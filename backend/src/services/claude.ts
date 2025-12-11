// backend/src/services/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface Correction {
  original: string;
  corrected: string;
  position: { start: number; end: number };
  rule: string;
  explanation: string;
}

export interface CheckResult {
  correctedText: string;
  corrections: Correction[];
  errorCount: number;
}

const SYSTEM_PROMPT = `Jesteś ekspertem od polskiej interpunkcji. Twoim zadaniem jest sprawdzenie tekstu pod kątem błędów interpunkcyjnych i zaproponowanie poprawek.

ZASADY:
1. Skup się TYLKO na interpunkcji (przecinki, kropki, średniki, dwukropki, myślniki, cudzysłowy, nawiasy, znaki zapytania i wykrzykniki)
2. NIE poprawiaj ortografii, stylistyki ani gramatyki (chyba że bezpośrednio wpływa na interpunkcję)
3. Dla każdej poprawki podaj:
   - Oryginalny fragment
   - Poprawiony fragment  
   - Nazwę reguły interpunkcyjnej
   - Krótkie wyjaśnienie (max 2 zdania)

ODPOWIEDZ W FORMACIE JSON:
{
  "correctedText": "pełny tekst z naniesionymi poprawkami",
  "corrections": [
    {
      "original": "fragment przed poprawką",
      "corrected": "fragment po poprawce",
      "position": { "start": 0, "end": 10 },
      "rule": "Nazwa reguły",
      "explanation": "Krótkie wyjaśnienie"
    }
  ]
}

Jeśli tekst jest poprawny interpunkcyjnie, zwróć pustą tablicę corrections i oryginalny tekst jako correctedText.`;

export async function checkPunctuation(text: string): Promise<CheckResult> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Sprawdź interpunkcję w poniższym tekście:\n\n${text}`,
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

    const result = JSON.parse(jsonText);

    return {
      correctedText: result.correctedText || text,
      corrections: result.corrections || [],
      errorCount: result.corrections?.length || 0,
    };
  } catch (error) {
    console.error("Failed to parse Claude response:", content.text);
    throw new Error("Failed to parse punctuation check response");
  }
}
