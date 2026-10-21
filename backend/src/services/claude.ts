// backend/src/services/claude.ts
import Anthropic from "@anthropic-ai/sdk";

// Lazy initialization - klient tworzony przy pierwszym użyciu (po załadowaniu dotenv)
let anthropicClient: Anthropic | null = null;

// ============================================
// KONFIGURACJA LOGOWANIA
// ============================================
const LOG_CONFIG = {
  ENABLED: true, // Włącz/wyłącz logowanie
  SHOW_FULL_PROMPT: true, // Pokaż pełny system prompt
  SHOW_USER_TEXT: true, // Pokaż tekst użytkownika
  SHOW_RAW_RESPONSE: true, // Pokaż surową odpowiedź Claude
  SHOW_PARSED_RESULT: true, // Pokaż sparsowany wynik
  SHOW_TOKENS: true, // Pokaż zużycie tokenów
  TRUNCATE_LONG_TEXT: 500, // Skróć teksty dłuższe niż X znaków (0 = nie skracaj)
};

// Kolory dla konsoli
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgBlue: "\x1b[44m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgRed: "\x1b[41m",
};

// Helper do logowania
function log(color: string, label: string, message: string) {
  if (!LOG_CONFIG.ENABLED) return;
  const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
  console.log(
    `${COLORS.dim}[${timestamp}]${COLORS.reset} ${color}[${label}]${COLORS.reset} ${message}`
  );
}

function logSection(title: string) {
  if (!LOG_CONFIG.ENABLED) return;
  console.log(
    `\n${COLORS.bgBlue}${COLORS.white}${COLORS.bright} ═══════════════════════════════════════════════════════════════ ${COLORS.reset}`
  );
  console.log(
    `${COLORS.bgBlue}${COLORS.white}${COLORS.bright}  ${title} ${COLORS.reset}`
  );
  console.log(
    `${COLORS.bgBlue}${COLORS.white}${COLORS.bright} ═══════════════════════════════════════════════════════════════ ${COLORS.reset}\n`
  );
}

function logSubSection(title: string) {
  if (!LOG_CONFIG.ENABLED) return;
  console.log(`\n${COLORS.cyan}${COLORS.bright}▶ ${title}${COLORS.reset}`);
  console.log(`${COLORS.dim}${"─".repeat(60)}${COLORS.reset}`);
}

function truncateText(
  text: string,
  maxLength: number = LOG_CONFIG.TRUNCATE_LONG_TEXT
): string {
  if (maxLength === 0 || text.length <= maxLength) return text;
  return (
    text.substring(0, maxLength) +
    `... [SKRÓCONO - łącznie ${text.length} znaków]`
  );
}

function logBox(title: string, content: string, color: string = COLORS.white) {
  if (!LOG_CONFIG.ENABLED) return;
  console.log(
    `${color}┌─ ${title} ${"─".repeat(Math.max(0, 55 - title.length))}┐${
      COLORS.reset
    }`
  );
  const lines = content.split("\n");
  for (const line of lines) {
    console.log(`${color}│${COLORS.reset} ${line}`);
  }
  console.log(`${color}└${"─".repeat(60)}┘${COLORS.reset}`);
}

// ============================================

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    log(
      COLORS.yellow,
      "INIT",
      `Inicjalizacja klienta Anthropic, API key obecny: ${!!apiKey}`
    );
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

// ============================================
// MODEL - wybierany zmienną CLAUDE_MODEL w .env
// ============================================
// Profile zmierzone w teście z 21.10.2026 (40 tekstów, ocena przez Claude Opus 5.5):
// Sonnet 5.5 + schemat: ocena 8,10 vs 7,79 dla Sonnet 4.5, mediana 6,2 s vs 12,7 s.
// Koszt: ceny $ za 1M tokenów (input, output).
interface ModelProfile {
  price: [number, number];
  params: Pick<
    Anthropic.MessageCreateParams,
    "thinking" | "output_config"
  >;
}

