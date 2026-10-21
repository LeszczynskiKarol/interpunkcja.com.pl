// Test korekty całego dokumentu z prawdziwym AI (zużywa klucz z backend/.env).
// Użycie: npx tsx scripts/test-document-correct.ts input.docx output.docx
import "dotenv/config";
import fs from "fs";
import { TrackedDocx } from "../src/services/docx/trackedDocx";
import { correctDocument, documentChars } from "../src/services/documentCorrector";

const [input, output] = process.argv.slice(2);

(async () => {
  const doc = await TrackedDocx.load(fs.readFileSync(input));
  const chars = documentChars(doc);
  console.log(`znaki: ${chars}, strony: ${(chars / 1800).toFixed(1)}`);
  const t0 = Date.now();
  const report = await correctDocument(doc, (done, total) => console.log(`fragment ${done}/${total}`));
  fs.writeFileSync(output, await doc.toBuffer());
  console.log(JSON.stringify(report, null, 1));
  console.log(`czas: ${((Date.now() - t0) / 1000).toFixed(1)} s`);
})();
