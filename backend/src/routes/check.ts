// backend/src/routes/check.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { checkPunctuation } from "../services/claude";
import {
  checkUsageLimits,
  recordUsage,
  LIMITS,
  type Plan,
} from "../services/limits";
import { prisma } from "../lib/prisma";

const checkSchema = z.object({
  text: z
    .string()
    .min(1, "Tekst nie może być pusty")
    .max(50000, "Tekst jest zbyt długi"),
});

export async function checkRoutes(fastify: FastifyInstance) {
  // Główny endpoint sprawdzania interpunkcji - WYMAGA ZALOGOWANIA
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
    const { text } = body;

    // Pobierz dane użytkownika - WAŻNE: emailVerified musi być w select!
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, emailVerified: true },
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

    if (!usageStatus.canCheck) {
      return reply.status(429).send({
        error: "LIMIT_EXCEEDED",
        message: usageStatus.reason,
        remainingChecks: usageStatus.remainingChecks,
        remainingChars: usageStatus.remainingChars,
        plan: userPlan,
      });
    }

    // Sprawdź interpunkcję przez Claude
    const result = await checkPunctuation(text);

    // Zapisz użycie
    await recordUsage(userId, null, text.length);

    // Limity dla planu
    const limits = LIMITS[userPlan];

    // ZAWSZE zapisuj sprawdzenie do bazy - potrzebne dla panelu admina
    // Historia dla użytkownika jest kontrolowana przez endpoint /api/check/history
    await prisma.check.create({
      data: {
        userId,
        visitorId: null,
        originalText: text,
        correctedText: result.correctedText,
        // Cast do JSON - Prisma wymaga InputJsonValue
        corrections: JSON.parse(JSON.stringify(result.corrections)),
        charCount: text.length,
        errorCount: result.errorCount,
      },
    });

    // Dla FREE - ukryj wyjaśnienia
    const corrections = limits.showExplanations
      ? result.corrections
      : result.corrections.map((c) => ({
          ...c,
          explanation: "Przejdź na Premium, aby zobaczyć wyjaśnienia",
          rule: c.rule,
        }));

    return {
      correctedText: result.correctedText,
      corrections,
      errorCount: result.errorCount,
      usage: {
        remainingChecks: usageStatus.remainingChecks - 1,
        remainingChars: usageStatus.remainingChars - text.length,
        plan: userPlan,
      },
    };
  });

  // Endpoint do sprawdzenia statusu limitów - WYMAGA ZALOGOWANIA
  fastify.get("/api/check/status", async (request, reply) => {
    // Wymagaj autoryzacji
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

    const userPlan: Plan = (user?.plan as Plan) || "FREE";
    const status = await checkUsageLimits(userId, null, 0);

    return {
      ...status,
      plan: userPlan,
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
        createdAt: true,
      },
    });

    return history;
  });
}
