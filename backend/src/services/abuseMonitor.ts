// backend/src/services/abuseMonitor.ts
import { prisma } from "../lib/prisma";
import { EmailService } from "./email";

const MIN_ACCOUNTS_TO_REPORT = 3; // zgłaszaj IP z 3+ kontami FREE
const LOOKBACK_DAYS = 30;

export interface SuspiciousIpEntry {
  ip: string;
  accountCount: number;
  accounts: {
    id: string;
    email: string;
    name: string | null;
    plan: string;
    createdAt: Date;
    checksCount: number;
  }[];
  totalChecks: number;
}

export async function findSuspiciousIps(): Promise<SuspiciousIpEntry[]> {
  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  // Znajdź IP z >= MIN_ACCOUNTS_TO_REPORT kontami FREE założonymi w ostatnich 30 dniach
  const grouped = await prisma.user.groupBy({
    by: ["registrationIp"],
    where: {
      registrationIp: { not: null },
      plan: "FREE",
      createdAt: { gte: since },
    },
    _count: { id: true },
    having: {
      id: { _count: { gte: MIN_ACCOUNTS_TO_REPORT } },
    },
  });

  const result: SuspiciousIpEntry[] = [];

  for (const row of grouped) {
    if (!row.registrationIp) continue;

    const accounts = await prisma.user.findMany({
      where: {
        registrationIp: row.registrationIp,
        plan: "FREE",
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        createdAt: true,
        _count: {
          select: { checks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalChecks = accounts.reduce((sum, a) => sum + a._count.checks, 0);

    result.push({
      ip: row.registrationIp,
      accountCount: row._count.id,
      accounts: accounts.map((a) => ({
        id: a.id,
        email: a.email,
        name: a.name,
        plan: a.plan,
        createdAt: a.createdAt,
        checksCount: a._count.checks,
      })),
      totalChecks,
    });
  }

  // Sortuj malejąco po liczbie kont
  result.sort((a, b) => b.accountCount - a.accountCount);

  return result;
}

export async function runAbuseReport(): Promise<void> {
  console.log("[AbuseMonitor] Running daily abuse scan...");

  try {
    const suspicious = await findSuspiciousIps();

    if (suspicious.length === 0) {
      console.log("[AbuseMonitor] No suspicious IPs found. ✓");
      return;
    }

    console.log(`[AbuseMonitor] Found ${suspicious.length} suspicious IP(s):`);
    for (const entry of suspicious) {
      console.log(
        `  - IP ${entry.ip}: ${entry.accountCount} kont FREE, ${entry.totalChecks} sprawdzeń`,
      );
      for (const acc of entry.accounts) {
        console.log(
          `      • ${acc.email} (${acc.checksCount} sprawdzeń, utworzone ${acc.createdAt.toISOString().slice(0, 10)})`,
        );
      }
    }

    // Wyślij email do admina
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const emailService = new EmailService();
      await emailService.sendAbuseReport(adminEmail, suspicious);
      console.log(`[AbuseMonitor] Report sent to ${adminEmail}`);
    } else {
      console.warn("[AbuseMonitor] ADMIN_EMAIL not set, skipping email.");
    }
  } catch (error) {
    console.error("[AbuseMonitor] Error during scan:", error);
  }
}
