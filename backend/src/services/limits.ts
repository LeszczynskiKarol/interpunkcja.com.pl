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

// Pakiety dokupienia sprawdzeń
export const TOPUP_PACKAGES = [
  {
    id: "topup_5",
    amount: 500,
    credits: 10,
    label: "10 sprawdzeń",
    priceLabel: "5 zł",
  },
  {
    id: "topup_10",
    amount: 1000,
    credits: 25,
    label: "25 sprawdzeń",
    priceLabel: "10 zł",
    bonus: 5,
  },
  {
    id: "topup_20",
    amount: 2000,
    credits: 60,
    label: "60 sprawdzeń",
    priceLabel: "20 zł",
    bonus: 10,
  },
] as const;

export interface UsageStatus {
  canCheck: boolean;
  reason?: string;
  remainingChecks: number;
  remainingChars: number;
  bonusChecks: number;
  canUseBonusCheck: boolean;
  limits: typeof LIMITS.FREE;
}

export async function checkUsageLimits(
  userId: string,
  _visitorId: string | null,
  textLength: number
): Promise<UsageStatus> {
  // Pobierz plan użytkownika i bonus checks
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, bonusChecks: true },
  });

  const plan: Plan = (user?.plan as Plan) || "FREE";
  const bonusChecks = user?.bonusChecks || 0;
  const limits = LIMITS[plan];

  // Sprawdź limit znaków na jedno sprawdzenie
  // Dla bonus checks używamy limitu PREMIUM (10 000 znaków)
  const effectiveCharLimit =
    bonusChecks > 0
      ? Math.max(limits.maxCharsPerCheck, LIMITS.PREMIUM.maxCharsPerCheck)
      : limits.maxCharsPerCheck;

  if (textLength > effectiveCharLimit) {
    return {
      canCheck: false,
      reason: `Tekst przekracza limit ${effectiveCharLimit} znaków. Twój tekst ma ${textLength} znaków.`,
      remainingChecks: 0,
      remainingChars: 0,
      bonusChecks,
      canUseBonusCheck: false,
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

  // Oblicz pozostałe sprawdzenia
  const remainingRegularChecks =
    limits.maxChecksPerDay === Infinity
      ? Infinity
      : Math.max(0, limits.maxChecksPerDay - usedChecks);

  const remainingRegularChars =
    limits.maxCharsPerDay === Infinity
      ? Infinity
      : Math.max(0, limits.maxCharsPerDay - usedChars);

  // Sprawdź czy można użyć regularnego limitu
  const canUseRegular =
    (limits.maxChecksPerDay === Infinity ||
      usedChecks < limits.maxChecksPerDay) &&
    (limits.maxCharsPerDay === Infinity ||
      usedChars + textLength <= limits.maxCharsPerDay);

  if (canUseRegular) {
    return {
      canCheck: true,
      remainingChecks: remainingRegularChecks,
      remainingChars: remainingRegularChars,
      bonusChecks,
      canUseBonusCheck: false, // Nie potrzeba - mamy jeszcze limit
      limits,
    };
  }

  // Limit wyczerpany - sprawdź czy są bonus checks
  if (bonusChecks > 0) {
    return {
      canCheck: true, // Można użyć bonus check
      reason: "Dzienny limit wyczerpany. Użyto dodatkowego sprawdzenia.",
      remainingChecks: 0,
      remainingChars: 0,
      bonusChecks,
      canUseBonusCheck: true,
      limits,
    };
  }

  // Brak limitów i brak bonus checks
  const reasonParts: string[] = [];

  if (
    limits.maxChecksPerDay !== Infinity &&
    usedChecks >= limits.maxChecksPerDay
  ) {
    reasonParts.push(
      `Wykorzystano dzienny limit ${limits.maxChecksPerDay} sprawdzeń.`
    );
  }

  if (
    limits.maxCharsPerDay !== Infinity &&
    usedChars + textLength > limits.maxCharsPerDay
  ) {
    reasonParts.push(
      `Wykorzystano dzienny limit ${limits.maxCharsPerDay} znaków.`
    );
  }

  return {
    canCheck: false,
    reason:
      reasonParts.join(" ") +
      " Dokup dodatkowe sprawdzenia lub poczekaj do jutra.",
    remainingChecks: 0,
    remainingChars: Math.max(
      0,
      (limits.maxCharsPerDay === Infinity ? 0 : limits.maxCharsPerDay) -
        usedChars
    ),
    bonusChecks: 0,
    canUseBonusCheck: false,
    limits,
  };
}

export async function recordUsage(
  userId: string,
  _visitorId: string | null,
  charCount: number,
  usedBonusCheck: boolean = false
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Jeśli użyto bonus check, zmniejsz licznik
  if (usedBonusCheck) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        bonusChecks: { decrement: 1 },
      },
    });
  }

  // Zawsze zapisuj użycie dzienne (dla statystyk)
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

export async function addBonusChecks(
  userId: string,
  credits: number
): Promise<number> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      bonusChecks: { increment: credits },
    },
    select: { bonusChecks: true },
  });

  return user.bonusChecks;
}

export async function getBonusChecks(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { bonusChecks: true },
  });

  return user?.bonusChecks || 0;
}
