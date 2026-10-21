// backend/src/routes/spellcheck.ts
// Publiczne sprawdzanie pisowni (bez logowania, bez AI) - Hunspell.
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { checkSpelling } from "../services/spellcheck";
import { recordSpellcheckVisitor } from "../services/trafficStats";

export const SPELLCHECK_MAX_CHARS = 5000;

const spellcheckSchema = z.object({
  text: z.string().min(1).max(SPELLCHECK_MAX_CHARS),
});

export async function spellcheckRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/api/spellcheck",
    {
      // Koszt jest pomijalny, limit chroni tylko przed zalewaniem serwera
      config: { rateLimit: { max: 20, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const { text } = spellcheckSchema.parse(request.body);
      // Ruch na narzędziu wyznacza dzienny limit AI dla gości
      recordSpellcheckVisitor(request.ip);
      try {
        const issues = await checkSpelling(text);
        return { issues, checkedChars: text.length };
      } catch (error: any) {
        console.error("[Spellcheck] Błąd:", error.message);
        return reply.status(503).send({
          error: "SPELLCHECK_UNAVAILABLE",
          message: "Sprawdzanie pisowni jest chwilowo niedostępne",
        });
      }
    },
  );
}
