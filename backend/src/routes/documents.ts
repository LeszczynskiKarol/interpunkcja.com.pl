// backend/src/routes/documents.ts
// Korekta całego dokumentu: wgranie .docx -> wycena -> płatność Stripe -> kolejka -> pobranie.
import fs from "fs";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";
import { TrackedDocx } from "../services/docx/trackedDocx";
import { documentChars } from "../services/documentCorrector";
import { createPreview, PreviewRefused } from "../services/documentPreview";
import {
  CHARS_PER_PAGE,
  DOCUMENT_PACKAGES,
  documentDir,
  inputPath,
  markDocumentPaid,
  outputPath,
  packageForPages,
} from "../services/documentJobs";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

const guestKeyConfigured = () => !!process.env.ANTHROPIC_API_KEY_GUEST;

const PREVIEW_MESSAGES: Record<string, [number, string]> = {
  PREVIEW_DISABLED: [503, "Bezpłatne próbki są chwilowo niedostępne."],
  PREVIEW_USED: [403, "Bezpłatną próbkę można zobaczyć raz na konto."],
  PREVIEW_IP_LIMIT: [429, "Z tej sieci wykorzystano już limit bezpłatnych próbek."],
  PREVIEW_DAILY_LIMIT: [429, "Dzisiejsza pula bezpłatnych próbek się wyczerpała. Spróbuj jutro."],
  PREVIEW_BUSY: [429, "Próbka jest już przygotowywana."],
  PREVIEW_NO_TEXT: [400, "Nie znaleźliśmy w dokumencie akapitów z tekstem do próbki."],
};
const MAX_UNPAID_DOCUMENTS = 5;
const MAX_UPLOADS_PER_DAY = 20;

function stripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "");
}

async function requireUser(request: FastifyRequest, reply: FastifyReply): Promise<string | null> {
  try {
    await request.jwtVerify();
    return (request.user as any).userId as string;
  } catch {
    reply.status(401).send({ error: "UNAUTHORIZED", message: "Zaloguj się, aby skorzystać z korekty dokumentu" });
    return null;
  }
}

async function ownDocument(id: string, userId: string) {
  const doc = await prisma.document.findUnique({ where: { id } });
  return doc && doc.userId === userId ? doc : null;
}

function publicDocument(d: any) {
  return {
    id: d.id,
    fileName: d.fileName,
    pages: d.pages,
    chars: d.chars,
    amount: d.amount,
    packageId: d.packageId,
    status: d.status,
    progressDone: d.progressDone,
    progressTotal: d.progressTotal,
    corrections: d.corrections,
    createdAt: d.createdAt,
    completedAt: d.completedAt,
    downloadable: d.status === "DONE" && !d.filesDeletedAt,
    // Wynik bezpłatnej próbki (bez kosztu - to dane wewnętrzne)
    preview: d.preview
      ? { paragraphs: d.preview.paragraphs, chars: d.preview.chars, corrections: d.preview.corrections }
      : null,
  };
}

