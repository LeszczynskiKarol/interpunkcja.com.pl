// backend/src/services/claude.ts
import Anthropic from "@anthropic-ai/sdk";

// Lazy initialization - klient tworzony przy pierwszym użyciu (po załadowaniu dotenv)
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    console.log("Initializing Anthropic client, API key present:", !!apiKey);
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
  const anthropic = getAnthropicClient();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 64000,
    messages: [
      {
        role: "user",
        content: `Przeanalizuj poniższy tekst i znajdź WSZYSTKIE błędy językowe (interpunkcja, ortografia, pisownia łączna/rozdzielna, gramatyka, stylistyka). Zwróć wynik w formacie JSON.

TEKST DO SPRAWDZENIA:
"""
${text}
"""`,
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  try {
    // Wyciągnij JSON z odpowiedzi (może być otoczony markdown code block)
    let jsonText = content.text;
    const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    // Czasem Claude dodaje tekst przed/po JSON - spróbuj wyciągnąć sam JSON
    const jsonStartIndex = jsonText.indexOf("{");
    const jsonEndIndex = jsonText.lastIndexOf("}");
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      jsonText = jsonText.substring(jsonStartIndex, jsonEndIndex + 1);
    }

    const result = JSON.parse(jsonText);

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

    return {
      correctedText: result.correctedText || text,
      corrections,
      errorCount: corrections.length,
      summary,
    };
  } catch (error) {
    console.error("Failed to parse Claude response:", content.text);
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
