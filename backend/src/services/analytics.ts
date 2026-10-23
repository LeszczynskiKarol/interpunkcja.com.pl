// backend/src/services/analytics.ts
// Własna analityka zdarzeń - uzupełnienie GA4, które przy zgodzie na cookies
// i małym ruchu widzi pojedyncze sztuki. Nic nie zapisujemy w przeglądarce:
// osobę anonimową rozpoznaje skrót IP z solą zmienianą codziennie (anonId),
// więc liczymy unikalnych w obrębie dnia, ale nie śledzimy między dniami.
// Zapis nigdy nie przerywa obsługi żądania - błędy tylko do logu.
import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { warsawDate } from "./trafficStats";

export type EventSource = "web" | "app" | "server";

export const RETENTION_DAYS = 395; // 13 miesięcy

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|curl|wget|python|axios|node-fetch|go-http/i;

export function isBot(userAgent: string | undefined): boolean {
  return !userAgent || BOT_UA.test(userAgent);
}

export function anonId(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(`${process.env.JWT_SECRET || ""}:${warsawDate()}:${ip}`)
    .digest("hex")
    .slice(0, 16);
}

export function deviceType(userAgent: string | undefined): string | null {
  if (!userAgent) return null;
  if (/ipad|tablet/i.test(userAgent)) return "tablet";
  if (/mobi|android|iphone/i.test(userAgent)) return "mobile";
  return "desktop";
}

// Rozszerzenie pliku bez kropki, małymi literami ("" gdy brak)
export function fileExtension(fileName: string): string {
  const m = /\.([a-z0-9]{1,8})$/i.exec(fileName.trim());
  return m ? m[1].toLowerCase() : "";
}

export interface EventInput {
  name: string;
  source: EventSource;
  userId?: string | null;
  ip?: string;
  userAgent?: string;
  path?: string | null;
  props?: Record<string, string | number | boolean | null | undefined>;
}

export async function recordEvent(e: EventInput): Promise<void> {
  try {
    const props = e.props
      ? Object.fromEntries(Object.entries(e.props).filter(([, v]) => v !== undefined))
      : undefined;
    await prisma.analyticsEvent.create({
      data: {
        name: e.name,
        source: e.source,
        userId: e.userId || null,
        anonId: e.ip ? anonId(e.ip) : null,
        path: e.path ? e.path.slice(0, 300) : null,
        device: deviceType(e.userAgent),
        props: props && Object.keys(props).length ? (props as Prisma.InputJsonObject) : undefined,
      },
    });
  } catch (error: any) {
    console.error(`[Analytics] Nie zapisano zdarzenia ${e.name}:`, error?.message);
  }
}

// Zdarzenie z backendu wywołane żądaniem użytkownika - IP i UA z żądania
export function recordServerEvent(
  request: { ip: string; headers: Record<string, any> },
  name: string,
  userId: string | null,
  props?: EventInput["props"],
): void {
  void recordEvent({
    name,
    source: "server",
    userId,
    ip: request.ip,
    userAgent: request.headers["user-agent"],
    props,
  });
}

export async function purgeOldEvents(): Promise<void> {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const { count } = await prisma.analyticsEvent.deleteMany({ where: { createdAt: { lt: cutoff } } });
  if (count) console.log(`[Analytics] Usunięto ${count} zdarzeń starszych niż ${RETENTION_DAYS} dni`);
}
