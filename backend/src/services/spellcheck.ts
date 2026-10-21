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
const CACHE_LIMIT = 20000;

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
    const list = line.split(": ")[1] || "";
    return list
      .split(", ")
      .filter((s) => s && (word.includes("-") || !s.includes("-")))
      .slice(0, MAX_SUGGESTIONS);
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
  }

  return tokens
    .filter((t) => cache.get(t.word) !== null)
    .map((t) => ({ ...t, suggestions: cache.get(t.word) || [] }));
}
