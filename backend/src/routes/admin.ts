// backend/src/routes/admin.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

// Middleware sprawdzający czy user jest adminem
async function requireAdmin(request: any, reply: any) {
  try {
    await request.jwtVerify();
    const userId = request.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true },
    });

    if (!user || user.role !== "ADMIN" || !user.isActive) {
      return reply.status(403).send({
        error: "FORBIDDEN",
        message: "Brak uprawnień administratora",
      });
    }
  } catch {
    return reply.status(401).send({
      error: "UNAUTHORIZED",
      message: "Musisz być zalogowany",
    });
  }
}

export async function adminRoutes(fastify: FastifyInstance) {
  // Dodaj hook dla wszystkich route'ów admina
  fastify.addHook("preHandler", requireAdmin);

  // ==================== DASHBOARD STATS ====================

  fastify.get("/api/admin/stats", async (request, reply) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Statystyki użytkowników
    const [
      totalUsers,
      premiumUsers,
      lifetimeUsers,
      newUsersToday,
      newUsersWeek,
      newUsersMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: "PREMIUM" } }),
      prisma.user.count({ where: { plan: "LIFETIME" } }),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    ]);

    // Statystyki sprawdzeń
    const [
      totalChecks,
      checksToday,
      checksWeek,
      checksMonth,
      totalCharsChecked,
      bonusChecksUsed,
    ] = await Promise.all([
      prisma.check.count(),
      prisma.check.count({ where: { createdAt: { gte: today } } }),
      prisma.check.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.check.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.check.aggregate({ _sum: { charCount: true } }),
      prisma.check.count({ where: { usedBonusCheck: true } }),
    ]);

    // Statystyki błędów
    const totalErrors = await prisma.check.aggregate({
      _sum: { errorCount: true },
    });

    // Aktywni użytkownicy (zalogowani w ciągu tygodnia)
    const activeUsers = await prisma.user.count({
      where: { lastLogin: { gte: weekAgo } },
    });

    // Statystyki zakupów topup
    const [
      totalTopUpPurchases,
      topUpPurchasesToday,
      topUpPurchasesWeek,
      topUpPurchasesMonth,
      topUpRevenueTotal,
      topUpRevenueMonth,
      totalBonusCreditsGranted,
    ] = await Promise.all([
      prisma.creditPurchase.count({ where: { status: "COMPLETED" } }),
      prisma.creditPurchase.count({
        where: { status: "COMPLETED", completedAt: { gte: today } },
      }),
      prisma.creditPurchase.count({
        where: { status: "COMPLETED", completedAt: { gte: weekAgo } },
      }),
      prisma.creditPurchase.count({
        where: { status: "COMPLETED", completedAt: { gte: monthAgo } },
      }),
      prisma.creditPurchase.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.creditPurchase.aggregate({
        where: { status: "COMPLETED", completedAt: { gte: monthAgo } },
        _sum: { amount: true },
      }),
      prisma.creditPurchase.aggregate({
        where: { status: "COMPLETED" },
        _sum: { creditsGranted: true },
      }),
    ]);

    // Suma wszystkich bonus checks u użytkowników
    const totalBonusChecksAvailable = await prisma.user.aggregate({
      _sum: { bonusChecks: true },
    });

    return {
      users: {
        total: totalUsers,
        premium: premiumUsers,
        lifetime: lifetimeUsers,
        free: totalUsers - premiumUsers - lifetimeUsers,
        newToday: newUsersToday,
        newWeek: newUsersWeek,
        newMonth: newUsersMonth,
        active: activeUsers,
      },
      checks: {
        total: totalChecks,
        today: checksToday,
        week: checksWeek,
        month: checksMonth,
        totalChars: totalCharsChecked._sum.charCount || 0,
        totalErrors: totalErrors._sum.errorCount || 0,
        bonusUsed: bonusChecksUsed,
      },
      topUp: {
        totalPurchases: totalTopUpPurchases,
        purchasesToday: topUpPurchasesToday,
        purchasesWeek: topUpPurchasesWeek,
        purchasesMonth: topUpPurchasesMonth,
        revenueTotal: (topUpRevenueTotal._sum.amount || 0) / 100, // grosze -> PLN
        revenueMonth: (topUpRevenueMonth._sum.amount || 0) / 100,
        creditsGranted: totalBonusCreditsGranted._sum.creditsGranted || 0,
        creditsAvailable: totalBonusChecksAvailable._sum.bonusChecks || 0,
      },
      revenue: {
        premiumMonthly: premiumUsers * 29, // PLN
        lifetimeTotal: lifetimeUsers * 299,
        topUpTotal: (topUpRevenueTotal._sum.amount || 0) / 100,
        topUpMonth: (topUpRevenueMonth._sum.amount || 0) / 100,
        estimatedMRR:
          premiumUsers * 29 + (topUpRevenueMonth._sum.amount || 0) / 100,
      },
    };
  });

  // ==================== USERS MANAGEMENT ====================

  // Lista użytkowników z paginacją i filtrami
  fastify.get("/api/admin/users", async (request, reply) => {
    const schema = z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(20),
      search: z.string().optional(),
      plan: z.enum(["FREE", "PREMIUM", "LIFETIME", "ALL"]).default("ALL"),
      role: z.enum(["USER", "ADMIN", "ALL"]).default("ALL"),
      hasBonusChecks: z.enum(["true", "false", "ALL"]).default("ALL"),
      sortBy: z
        .enum([
          "createdAt",
          "email",
          "name",
          "lastLogin",
          "plan",
          "bonusChecks",
        ])
        .default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    });

    const params = schema.parse(request.query);
    const skip = (params.page - 1) * params.limit;

    // Buduj warunki WHERE
    const where: any = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: "insensitive" } },
        { name: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params.plan !== "ALL") {
      where.plan = params.plan;
    }

    if (params.role !== "ALL") {
      where.role = params.role;
    }

    if (params.hasBonusChecks === "true") {
      where.bonusChecks = { gt: 0 };
    } else if (params.hasBonusChecks === "false") {
      where.bonusChecks = 0;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          role: true,
          emailVerified: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          stripeCustomerId: true,
          bonusChecks: true,
          _count: {
            select: {
              checks: true,
              creditPurchases: true,
            },
          },
        },
        orderBy: { [params.sortBy]: params.sortOrder },
        skip,
        take: params.limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map((u) => ({
        ...u,
        checksCount: u._count.checks,
        purchasesCount: u._count.creditPurchases,
        _count: undefined,
      })),
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  });

  // Szczegóły użytkownika
  fastify.get("/api/admin/users/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        emailVerified: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        stripeCustomerId: true,
        bonusChecks: true,
        _count: {
          select: {
            checks: true,
            creditPurchases: true,
          },
        },
        checks: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            charCount: true,
            errorCount: true,
            usedBonusCheck: true,
            createdAt: true,
          },
        },
        creditPurchases: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            amount: true,
            creditsGranted: true,
            status: true,
            createdAt: true,
            completedAt: true,
          },
        },
        dailyUsage: {
          orderBy: { date: "desc" },
          take: 30,
        },
      },
    });

    if (!user) {
      return reply.status(404).send({
        error: "NOT_FOUND",
        message: "Użytkownik nie został znaleziony",
      });
    }

    return {
      ...user,
      checksCount: user._count.checks,
      purchasesCount: user._count.creditPurchases,
      _count: undefined,
    };
  });

  // Aktualizuj użytkownika
  fastify.patch("/api/admin/users/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const schema = z.object({
      name: z.string().min(2).max(50).optional(),
      plan: z.enum(["FREE", "PREMIUM", "LIFETIME"]).optional(),
      role: z.enum(["USER", "ADMIN"]).optional(),
      isActive: z.boolean().optional(),
      emailVerified: z.boolean().optional(),
      bonusChecks: z.number().min(0).optional(),
    });

    const data = schema.parse(request.body);

    // Sprawdź czy user istnieje
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return reply.status(404).send({
        error: "NOT_FOUND",
        message: "Użytkownik nie został znaleziony",
      });
    }

    // Nie pozwól usunąć ostatniego admina
    if (data.role === "USER" && existingUser.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return reply.status(400).send({
          error: "LAST_ADMIN",
          message: "Nie można usunąć ostatniego administratora",
        });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        emailVerified: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        bonusChecks: true,
      },
    });

    return user;
  });

  // Dodaj bonus sprawdzenia użytkownikowi
  fastify.post("/api/admin/users/:id/add-bonus", async (request, reply) => {
    const { id } = request.params as { id: string };

    const schema = z.object({
      credits: z.number().min(1).max(1000),
      reason: z.string().optional(),
    });

    const { credits, reason } = schema.parse(request.body);

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return reply.status(404).send({
        error: "NOT_FOUND",
        message: "Użytkownik nie został znaleziony",
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        bonusChecks: { increment: credits },
      },
      select: {
        id: true,
        email: true,
        bonusChecks: true,
      },
    });

    // Log dla audytu (opcjonalnie możesz zapisać do osobnej tabeli)
    console.log(
      `[ADMIN] Added ${credits} bonus checks to user ${id} (${
        existingUser.email
      }). Reason: ${reason || "none"}`
    );

    return {
      success: true,
      user,
      creditsAdded: credits,
      message: `Dodano ${credits} bonus sprawdzeń`,
    };
  });

  // Usuń użytkownika (soft delete - dezaktywacja)
  fastify.delete("/api/admin/users/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return reply.status(404).send({
        error: "NOT_FOUND",
        message: "Użytkownik nie został znaleziony",
      });
    }

    // Nie pozwól usunąć admina
    if (existingUser.role === "ADMIN") {
      return reply.status(400).send({
        error: "CANNOT_DELETE_ADMIN",
        message: "Nie można usunąć administratora",
      });
    }

    // Soft delete
    await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        refreshToken: null,
      },
    });

    return { success: true, message: "Użytkownik został dezaktywowany" };
  });

  // Reset hasła użytkownika (ustaw tymczasowe)
  fastify.post(
    "/api/admin/users/:id/reset-password",
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const existingUser = await prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        return reply.status(404).send({
          error: "NOT_FOUND",
          message: "Użytkownik nie został znaleziony",
        });
      }

      // Generuj tymczasowe hasło
      const tempPassword = Math.random().toString(36).slice(-10) + "A1!";
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      await prisma.user.update({
        where: { id },
        data: {
          passwordHash: hashedPassword,
          refreshToken: null, // Wyloguj
        },
      });

      return {
        success: true,
        tempPassword,
        message:
          "Hasło zostało zresetowane. Przekaż użytkownikowi tymczasowe hasło.",
      };
    }
  );

  // ==================== CHECKS MANAGEMENT ====================

  // Lista sprawdzeń z paginacją
  fastify.get("/api/admin/checks", async (request, reply) => {
    const schema = z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(20),
      userId: z.string().optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
      usedBonusCheck: z.enum(["true", "false", "ALL"]).default("ALL"),
    });

    const params = schema.parse(request.query);
    const skip = (params.page - 1) * params.limit;

    const where: any = {};

    if (params.userId) {
      where.userId = params.userId;
    }

    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) {
        where.createdAt.gte = new Date(params.dateFrom);
      }
      if (params.dateTo) {
        where.createdAt.lte = new Date(params.dateTo);
      }
    }

    if (params.usedBonusCheck === "true") {
      where.usedBonusCheck = true;
    } else if (params.usedBonusCheck === "false") {
      where.usedBonusCheck = false;
    }

    const [checks, total] = await Promise.all([
      prisma.check.findMany({
        where,
        select: {
          id: true,
          originalText: true,
          correctedText: true,
          charCount: true,
          errorCount: true,
          usedBonusCheck: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: params.limit,
      }),
      prisma.check.count({ where }),
    ]);

    return {
      checks: checks.map((c) => ({
        ...c,
        originalTextPreview:
          c.originalText.substring(0, 100) +
          (c.originalText.length > 100 ? "..." : ""),
        originalText: undefined, // Nie wysyłaj pełnego tekstu w liście
        correctedText: undefined,
      })),
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  });

  // Szczegóły sprawdzenia
  fastify.get("/api/admin/checks/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const check = await prisma.check.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            plan: true,
          },
        },
      },
    });

    if (!check) {
      return reply.status(404).send({
        error: "NOT_FOUND",
        message: "Sprawdzenie nie zostało znalezione",
      });
    }

    return check;
  });

  // ==================== PURCHASES MANAGEMENT ====================

  // Lista zakupów topup
  fastify.get("/api/admin/purchases", async (request, reply) => {
    const schema = z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(20),
      userId: z.string().optional(),
      status: z
        .enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED", "ALL"])
        .default("ALL"),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    });

    const params = schema.parse(request.query);
    const skip = (params.page - 1) * params.limit;

    const where: any = {};

    if (params.userId) {
      where.userId = params.userId;
    }

    if (params.status !== "ALL") {
      where.status = params.status;
    }

    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};
      if (params.dateFrom) {
        where.createdAt.gte = new Date(params.dateFrom);
      }
      if (params.dateTo) {
        where.createdAt.lte = new Date(params.dateTo);
      }
    }

    const [purchases, total] = await Promise.all([
      prisma.creditPurchase.findMany({
        where,
        select: {
          id: true,
          amount: true,
          creditsGranted: true,
          status: true,
          stripeSessionId: true,
          createdAt: true,
          completedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              plan: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: params.limit,
      }),
      prisma.creditPurchase.count({ where }),
    ]);

    // Suma przychodów z bieżącej strony
    const pageRevenue = purchases
      .filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      purchases: purchases.map((p) => ({
        ...p,
        amountPLN: p.amount / 100, // grosze -> PLN
      })),
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
      summary: {
        pageRevenue: pageRevenue / 100,
      },
    };
  });

  // Zmień status zakupu (np. refund)
  fastify.patch("/api/admin/purchases/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const schema = z.object({
      status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
      refundCredits: z.boolean().optional(), // Czy odjąć kredyty przy refund
    });

    const { status, refundCredits } = schema.parse(request.body);

    const purchase = await prisma.creditPurchase.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!purchase) {
      return reply.status(404).send({
        error: "NOT_FOUND",
        message: "Zakup nie został znaleziony",
      });
    }

    // Jeśli refund i chcemy odjąć kredyty
    if (
      status === "REFUNDED" &&
      refundCredits &&
      purchase.status === "COMPLETED"
    ) {
      await prisma.user.update({
        where: { id: purchase.userId },
        data: {
          bonusChecks: {
            decrement: Math.min(
              purchase.creditsGranted,
              purchase.user.bonusChecks
            ),
          },
        },
      });
    }

    const updatedPurchase = await prisma.creditPurchase.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        status: true,
        amount: true,
        creditsGranted: true,
        user: {
          select: {
            id: true,
            email: true,
            bonusChecks: true,
          },
        },
      },
    });

    return {
      success: true,
      purchase: updatedPurchase,
    };
  });

  // ==================== CHARTS DATA ====================

  // Dane do wykresów - użytkownicy i sprawdzenia dziennie
  fastify.get("/api/admin/charts/daily", async (request, reply) => {
    const schema = z.object({
      days: z.coerce.number().min(7).max(90).default(30),
    });

    const { days } = schema.parse(request.query);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Pobierz dane dzienne
    const [dailyUsers, dailyChecks, dailyPurchases] = await Promise.all([
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM "User"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date
      ` as Promise<Array<{ date: Date; count: bigint }>>,

      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count, SUM(char_count) as chars,
               SUM(CASE WHEN used_bonus_check THEN 1 ELSE 0 END) as bonus_used
        FROM "Check"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date
      ` as Promise<
        Array<{ date: Date; count: bigint; chars: bigint; bonus_used: bigint }>
      >,

      prisma.$queryRaw`
        SELECT DATE(completed_at) as date, COUNT(*) as count, SUM(amount) as revenue
        FROM "CreditPurchase"
        WHERE status = 'COMPLETED' AND completed_at >= ${startDate}
        GROUP BY DATE(completed_at)
        ORDER BY date
      ` as Promise<Array<{ date: Date; count: bigint; revenue: bigint }>>,
    ]);

    // Wypełnij brakujące dni zerami
    const result = [];
    const currentDate = new Date(startDate);
    const today = new Date();

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split("T")[0];

      const userEntry = dailyUsers.find(
        (u) => u.date.toISOString().split("T")[0] === dateStr
      );
      const checkEntry = dailyChecks.find(
        (c) => c.date.toISOString().split("T")[0] === dateStr
      );
      const purchaseEntry = dailyPurchases.find(
        (p) => p.date && p.date.toISOString().split("T")[0] === dateStr
      );

      result.push({
        date: dateStr,
        newUsers: userEntry ? Number(userEntry.count) : 0,
        checks: checkEntry ? Number(checkEntry.count) : 0,
        chars: checkEntry ? Number(checkEntry.chars) : 0,
        bonusChecksUsed: checkEntry ? Number(checkEntry.bonus_used) : 0,
        purchases: purchaseEntry ? Number(purchaseEntry.count) : 0,
        revenue: purchaseEntry ? Number(purchaseEntry.revenue) / 100 : 0, // grosze -> PLN
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  });

  // Rozkład planów
  fastify.get("/api/admin/charts/plans", async (request, reply) => {
    const plans = await prisma.user.groupBy({
      by: ["plan"],
      _count: { plan: true },
    });

    return plans.map((p) => ({
      plan: p.plan,
      count: p._count.plan,
    }));
  });

  // Rozkład pakietów topup
  fastify.get("/api/admin/charts/topup-packages", async (request, reply) => {
    const packages = (await prisma.$queryRaw`
      SELECT 
        amount,
        COUNT(*) as count,
        SUM(credits_granted) as total_credits
      FROM "CreditPurchase"
      WHERE status = 'COMPLETED'
      GROUP BY amount
      ORDER BY amount
    `) as Array<{ amount: number; count: bigint; total_credits: bigint }>;

    const packageLabels: Record<number, string> = {
      500: "5 zł (10 spr.)",
      1000: "10 zł (25 spr.)",
      2000: "20 zł (60 spr.)",
    };

    return packages.map((p) => ({
      amount: p.amount / 100,
      label: packageLabels[p.amount] || `${p.amount / 100} zł`,
      count: Number(p.count),
      totalCredits: Number(p.total_credits),
    }));
  });
}
