// backend/src/routes/check.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { checkPunctuation, type ErrorCategory } from "../services/claude";
import {
  checkUsageLimits,
  recordUsage,
  LIMITS,
  TOPUP_PACKAGES,
  getBonusChecks,
  type Plan,
} from "../services/limits";
import { prisma } from "../lib/prisma";

const checkSchema = z.object({
  text: z
    .string()
    .min(1, "Tekst nie może być pusty")
    .max(50000, "Tekst jest zbyt długi"),
  useBonusCheck: z.boolean().optional().default(false),
});

export async function checkRoutes(fastify: FastifyInstance) {
  // Główny endpoint sprawdzania tekstu - WYMAGA ZALOGOWANIA
  fastify.post("/api/check", async (request, reply) => {
    // Wymagaj autoryzacji
    let userId: string;
    try {
      await request.jwtVerify();
      userId = (request.user as any).userId;
    } catch {
      return reply.status(401).send({
        error: "UNAUTHORIZED",
        message: "Musisz być zalogowany, aby sprawdzić tekst",
      });
    }

    const body = checkSchema.parse(request.body);
    const { text, useBonusCheck } = body;

    // Pobierz dane użytkownika
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, emailVerified: true, bonusChecks: true },
    });

    if (!user) {
      return reply.status(401).send({
        error: "USER_NOT_FOUND",
        message: "Użytkownik nie został znaleziony",
      });
    }

    if (!user.emailVerified) {
      return reply.status(403).send({
        error: "EMAIL_NOT_VERIFIED",
        message: "Musisz potwierdzić swój email przed korzystaniem z serwisu",
      });
    }

    const userPlan: Plan = user.plan as Plan;

    // Sprawdź limity
    const usageStatus = await checkUsageLimits(userId, null, text.length);

    // Jeśli nie można sprawdzić i nie ma bonus checks
    if (!usageStatus.canCheck) {
      return reply.status(429).send({
        error: "LIMIT_EXCEEDED",
        message: usageStatus.reason,
        remainingChecks: usageStatus.remainingChecks,
        remainingChars: usageStatus.remainingChars,
        bonusChecks: usageStatus.bonusChecks,
        canTopUp: true,
        topUpPackages: TOPUP_PACKAGES,
        plan: userPlan,
      });
    }

    // Określ czy używamy bonus check
    const willUseBonusCheck = usageStatus.canUseBonusCheck;

    // Sprawdź tekst przez Claude (kompleksowa korekta)
    const result = await checkPunctuation(text);

    // Zapisz użycie
    await recordUsage(userId, null, text.length, willUseBonusCheck);

    // Limity dla planu (dla bonus check używamy PREMIUM limits dla wyjaśnień)
    const limits = willUseBonusCheck ? LIMITS.PREMIUM : LIMITS[userPlan];

    // ZAWSZE zapisuj sprawdzenie do bazy
    await prisma.check.create({
      data: {
        userId,
        visitorId: null,
        originalText: text,
        correctedText: result.correctedText,
        corrections: JSON.parse(JSON.stringify(result.corrections)),
        charCount: text.length,
        errorCount: result.errorCount,
        usedBonusCheck: willUseBonusCheck,
      },
    });

    // Dla bonus check lub premium - pokaż pełne wyjaśnienia
    // Dla FREE bez bonus - ukryj szczegółowe wyjaśnienia
    const showExplanations = willUseBonusCheck || limits.showExplanations;

    const corrections = showExplanations
      ? result.corrections
      : result.corrections.map((c) => ({
          ...c,
          explanation:
            "Przejdź na Premium, aby zobaczyć szczegółowe wyjaśnienia",
          // Zostawiamy rule i category - to podstawowe info
        }));

    // Pobierz aktualny stan bonus checks
    const currentBonusChecks = await getBonusChecks(userId);

    // Przelicz pozostałe sprawdzenia
    const newUsageStatus = await checkUsageLimits(userId, null, 0);

    return {
      correctedText: result.correctedText,
      corrections,
      errorCount: result.errorCount,
      summary: result.summary, // Dodajemy podsumowanie błędów według kategorii
      usedBonusCheck: willUseBonusCheck,
      usage: {
        remainingChecks: newUsageStatus.remainingChecks,
        remainingChars: newUsageStatus.remainingChars,
        bonusChecks: currentBonusChecks,
        plan: userPlan,
      },
    };
  });

  // Endpoint do sprawdzenia statusu limitów - WYMAGA ZALOGOWANIA
  fastify.get("/api/check/status", async (request, reply) => {
    let userId: string;
    try {
      await request.jwtVerify();
      userId = (request.user as any).userId;
    } catch {
      return reply.status(401).send({
        error: "UNAUTHORIZED",
        message: "Musisz być zalogowany",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, bonusChecks: true },
    });

    const userPlan: Plan = (user?.plan as Plan) || "FREE";
    const status = await checkUsageLimits(userId, null, 0);

    return {
      ...status,
      plan: userPlan,
      topUpPackages: TOPUP_PACKAGES,
    };
  });

  // Endpoint do pobierania historii sprawdzeń - WYMAGA PREMIUM/LIFETIME
  fastify.get("/api/check/history", async (request, reply) => {
    let userId: string;
    try {
      await request.jwtVerify();
      userId = (request.user as any).userId;
    } catch {
      return reply.status(401).send({
        error: "UNAUTHORIZED",
        message: "Musisz być zalogowany",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (!user || user.plan === "FREE") {
      return reply.status(403).send({
        error: "PREMIUM_REQUIRED",
        message:
          "Historia sprawdzeń jest dostępna tylko dla Premium i Lifetime",
      });
    }

    const history = await prisma.check.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        originalText: true,
        correctedText: true,
        corrections: true,
        errorCount: true,
        charCount: true,
        usedBonusCheck: true,
        createdAt: true,
      },
    });

    return history;
  });

  // Nowy endpoint - statystyki błędów użytkownika (dla Premium/Lifetime)
  fastify.get("/api/check/stats", async (request, reply) => {
    let userId: string;
    try {
      await request.jwtVerify();
      userId = (request.user as any).userId;
    } catch {
      return reply.status(401).send({
        error: "UNAUTHORIZED",
        message: "Musisz być zalogowany",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (!user || user.plan === "FREE") {
      return reply.status(403).send({
        error: "PREMIUM_REQUIRED",
        message: "Statystyki błędów są dostępne tylko dla Premium i Lifetime",
      });
    }

    // Pobierz wszystkie sprawdzenia użytkownika
    const checks = await prisma.check.findMany({
      where: { userId },
      select: {
        corrections: true,
        errorCount: true,
        charCount: true,
        createdAt: true,
      },
    });

    // Agreguj statystyki
    const stats = {
      totalChecks: checks.length,
      totalErrors: 0,
      totalChars: 0,
      byCategory: {
        interpunkcja: 0,
        ortografia: 0,
        pisownia: 0,
        gramatyka: 0,
        stylistyka: 0,
      } as Record<string, number>,
      mostCommonErrors: [] as { rule: string; count: number }[],
    };

    const ruleCounter: Record<string, number> = {};

    for (const check of checks) {
      stats.totalErrors += check.errorCount;
      stats.totalChars += check.charCount;

      const corrections = check.corrections as any[];
      if (Array.isArray(corrections)) {
        for (const c of corrections) {
          // Zliczaj kategorie
          const category = c.category as string;
          if (category && category in stats.byCategory) {
            stats.byCategory[category]++;
          }

          // Zliczaj reguły
          const rule = c.rule as string;
          if (rule) {
            ruleCounter[rule] = (ruleCounter[rule] || 0) + 1;
          }
        }
      }
    }

    // Top 10 najczęstszych błędów
    stats.mostCommonErrors = Object.entries(ruleCounter)
      .map(([rule, count]) => ({ rule, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  });
}
