// backend/src/services/docx/trackedDocx.ts
// Nanoszenie poprawek na .docx jako zmiany śledzone Worda (w:ins / w:del)
// z komentarzem przy każdej poprawce. Formatowanie zostaje nietknięte:
// tekst akapitu jest mapowany na znaczniki w:t, a poprawka dzieli runy
// tylko w miejscu zmiany i kopiuje ich właściwości (w:rPr).
import JSZip from "jszip";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import { diffArrays } from "diff";

const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const REL_COMMENTS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments";
const CT_COMMENTS = "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml";

export const REVISION_AUTHOR = "Interpunkcja.com.pl";

// Znaki nieedytowalne w tekście akapitu (tabulator, łamanie wiersza) - poprawka,
// która by je naruszyła, jest pomijana
const LOCKED = /[\t\n]/;

interface Segment {
  run: Element; // w:r
  node: Element; // w:t albo w:tab / w:br
  start: number;
  end: number;
  locked: boolean;
}

// Część dokumentu: treść główna albo przypisy (osobne pliki XML w archiwum .docx)
export type PartKind = "body" | "footnote" | "endnote";

export interface Paragraph {
  index: number;
  element: Element;
  text: string;
  editable: boolean;
  part: PartKind;
  // Identyfikator przypisu (w:footnote/w:endnote w:id) dla akapitów z przypisów
  noteId?: string;
}

const PARTS: { kind: PartKind; path: string; container?: string }[] = [
  { kind: "body", path: "word/document.xml" },
  { kind: "footnote", path: "word/footnotes.xml", container: "footnote" },
  { kind: "endnote", path: "word/endnotes.xml", container: "endnote" },
];

export interface CommentInput {
  // Fragment poprawionego tekstu, przy którym ma się pojawić komentarz
  corrected: string;
  text: string;
}

export interface EditStats {
  applied: number;
  skipped: number;
}

function isW(node: Node | null, local: string): node is Element {
  return !!node && node.nodeType === 1 && (node as Element).namespaceURI === W && (node as Element).localName === local;
}

function hasAncestor(node: Node, locals: string[], stop: Element): boolean {
  let cur = node.parentNode;
  while (cur && cur !== stop) {
    if (cur.nodeType === 1 && (cur as Element).namespaceURI === W && locals.includes((cur as Element).localName)) {
      return true;
    }
    cur = cur.parentNode;
  }
  return false;
}

function descendants(el: Element, local: string): Element[] {
  return Array.from(el.getElementsByTagNameNS(W, local));
}

// Runy akapitu w kolejności dokumentu, z pominięciem zagnieżdżonych akapitów
// (np. w polach tekstowych) i istniejących zmian śledzonych
function paragraphSegments(p: Element): { segments: Segment[]; text: string; editable: boolean } {
  const segments: Segment[] = [];
  let text = "";
  let editable = true;

  for (const run of descendants(p, "r")) {
    // Run należy do innego (zagnieżdżonego) akapitu
    let owner = run.parentNode;
    while (owner && !isW(owner, "p")) owner = owner.parentNode;
    if (owner !== p) continue;

    if (hasAncestor(run, ["del", "ins", "moveFrom", "moveTo"], p)) {
      // Dokument ma już zmiany śledzone w tym akapicie - nie mieszamy z nimi
      editable = false;
      continue;
    }
    for (let child = run.firstChild; child; child = child.nextSibling) {
      if (isW(child, "instrText") || isW(child, "fldChar")) {
        // Pola (spisy treści, przypisy w polach) - akapit tylko do odczytu
        editable = false;
      } else if (isW(child, "t")) {
        const value = child.textContent || "";
        segments.push({ run, node: child, start: text.length, end: text.length + value.length, locked: false });
        text += value;
      } else if (isW(child, "tab") || isW(child, "br") || isW(child, "cr")) {
        const ch = isW(child, "tab") ? "\t" : "\n";
        segments.push({ run, node: child, start: text.length, end: text.length + 1, locked: true });
        text += ch;
      }
    }
  }
  return { segments, text, editable };
}