// Schemat odpowiedzi - wymusza poprawny JSON (bez niego ok. 1 na 40 odpowiedzi
// nie dawało się sparsować) i w teście poprawił też trafność poprawek
const CATEGORIES = ["interpunkcja", "ortografia", "pisownia", "gramatyka", "stylistyka"];

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["correctedText", "corrections", "summary"],
  properties: {
    correctedText: { type: "string" },
    corrections: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["original", "corrected", "position", "category", "rule", "explanation"],
        properties: {
          original: { type: "string" },
          corrected: { type: "string" },
          position: {
            type: "object",
            additionalProperties: false,
            required: ["start", "end"],
            properties: { start: { type: "integer" }, end: { type: "integer" } },
          },
          category: { type: "string", enum: CATEGORIES },
          rule: { type: "string" },
          explanation: { type: "string" },
        },
      },
    },
    summary: {
      type: "object",
      additionalProperties: false,
      required: CATEGORIES,
      properties: Object.fromEntries(CATEGORIES.map((c) => [c, { type: "integer" }])),
    },
  },
};

const MODEL_PROFILES: Record<string, ModelProfile> = {
  "claude-sonnet-5-5": {
    price: [2, 10],
    // Bez myślenia - korekta krótkiego tekstu nie zyskuje na nim, a wydłuża czas
    params: {
      thinking: { type: "between_tools" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: RESULT_SCHEMA },
      },
    },
  },
  "claude-haiku-5-5": {
    price: [0.1, 0.5],
    params: {
      thinking: { type: "disabled" },
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: RESULT_SCHEMA },
      },
    },
  },
  // Wycofywany 30.11.2026 - zostawiony tylko na wypadek szybkiego powrotu
  "claude-sonnet-4-5-20250929": { price: [3, 15], params: {} },
};

const DEFAULT_MODEL = "claude-sonnet-5-5";

function getModel(): { model: string; profile: ModelProfile } {
  const model = process.env.CLAUDE_MODEL || DEFAULT_MODEL;
  const profile = MODEL_PROFILES[model];
  if (!profile) {
    throw new Error(`Nieznany CLAUDE_MODEL: ${model}`);
  }
  return { model, profile };
}

// Typy błędów - odpowiadają temu co obiecujemy na landingach
export type ErrorCategory =
  | "interpunkcja" // przecinki, kropki, średniki, etc.
  | "ortografia" // literówki, ó/u, rz/ż, ch/h
  | "pisownia" // łączna/rozdzielna (napewno, naprawdę)
  | "gramatyka" // odmiana, formy czasowników
  | "stylistyka"; // pleonazmy, powtórzenia, niezręczności

export interface Correction {
  original: string;
  corrected: string;
  position: { start: number; end: number };
  category: ErrorCategory;
  rule: string;
  explanation: string;
}

export interface CheckResult {
  correctedText: string;
  corrections: Correction[];
  errorCount: number;
  summary?: {
    interpunkcja: number;
    ortografia: number;
    pisownia: number;
    gramatyka: number;
    stylistyka: number;
  };
  // Dodatkowe info o API call (tylko do logów)
  _debug?: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    responseTimeMs: number;
    stopReason: string;
    estimatedCostUsd: number;
  };
}

