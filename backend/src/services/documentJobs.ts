// backend/src/services/documentJobs.ts
// Pakiety, pliki i kolejka korekty dokumentów. Dokumenty przetwarzamy po jednym
// (w środku korektor i tak wysyła kilka fragmentów naraz); po restarcie
// procesu kolejka wznawia opłacone i przerwane dokumenty.
import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";
import { TrackedDocx } from "./docx/trackedDocx";
import { correctDocument } from "./documentCorrector";
import { EmailService } from "./email";
import { sendSlack } from "./slack";

export const CHARS_PER_PAGE = 1800;
export const FILE_RETENTION_DAYS = 30;

export const DOCUMENT_PACKAGES = [
  { id: "doc_20", maxPages: 20, amount: 3900, label: "do 20 stron" },
  { id: "doc_60", maxPages: 60, amount: 7900, label: "do 60 stron" },
  { id: "doc_150", maxPages: 150, amount: 14900, label: "do 150 stron" },
] as const;

export function packageForPages(pages: number) {
  return DOCUMENT_PACKAGES.find((p) => pages <= p.maxPages) || null;
}

const STORAGE = path.join(process.cwd(), "uploads", "documents");

export function documentDir(id: string): string {
  return path.join(STORAGE, id);
}
export const inputPath = (id: string) => path.join(documentDir(id), "input.docx");
export const outputPath = (id: string) => path.join(documentDir(id), "output.docx");

let running = false;

async function processDocument(id: string) {
  const doc = await prisma.document.findUnique({ where: { id }, include: { user: true } });
  if (!doc || (doc.status !== "PAID" && doc.status !== "PROCESSING")) return;

  await prisma.document.update({ where: { id }, data: { status: "PROCESSING", error: null } });
  try {
    const docx = await TrackedDocx.load(fs.readFileSync(inputPath(id)));
    let lastSaved = 0;
    const report = await correctDocument(docx, (done, total) => {
      // Postęp do bazy co kilka sekund - panel odpytuje go w trakcie
      if (Date.now() - lastSaved > 3000 || done === total) {
        lastSaved = Date.now();
        prisma.document
          .update({ where: { id }, data: { progressDone: done, progressTotal: total } })
          .catch(() => undefined);
      }
    });
    fs.writeFileSync(outputPath(id), await docx.toBuffer());

    await prisma.document.update({
      where: { id },
      data: {
        status: "DONE",
        completedAt: new Date(),
        corrections: report.corrections,
        report: JSON.parse(JSON.stringify(report)),
        costUsd: report.costUsd,
      },
    });
    await new EmailService().sendDocumentReady(doc.user.email, doc.fileName, report.corrections);
    await sendSlack(
      `:page_facing_up: interpunkcja.com.pl - dokument gotowy: ${doc.pages} str., ${report.corrections} poprawek, koszt AI ${report.costUsd.toFixed(2)} USD (${(doc.amount / 100).toFixed(0)} zł)`,
    );
  } catch (error: any) {
    console.error(`[Documents] Błąd korekty ${id}:`, error);
    await prisma.document.update({
      where: { id },
      data: { status: "FAILED", error: String(error?.message || error).slice(0, 500) },
    });
    await sendSlack(
      `:x: interpunkcja.com.pl - korekta dokumentu ${id} nie powiodła się (${error?.message}). Klient zapłacił ${(doc.amount / 100).toFixed(0)} zł - sprawdź i ponów albo zwróć pieniądze.`,
    );
  }
}

// Uruchamia przetwarzanie wszystkich opłaconych dokumentów po kolei
export async function runDocumentQueue() {
  if (running) return;
  running = true;
  try {
    for (;;) {
      const next = await prisma.document.findFirst({
        where: { status: { in: ["PAID", "PROCESSING"] } },
        orderBy: { paidAt: "asc" },
      });
      if (!next) break;
      await processDocument(next.id);
    }
  } finally {
    running = false;
  }
}

// Oznacza dokument jako opłacony (z weryfikacji po powrocie ze Stripe albo z webhooka)
export async function markDocumentPaid(documentId: string, sessionId: string) {
  const updated = await prisma.document.updateMany({
    where: { id: documentId, status: "AWAITING_PAYMENT" },
    data: { status: "PAID", paidAt: new Date(), stripeSessionId: sessionId },
  });
  if (updated.count) {
    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (doc) {
      sendSlack(
        `:moneybag: interpunkcja.com.pl - zakup korekty dokumentu: ${doc.pages} str., ${(doc.amount / 100).toFixed(0)} zł`,
      );
    }
    runDocumentQueue().catch((e) => console.error("[Documents] Kolejka:", e));
  }
}

// Kasuje pliki starsze niż 30 dni i nieopłacone porzucone po 2 dniach
export async function purgeDocumentFiles() {
  const now = Date.now();
  const old = await prisma.document.findMany({
    where: {
      filesDeletedAt: null,
      OR: [
        { createdAt: { lt: new Date(now - FILE_RETENTION_DAYS * 86400000) } },
        { status: "AWAITING_PAYMENT", createdAt: { lt: new Date(now - 2 * 86400000) } },
      ],
    },
    select: { id: true },
  });
  for (const { id } of old) {
    fs.rmSync(documentDir(id), { recursive: true, force: true });
    await prisma.document.update({ where: { id }, data: { filesDeletedAt: new Date() } });
  }
  if (old.length) console.log(`[Documents] Usunięto pliki ${old.length} dokumentów`);
}
