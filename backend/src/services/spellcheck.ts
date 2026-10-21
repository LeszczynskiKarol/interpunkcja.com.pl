// backend/src/services/spellcheck.ts
// Sprawdzanie pisowni bez AI: natywny Hunspell ze słownikiem pl_PL (pakiety
// Ubuntu `hunspell` + `hunspell-pl`). Jeden stały proces w trybie potokowym
// (-a, protokół Ispell) - start ~0,4 s, ~36 MB RAM, sprawdzenie w milisekundach.
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

export interface SpellingIssue {
  word: string;
  start: number;
  end: number;
  suggestions: string[];
}

const MAX_SUGGESTIONS = 5;

// Najczęstsze błędy (także bez polskich znaków), dla których Hunspell nie
// podaje właściwej formy albo podaje ją daleko na liście
const COMMON_ERRORS: Record<string, string> = {
  wogole: "w ogóle", wogóle: "w ogóle", wogle: "w ogóle", napewno: "na pewno",
  narazie: "na razie", poprostu: "po prostu", conajmniej: "co najmniej",
  conajwyżej: "co najwyżej", conajwyzej: "co najwyżej", niewiem: "nie wiem",
  naprzyklad: "na przykład", naprzykład: "na przykład", wkońcu: "w końcu",
  wkoncu: "w końcu", ztąd: "stąd", pozatym: "poza tym", odrazu: "od razu",
  wszczególności: "w szczególności", przedewszystkim: "przede wszystkim",
  napoczątku: "na początku", spowrotem: "z powrotem", zpowrotem: "z powrotem",
  wrazie: "w razie", naprawde: "naprawdę",
};

function withCase(original: string, fix: string): string {
  return original[0] === original[0].toUpperCase() ? fix[0].toUpperCase() + fix.slice(1) : fix;
}

// Pierwsze człony typowych błędów pisowni łącznej ("napewno", "wogóle", "niewiem")
const SPLIT_PREFIXES = new Set([
  "w", "we", "z", "ze", "na", "po", "do", "od", "za", "o", "u", "przy", "przed",
  "nad", "pod", "bez", "dla", "nie", "co", "jak", "ani", "by",
]);
const CACHE_LIMIT = 20000;

// Reforma pisowni od 1.01.2026 - słownik pl_PL jej nie zna. Przedrostki piszemy
// łącznie (nibyartysta, quasinauka, półżartem, superpomysł), łącznik zostaje
// tylko przed wielką literą (niby-Polak).
const REFORM_PREFIXES = ["quasi", "ekstra", "super", "niby", "mega", "mini", "eko", "pół"];
// "nie" łącznie z przymiotnikami i przysłówkami w stopniu wyższym i najwyższym
// (niemilszy, nienajlepszy, nielepiej). Tylko te końcówki - inaczej przeszłoby
// też "niewiem".
const COMPARATIVE = /^(naj\p{L}{3,}|\p{L}{3,}(szy|sza|sze|szego|szej|szemu|szym|szych|szymi|szą|iej|ej))$/u;
const NOT_COMPARATIVE = new Set(["więcej", "mniej", "bardziej", "najwięcej", "najmniej", "najbardziej"]);

// Druga część słowa, które według reformy jest poprawne, o ile ta część jest poprawna
function reformRest(word: string): string | null {
  const lower = word.toLowerCase();
  const prefix = REFORM_PREFIXES.find((p) => lower.startsWith(p) && lower.length - p.length >= 3);
  if (prefix && /^\p{Ll}/u.test(word.slice(prefix.length))) return word.slice(prefix.length);
  if (lower.startsWith("nie")) {
    const rest = lower.slice(3);
    if (COMPARATIVE.test(rest) && !NOT_COMPARATIVE.has(rest)) return rest;
  }
  return null;
}

// Dawny zapis z łącznikiem przed małą literą (niby-artysta, super-oferta)
function oldHyphenated(word: string): string | null {
  const m = /^(\p{L}+)-(\p{Ll}\p{L}*)$/u.exec(word);
  if (!m || !REFORM_PREFIXES.includes(m[1].toLowerCase())) return null;
  return m[1] + m[2];
}

// Wynik dla pojedynczego słowa: null = poprawne, tablica = podpowiedzi
const cache = new Map<string, string[] | null>();

let proc: ChildProcessWithoutNullStreams | null = null;
let buffer = "";
// Kolejka oczekujących odpowiedzi - Hunspell odpowiada w kolejności zapytań,
// każda linia wejścia kończy się w wyjściu pustą linią
let pending: { lines: string[]; resolve: (v: string[]) => void }[] = [];
let queue: Promise<unknown> = Promise.resolve();

