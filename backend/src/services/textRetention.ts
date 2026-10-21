// backend/src/services/textRetention.ts
import { prisma } from "../lib/prisma";

// Zgodnie z polityką prywatności: treść tekstów trzymamy 90 dni.
// Wiersza nie kasujemy - liczniki limitów i statystyki admina liczą sprawdzenia,
// więc zostają charCount, errorCount, metadata i data.
export const TEXT_RETENTION_DAYS = 90;

export async function purgeOldCheckTexts(): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - TEXT_RETENTION_DAYS);

  const result = await prisma.check.updateMany({
    where: {
      createdAt: { lt: cutoff },
      NOT: { originalText: "" },
    },
    data: {
      originalText: "",
      correctedText: "",
      corrections: [],
    },
  });

  console.log(
    `[TextRetention] Wyczyszczono treść ${result.count} sprawdzeń starszych niż ${TEXT_RETENTION_DAYS} dni`,
  );
  return result.count;
}