export class TrackedDocx {
  private zip: JSZip;
  // Dokument XML, w którym tworzymy nowe elementy - ustawiany na część
  // edytowanego akapitu (treść albo przypisy)
  private doc: Document;
  private parts: { path: string; doc: Document }[];
  private comments: { id: number; text: string }[] = [];
  private nextId = 9000; // id zmian i komentarzy - poza zakresem typowym dla Worda
  private date = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  readonly paragraphs: Paragraph[] = [];

  private constructor(zip: JSZip, parts: { kind: PartKind; path: string; container?: string; doc: Document }[]) {
    this.zip = zip;
    this.parts = parts.map(({ path, doc }) => ({ path, doc }));
    this.doc = parts[0].doc;
    let index = 0;
    for (const part of parts) {
      let containers: Element[];
      if (part.kind === "body") {
        containers = [part.doc.getElementsByTagNameNS(W, "body")[0]];
      } else {
        // Separatory przypisów (w:type="separator" itp.) to linie, nie treść
        containers = descendants(part.doc.documentElement, part.container!).filter(
          (c) => !c.getAttributeNS(W, "type") || c.getAttributeNS(W, "type") === "normal",
        );
      }
      for (const container of containers) {
        for (const element of descendants(container, "p")) {
          const { text, editable } = paragraphSegments(element);
          const noteId = part.kind === "body" ? undefined : container.getAttributeNS(W, "id") || undefined;
          this.paragraphs.push({ index: index++, element, text, editable, part: part.kind, noteId });
        }
      }
    }
  }

  static async load(buffer: Buffer): Promise<TrackedDocx> {
    const zip = await JSZip.loadAsync(buffer);
    assertSaneArchive(zip);
    if (!zip.file("word/document.xml")) throw new Error("INVALID_DOCX");
    const parts: { kind: PartKind; path: string; container?: string; doc: Document }[] = [];
    for (const part of PARTS) {
      const entry = zip.file(part.path);
      if (!entry) continue;
      const xml = await readLimited(entry, MAX_DOCUMENT_XML_BYTES);
      parts.push({ ...part, doc: new DOMParser().parseFromString(xml, "text/xml") });
    }
    return new TrackedDocx(zip, parts);
  }

  private el(local: string, attrs: Record<string, string> = {}): Element {
    const e = this.doc.createElementNS(W, `w:${local}`);
    for (const [k, v] of Object.entries(attrs)) e.setAttributeNS(W, `w:${k}`, v);
    return e;
  }

  private revision(local: "ins" | "del"): Element {
    return this.el(local, { id: String(this.nextId++), author: REVISION_AUTHOR, date: this.date });
  }

  // Dzieli run tak, żeby `offset` (w tekście akapitu) wypadał na granicy runów
  private splitAt(p: Element, offset: number) {
    const { segments } = paragraphSegments(p);
    const seg = segments.find((s) => s.start < offset && offset < s.end);
    if (seg) {
      // Podział tekstu w:t na dwa runy z tym samym formatowaniem
      const value = seg.node.textContent || "";
      const k = offset - seg.start;
      seg.node.textContent = value.slice(0, k);
      seg.node.setAttribute("xml:space", "preserve");
      const tail = this.cloneRunShell(seg.run);
      const t2 = this.el("t");
      t2.setAttribute("xml:space", "preserve");
      t2.textContent = value.slice(k);
      tail.appendChild(t2);
      let next = seg.node.nextSibling;
      while (next) {
        const after = next.nextSibling;
        tail.appendChild(next);
        next = after;
      }
      seg.run.parentNode!.insertBefore(tail, seg.run.nextSibling);
      return;
    }
    // Granica między elementami jednego runu (np. w:t, w:tab, w:t)
    const at = segments.find((s) => s.start === offset);
    if (at) {
      // Dzielimy tylko, gdy przed tym elementem w tym samym runie jest już tekst
      const before = segments.some((s) => s.run === at.run && s.start < offset);
      if (before) {
        const tail = this.cloneRunShell(at.run);
        let cur: Node | null = at.node;
        while (cur) {
          const after: Node | null = cur.nextSibling;
          tail.appendChild(cur);
          cur = after;
        }
        at.run.parentNode!.insertBefore(tail, at.run.nextSibling);
      }
    }
  }