function startProcess(): ChildProcessWithoutNullStreams {
  const p = spawn("hunspell", ["-d", "pl_PL", "-a", "-i", "utf-8"]);
  p.stdout.setEncoding("utf8");
  p.stdout.on("data", (chunk: string) => {
    buffer += chunk;
    // Pierwsza linia to nagłówek wersji ("@(#) International Ispell...")
    if (buffer.startsWith("@(#)")) {
      const nl = buffer.indexOf("\n");
      if (nl === -1) return;
      buffer = buffer.slice(nl + 1);
    }
    let idx: number;
    while (pending.length && (idx = buffer.indexOf("\n\n")) !== -1) {
      const block = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      pending[0].lines.push(block);
    }
    flush();
  });
  p.on("exit", (code) => {
    console.error(`[Spellcheck] Hunspell zakończył działanie (kod ${code})`);
    proc = null;
    buffer = "";
    for (const req of pending) req.resolve([]);
    pending = [];
  });
  p.on("error", (err) => {
    console.error("[Spellcheck] Nie udało się uruchomić Hunspella:", err.message);
    proc = null;
    for (const req of pending) req.resolve([]);
    pending = [];
  });
  return p;
}

let expected = 0;

function flush() {
  const req = pending[0];
  if (req && req.lines.length >= expected) {
    pending.shift();
    req.resolve(req.lines);
  }
}

// Sprawdza listę słów; zwraca surowe linie odpowiedzi (jedna na słowo)
function queryWords(words: string[]): Promise<string[]> {
  const run = () =>
    new Promise<string[]>((resolve) => {
      if (!proc) proc = startProcess();
      expected = words.length;
      pending.push({ lines: [], resolve });
      // "^" na początku linii każe Hunspellowi sprawdzić ją dosłownie
      proc.stdin.write(words.map((w) => `^${w}`).join("\n") + "\n");
    });
  // Jedno zapytanie naraz - odpowiedzi nie mają identyfikatorów
  const result = queue.then(run, run);
  queue = result.catch(() => undefined);
  return result;
}

function parseLine(line: string, word: string): string[] | null {
  if (!line || line.startsWith("*") || line.startsWith("+") || line.startsWith("-")) {
    return null; // poprawne (także jako złożenie lub forma pochodna)
  }
  if (line.startsWith("&")) {
    const list = (line.split(": ")[1] || "")
      .split(", ")
      .filter((s) => s && (word.includes("-") || !s.includes("-")));
    // Pisownia rozdzielna ("wogóle" -> "w ogóle") to najczęstszy przypadek,
    // a Hunspell podaje ją zwykle dalej na liście. Tylko gdy pierwszy człon to
    // przyimek lub partykuła - inaczej wygrywały rozbicia typu "wo gole".
    const split = list.filter((s) => {
      const [first, ...rest] = s.split(" ");
      return (
        rest.length > 0 &&
        s.replace(/ /g, "") === word &&
        SPLIT_PREFIXES.has(first.toLowerCase())
      );
    });
    return [...split, ...list.filter((s) => !split.includes(s))].slice(0, MAX_SUGGESTIONS);
  }
  return []; // "#" - brak podpowiedzi
}

// Słowa do pominięcia: cyfry, skróty pisane wersalikami, pojedyncze litery
function shouldSkip(word: string): boolean {
  return word.length < 2 || /\d/.test(word) || (word === word.toUpperCase() && word.length <= 5);
}

export async function checkSpelling(text: string): Promise<SpellingIssue[]> {
  const tokens: { word: string; start: number; end: number }[] = [];
  const re = /\p{L}+(?:-\p{L}+)*/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (!shouldSkip(m[0])) {
      tokens.push({ word: m[0], start: m.index, end: m.index + m[0].length });
    }
  }

  const unknown = [...new Set(tokens.map((t) => t.word))].filter((w) => !cache.has(w));
  if (unknown.length) {
    const lines = await queryWords(unknown);
    if (lines.length !== unknown.length) {
      throw new Error("SPELLCHECK_UNAVAILABLE");
    }
    unknown.forEach((w, i) => {
      if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value as string);
      cache.set(w, parseLine(lines[i], w));
    });

    // Słowa odrzucone przez słownik, ale poprawne po reformie 2026
    const candidates = unknown
      .map((w) => ({ w, rest: cache.get(w) !== null ? reformRest(w) : null }))
      .filter((c): c is { w: string; rest: string } => c.rest !== null);
    if (candidates.length) {
      const rests = [...new Set(candidates.map((c) => c.rest))];
      const restLines = await queryWords(rests);
      if (restLines.length === rests.length) {
        const ok = new Set(rests.filter((r, i) => parseLine(restLines[i], r) === null));
        for (const c of candidates) if (ok.has(c.rest)) cache.set(c.w, null);
      }
    }
    for (const w of unknown) {
      const joined = oldHyphenated(w);
      if (joined && cache.get(w) === null) cache.set(w, [joined]);
    }
  }

  return tokens
    .filter((t) => cache.get(t.word) !== null)
    .map((t) => {
      const suggestions = cache.get(t.word) || [];
      const known = COMMON_ERRORS[t.word.toLowerCase()];
      if (!known) return { ...t, suggestions };
      const fix = withCase(t.word, known);
      return { ...t, suggestions: [fix, ...suggestions.filter((s) => s !== fix)].slice(0, MAX_SUGGESTIONS) };
    });
}
