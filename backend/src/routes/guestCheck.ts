// backend/src/routes/guestCheck.ts
// Sprawdzenie AI bez konta - limity i pułap kosztu w services/guestCheck.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  GUEST_MAX_CHARS,
  GuestCheckRefused,
  guestEnabled,
  runGuestCheck,
} from "../services/guestCheck";
import { recordServerEvent } from "../services/analytics";

const guestCheckSchema = z.object({
  text: z.string().min(1).max(GUEST_MAX_CHARS),
  recaptchaToken: z.string().min(1),
  visitorId: z.string().regex(/^[a-zA-Z0-9-]{16,64}$/),
});

const MESSAGES: Record<string, [number, string]> = {
  GUEST_DISABLED: [503, "Sprawdzanie AI bez konta jest chwilowo wyłączone."],
  TEXT_TOO_LONG: [400, `Bez konta AI sprawdzi tekst do ${GUEST_MAX_CHARS} znaków.`],
  RECAPTCHA_FAILED: [403, "Weryfikacja bezpieczeństwa nie powiodła się. Odśwież stronę i spróbuj ponownie."],
  GUEST_LIMIT_PERSONAL: [429, "Twoje darmowe sprawdzenie AI na dziś zostało wykorzystane."],
  GUEST_LIMIT_GLOBAL: [429, "Dzisiejsza pula sprawdzeń AI bez konta się wyczerpała."],
};

export async function guestCheckRoutes(fastify: FastifyInstance) {
  fastify.get("/api/guest-check/status", async () => ({
    enabled: guestEnabled(),
    maxChars: GUEST_MAX_CHARS,
  }));

  fastify.post(
    "/api/guest-check",
    { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const { text, recaptchaToken, visitorId } = guestCheckSchema.parse(request.body);
      try {
        const result = await runGuestCheck({ text, ip: request.ip, visitorId, recaptchaToken });
        return {
          correctedText: result.correctedText,
          corrections: result.corrections,
          errorCount: result.errorCount,
          summary: result.summary,
        };
      } catch (error: any) {
        if (error instanceof GuestCheckRefused) {
          recordServerEvent(request, "guest_check_refused", null, { reason: error.code, chars: text.length });
          const [status, message] = MESSAGES[error.code];
          return reply.status(status).send({ error: error.code, message });
        }
        console.error("[GuestCheck] Błąd:", error.message);
        return reply.status(500).send({
          error: "CHECK_FAILED",
          message: "Nie udało się sprawdzić tekstu. Spróbuj ponownie za chwilę.",
        });
      }
    },
  );
}
