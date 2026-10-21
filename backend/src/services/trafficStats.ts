// backend/src/services/trafficStats.ts
// Dzienna liczba unikalnych osób (skrót IP) korzystających ze sprawdzania
// pisowni. Na jej podstawie liczony jest dzienny limit AI dla gości, żeby
// rósł razem z ruchem zamiast być sztywny. Zapis do pliku przeżywa restarty.
import fs from "fs";
import path from "path";
import crypto from "crypto";

const FILE = path.join(process.cwd(), "data", "traffic-stats.json");
const KEEP_DAYS = 14;
const SAVE_EVERY_MS = 60 * 1000;

// dzień (YYYY-MM-DD, Europe/Warsaw) -> zbiór skrótów IP
let days: Record<string, Set<string>> = {};
let dirty = false;

export function warsawDate(d = new Date()): string {
  return d.toLocaleDateString("sv-SE", { timeZone: "Europe/Warsaw" });
}

function hashIp(ip: string): string {
  // Sól z JWT_SECRET - skrótu nie da się odwrócić słownikiem adresów IP
  return crypto
    .createHash("sha256")
    .update(`${process.env.JWT_SECRET || ""}:${ip}`)
    .digest("hex")
    .slice(0, 16);
}

function load() {
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf8")) as Record<string, string[]>;
    days = Object.fromEntries(Object.entries(raw).map(([d, ips]) => [d, new Set(ips)]));
  } catch {
    days = {};
  }
}

function save() {
  if (!dirty) return;
  const keep = Object.keys(days).sort().slice(-KEEP_DAYS);
  const out = Object.fromEntries(keep.map((d) => [d, [...days[d]]]));
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(out));
    dirty = false;
  } catch (error: any) {
    console.error("[TrafficStats] Nie udało się zapisać:", error.message);
  }
}

load();
// Bez obsługi sygnałów - własny handler SIGINT blokowałby restart PM2.
// Przy restarcie tracimy najwyżej minutę wpisów.
setInterval(save, SAVE_EVERY_MS).unref();

export function recordSpellcheckVisitor(ip: string) {
  const day = warsawDate();
  if (!days[day]) days[day] = new Set();
  const before = days[day].size;
  days[day].add(hashIp(ip));
  if (days[day].size !== before) dirty = true;
}

export function spellcheckVisitors(day: string): number {
  return days[day]?.size ?? 0;
}
