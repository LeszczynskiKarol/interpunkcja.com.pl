// backend/src/services/dailyReport.ts
// Codzienny raport użycia i kosztów na Slacka (za poprzedni dzień, czas warszawski).
import { prisma } from "../lib/prisma";
import { sendSlack } from "./slack";
import { spellcheckVisitors, warsawDate } from "./trafficStats";
import { guestDailyLimit } from "./guestCheck";

interface CheckStats {
  checks: number;
  actors: number;
  cost: number;
}

async function checkStats(day: string, guest: boolean): Promise<CheckStats> {
  const rows = await prisma.$queryRaw<CheckStats[]>`
    SELECT count(*)::int AS checks,
           count(DISTINCT COALESCE("userId", "visitorId"))::int AS actors,
           COALESCE(SUM((metadata->>'estimatedCostUsd')::numeric), 0)::float AS cost
    FROM "Check"
    WHERE ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Warsaw')::date = ${day}::date
      AND ("userId" IS NULL) = ${guest}`;
  return rows[0];
}

export async function sendDailyReport(): Promise<void> {
  const day = warsawDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

  const [guests, users, signups, purchases] = await Promise.all([
    checkStats(day, true),
    checkStats(day, false),
    prisma.$queryRaw<{ total: number; google: number; unverified: number }[]>`
      SELECT count(*)::int AS total,
             count(*) FILTER (WHERE "authProvider" = 'GOOGLE')::int AS google,
             count(*) FILTER (WHERE NOT "emailVerified")::int AS unverified
      FROM "User"
      WHERE ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Warsaw')::date = ${day}::date`,
    prisma.$queryRaw<{ count: number; pln: number }[]>`
      SELECT count(*)::int AS count, COALESCE(SUM(amount), 0)::float / 100 AS pln
      FROM "CreditPurchase"
      WHERE status = 'COMPLETED'
        AND ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Warsaw')::date = ${day}::date`,
  ]);

  const s = signups[0];
  const p = purchases[0];
  const lines = [
    `*interpunkcja.com.pl - raport za ${day}*`,
    `• Sprawdzanie pisowni (słownik, bez konta): ${spellcheckVisitors(day)} osób`,
    `• AI goście: ${guests.checks} sprawdzeń, ${guests.cost.toFixed(3)} USD (dzisiejszy limit: ${guestDailyLimit()}, pułap ${process.env.GUEST_DAILY_COST_CAP_USD || "1"} USD)`,
    `• AI zalogowani: ${users.checks} sprawdzeń, ${users.actors} osób, ${users.cost.toFixed(3)} USD`,
    `• Rejestracje: ${s.total} (Google ${s.google}, e-mail ${s.total - s.google}, niezweryfikowane ${s.unverified})`,
    `• Zakupy: ${p.count}${p.count ? `, ${p.pln.toFixed(2)} zł` : ""}`,
  ];
  await sendSlack(lines.join("\n"));
}
