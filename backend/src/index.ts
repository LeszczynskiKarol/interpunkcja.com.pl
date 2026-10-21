// backend/src/index.ts
import cron from "node-cron";
import { runAbuseReport } from "./services/abuseMonitor";
import { purgeOldCheckTexts } from "./services/textRetention";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";
import { sitemapRoutes } from "./routes/sitemap";
import { checkRoutes } from "./routes/check";
import { authRoutes } from "./routes/auth";
import { paymentRoutes } from "./routes/payments";
import { adminRoutes } from "./routes/admin";
import { articleRoutes } from "./routes/articles";
import { spellcheckRoutes } from "./routes/spellcheck";
import { guestCheckRoutes } from "./routes/guestCheck";
import { documentRoutes, MAX_UPLOAD_BYTES } from "./routes/documents";
import { purgeDocumentFiles, runDocumentQueue } from "./services/documentJobs";
import multipart from "@fastify/multipart";
import { sendDailyReport } from "./services/dailyReport";

import fastifyRawBody from "fastify-raw-body";

dotenv.config();

const fastify = Fastify({
  logger: true,
  disableRequestLogging: true,
  trustProxy: true,
});

async function start() {
  // CORS - tylko w dev (Vite :5173, ngrok). Na produkcji front i API są pod
  // jedną domeną za nginx, więc CORS_ORIGINS nie jest ustawione.
  const allowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  if (allowedOrigins.length > 0) {
    await fastify.register(cors, {
      origin: (origin, cb) => {
        // Brak origin (np. curl, Postman) - pozwól
        if (!origin) {
          cb(null, true);
          return;
        }
        // Sprawdź czy origin jest dozwolony
        if (allowedOrigins.includes(origin)) {
          cb(null, true);
          return;
        }
        // Niedozwolony origin
        cb(new Error("Not allowed by CORS"), false);
      },
      credentials: true,
    });
  }

  // Raw body for Stripe webhooks
  await fastify.register(fastifyRawBody, {
    field: "rawBody",
    global: false,
    runFirst: true,
  });

  // JWT
  await fastify.register(jwt, {
    secret:
      process.env.JWT_SECRET ||
      "interpunkcja-super-secret-key-change-in-production",
  });

  // Rate limiting (dodatkowa warstwa ochrony)
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // Error handler dla Zod
  fastify.setErrorHandler((error: Error, request, reply) => {
    if (error.name === "ZodError") {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Błąd walidacji danych",
        details: JSON.parse(error.message),
      });
    }

    fastify.log.error(error);

    return reply.status(500).send({
      error: "INTERNAL_ERROR",
      message: "Wystąpił błąd serwera",
    });
  });

  // Routes
  await fastify.register(checkRoutes);
  await fastify.register(authRoutes);
  await fastify.register(paymentRoutes);
  await fastify.register(adminRoutes);
  await fastify.register(articleRoutes);
  await fastify.register(spellcheckRoutes);
  await fastify.register(multipart, { limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 } });
  await fastify.register(guestCheckRoutes);
  await fastify.register(documentRoutes);
  await fastify.register(sitemapRoutes);

  // Health check
  fastify.get("/api/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // Start server
  const port = parseInt(process.env.PORT || "3001");
  const host = process.env.HOST || "0.0.0.0";

  // Cron - codziennie o 9:00 raport podejrzanych IP
  if (process.env.ENABLE_ABUSE_MONITOR === "true") {
    cron.schedule(
      "0 9 * * *",
      () => {
        runAbuseReport().catch((err) =>
          console.error("[AbuseMonitor] Unhandled error:", err),
        );
      },
      {
        timezone: "Europe/Warsaw",
      },
    );
    console.log("✅ Abuse monitor cron registered (daily 9:00 Europe/Warsaw)");
  }

  // Cron - codziennie o 3:30 czyszczenie treści sprawdzeń starszych niż 90 dni
  cron.schedule(
    "30 3 * * *",
    () => {
      purgeOldCheckTexts().catch((err) =>
        console.error("[TextRetention] Unhandled error:", err),
      );
    },
    {
      timezone: "Europe/Warsaw",
    },
  );
  console.log("✅ Text retention cron registered (daily 3:30 Europe/Warsaw)");

  // Cron - codziennie o 8:00 raport użycia i kosztów na Slacka
  cron.schedule(
    "0 8 * * *",
    () => {
      sendDailyReport().catch((err) =>
        console.error("[DailyReport] Unhandled error:", err),
      );
    },
    {
      timezone: "Europe/Warsaw",
    },
  );
  console.log("✅ Daily report cron registered (daily 8:00 Europe/Warsaw)");

  // Cron - codziennie o 3:45 kasowanie plików dokumentów starszych niż 30 dni
  cron.schedule(
    "45 3 * * *",
    () => {
      purgeDocumentFiles().catch((err) =>
        console.error("[Documents] Purge error:", err),
      );
    },
    {
      timezone: "Europe/Warsaw",
    },
  );

  try {
    await fastify.listen({ port, host });
    console.log(`🚀 Interpunkcja API running on http://${host}:${port}`);
    // Dokumenty opłacone lub przerwane restartem wracają do kolejki
    runDocumentQueue().catch((err) => console.error("[Documents] Kolejka:", err));
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
