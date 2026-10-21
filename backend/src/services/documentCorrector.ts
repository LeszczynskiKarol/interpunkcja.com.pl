// backend/src/services/documentCorrector.ts
// Korekta całego dokumentu .docx: akapity -> fragmenty po ~3000 znaków -> Claude
// (ponumerowane akapity, schemat odpowiedzi) -> zmiany śledzone z komentarzami.
import { CORRECTION_RULES, getAnthropicClient, getModel } from "./claude";
import { diffArrays } from "diff";
import { TrackedDocx, Paragraph, tokenize } from "./docx/trackedDocx";

const CHUNK_CHARS = 3000;
const CHUNK_MAX_PARAGRAPHS = 40;
const CONCURRENCY = 4;
// Akapit, w którym zmieniło się więcej niż tyle znaków, to przepisanie, a nie korekta.
// Próg bezwzględny przepuszcza krótkie akapity z kilkoma poprawkami pisowni
// („Wogóle… napewno” to ~30% krótkiego zdania, a nadal zwykła korekta).
const MAX_CHANGE_RATIO = 0.25;
const MIN_REWRITE_CHARS = 40;

// Po takim nagłówku zaczyna się bibliografia - jej nie poprawiamy
const BIBLIOGRAPHY = /^(bibliografia|literatura|spis literatury|wykaz literatury|źródła|netografia|references)\b/i;

const DOCUMENT_PROMPT = `Jesteś doświadczonym korektorem tekstów polskich. Poprawiasz dokument - najczęściej pracę dyplomową, artykuł albo raport. Dostajesz kolejny fragment dokumentu jako ponumerowane akapity. Twoim głównym zadaniem jest interpunkcja; przy okazji poprawiasz ortografię, pisownię łączną i rozdzielną oraz gramatykę.

To korekta, nie redakcja: zostaw styl autora, słownictwo i budowę zdań. Zmieniaj tylko to, co jest błędem według norm języka polskiego. Nie poprawiaj cytatów z innych autorów (tekst w cudzysłowie przytoczony z cudzego źródła), terminologii fachowej, nazw własnych, tytułów publikacji, adresów, wzorów ani zapisów bibliograficznych. Część akapitów to przypisy dolne - zwykle zawierają opisy źródeł (autor, tytuł, wydawca, strona); poprawiaj w nich tylko tekst autora pracy, nie zapis źródła.

${CORRECTION_RULES}
## Odpowiedź

Zwróć tylko akapity, w których coś poprawiłeś. Dla każdego podaj:
- id: numer akapitu z wejścia;
- correctedText: cały akapit po poprawkach - ten sam tekst co na wejściu, różniący się wyłącznie poprawkami (nie łącz i nie dziel akapitów, nie zmieniaj tabulatorów);
- corrections: lista poprawek, a w każdej: corrected (krótki fragment poprawionego tekstu obejmujący zmianę, np. "się, że"), category, rule (konkretna reguła) i explanation (1-2 zdania przystępnym językiem).

Jeśli fragment nie zawiera błędów, zwróć pustą listę paragraphs.`;

const CATEGORIES = ["interpunkcja", "ortografia", "pisownia", "gramatyka", "stylistyka"];