// Wersja 2 (21.10.2026): interpunkcja jako główne zadanie z pełną listą reguł,
// bez wykrzyczanych zakazów - nowsze modele czytają je dosłownie i za mało poprawiają.
const SYSTEM_PROMPT = `Jesteś doświadczonym korektorem tekstów polskich. Twoim głównym zadaniem jest interpunkcja - użytkownicy przychodzą do serwisu przede wszystkim po to, żeby mieć pewność, że przecinki i inne znaki stoją we właściwych miejscach. Przy okazji poprawiasz też ortografię, pisownię łączną i rozdzielną, gramatykę oraz rażące błędy stylistyczne.

## Jak sprawdzać interpunkcję

Przejdź przez tekst zdanie po zdaniu. W każdym zdaniu wskaż orzeczenia i ustal granice zdań składowych - przecinek najczęściej brakuje właśnie na granicy dwóch zdań. Następnie sprawdź każdy z poniższych przypadków:

- Zdanie podrzędne zaczynające się od spójnika lub zaimka: że, żeby, aby, by, bo, ponieważ, gdyż, jeśli, jeżeli, gdy, kiedy, chociaż, choć, mimo że, zanim, dopóki, odkąd, skoro, jakby, niż (gdy wprowadza zdanie), który/która/które, czy, co, gdzie, dokąd, jak, dlaczego, ile, kto. Przecinek stawiamy przed takim zdaniem i - jeśli zdanie podrzędne jest wplecione w środek nadrzędnego - także po nim (np. "Zespół, który nad tym pracuje, ma doświadczenie").
- Spójniki złożone: przecinek stoi przed całym wyrażeniem (", mimo że", ", dlatego że", ", chyba że", ", podczas gdy", ", zwłaszcza że"), a nie w jego środku.
- Imiesłowowy równoważnik zdania (formy na -ąc, -łszy, -wszy) oddzielamy przecinkiem od reszty zdania z obu stron.
- Zdania współrzędne: przecinek przed ale, lecz, a, jednak, więc, zatem, dlatego, czyli, natomiast, tylko (w znaczeniu "lecz"); brak przecinka przed i, oraz, lub, albo, ani, bądź, czy (łączącymi równorzędne części), chyba że spójnik się powtarza ("i… i…", "albo… albo…") albo po nim następuje wtrącenie.
- Zdania współrzędne zestawione bez spójnika oddzielamy przecinkiem.
- Wtrącenia, dopowiedzenia, wołacze, wykrzykniki ("niestety", "oczywiście" w funkcji wtrącenia, "Panie Marku") wydzielamy przecinkami z obu stron.
- Wyliczenia, porównania (jak, niż przed zdaniem lub dłuższym członem), daty, liczby.
- Zbędne przecinki: między podmiotem a orzeczeniem, przed "i" łączącym równorzędne człony, po okoliczniku na początku zdania (chyba że jest rozbudowany i stanowi wtrącenie).
- Pozostałe znaki: kropki (także w skrótach), średniki, dwukropki, myślniki i półpauzy, cudzysłowy, nawiasy, znaki zapytania i wykrzykniki.

Poprawiaj każdy błąd interpunkcyjny, który wynika z reguł - także drobny i także wtedy, gdy tekst jest poza tym dobry. Nie zmieniaj natomiast miejsc, w których norma dopuszcza obie wersje (przecinek fakultatywny), ani nie przepisuj zdań.

## Pozostałe kategorie

- ortografia: literówki, ó/u, rz/ż, ch/h, ą/ę, wielkie i małe litery;
- pisownia: pisownia łączna i rozdzielna (na pewno, naprawdę, w ogóle, sprzed, zza, niemniej, "nie" z częściami mowy);
- gramatyka: błędne formy (wziąć, poszedłem, włączać), odmiana, rekcja, składnia;
- stylistyka: pleonazmy (cofnąć się do tyłu, okres czasu), powtórzenia, błędne związki wyrazowe.

Oznaczaj tylko rzeczywiste błędy, a styl poprawiaj oszczędnie - to korekta, nie redakcja.

## Opis każdej poprawki

- category: "interpunkcja", "ortografia", "pisownia", "gramatyka" albo "stylistyka";
- rule: konkretna reguła, np. "Przecinek przed spójnikiem »że«" albo "Imiesłowowy równoważnik zdania";
- explanation: 1-2 zdania przystępnym językiem, tak żeby użytkownik zrozumiał regułę i zapamiętał ją na przyszłość;
- original i corrected: krótki fragment z błędem i jego poprawiona wersja (dla przecinka wystarczy słowo przed nim i po nim);
- position: start i end tego fragmentu w oryginalnym tekście (indeksy znaków), tak żeby interfejs mógł go podświetlić.

## Format odpowiedzi

Zwróć wyłącznie obiekt JSON:

{
  "correctedText": "pełny tekst z naniesionymi wszystkimi poprawkami",
  "corrections": [
    {
      "original": "dokładny fragment z błędem",
      "corrected": "poprawiona wersja fragmentu",
      "position": { "start": 0, "end": 10 },
      "category": "interpunkcja|ortografia|pisownia|gramatyka|stylistyka",
      "rule": "Nazwa konkretnej reguły",
      "explanation": "Wyjaśnienie reguły"
    }
  ],
  "summary": {
    "interpunkcja": 0,
    "ortografia": 0,
    "pisownia": 0,
    "gramatyka": 0,
    "stylistyka": 0
  }
}

Jeśli tekst jest w pełni poprawny, zwróć pustą tablicę corrections i niezmieniony correctedText.`;

