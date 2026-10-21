// backend/src/services/guestCheck.ts
// Sprawdzenie AI dla gości (bez konta). Osobny klucz API (ANTHROPIC_API_KEY_GUEST,
// w osobnym workspace z limitem wydatków w konsoli Anthropic) i wielowarstwowe limity:
//  - na osobę: reCAPTCHA, 1 sprawdzenie / 24 h na IP i na visitorId, 3 na podsieć
//  - łącznie: dzienny limit proporcjonalny do ruchu (30% wczorajszych użytkowników
//    sprawdzania pisowni, 20-200), godzinowy 1/8 dziennego, twardy pułap kosztu w USD
import { prisma } from "../lib/prisma";
import { checkPunctuation, CheckResult } from "./claude";
import { verifyRecaptcha } from "./recaptcha";
import { sendSlack } from "./slack";
import { spellcheckVisitors, warsawDate } from "./trafficStats";

export const GUEST_MAX_CHARS = 300;

const PER_IP = 1;
const PER_VISITOR = 1;
const PER_SUBNET = 3;
const DAILY_SHARE = 0.3;
const DAILY_MIN = 20;
const DAILY_MAX = 200;
// Rezerwa na jedno sprawdzenie przy porównaniu z pułapem (średnio ~0,015 USD)
const COST_RESERVE_USD = 0.03;

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

export type GuestCheckError =
  | "GUEST_DISABLED"
  | "TEXT_TOO_LONG"
  | "RECAPTCHA_FAILED"
  | "GUEST_LIMIT_PERSONAL"
  | "GUEST_LIMIT_GLOBAL";

export class GuestCheckRefused extends Error {
  constructor(public code: GuestCheckError) {
    super(code);
  }
}

// Zapytania w toku - blokują równoległe żądania z jednego IP, zanim trafią do bazy
const inFlight = new Set<string>();
// Sprawdzenia w toku z wszystkich adresów. AI pracuje kilka sekund, a wiersz trafia
// do bazy dopiero po odpowiedzi - bez tej rezerwacji wiele równoczesnych zapytań
// z różnych adresów przechodziło limit łączny i pułap kosztu, zanim którekolwiek
// zostało policzone. Backend działa w jednym procesie, więc licznik w pamięci wystarcza.
let globalInFlight = 0;

export function guestEnabled(): boolean {
  return !!process.env.ANTHROPIC_API_KEY_GUEST && !!process.env.RECAPTCHA_SECRET_KEY;
}

function dailyCostCap(): number {
  const cap = parseFloat(process.env.GUEST_DAILY_COST_CAP_USD || "1");
  return Number.isFinite(cap) ? cap : 1;
}

export function guestDailyLimit(): number {
  const yesterday = warsawDate(new Date(Date.now() - DAY_MS));
  const share = Math.round(spellcheckVisitors(yesterday) * DAILY_SHARE);
  return Math.min(DAILY_MAX, Math.max(DAILY_MIN, share));
}

function subnetPrefix(ip: string): string {
  const v4 = ip.replace(/^::ffff:/, "");
  if (/^\d+\.\d+\.\d+\.\d+$/.test(v4)) {
    return v4.split(".").slice(0, 3).join(".") + ".";
  }
  // IPv6: /64 - pierwsze cztery grupy
  return ip.split(":").slice(0, 4).join(":") + ":";
}

const guestWhere = { userId: null, visitorId: { not: null } };

async function guestCostSince(since: Date): Promise<number> {
  const rows = await prisma.$queryRaw<{ cost: number | null }[]>`
    SELECT COALESCE(SUM((metadata->>'estimatedCostUsd')::numeric), 0)::float AS cost
    FROM "Check"
    WHERE "userId" IS NULL AND "visitorId" IS NOT NULL AND "createdAt" >= ${since}`;
  return rows[0]?.cost ?? 0;
}

// Powiadomienie o wyczerpaniu limitu - raz dziennie dla danego rodzaju
const notified = new Set<string>();
function notifyOnce(kind: string, message: string) {
  const key = `${warsawDate()}:${kind}`;
  if (notified.has(key)) return;
  notified.add(key);
  sendSlack(`:warning: interpunkcja.com.pl - AI dla gości: ${message}`);
}

