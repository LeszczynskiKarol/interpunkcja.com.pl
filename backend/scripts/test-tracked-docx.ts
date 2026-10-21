// Test silnika zmian śledzonych na ręcznie przygotowanym pliku (bez AI).
// Użycie: npx tsx scripts/test-tracked-docx.ts input.docx output.docx
import fs from "fs";
import { TrackedDocx } from "../src/services/docx/trackedDocx";

const [input, output] = process.argv.slice(2);

// Poprawki takie, jakie zwróciłby model: poprawiony akapit + komentarze
const FIXES: Record<string, { corrected: string; comments: { corrected: string; text: string }[] }> = {
  "Wydaje mi się że ten projekt uda się skończyć przed końcem miesiąca.": {
    corrected: "Wydaje mi się, że ten projekt uda się skończyć przed końcem miesiąca.",
    comments: [{ corrected: "się, że", text: "Przecinek przed „że”: zdanie podrzędne oddzielamy przecinkiem." }],
  },
  "Zespół który nad nim pracuje ma duże doświadczenie, ale czasu jest niewiele.": {
    corrected: "Zespół, który nad nim pracuje, ma duże doświadczenie, ale czasu jest niewiele.",
    comments: [
      { corrected: "Zespół, który", text: "Zdanie wtrącone z „który” wydzielamy przecinkami z obu stron." },
      { corrected: "pracuje, ma", text: "Zamknięcie zdania wtrąconego." },
    ],
  },
  "Tabela 1\tWyniki badań": { corrected: "Tabela 1 Wyniki badań", comments: [] },
  "Wracając z biura zastanawiałam się czy warto.": {
    corrected: "Wracając z biura, zastanawiałam się, czy warto.",
    comments: [
      { corrected: "biura, zastanawiałam", text: "Imiesłowowy równoważnik zdania oddzielamy przecinkiem." },
      { corrected: "się, czy", text: "Przecinek przed „czy” wprowadzającym zdanie podrzędne." },
    ],
  },
  "Napewno to wogóle zadziała.": {
    corrected: "Na pewno to w ogóle zadziała.",
    comments: [
      { corrected: "Na pewno", text: "„Na pewno” piszemy rozdzielnie." },
      { corrected: "w ogóle", text: "„W ogóle” piszemy rozdzielnie." },
    ],
  },
};

(async () => {
  const doc = await TrackedDocx.load(fs.readFileSync(input));
  for (const p of doc.paragraphs) {
    const fix = FIXES[p.text];
    const stats = fix ? doc.applyParagraph(p, fix.corrected, fix.comments) : { applied: 0, skipped: 0 };
    console.log(`[${p.editable ? "edit" : "lock"}] ${JSON.stringify(p.text)} -> applied ${stats.applied}, skipped ${stats.skipped}`);
  }
  fs.writeFileSync(output, await doc.toBuffer());
  console.log("zapisano", output);
})();
