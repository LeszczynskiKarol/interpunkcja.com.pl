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
    ] = await Promise.all([
      prisma.check.count(),
      prisma.check.count({ where: { createdAt: { gte: today } } }),
      prisma.check.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.check.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.check.aggregate({ _sum: { charCount: true } }),
    ]);

    // Statystyki błędów
    const totalErrors = await prisma.check.aggregate({
      _sum: { errorCount: true },
    });

    // Aktywni użytkownicy (zalogowani w ciągu tygodnia)
    const activeUsers = await prisma.user.count({
      where: { lastLogin: { gte: weekAgo } },
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
      },
      revenue: {
        premiumMonthly: premiumUsers * 29, // PLN
        lifetimeTotal: lifetimeUsers * 299,
        estimatedMRR: premiumUsers * 29,
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
      sortBy: z
        .enum(["createdAt", "email", "name", "lastLogin", "plan"])
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
          _count: {
            select: { checks: true },
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
        _count: {
          select: { checks: true },
        },
        checks: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            charCount: true,
            errorCount: true,
            createdAt: true,
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
      },
    });

    return user;
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

    const [checks, total] = await Promise.all([
      prisma.check.findMany({
        where,
        select: {
          id: true,
          originalText: true,
          correctedText: true,
          charCount: true,
          errorCount: true,
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
    const [dailyUsers, dailyChecks] = await Promise.all([
      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM "User"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date
      ` as Promise<Array<{ date: Date; count: bigint }>>,

      prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count, SUM(char_count) as chars
        FROM "Check"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date
      ` as Promise<Array<{ date: Date; count: bigint; chars: bigint }>>,
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

      result.push({
        date: dateStr,
        newUsers: userEntry ? Number(userEntry.count) : 0,
        checks: checkEntry ? Number(checkEntry.count) : 0,
        chars: checkEntry ? Number(checkEntry.chars) : 0,
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
}