export async function checkPunctuation(text: string): Promise<CheckResult> {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  logSection(`KOREKTA TEKSTU [ID: ${requestId}]`);

  // ============================================
  // 1. LOGOWANIE INPUTU
  // ============================================
  log(COLORS.blue, "INPUT", `Długość tekstu: ${text.length} znaków`);

  if (LOG_CONFIG.SHOW_USER_TEXT) {
    logSubSection("TEKST UŻYTKOWNIKA");
    console.log(truncateText(text));
  }

  if (LOG_CONFIG.SHOW_FULL_PROMPT) {
    logSubSection("SYSTEM PROMPT");
    console.log(truncateText(SYSTEM_PROMPT, 1000));
  }

  // ============================================
  // 2. PRZYGOTOWANIE REQUESTU
  // ============================================
  const userMessage = `Przeanalizuj poniższy tekst i znajdź WSZYSTKIE błędy językowe (interpunkcja, ortografia, pisownia łączna/rozdzielna, gramatyka, stylistyka). Zwróć wynik w formacie JSON.

TEKST DO SPRAWDZENIA:
"""
${text}
"""`;

  logSubSection("USER MESSAGE DO CLAUDE");
  console.log(truncateText(userMessage, 300));

  const anthropic = getAnthropicClient();
  const { model, profile } = getModel();

  log(COLORS.yellow, "API", "Wysyłanie requestu do Anthropic API...");
  log(COLORS.dim, "API", `Model: ${model}`);
  log(COLORS.dim, "API", `Max tokens: 64000`);

  // ============================================
  // 3. WYWOŁANIE API
  // ============================================
  let response;
  try {
    // Streaming - przy max_tokens 64000 SDK nie pozwala na zwykłe zapytanie
    // (ryzyko timeoutu), a długie teksty Lifetime potrzebują dużego limitu
    response = await anthropic.messages
      .stream({
        model,
        max_tokens: 64000,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
        system: SYSTEM_PROMPT,
        ...profile.params,
      })
      .finalMessage();
  } catch (apiError: any) {
    log(COLORS.red, "ERROR", `Błąd API: ${apiError.message}`);
    throw apiError;
  }

  const responseTime = Date.now() - startTime;

  // ============================================
  // 4. LOGOWANIE RESPONSE
  // ============================================
  logSubSection("ODPOWIEDŹ Z API");

  if (LOG_CONFIG.SHOW_TOKENS) {
    const inputTokens = response.usage?.input_tokens || 0;
    const outputTokens = response.usage?.output_tokens || 0;
    const totalTokens = inputTokens + outputTokens;

    const inputCost = (inputTokens / 1_000_000) * profile.price[0];
    const outputCost = (outputTokens / 1_000_000) * profile.price[1];
    const totalCost = inputCost + outputCost;

    logBox(
      "ZUŻYCIE TOKENÓW",
      `
Input tokens:  ${inputTokens.toLocaleString()}
Output tokens: ${outputTokens.toLocaleString()}
Total tokens:  ${totalTokens.toLocaleString()}
─────────────────────────────
Szacunkowy koszt: $${totalCost.toFixed(6)}
  - Input:  $${inputCost.toFixed(6)}
  - Output: $${outputCost.toFixed(6)}
─────────────────────────────
Czas odpowiedzi: ${responseTime}ms
Stop reason: ${response.stop_reason}
`,
      COLORS.green
    );
  }

  if (response.stop_reason === "refusal") {
    log(COLORS.red, "ERROR", "Model odmówił sprawdzenia tekstu (refusal)");
    throw new Error("Model refused to check the text");
  }

  // Nowe modele mogą zwrócić przed tekstem blok "thinking" - bierzemy blok tekstowy
  const content = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text",
  );
  if (!content) {
    log(
      COLORS.red,
      "ERROR",
      `Brak bloku tekstowego w odpowiedzi: ${response.content.map((b) => b.type).join(", ")}`,
    );
    throw new Error("Unexpected response type");
  }

  if (LOG_CONFIG.SHOW_RAW_RESPONSE) {
    logSubSection("SUROWA ODPOWIEDŹ CLAUDE");
    console.log(truncateText(content.text, 2000));
  }

  // ============================================
  // 5. PARSOWANIE ODPOWIEDZI
  // ============================================
  logSubSection("PARSOWANIE JSON");

  try {
    // Wyciągnij JSON z odpowiedzi (może być otoczony markdown code block)
    let jsonText = content.text;
    const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      log(COLORS.dim, "PARSE", "Wykryto blok ```json```, ekstrakcja...");
      jsonText = jsonMatch[1];
    }

    // Czasem Claude dodaje tekst przed/po JSON - spróbuj wyciągnąć sam JSON
    const jsonStartIndex = jsonText.indexOf("{");
    const jsonEndIndex = jsonText.lastIndexOf("}");
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      jsonText = jsonText.substring(jsonStartIndex, jsonEndIndex + 1);
    }

    log(COLORS.dim, "PARSE", `Długość JSON: ${jsonText.length} znaków`);

    const result = JSON.parse(jsonText);

    log(COLORS.green, "PARSE", "✓ JSON sparsowany pomyślnie");

    // Walidacja i normalizacja wyników
    const corrections: Correction[] = (result.corrections || []).map(
      (c: any) => ({
        original: c.original || "",
        corrected: c.corrected || "",
        position: c.position || { start: 0, end: 0 },
        category: validateCategory(c.category),
        rule: c.rule || "Błąd językowy",
        explanation: c.explanation || "Poprawiono błąd w tekście.",
      })
    );

    // Oblicz summary jeśli nie ma
    const summary = result.summary || calculateSummary(corrections);

    // ============================================
    // 6. LOGOWANIE WYNIKU
    // ============================================
    if (LOG_CONFIG.SHOW_PARSED_RESULT) {
      logSubSection("WYNIK KOREKTY");

      logBox(
        "PODSUMOWANIE",
        `
Liczba błędów: ${corrections.length}
─────────────────────────────
Interpunkcja: ${summary.interpunkcja}
Ortografia:   ${summary.ortografia}
Pisownia:     ${summary.pisownia}
Gramatyka:    ${summary.gramatyka}
Stylistyka:   ${summary.stylistyka}
`,
        corrections.length > 0 ? COLORS.yellow : COLORS.green
      );

      if (corrections.length > 0) {
        logSubSection("ZNALEZIONE BŁĘDY");
        corrections.forEach((c, i) => {
          console.log(
            `\n${COLORS.magenta}[${i + 1}] ${c.category.toUpperCase()}${
              COLORS.reset
            }`
          );
          console.log(
            `    ${COLORS.red}"${c.original}"${COLORS.reset} → ${COLORS.green}"${c.corrected}"${COLORS.reset}`
          );
          console.log(`    ${COLORS.dim}Reguła: ${c.rule}${COLORS.reset}`);
          console.log(
            `    ${COLORS.dim}Wyjaśnienie: ${c.explanation}${COLORS.reset}`
          );
          console.log(
            `    ${COLORS.dim}Pozycja: ${c.position.start}-${c.position.end}${COLORS.reset}`
          );
        });
      }

      logSubSection("POPRAWIONY TEKST");
      console.log(truncateText(result.correctedText || text, 500));
    }

    // ============================================
    // 7. KOŃCOWE PODSUMOWANIE
    // ============================================
    console.log(
      `\n${COLORS.bgGreen}${COLORS.white}${COLORS.bright} ✓ KOREKTA ZAKOŃCZONA [${requestId}] - ${responseTime}ms, ${corrections.length} błędów ${COLORS.reset}\n`
    );

    return {
      correctedText: result.correctedText || text,
      corrections,
      errorCount: corrections.length,
      summary,
      _debug: {
        model,
        inputTokens: response.usage?.input_tokens || 0,
        outputTokens: response.usage?.output_tokens || 0,
        totalTokens:
          (response.usage?.input_tokens || 0) +
          (response.usage?.output_tokens || 0),
        responseTimeMs: responseTime,
        stopReason: response.stop_reason || "unknown",
        estimatedCostUsd:
          ((response.usage?.input_tokens || 0) * profile.price[0] +
            (response.usage?.output_tokens || 0) * profile.price[1]) /
          1_000_000,
      },
    };
  } catch (error: any) {
    console.log(
      `\n${COLORS.bgRed}${COLORS.white}${COLORS.bright} ✗ BŁĄD PARSOWANIA [${requestId}] ${COLORS.reset}`
    );
    log(COLORS.red, "ERROR", `Błąd: ${error.message}`);
    log(COLORS.red, "ERROR", `Surowa odpowiedź Claude:`);
    console.log(content.text);
    throw new Error("Failed to parse correction response");
  }
}