  // Nowy run z tymi samymi właściwościami (w:rPr), bez treści
  private cloneRunShell(run: Element): Element {
    const shell = this.el("r");
    for (let c = run.firstChild; c; c = c.nextSibling) {
      if (isW(c, "rPr")) {
        shell.appendChild(c.cloneNode(true));
        break;
      }
    }
    return shell;
  }

  // Zamienia fragment [a, b) tekstu akapitu na `insert` jako zmianę śledzoną.
  // Zwraca false, gdy zmiana dotyka znaków nieedytowalnych.
  private applyHunk(p: Element, a: number, b: number, insert: string, comment?: string): boolean {
    const before = paragraphSegments(p);
    if (LOCKED.test(before.text.slice(a, b)) || LOCKED.test(insert)) return false;
    if (before.segments.length === 0) return false;

    this.splitAt(p, b);
    this.splitAt(p, a);
    const { segments } = paragraphSegments(p);

    const runsInRange: Element[] = [];
    for (const s of segments) {
      if (s.start >= a && s.end <= b && s.end > s.start && !runsInRange.includes(s.run)) runsInRange.push(s.run);
    }

    // Run, od którego bierzemy formatowanie wstawianego tekstu
    const styleRun =
      runsInRange[0] ||
      segments.find((s) => s.end === a && !s.locked)?.run ||
      segments.find((s) => s.start === a)?.run ||
      segments[segments.length - 1].run;

    const touched: Element[] = [];
    for (const run of runsInRange) {
      for (const t of descendants(run, "t")) {
        const dt = this.el("delText");
        dt.setAttribute("xml:space", "preserve");
        dt.textContent = t.textContent;
        run.replaceChild(dt, t);
      }
      const del = this.revision("del");
      run.parentNode!.insertBefore(del, run);
      del.appendChild(run);
      touched.push(del);
    }

    if (insert) {
      const run = this.cloneRunShell(styleRun);
      const t = this.el("t");
      t.setAttribute("xml:space", "preserve");
      t.textContent = insert;
      run.appendChild(t);
      const ins = this.revision("ins");
      ins.appendChild(run);
      if (touched.length) {
        const last = touched[touched.length - 1];
        last.parentNode!.insertBefore(ins, last.nextSibling);
      } else {
        const endRun = segments.find((s) => s.end === a)?.run;
        if (endRun) {
          endRun.parentNode!.insertBefore(ins, endRun.nextSibling);
        } else {
          const startRun = segments.find((s) => s.start === a)?.run || styleRun;
          startRun.parentNode!.insertBefore(ins, startRun);
        }
      }
      touched.push(ins);
    }

    if (comment && touched.length) this.attachComment(touched[0], touched[touched.length - 1], comment);
    return true;
  }

  // Komentarz do poprawek w przypisie - na odnośniku przypisu w treści głównej
  private attachNoteComment(paragraph: Paragraph, texts: string[]) {
    if (!paragraph.noteId || !texts.length) return;
    const local = paragraph.part === "footnote" ? "footnoteReference" : "endnoteReference";
    const body = this.parts[0].doc;
    const ref = descendants(body.documentElement, local).find((r) => r.getAttributeNS(W, "id") === paragraph.noteId);
    const run = ref?.parentNode as Element | undefined;
    if (!run || !isW(run, "r")) return;
    this.doc = body;
    this.attachComment(run, run, `W przypisie: ${texts.join(" ")}`);
  }

