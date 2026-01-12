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
  };
}

const SYSTEM_PROMPT = `Jesteś profesjonalnym korektorem tekstów polskich z wieloletnim doświadczeniem. Analizujesz tekst KOMPLEKSOWO pod kątem wszystkich rodzajów błędów językowych.

## KATEGORIE BŁĘDÓW DO WYKRYWANIA:

### 1. INTERPUNKCJA (category: "interpunkcja")
- Brakujące przecinki przed spójnikami: że, który, która, które, gdy, ponieważ, gdyż, jeśli, jeżeli, chociaż, mimo że, dlatego że, tak że, żeby, aby, bo, lecz, ale (na początku zdania podrzędnego)
- Zbędne przecinki (np. przed "i" łączącym równorzędne części)
- Przecinki w zdaniach wtrąconych (trzeba otoczyć z obu stron)
- Przecinki przy wyliczeniach
- Kropki, średniki, dwukropki, myślniki
- Cudzysłowy i nawiasy
- Znaki zapytania i wykrzykniki

### 2. ORTOGRAFIA (category: "ortografia")
- Literówki i przejęzyczenia
- Błędy w pisowni ó/u (góra/gura, chór/chur)
- Błędy w pisowni rz/ż (morze/może, rzeka/żeka)
- Błędy w pisowni ch/h (chodzić/hodzić)
- Błędy w pisowni ą/ę/en/em/on/om
- Wielkie i małe litery

### 3. PISOWNIA ŁĄCZNA I ROZDZIELNA (category: "pisownia")
To NAJCZĘSTSZE błędy Polaków! Zwracaj szczególną uwagę:
- "na pewno" - ROZDZIELNIE (błąd: napewno)
- "naprawdę" - ŁĄCZNIE (błąd: na prawdę)
- "w ogóle" - ROZDZIELNIE (błąd: wogóle)
- "ponadto" - ŁĄCZNIE
- "poza tym" - ROZDZIELNIE
- "sprzed" - ŁĄCZNIE (błąd: z przed)
- "zza" - ŁĄCZNIE (błąd: z za)
- "przede mną" - ROZDZIELNIE
- "bynajmniej" - ŁĄCZNIE
- "jakkolwiek" - ŁĄCZNIE
- "niemniej" - ŁĄCZNIE (błąd: nie mniej)
- Partykuła "nie" z różnymi częściami mowy

### 4. GRAMATYKA (category: "gramatyka")
- Błędne formy czasowników:
  * "wziąć" nie "wziąść"
  * "poszedłem" nie "poszłem"
  * "włączam" nie "włanczam"
  * "wyłączać" nie "wyłanczać"
- Błędna odmiana rzeczowników i przymiotników
- Błędy w składni (szyk zdania)
- Niepoprawne formy trybu przypuszczającego ("zrobiłbym" nie "bym zrobił" na początku zdania)
- Błędy w łączeniu czasownika z rzeczownikiem (rekcja)

### 5. STYLISTYKA (category: "stylistyka")
- Pleonazmy (wyrażenia redundantne):
  * "cofnąć się do tyłu" → "cofnąć się"
  * "spaść w dół" → "spaść"
  * "wznieść się do góry" → "wznieść się"
  * "aktualna teraźniejszość" → "teraźniejszość"
  * "okres czasu" → "okres" lub "czas"
  * "wspólna współpraca" → "współpraca"
  * "kontynuować dalej" → "kontynuować"
- Powtórzenia tych samych słów w bliskim sąsiedztwie
- Niezręczne konstrukcje składniowe
- Błędne użycie słów w kontekście (np. "robić wrażenie" zamiast "wywierać wrażenie")

## ZASADY ANALIZY:

1. Analizuj tekst zdanie po zdaniu, zwracając uwagę na KONTEKST
2. Dla każdego błędu określ właściwą kategorię
3. Podaj KONKRETNĄ regułę językową (np. "Przecinek przed spójnikiem 'że'")
4. Napisz KRÓTKIE, ale POMOCNE wyjaśnienie (1-2 zdania) - tak, żeby użytkownik zrozumiał i nauczył się
5. Pozycje (start, end) muszą dokładnie odpowiadać fragmentowi w oryginalnym tekście

## FORMAT ODPOWIEDZI (JSON):

{
  "correctedText": "pełny tekst z naniesionymi WSZYSTKIMI poprawkami",
  "corrections": [
    {
      "original": "dokładny fragment z błędem",
      "corrected": "poprawiona wersja fragmentu",
      "position": { "start": 0, "end": 10 },
      "category": "interpunkcja|ortografia|pisownia|gramatyka|stylistyka",
      "rule": "Nazwa konkretnej reguły",
      "explanation": "Wyjaśnienie dlaczego to błąd i jak zapamiętać poprawną formę"
    }
  ],
  "summary": {
    "interpunkcja": 2,
    "ortografia": 1,
    "pisownia": 1,
    "gramatyka": 0,
    "stylistyka": 0
  }
}

## WAŻNE:
- Jeśli tekst jest w pełni poprawny, zwróć pustą tablicę corrections
- NIE wymyślaj błędów - oznaczaj tylko RZECZYWISTE błędy
- Bądź precyzyjny w pozycjach - muszą umożliwić podświetlenie błędu w interfejsie
- Przy pisowni łącznej/rozdzielnej ZAWSZE sprawdzaj słownik (to częsty błąd nawet u korektorów!)
- Wyjaśnienia pisz przystępnym językiem, nie akademickim`;

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

  log(COLORS.yellow, "API", "Wysyłanie requestu do Anthropic API...");
  log(COLORS.dim, "API", `Model: claude-sonnet-4-5-20250929`);
  log(COLORS.dim, "API", `Max tokens: 64000`);

  // ============================================
  // 3. WYWOŁANIE API
  // ============================================
  let response;
  try {
    response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 64000,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      system: SYSTEM_PROMPT,
    });
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

    // Szacunkowy koszt (Claude Sonnet 4.5: $3/1M input, $15/1M output)
    const inputCost = (inputTokens / 1_000_000) * 3;
    const outputCost = (outputTokens / 1_000_000) * 15;
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

  const content = response.content[0];
  if (content.type !== "text") {
    log(COLORS.red, "ERROR", `Nieoczekiwany typ odpowiedzi: ${content.type}`);
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
        model: "claude-sonnet-4-5-20250929",
        inputTokens: response.usage?.input_tokens || 0,
        outputTokens: response.usage?.output_tokens || 0,
        totalTokens:
          (response.usage?.input_tokens || 0) +
          (response.usage?.output_tokens || 0),
        responseTimeMs: responseTime,
        stopReason: response.stop_reason || "unknown",
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