const DOCUMENT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["paragraphs"],
  properties: {
    paragraphs: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "correctedText", "corrections"],
        properties: {
          id: { type: "integer" },
          correctedText: { type: "string" },
          corrections: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["corrected", "category", "rule", "explanation"],
              properties: {
                corrected: { type: "string" },
                category: { type: "string", enum: CATEGORIES },
                rule: { type: "string" },
                explanation: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

export interface AiParagraph {
  id: number;
  correctedText: string;
  corrections: { corrected: string; category: string; rule: string; explanation: string }[];
}

export interface CorrectionReport {
  paragraphs: number;
  checkedParagraphs: number;
  chunks: number;
  corrections: number;
  rejectedRewrites: number;
  skippedEdits: number;
  byCategory: Record<string, number>;
  costUsd: number;
}

// Liczba znaków ze spacjami (1 strona = 1800 znaków)
export function documentChars(doc: TrackedDocx): number {
  return doc.paragraphs.reduce((sum, p) => sum + p.text.length, 0);
}

function checkable(paragraphs: Paragraph[]): Paragraph[] {
  const out: Paragraph[] = [];
  let inBibliography = false;
  for (const p of paragraphs) {
    const text = p.text.trim();
    // Bibliografia kończy treść główną; przypisy (osobna część) sprawdzamy dalej
    if (p.part === "body" && BIBLIOGRAPHY.test(text) && text.length < 40) inBibliography = true;
    if (p.part === "body" && inBibliography) continue;
    // Puste akapity, numery stron, same liczby - nic do poprawy
    if (p.editable && /\p{L}{2,}/u.test(text) && text.split(/\s+/).length >= 2) out.push(p);
  }
  return out;
}

// Fragment do bezpłatnej próbki: pierwsze akapity treści głównej (od ~15 słów,
// co pomija stronę tytułową i spis treści) do zadanej liczby znaków
export function previewParagraphs(doc: TrackedDocx, maxChars: number): Paragraph[] {
  const out: Paragraph[] = [];
  let size = 0;
  for (const p of checkable(doc.paragraphs)) {
    if (p.part !== "body" || p.text.trim().split(/\s+/).length < 15) continue;
    if (size + p.text.length > maxChars && out.length) break;
    out.push(p);
    size += p.text.length;
  }
  return out;
}

function chunk(paragraphs: Paragraph[]): Paragraph[][] {
  const chunks: Paragraph[][] = [];
  let current: Paragraph[] = [];
  let size = 0;
  for (const p of paragraphs) {
    if (current.length && (size + p.text.length > CHUNK_CHARS || current.length >= CHUNK_MAX_PARAGRAPHS)) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(p);
    size += p.text.length;
  }
  if (current.length) chunks.push(current);
  return chunks;
}

// Liczba znaków faktycznie usuniętych lub dodanych (porównanie słowo po słowie)
function changedChars(a: string, b: string): number {
  let changed = 0;
  for (const part of diffArrays(tokenize(a), tokenize(b))) {
    if (part.added || part.removed) changed += part.value.join("").length;
  }
  return changed;
}

async function correctChunk(paragraphs: Paragraph[], apiKey?: string): Promise<{ result: AiParagraph[]; costUsd: number }> {
  const { model, profile } = getModel();
  const input = paragraphs.map((p) => ({ id: p.index, text: p.text }));
  const response = await getAnthropicClient(apiKey)
    .messages.stream({
      model,
      max_tokens: 32000,
      thinking: profile.params.thinking,
      output_config: {
        ...(profile.params.output_config || {}),
        format: { type: "json_schema", schema: DOCUMENT_SCHEMA },
      },
      // Ten sam prompt w każdym fragmencie - cache obniża koszt wejścia
      system: [{ type: "text", text: DOCUMENT_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Akapity do sprawdzenia (JSON):\n${JSON.stringify(input)}` }],
    })
    .finalMessage();

  if (response.stop_reason === "refusal") throw new Error("MODEL_REFUSAL");
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("NO_TEXT_BLOCK");

  const u = response.usage;
  const cacheRead = u.cache_read_input_tokens || 0;
  const cacheWrite = u.cache_creation_input_tokens || 0;
  const costUsd =
    (u.input_tokens * profile.price[0] +
      cacheWrite * profile.price[0] * 1.25 +
      cacheRead * profile.price[0] * 0.1 +
      u.output_tokens * profile.price[1]) /
    1_000_000;

  return { result: (JSON.parse(text.text).paragraphs || []) as AiParagraph[], costUsd };
}

// Akapity -> fragmenty -> Claude równolegle; wyniki w kolejności fragmentów
export async function correctParagraphs(
  paragraphs: Paragraph[],
  options: { apiKey?: string; onProgress?: (done: number, total: number) => void } = {},
): Promise<{ results: AiParagraph[]; costUsd: number }> {
  const chunks = chunk(paragraphs);
  const results: AiParagraph[][] = new Array(chunks.length);
  let costUsd = 0;
  let next = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, chunks.length) }, async () => {
      while (next < chunks.length) {
        const i = next++;
        let lastError: unknown;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const r = await correctChunk(chunks[i], options.apiKey);
            results[i] = r.result;
            costUsd += r.costUsd;
            lastError = null;
            break;
          } catch (error) {
            lastError = error;
          }
        }
        if (lastError) throw lastError;
        options.onProgress?.(++done, chunks.length);
      }
    }),
  );
  return { results: results.flat(), costUsd };
}

// Poprawka akapitu przyjęta do pliku: nie przepisuje akapitu (bezpiecznik 25%)
export function acceptableEdit(paragraph: Paragraph, item: AiParagraph): boolean {
  if (item.correctedText === paragraph.text) return false;
  const changed = changedChars(paragraph.text, item.correctedText);
  return changed <= MIN_REWRITE_CHARS || changed / Math.max(1, paragraph.text.length) <= MAX_CHANGE_RATIO;
}

export async function correctDocument(
  doc: TrackedDocx,
  onProgress?: (done: number, total: number) => void,
): Promise<CorrectionReport> {
  const toCheck = checkable(doc.paragraphs);
  const chunks = chunk(toCheck);
  const byIndex = new Map(doc.paragraphs.map((p) => [p.index, p]));
  const report: CorrectionReport = {
    paragraphs: doc.paragraphs.length,
    checkedParagraphs: toCheck.length,
    chunks: chunks.length,
    corrections: 0,
    rejectedRewrites: 0,
    skippedEdits: 0,
    byCategory: Object.fromEntries(CATEGORIES.map((c) => [c, 0])),
    costUsd: 0,
  };

  // Wyniki zbieramy równolegle, a nanosimy po kolei (zmiany dotyczą jednego DOM)
  const { results, costUsd } = await correctParagraphs(toCheck, { onProgress });
  report.costUsd = costUsd;

  for (const item of results) {
    const paragraph = byIndex.get(item.id);
    if (!paragraph || item.correctedText === paragraph.text) continue;
    if (!acceptableEdit(paragraph, item)) {
      report.rejectedRewrites++;
      continue;
    }
    const stats = doc.applyParagraph(
      paragraph,
      item.correctedText,
      item.corrections.map((c) => ({ corrected: c.corrected, text: `${c.rule}: ${c.explanation}` })),
    );
    report.skippedEdits += stats.skipped;
    if (stats.applied) {
      report.corrections += item.corrections.length;
      for (const c of item.corrections) report.byCategory[c.category] = (report.byCategory[c.category] || 0) + 1;
    }
  }
  return report;
}