export async function documentRoutes(fastify: FastifyInstance) {
  fastify.get("/api/documents/packages", async () => ({
    charsPerPage: CHARS_PER_PAGE,
    packages: DOCUMENT_PACKAGES,
  }));

  // Wgranie pliku i wycena (bez płatności)
  fastify.post(
    "/api/documents",
    { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const userId = await requireUser(request, reply);
      if (!userId) return;

      const user = await prisma.user.findUnique({ where: { id: userId }, select: { emailVerified: true } });
      if (!user?.emailVerified) {
        return reply.status(403).send({ error: "EMAIL_NOT_VERIFIED", message: "Potwierdź adres e-mail, aby wgrać dokument" });
      }

      // Limity chroniące dysk serwera przed zalewaniem nieopłaconymi plikami
      const [unpaid, today] = await Promise.all([
        prisma.document.count({ where: { userId, status: "AWAITING_PAYMENT", filesDeletedAt: null } }),
        prisma.document.count({ where: { userId, createdAt: { gte: new Date(Date.now() - 86400000) } } }),
      ]);
      if (unpaid >= MAX_UNPAID_DOCUMENTS || today >= MAX_UPLOADS_PER_DAY) {
        return reply.status(429).send({
          error: "TOO_MANY_DOCUMENTS",
          message:
            unpaid >= MAX_UNPAID_DOCUMENTS
              ? `Masz już ${unpaid} nieopłaconych dokumentów. Opłać któryś albo poczekaj - nieopłacone usuwamy po 2 dniach.`
              : "Osiągnięto dzienny limit wgranych plików. Spróbuj jutro.",
        });
      }

      const file = await request.file();
      if (!file) return reply.status(400).send({ error: "NO_FILE", message: "Nie wybrano pliku" });
      const fileName = file.filename || "dokument.docx";
      if (!/\.docx$/i.test(fileName)) {
        return reply.status(400).send({
          error: "INVALID_FILE",
          message: "Obsługujemy pliki Worda .docx. Plik .doc albo .pdf zapisz najpierw w Wordzie jako .docx.",
        });
      }
      const buffer = await file.toBuffer();
      if (file.file.truncated) {
        return reply.status(400).send({ error: "FILE_TOO_LARGE", message: "Plik jest większy niż 15 MB" });
      }

      let chars: number;
      try {
        chars = documentChars(await TrackedDocx.load(buffer));
      } catch (error: any) {
        if (error?.message === "DOCX_TOO_LARGE") {
          return reply.status(400).send({ error: "FILE_TOO_LARGE", message: "Dokument jest za duży do automatycznej korekty - napisz do nas." });
        }
        return reply.status(400).send({ error: "INVALID_FILE", message: "Nie udało się odczytać pliku .docx" });
      }
      const pages = Math.max(1, Math.ceil(chars / CHARS_PER_PAGE));
      if (chars < 50) {
        return reply.status(400).send({ error: "EMPTY_DOCUMENT", message: "Dokument nie zawiera tekstu do sprawdzenia" });
      }
      const pkg = packageForPages(pages);
      if (!pkg) {
        return reply.status(400).send({
          error: "TOO_LONG",
          message: `Dokument ma ${pages} stron. Teksty powyżej 150 stron wyceniamy indywidualnie - napisz do nas.`,
          pages,
        });
      }

      const doc = await prisma.document.create({
        data: { userId, fileName: fileName.slice(0, 200), chars, pages, packageId: pkg.id, amount: pkg.amount },
      });
      fs.mkdirSync(documentDir(doc.id), { recursive: true });
      fs.writeFileSync(inputPath(doc.id), buffer);
      return publicDocument(doc);
    },
  );

  fastify.get("/api/documents", async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;
    const docs = await prisma.document.findMany({
      where: { userId, NOT: { status: "AWAITING_PAYMENT", filesDeletedAt: { not: null } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    // Próbka przysługuje raz na konto - przycisk tylko przy nieopłaconym dokumencie
    const previewUsed = docs.some((d) => d.previewAt) ||
      (await prisma.document.count({ where: { userId, previewAt: { not: null } } })) > 0;
    return docs.map((d) => ({
      ...publicDocument(d),
      canPreview: !previewUsed && d.status === "AWAITING_PAYMENT" && !d.filesDeletedAt && guestKeyConfigured(),
    }));
  });

  // Bezpłatna próbka ~2 stron (limity w services/documentPreview.ts)
  fastify.post(
    "/api/documents/:id/preview",
    { config: { rateLimit: { max: 3, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const userId = await requireUser(request, reply);
      if (!userId) return;
      const { id } = request.params as { id: string };
      const doc = await ownDocument(id, userId);
      if (!doc || doc.filesDeletedAt) {
        return reply.status(404).send({ error: "NOT_FOUND", message: "Nie znaleziono dokumentu" });
      }
      if (doc.preview) return { preview: publicDocument(doc).preview };
      if (doc.status !== "AWAITING_PAYMENT") {
        return reply.status(400).send({ error: "ALREADY_PAID", message: "Ten dokument jest już opłacony" });
      }
      try {
        const preview = await createPreview(id, userId, request.ip);
        return { preview: { paragraphs: preview.paragraphs, chars: preview.chars, corrections: preview.corrections } };
      } catch (error: any) {
        if (error instanceof PreviewRefused) {
          const [status, message] = PREVIEW_MESSAGES[error.code];
          return reply.status(status).send({ error: error.code, message });
        }
        console.error("[Documents] Błąd próbki:", error);
        return reply.status(500).send({ error: "PREVIEW_FAILED", message: "Nie udało się przygotować próbki. Spróbuj ponownie za chwilę." });
      }
    },
  );

  fastify.post("/api/documents/:id/checkout", async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;
    const { id } = request.params as { id: string };
    const { consent } = z.object({ consent: z.literal(true) }).parse(request.body);
    const doc = await ownDocument(id, userId);
    if (!doc || doc.status !== "AWAITING_PAYMENT" || doc.filesDeletedAt) {
      return reply.status(404).send({ error: "NOT_FOUND", message: "Nie znaleziono dokumentu do opłacenia" });
    }
    if (consent) await prisma.document.update({ where: { id }, data: { consentAt: new Date() } });
    const pkg = DOCUMENT_PACKAGES.find((p) => p.id === doc.packageId)!;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, stripeCustomerId: true } });
    const frontendUrl = process.env.FRONTEND_URL || "https://www.interpunkcja.com.pl";

    const session = await stripeClient().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "blik"],
      ...(user?.stripeCustomerId ? { customer: user.stripeCustomerId } : { customer_email: user?.email }),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "pln",
            unit_amount: doc.amount,
            product_data: {
              name: `Korekta dokumentu ${pkg.label}`,
              description: `${doc.fileName} - ${doc.pages} str.`,
            },
          },
        },
      ],
      success_url: `${frontendUrl}/panel/dokumenty?doc=${doc.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/panel/dokumenty`,
      metadata: { type: "document", documentId: doc.id, userId },
    });
    return { url: session.url };
  });

  // Potwierdzenie po powrocie ze Stripe (webhook robi to samo w tle)
  fastify.post("/api/documents/:id/verify", async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;
    const { id } = request.params as { id: string };
    const { sessionId } = z.object({ sessionId: z.string().min(1) }).parse(request.body);

    const doc = await ownDocument(id, userId);
    if (!doc) return reply.status(404).send({ error: "NOT_FOUND" });

    if (doc.status === "AWAITING_PAYMENT") {
      const session = await stripeClient().checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid" || session.metadata?.documentId !== id) {
        return reply.status(400).send({ error: "PAYMENT_NOT_COMPLETED", message: "Płatność nie została zakończona" });
      }
      await markDocumentPaid(id, session.id);
    }
    return publicDocument(await prisma.document.findUnique({ where: { id } }));
  });

  fastify.get("/api/documents/:id/download", async (request, reply) => {
    const userId = await requireUser(request, reply);
    if (!userId) return;
    const { id } = request.params as { id: string };
    const doc = await ownDocument(id, userId);
    if (!doc || doc.status !== "DONE" || doc.filesDeletedAt || !fs.existsSync(outputPath(id))) {
      return reply.status(404).send({ error: "NOT_FOUND", message: "Plik nie jest dostępny" });
    }
    const name = doc.fileName.replace(/\.docx$/i, "") + " - korekta.docx";
    reply
      .header("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      .header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(name)}`);
    return reply.send(fs.createReadStream(outputPath(id)));
  });
}
