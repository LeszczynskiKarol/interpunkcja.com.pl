// backend/src/services/limits.ts
import { prisma } from "../lib/prisma";

// Typ Plan (zgodny z enum w Prisma schema)
export type Plan = "FREE" | "PREMIUM" | "LIFETIME";

// Typ dla limitów
interface PlanLimits {
  maxCharsPerCheck: number;
  maxChecksPerDay: number;
  maxCharsPerDay: number;
  showExplanations: boolean;
  saveHistory: boolean;
}

// Limity dla różnych planów
export const LIMITS: Record<Plan, PlanLimits> = {
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
};

export interface UsageStatus {
  canCheck: boolean;
  reason?: string;
  remainingChecks: number;
  remainingChars: number;
  limits: typeof LIMITS.FREE;
}

export async function checkUsageLimits(
  userId: string,
  _visitorId: string | null, // Ignored - kept for compatibility
  textLength: number
): Promise<UsageStatus> {
  // Pobierz plan użytkownika
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  const plan: Plan = (user?.plan as Plan) || "FREE";
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
    where: { userId, date: today },
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
        : limits.maxChecksPerDay - usedChecks,
    remainingChars:
      limits.maxCharsPerDay === Infinity
        ? Infinity
        : limits.maxCharsPerDay - usedChars,
    limits,
  };
}

export async function recordUsage(
  userId: string,
  _visitorId: string | null, // Ignored - kept for compatibility
  charCount: number
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
}
