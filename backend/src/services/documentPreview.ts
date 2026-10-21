// backend/src/services/documentPreview.ts
// Bezpłatna próbka korekty dokumentu: ~2 strony treści, wynik jako podgląd w panelu
// (bez pliku do pobrania - inaczej pracę dałoby się poprawić za darmo w kawałkach).
// Zabezpieczenia: 1 próbka na konto, 2 na adres IP w 30 dni, dzienny limit dla
// całego serwisu, blokada równoległych żądań; koszt z klucza gości (osobny
// workspace z limitem wydatków w konsoli Anthropic).
import fs from "fs";
import { prisma } from "../lib/prisma";
import { TrackedDocx } from "./docx/trackedDocx";
import { acceptableEdit, correctParagraphs, previewParagraphs } from "./documentCorrector";
import { inputPath } from "./documentJobs";
import { sendSlack } from "./slack";
import { warsawDate } from "./trafficStats";

export const PREVIEW_CHARS = 3600; // 2 strony po 1800 znaków
const PREVIEWS_PER_IP_30_DAYS = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

function dailyLimit(): number {
  const n = parseInt(process.env.PREVIEW_DAILY_LIMIT || "30", 10);
  return Number.isFinite(n) ? n : 30;
}

export type PreviewError =
  | "PREVIEW_DISABLED"
  | "PREVIEW_USED"
  | "PREVIEW_IP_LIMIT"
  | "PREVIEW_DAILY_LIMIT"
  | "PREVIEW_BUSY"
  | "PREVIEW_NO_TEXT";

export class PreviewRefused extends Error {
  constructor(public code: PreviewError) {
    super(code);
  }
}

export interface PreviewParagraph {
  original: string;
  corrected: string;
  corrections: { corrected: string; category: string; rule: string; explanation: string }[];
}

export interface DocumentPreview {
  paragraphs: PreviewParagraph[];
  chars: number;
  corrections: number;
  costUsd: number;
}

// Użytkownicy z próbką w toku - podwójne kliknięcie albo dwie karty naraz
const inFlight = new Set<string>();
const notified = new Set<string>();

export async function createPreview(documentId: string, userId: string, ip: string): Promise<DocumentPreview> {
  if (!process.env.ANTHROPIC_API_KEY_GUEST) throw new PreviewRefused("PREVIEW_DISABLED");
  if (inFlight.has(userId)) throw new PreviewRefused("PREVIEW_BUSY");
  inFlight.add(userId);
  try {
    const now = Date.now();
    const [usedByUser, usedByIp, usedToday] = await Promise.all([
      prisma.document.count({ where: { userId, previewAt: { not: null } } }),
      prisma.document.count({ where: { previewIp: ip, previewAt: { gte: new Date(now - 30 * DAY_MS) } } }),
      prisma.document.count({ where: { previewAt: { gte: new Date(now - DAY_MS) } } }),
    ]);
    if (usedByUser > 0) throw new PreviewRefused("PREVIEW_USED");
    if (usedByIp >= PREVIEWS_PER_IP_30_DAYS) throw new PreviewRefused("PREVIEW_IP_LIMIT");
    if (usedToday >= dailyLimit()) {
      const key = warsawDate();
      if (!notified.has(key)) {
        notified.add(key);
        sendSlack(`:warning: interpunkcja.com.pl - wyczerpany dzienny limit bezpłatnych próbek dokumentów (${dailyLimit()}).`);
      }
      throw new PreviewRefused("PREVIEW_DAILY_LIMIT");
    }

    const doc = await TrackedDocx.load(fs.readFileSync(inputPath(documentId)));
    const selected = previewParagraphs(doc, PREVIEW_CHARS);
    if (!selected.length) throw new PreviewRefused("PREVIEW_NO_TEXT");

    // Rezerwacja przed wywołaniem AI; przy błędzie zwalniamy ją, żeby dało się ponowić
    await prisma.document.update({ where: { id: documentId }, data: { previewAt: new Date(), previewIp: ip } });
    try {
      const { results, costUsd } = await correctParagraphs(selected, { apiKey: process.env.ANTHROPIC_API_KEY_GUEST });
      const byId = new Map(results.map((r) => [r.id, r]));
      const paragraphs: PreviewParagraph[] = selected.map((p) => {
        const item = byId.get(p.index);
        const ok = item && acceptableEdit(p, item);
        return { original: p.text, corrected: ok ? item!.correctedText : p.text, corrections: ok ? item!.corrections : [] };
      });
      const preview: DocumentPreview = {
        paragraphs,
        chars: selected.reduce((sum, p) => sum + p.text.length, 0),
        corrections: paragraphs.reduce((sum, p) => sum + p.corrections.length, 0),
        costUsd,
      };
      await prisma.document.update({ where: { id: documentId }, data: { preview: JSON.parse(JSON.stringify(preview)) } });
      return preview;
    } catch (error) {
      await prisma.document.update({ where: { id: documentId }, data: { previewAt: null, previewIp: null } });
      throw error;
    }
  } finally {
    inFlight.delete(userId);
  }
}
