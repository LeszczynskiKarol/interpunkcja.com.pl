// backend/src/routes/events.ts
// Zbieranie zdarzeń z przeglądarki (strony Astro i panel SPA) do AnalyticsEvent.
// Tylko nazwy z listy - endpoint jest publiczny, więc nie przyjmujemy dowolnych.
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { isBot, recordEvent } from "../services/analytics";

// Celowo bez guest_check_refused i document_upload_rejected: te zapisuje
// backend sam (zna prawdziwy powód), przeglądarka wysyła je tylko do GA4.
const CLIENT_EVENTS = new Set([
  "page_view",
  "spellcheck",
  "spellcheck_cta",
  "guest_check",
  "article_cta",
  "sign_up",
  "login",
  "email_verified",
  "check_text",
  "limit_reached",
  "begin_checkout",
  "purchase",
  "document_quote",
  "document_preview",
]);

const propValue = z.union([z.string().max(200), z.number().finite(), z.boolean(), z.null()]);

const eventSchema = z.object({
  name: z.string().max(40),
  source: z.enum(["web", "app"]),
  path: z.string().max(300).optional(),
  props: z
    .record(z.string().max(40), propValue)
    .refine((p) => Object.keys(p).length <= 12)
    .optional(),
});

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/events",
    { config: { rateLimit: { max: 60, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const parsed = eventSchema.safeParse(request.body);
      const userAgent = request.headers["user-agent"];
      // Zawsze 204 - analityka nie zwraca błędów, które ktoś miałby debugować w konsoli
      if (!parsed.success || !CLIENT_EVENTS.has(parsed.data.name) || isBot(userAgent)) {
        return reply.status(204).send();
      }

      let userId: string | null = null;
      if (request.headers.authorization) {
        try {
          await request.jwtVerify();
          userId = (request.user as any).userId ?? null;
        } catch {
          // wygasły token - zdarzenie zapisujemy jako anonimowe
        }
      }

      const { name, source, path, props } = parsed.data;
      await recordEvent({ name, source, userId, ip: request.ip, userAgent, path, props });
      return reply.status(204).send();
    },
  );
}