async function assertGlobalLimits() {
  const now = Date.now();
  const daily = guestDailyLimit();
  const hourly = Math.max(3, Math.ceil(daily / 8));
  const [lastDay, lastHour, cost] = await Promise.all([
    prisma.check.count({ where: { ...guestWhere, createdAt: { gte: new Date(now - DAY_MS) } } }),
    prisma.check.count({ where: { ...guestWhere, createdAt: { gte: new Date(now - HOUR_MS) } } }),
    guestCostSince(new Date(now - DAY_MS)),
  ]);

  const cap = dailyCostCap();
  if (cost + globalInFlight * COST_RESERVE_USD > cap) {
    notifyOnce("cost", `osiągnięty pułap kosztu ${cap} USD / 24 h (wydane ${cost.toFixed(3)} USD). Goście dostają tylko słownik.`);
    throw new GuestCheckRefused("GUEST_LIMIT_GLOBAL");
  }
  if (lastDay + globalInFlight > daily) {
    notifyOnce("daily", `wyczerpany limit dzienny ${daily} sprawdzeń (30% wczorajszych użytkowników sprawdzania pisowni).`);
    throw new GuestCheckRefused("GUEST_LIMIT_GLOBAL");
  }
  if (lastHour + globalInFlight > hourly) {
    notifyOnce("hourly", `wyczerpany limit godzinowy ${hourly} sprawdzeń - nagły wzrost ruchu.`);
    throw new GuestCheckRefused("GUEST_LIMIT_GLOBAL");
  }
}

async function assertPersonalLimits(ip: string, visitorId: string) {
  const since = new Date(Date.now() - DAY_MS);
  const [byIp, byVisitor, bySubnet] = await Promise.all([
    prisma.check.count({ where: { ...guestWhere, ipAddress: ip, createdAt: { gte: since } } }),
    prisma.check.count({ where: { ...guestWhere, visitorId, createdAt: { gte: since } } }),
    prisma.check.count({
      where: { ...guestWhere, ipAddress: { startsWith: subnetPrefix(ip) }, createdAt: { gte: since } },
    }),
  ]);
  if (byIp >= PER_IP || byVisitor >= PER_VISITOR || bySubnet >= PER_SUBNET) {
    throw new GuestCheckRefused("GUEST_LIMIT_PERSONAL");
  }
}

export async function runGuestCheck(params: {
  text: string;
  ip: string;
  visitorId: string;
  recaptchaToken: string;
}): Promise<CheckResult> {
  const { text, ip, visitorId, recaptchaToken } = params;

  if (!guestEnabled()) throw new GuestCheckRefused("GUEST_DISABLED");
  if (text.length > GUEST_MAX_CHARS) throw new GuestCheckRefused("TEXT_TOO_LONG");
  if (inFlight.has(ip)) throw new GuestCheckRefused("GUEST_LIMIT_PERSONAL");

  inFlight.add(ip);
  try {
    const captcha = await verifyRecaptcha(recaptchaToken, "guest_check");
    if (!captcha.success) throw new GuestCheckRefused("RECAPTCHA_FAILED");

    await assertPersonalLimits(ip, visitorId);

    // Rezerwacja przed sprawdzeniem limitu łącznego: inkrementacja jest synchroniczna,
    // więc równoległe zapytania widzą swoje rezerwacje mimo await w środku
    globalInFlight++;
    try {
      await assertGlobalLimits();
      return await runReserved(text, ip, visitorId);
    } finally {
      globalInFlight--;
    }
  } finally {
    inFlight.delete(ip);
  }
}

// Wywołanie AI i zapis - wiersz trafia do bazy, zanim rezerwacja zostanie zwolniona
async function runReserved(text: string, ip: string, visitorId: string): Promise<CheckResult> {
  const result = await checkPunctuation(text, { apiKey: process.env.ANTHROPIC_API_KEY_GUEST });

  await prisma.check.create({
    data: {
      userId: null,
      visitorId,
      ipAddress: ip,
      originalText: text,
      correctedText: result.correctedText,
      corrections: JSON.parse(JSON.stringify(result.corrections)),
      charCount: text.length,
      errorCount: result.errorCount,
      metadata: result._debug
        ? JSON.parse(JSON.stringify({ ...result._debug, summary: result.summary, guest: true }))
        : undefined,
    },
  });

  return result;
}
