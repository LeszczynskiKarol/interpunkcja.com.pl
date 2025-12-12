// backend/src/services/recaptcha.ts

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

// Minimalne wymagane score (0.0 - 1.0, gdzie 1.0 = bardzo pewne że człowiek)
const MIN_SCORE = 0.5;

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

export async function verifyRecaptcha(
  token: string,
  expectedAction?: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  // Jeśli brak klucza - pomiń weryfikację (development)
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn("reCAPTCHA secret key not configured, skipping verification");
    return { success: true, score: 1.0 };
  }

  // Jeśli brak tokenu
  if (!token) {
    return { success: false, error: "Missing reCAPTCHA token" };
  }

  try {
    const params = new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token,
    });

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data: RecaptchaResponse = await response.json();

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"]);
      return {
        success: false,
        error: `reCAPTCHA verification failed: ${data["error-codes"]?.join(
          ", "
        )}`,
      };
    }

    // Sprawdź score (tylko dla v3)
    if (data.score !== undefined && data.score < MIN_SCORE) {
      console.warn(`reCAPTCHA score too low: ${data.score}`);
      return {
        success: false,
        score: data.score,
        error: "Suspicious activity detected",
      };
    }

    // Sprawdź akcję (opcjonalnie)
    if (expectedAction && data.action !== expectedAction) {
      console.warn(
        `reCAPTCHA action mismatch: expected ${expectedAction}, got ${data.action}`
      );
      return {
        success: false,
        error: "Action mismatch",
      };
    }

    return {
      success: true,
      score: data.score,
    };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return {
      success: false,
      error: "reCAPTCHA verification service unavailable",
    };
  }
}