  private attachComment(first: Element, last: Element, text: string) {
    const id = String(this.nextId++);
    const start = this.el("commentRangeStart", { id });
    const end = this.el("commentRangeEnd", { id });
    first.parentNode!.insertBefore(start, first);
    last.parentNode!.insertBefore(end, last.nextSibling);
    const refRun = this.el("r");
    const rPr = this.el("rPr");
    rPr.appendChild(this.el("rStyle", { val: "CommentReference" }));
    refRun.appendChild(rPr);
    refRun.appendChild(this.el("commentReference", { id }));
    end.parentNode!.insertBefore(refRun, end.nextSibling);
    this.comments.push({ id: Number(id), text });
  }

  // Nanosi poprawiony tekst akapitu jako zmiany śledzone. Komentarze są
  // przypinane do zmiany, która leży w obrębie fragmentu `corrected`.
  applyParagraph(paragraph: Paragraph, corrected: string, comments: CommentInput[] = []): EditStats {
    const stats: EditStats = { applied: 0, skipped: 0 };
    if (!paragraph.editable || corrected === paragraph.text) return stats;
    // Nowe elementy muszą powstać w tym samym dokumencie XML co akapit (treść albo przypisy)
    this.doc = paragraph.element.ownerDocument;

    const oldTokens = tokenize(paragraph.text);
    const newTokens = tokenize(corrected);
    const parts = diffArrays(oldTokens, newTokens);

    // Zmiany jako (a, b) w starym tekście + wstawka + pozycja w nowym tekście
    const hunks: { a: number; b: number; insert: string; newStart: number; newEnd: number }[] = [];
    let oldPos = 0;
    let newPos = 0;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const len = part.value.join("").length;
      if (!part.added && !part.removed) {
        oldPos += len;
        newPos += len;
        continue;
      }
      const removed = part.removed ? part.value.join("") : "";
      let added = part.added ? part.value.join("") : "";
      // Usunięcie tuż przed dodaniem tworzy jedną zamianę
      if (part.removed && parts[i + 1]?.added) {
        added = parts[i + 1].value.join("");
        i++;
      }
      hunks.push({ a: oldPos, b: oldPos + removed.length, insert: added, newStart: newPos, newEnd: newPos + added.length });
      oldPos += removed.length;
      newPos += added.length;
    }

    // Zmiany rozdzielone samą spacją łączymy w jedną ("Napewno" -> "Na pewno"
    // to jedna zamiana, a nie trzy drobne wstawki wokół wspólnej spacji)
    for (let i = hunks.length - 2; i >= 0; i--) {
      const cur = hunks[i];
      const next = hunks[i + 1];
      const gap = paragraph.text.slice(cur.b, next.a);
      if (/^\s*$/.test(gap) && gap.length <= 1 && next.newStart - cur.newEnd === gap.length) {
        hunks.splice(i, 2, {
          a: cur.a,
          b: next.b,
          insert: corrected.slice(cur.newStart, next.newEnd),
          newStart: cur.newStart,
          newEnd: next.newEnd,
        });
      }
    }

    // Komentarz -> zmiana: fragment `corrected` musi obejmować zmianę w nowym tekście
    const commentFor = new Map<number, string>();
    let searchFrom = 0;
    for (const c of comments) {
      const at = c.corrected ? corrected.indexOf(c.corrected, Math.max(0, searchFrom - c.corrected.length)) : -1;
      if (at === -1) continue;
      const end = at + c.corrected.length;
      const hi = hunks.findIndex(
        (h, idx) => !commentFor.has(idx) && h.newStart <= end && (h.newEnd >= at || h.newStart >= at),
      );
      if (hi !== -1) {
        commentFor.set(hi, c.text);
        searchFrom = end;
      }
    }