// Walidacja kategorii błędu
function validateCategory(category: string): ErrorCategory {
  const validCategories: ErrorCategory[] = [
    "interpunkcja",
    "ortografia",
    "pisownia",
    "gramatyka",
    "stylistyka",
  ];

  if (validCategories.includes(category as ErrorCategory)) {
    return category as ErrorCategory;
  }

  // Fallback - spróbuj dopasować
  const categoryLower = (category || "").toLowerCase();
  if (
    categoryLower.includes("interpunk") ||
    categoryLower.includes("przecin")
  ) {
    return "interpunkcja";
  }
  if (categoryLower.includes("ortograf") || categoryLower.includes("liter")) {
    return "ortografia";
  }
  if (
    categoryLower.includes("łączn") ||
    categoryLower.includes("rozdzieln") ||
    categoryLower.includes("pisown")
  ) {
    return "pisownia";
  }
  if (categoryLower.includes("gramat") || categoryLower.includes("odmian")) {
    return "gramatyka";
  }
  if (categoryLower.includes("styl") || categoryLower.includes("pleonaz")) {
    return "stylistyka";
  }

  log(
    COLORS.yellow,
    "WARN",
    `Nieznana kategoria: "${category}", używam "interpunkcja"`
  );
  return "interpunkcja"; // Default
}

// Oblicz podsumowanie błędów według kategorii
function calculateSummary(corrections: Correction[]): CheckResult["summary"] {
  const summary = {
    interpunkcja: 0,
    ortografia: 0,
    pisownia: 0,
    gramatyka: 0,
    stylistyka: 0,
  };

  for (const c of corrections) {
    if (c.category in summary) {
      summary[c.category]++;
    }
  }

  return summary;
}

// Eksport dla testów
export { validateCategory, calculateSummary };
