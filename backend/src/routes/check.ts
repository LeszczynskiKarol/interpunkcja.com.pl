// backend/src/routes/check.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { checkPunctuation } from "../services/claude";
import { checkUsageLimits, recordUsage, LIMITS } from "../services/limits";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkSchema = z.object({
  text: z
    .string()
    .min(1, "Tekst nie może być pusty")
    .max(50000, "Tekst jest zbyt długi"),
  visitorId: z.string().optional(),
});

export async function checkRoutes(fastify: FastifyInstance) {
  // Główny endpoint sprawdzania interpunkcji
  fastify.post("/api/check", async (request, reply) => {
    const body = checkSchema.parse(request.body);
    const { text, visitorId } = body;

    // Pobierz userId z tokena JWT (jeśli zalogowany)
    let userId: string | null = null;
    try {
      const decoded = await request.jwtVerify<{ id: string }>();
      userId = decoded.id;
    } catch {
      // Niezalogowany użytkownik - OK
    }

    // Sprawdź limity
    const usageStatus = await checkUsageLimits(
      userId,
      visitorId || null,
      text.length
    );

    if (!usageStatus.canCheck) {
      return reply.status(429).send({
        error: "LIMIT_EXCEEDED",
        message: usageStatus.reason,
        remainingChecks: usageStatus.remainingChecks,
        remainingChars: usageStatus.remainingChars,
      });
    }

    // Sprawdź interpunkcję przez Claude
    const result = await checkPunctuation(text);

    // Zapisz użycie
    await recordUsage(userId, visitorId || null, text.length);

    // Dla premium - zapisz w historii
    const userPlan = userId
      ? (
          await prisma.user.findUnique({
            where: { id: userId },
            select: { plan: true },
          })
        )?.plan
      : "FREE";

    const limits = LIMITS[userPlan || "FREE"];

    if (limits.saveHistory) {
      await prisma.check.create({
        data: {
          userId,
          visitorId: userId ? null : visitorId,
          originalText: text,
          correctedText: result.correctedText,
          corrections: result.corrections,
          charCount: text.length,
          errorCount: result.errorCount,
        },
      });
    }

    // Dla FREE - ukryj wyjaśnienia
    const corrections = limits.showExplanations
      ? result.corrections
      : result.corrections.map((c) => ({
          ...c,
          explanation: "Przejdź na Premium, aby zobaczyć wyjaśnienia",
          rule: c.rule, // Regułę zostawiamy
        }));

    return {
      correctedText: result.correctedText,
      corrections,
      errorCount: result.errorCount,
      usage: {
        remainingChecks: usageStatus.remainingChecks,
        remainingChars: usageStatus.remainingChars,
        plan: userPlan || "FREE",
      },
    };
  });

  // Endpoint do sprawdzenia statusu limitów
  fastify.get("/api/check/status", async (request, reply) => {
    const visitorId = (request.query as { visitorId?: string }).visitorId;

    let userId: string | null = null;
    try {
      const decoded = await request.jwtVerify<{ id: string }>();
      userId = decoded.id;
    } catch {
      // Niezalogowany
    }

    const status = await checkUsageLimits(userId, visitorId || null, 0);

    return {
      ...status,
      plan: userId
        ? (
            await prisma.user.findUnique({
              where: { id: userId },
              select: { plan: true },
            })
          )?.plan
        : "FREE",
    };
  });
}