    // Od końca - wcześniejsze przesunięcia w tekście akapitu nie zmieniają się
    const noteComments: string[] = [];
    for (let i = hunks.length - 1; i >= 0; i--) {
      const h = hunks[i];
      // Komentarz wewnątrz przypisu psuje otwieranie pliku w LibreOffice - w przypisach
      // zbieramy wyjaśnienia i przypinamy je do odnośnika przypisu w treści
      const inNote = paragraph.part !== "body";
      if (this.applyHunk(paragraph.element, h.a, h.b, h.insert, inNote ? undefined : commentFor.get(i))) {
        stats.applied++;
        if (inNote && commentFor.has(i)) noteComments.unshift(commentFor.get(i)!);
      } else {
        stats.skipped++;
      }
    }
    this.attachNoteComment(paragraph, noteComments);
    return stats;
  }

  async toBuffer(): Promise<Buffer> {
    for (const part of this.parts) {
      this.zip.file(part.path, new XMLSerializer().serializeToString(part.doc));
    }
    if (this.comments.length) await this.writeComments();
    return this.zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  }

  private async writeComments() {
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const body = this.comments
      .map(
        (c) =>
          `<w:comment w:id="${c.id}" w:author="${REVISION_AUTHOR}" w:date="${this.date}" w:initials="IP">` +
          `<w:p><w:r><w:t xml:space="preserve">${esc(c.text)}</w:t></w:r></w:p></w:comment>`,
      )
      .join("");

    const existing = await this.zip.file("word/comments.xml")?.async("string");
    if (existing) {
      // Dokument ma już komentarze - dopisujemy swoje na końcu
      this.zip.file("word/comments.xml", existing.replace(/<\/w:comments>\s*$/, `${body}</w:comments>`));
      return;
    }
    this.zip.file(
      "word/comments.xml",
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:comments xmlns:w="${W}">${body}</w:comments>`,
    );

    const relsPath = "word/_rels/document.xml.rels";
    let rels = (await this.zip.file(relsPath)?.async("string")) || "";
    if (!rels.includes(REL_COMMENTS)) {
      rels = rels.replace(
        /<\/Relationships>\s*$/,
        `<Relationship Id="rIdInterpunkcjaComments" Type="${REL_COMMENTS}" Target="comments.xml"/></Relationships>`,
      );
      this.zip.file(relsPath, rels);
    }

    let types = (await this.zip.file("[Content_Types].xml")?.async("string")) || "";
    if (!types.includes("/word/comments.xml")) {
      types = types.replace(
        /<\/Types>\s*$/,
        `<Override PartName="/word/comments.xml" ContentType="${CT_COMMENTS}"/></Types>`,
      );
      this.zip.file("[Content_Types].xml", types);
    }
  }
}

// Ochrona przed „bombą ZIP”: .docx to archiwum, a 15 MB może rozpakować się do
// gigabajtów i wyczerpać pamięć procesu. Treść pracy magisterskiej to kilka MB XML.
const MAX_DOCUMENT_XML_BYTES = 30 * 1024 * 1024;
const MAX_ARCHIVE_DECLARED_BYTES = 200 * 1024 * 1024;
const MAX_ARCHIVE_ENTRIES = 2000;

function assertSaneArchive(zip: JSZip) {
  const entries = Object.values(zip.files);
  if (entries.length > MAX_ARCHIVE_ENTRIES) throw new Error("DOCX_TOO_LARGE");
  // Rozmiary z nagłówków archiwum (pole wewnętrzne JSZip) - deklarowane, więc
  // treść dokumentu i tak czytamy z twardym limitem w readLimited
  const declared = entries.reduce((sum, e: any) => sum + (e._data?.uncompressedSize || 0), 0);
  if (declared > MAX_ARCHIVE_DECLARED_BYTES) throw new Error("DOCX_TOO_LARGE");
}

// Rozpakowanie strumieniem, przerwane po przekroczeniu limitu
function readLimited(entry: JSZip.JSZipObject, limit: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    const stream = entry.nodeStream("nodebuffer");
    stream.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > limit) {
        stream.removeAllListeners("data");
        stream.pause();
        reject(new Error("DOCX_TOO_LARGE"));
        return;
      }
      chunks.push(chunk);
    });
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    stream.on("error", reject);
  });
}

// Słowa, białe znaki i pojedyncze znaki interpunkcyjne - dzięki temu
// brakujący przecinek to jedna wstawka ",", a nie podmiana całego słowa
export function tokenize(text: string): string[] {
  return text.match(/\s+|[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || [];
}
