// backend/src/services/limits.ts
import { PrismaClient, Plan } from "@prisma/client";

const prisma = new PrismaClient();

// Limity dla różnych planów
export const LIMITS = {
  FREE: {
    maxCharsPerCheck: 500,
    maxChecksPerDay: 5,
    maxCharsPerDay: 2000,
    showExplanations: false,
    saveHistory: false,
  },
  PREMIUM: {
    maxCharsPerCheck: 10000,
    maxChecksPerDay: 100,
    maxCharsPerDay: 100000,
    showExplanations: true,
    saveHistory: true,
  },
  LIFETIME: {
    maxCharsPerCheck: 50000,
    maxChecksPerDay: Infinity,
    maxCharsPerDay: Infinity,
    showExplanations: true,
    saveHistory: true,
  },
} as const;

export interface UsageStatus {
  canCheck: boolean;
  reason?: string;
  remainingChecks: number;
  remainingChars: number;
  limits: typeof LIMITS.FREE;
}

export async function checkUsageLimits(
  userId: string | null,
  visitorId: string | null,
  textLength: number
): Promise<UsageStatus> {
  // Pobierz plan użytkownika
  let plan: Plan = "FREE";
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });
    plan = user?.plan || "FREE";
  }

  const limits = LIMITS[plan];

  // Sprawdź limit znaków na jedno sprawdzenie
  if (textLength > limits.maxCharsPerCheck) {
    return {
      canCheck: false,
      reason: `Tekst przekracza limit ${limits.maxCharsPerCheck} znaków dla planu ${plan}. Twój tekst ma ${textLength} znaków.`,
      remainingChecks: 0,
      remainingChars: 0,
      limits,
    };
  }

  // Pobierz dzienne użycie
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyUsage = await prisma.dailyUsage.findFirst({
    where: userId ? { userId, date: today } : { visitorId, date: today },
  });

  const usedChecks = dailyUsage?.checkCount || 0;
  const usedChars = dailyUsage?.charCount || 0;

  // Sprawdź limity dzienne
  if (
    limits.maxChecksPerDay !== Infinity &&
    usedChecks >= limits.maxChecksPerDay
  ) {
    return {
      canCheck: false,
      reason: `Wykorzystano dzienny limit ${limits.maxChecksPerDay} sprawdzeń. Spróbuj jutro lub przejdź na plan Premium.`,
      remainingChecks: 0,
      remainingChars: Math.max(0, limits.maxCharsPerDay - usedChars),
      limits,
    };
  }

  if (
    limits.maxCharsPerDay !== Infinity &&
    usedChars + textLength > limits.maxCharsPerDay
  ) {
    return {
      canCheck: false,
      reason: `Wykorzystano dzienny limit ${
        limits.maxCharsPerDay
      } znaków. Pozostało ${limits.maxCharsPerDay - usedChars} znaków.`,
      remainingChecks: Math.max(0, limits.maxChecksPerDay - usedChecks),
      remainingChars: Math.max(0, limits.maxCharsPerDay - usedChars),
      limits,
    };
  }

  return {
    canCheck: true,
    remainingChecks:
      limits.maxChecksPerDay === Infinity
        ? Infinity
        : limits.maxChecksPerDay - usedChecks - 1,
    remainingChars:
      limits.maxCharsPerDay === Infinity
        ? Infinity
        : limits.maxCharsPerDay - usedChars - textLength,
    limits,
  };
}

export async function recordUsage(
  userId: string | null,
  visitorId: string | null,
  charCount: number
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (userId) {
    await prisma.dailyUsage.upsert({
      where: {
        userId_date: { userId, date: today },
      },
      update: {
        checkCount: { increment: 1 },
        charCount: { increment: charCount },
      },
      create: {
        userId,
        date: today,
        checkCount: 1,
        charCount,
      },
    });
  } else if (visitorId) {
    await prisma.dailyUsage.upsert({
      where: {
        visitorId_date: { visitorId, date: today },
      },
      update: {
        checkCount: { increment: 1 },
        charCount: { increment: charCount },
      },
      create: {
        visitorId,
        date: today,
        checkCount: 1,
        charCount,
      },
    });
  }
}
