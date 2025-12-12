// backend/src/routes/auth.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { AuthService } from "../services/auth";
import { GoogleAuthService } from "../services/googleAuth";
import { verifyRecaptcha } from "../services/recaptcha";

const authService = new AuthService();
const googleAuthService = new GoogleAuthService();

const RegisterSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  name: z.string().min(2, "Minimum 2 znaki").max(50, "Maksimum 50 znaków"),
  password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
  recaptchaToken: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(1, "Hasło jest wymagane"),
  recaptchaToken: z.string().optional(),
});

const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Token weryfikacyjny jest wymagany"),
});

const ResendVerificationSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token jest wymagany"),
  password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
});

const RequestPasswordResetSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  recaptchaToken: z.string().optional(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // ==========================================
  // GOOGLE OAUTH ROUTES
  // ==========================================

  // Rozpocznij logowanie przez Google - przekieruj do Google
  fastify.get("/api/auth/google", async (request, reply) => {
    const authUrl = googleAuthService.getAuthUrl();
    return reply.redirect(authUrl);
  });

  // Callback z Google - tu wraca użytkownik po autoryzacji
  fastify.get("/api/auth/google/callback", async (request, reply) => {
    const { code, error } = request.query as { code?: string; error?: string };

    // Obsłuż błędy z Google
    if (error) {
      console.error("Google OAuth error:", error);
      const frontendUrl =
        process.env.FRONTEND_URL || "https://interpunkcja.com.pl";
      return reply.redirect(
        `${frontendUrl}/logowanie?error=google_auth_failed`
      );
    }

    if (!code) {
      const frontendUrl =
        process.env.FRONTEND_URL || "https://interpunkcja.com.pl";
      return reply.redirect(`${frontendUrl}/logowanie?error=no_code`);
    }

    try {
      // Autoryzuj użytkownika
      const result = await googleAuthService.authenticateWithGoogle(code);

      // Przekieruj do frontendu z tokenami w URL (bezpiecznie - HTTPS)
      const frontendUrl =
        process.env.FRONTEND_URL || "https://interpunkcja.com.pl";

      // Zakoduj dane do URL
      const params = new URLSearchParams({
        token: result.token,
        refreshToken: result.refreshToken,
        user: JSON.stringify(result.user),
      });

      return reply.redirect(
        `${frontendUrl}/auth/callback?${params.toString()}`
      );
    } catch (error: any) {
      console.error("Google authentication error:", error);

      const frontendUrl =
        process.env.FRONTEND_URL || "https://interpunkcja.com.pl";
      let errorCode = "google_auth_failed";

      if (error.message === "GOOGLE_EMAIL_NOT_VERIFIED") {
        errorCode = "email_not_verified";
      }

      return reply.redirect(`${frontendUrl}/logowanie?error=${errorCode}`);
    }
  });

  // ==========================================
  // STANDARD AUTH ROUTES
  // ==========================================

  // REJESTRACJA (z reCAPTCHA)
  fastify.post("/api/auth/register", async (request, reply) => {
    try {
      const data = RegisterSchema.parse(request.body);

      // Weryfikacja reCAPTCHA
      const recaptchaResult = await verifyRecaptcha(
        data.recaptchaToken || "",
        "register"
      );

      if (!recaptchaResult.success) {
        return reply.code(403).send({
          error: "RECAPTCHA_FAILED",
          message:
            "Weryfikacja bezpieczeństwa nie powiodła się. Spróbuj ponownie.",
          score: recaptchaResult.score,
        });
      }

      const result = await authService.register({
        email: data.email,
        name: data.name,
        password: data.password,
      });

      return reply.code(201).send(result);
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: "VALIDATION_ERROR",
          message: error.errors[0].message,
          errors: error.errors,
        });
      }

      const errorMessages: Record<string, string> = {
        USER_EXISTS: "Użytkownik z tym adresem email już istnieje",
        GOOGLE_ACCOUNT_EXISTS:
          "To konto jest już połączone z Google. Użyj logowania przez Google.",
        PASSWORD_TOO_SHORT: "Hasło musi mieć minimum 8 znaków",
        PASSWORD_NO_NUMBER: "Hasło musi zawierać przynajmniej jedną cyfrę",
        PASSWORD_NO_UPPERCASE:
          "Hasło musi zawierać przynajmniej jedną dużą literę",
        PASSWORD_NO_LOWERCASE:
          "Hasło musi zawierać przynajmniej jedną małą literę",
      };

      const message =
        errorMessages[error.message] || "Rejestracja nie powiodła się";

      return reply.code(400).send({
        error: error.message || "REGISTRATION_FAILED",
        message,
      });
    }
  });

  // WERYFIKACJA EMAIL
  fastify.post("/api/auth/verify-email", async (request, reply) => {
    try {
      const { token } = VerifyEmailSchema.parse(request.body);
      const result = await authService.verifyEmail(token);
      return reply.send(result);
    } catch (error: any) {
      console.error("Email verification error:", error);

      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: "VALIDATION_ERROR",
          message: error.errors[0].message,
        });
      }

      const errorMessages: Record<string, string> = {
        INVALID_TOKEN: "Kod weryfikacyjny jest nieprawidłowy lub wygasł",
      };

      return reply.code(400).send({
        error: error.message || "VERIFICATION_FAILED",
        message: errorMessages[error.message] || "Weryfikacja nie powiodła się",
      });
    }
  });

  // PONOWNE WYSŁANIE EMAILA WERYFIKACYJNEGO
  fastify.post("/api/auth/resend-verification", async (request, reply) => {
    try {
      const { email } = ResendVerificationSchema.parse(request.body);
      const result = await authService.resendVerificationEmail(email);
      return reply.send(result);
    } catch (error: any) {
      console.error("Resend verification error:", error);

      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: "VALIDATION_ERROR",
          message: error.errors[0].message,
        });
      }

      // Obsłuż rate limit
      if (error.message.startsWith("RATE_LIMIT:")) {
        const waitTime = error.message.split(":")[1];
        return reply.code(429).send({
          error: "RATE_LIMIT",
          message: `Poczekaj ${waitTime} sekund przed ponowną wysyłką.`,
        });
      }

      const errorMessages: Record<string, string> = {
        USER_NOT_FOUND: "Użytkownik nie został znaleziony",
        ALREADY_VERIFIED: "Email jest już zweryfikowany",
      };

      return reply.code(400).send({
        error: error.message || "RESEND_FAILED",
        message: errorMessages[error.message] || "Nie udało się wysłać emaila",
      });
    }
  });

  // LOGOWANIE (z reCAPTCHA)
  fastify.post("/api/auth/login", async (request, reply) => {
    try {
      const data = LoginSchema.parse(request.body);

      // Weryfikacja reCAPTCHA
      const recaptchaResult = await verifyRecaptcha(
        data.recaptchaToken || "",
        "login"
      );

      if (!recaptchaResult.success) {
        return reply.code(403).send({
          error: "RECAPTCHA_FAILED",
          message:
            "Weryfikacja bezpieczeństwa nie powiodła się. Spróbuj ponownie.",
          score: recaptchaResult.score,
        });
      }

      const result = await authService.login(data.email, data.password);
      return reply.send(result);
    } catch (error: any) {
      console.error("Login error:", error);

      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: "VALIDATION_ERROR",
          message: error.errors[0].message,
        });
      }

      if (error.message === "EMAIL_NOT_VERIFIED") {
        return reply.code(403).send({
          error: "EMAIL_NOT_VERIFIED",
          message:
            "Musisz potwierdzić swój email przed zalogowaniem. Sprawdź swoją skrzynkę.",
        });
      }

      if (error.message === "GOOGLE_ACCOUNT") {
        return reply.code(400).send({
          error: "GOOGLE_ACCOUNT",
          message:
            "To konto jest połączone z Google. Użyj przycisku 'Zaloguj przez Google'.",
        });
      }

      return reply.code(401).send({
        error: "INVALID_CREDENTIALS",
        message: "Nieprawidłowy email lub hasło",
      });
    }
  });

  // REFRESH TOKEN
  fastify.post("/api/auth/refresh", async (request, reply) => {
    try {
      const { refreshToken } = request.body as { refreshToken: string };

      if (!refreshToken) {
        return reply.code(401).send({
          error: "REFRESH_TOKEN_REQUIRED",
          message: "Refresh token jest wymagany",
        });
      }

      const tokens = await authService.refreshToken(refreshToken);
      return reply.send(tokens);
    } catch (error: any) {
      console.error("Token refresh error:", error);
      return reply.code(401).send({
        error: "INVALID_REFRESH_TOKEN",
        message: "Nieprawidłowy refresh token",
      });
    }
  });

  // WYLOGOWANIE
  fastify.post("/api/auth/logout", async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).userId;
      await authService.logout(userId);
      return reply.send({ success: true, message: "Wylogowano pomyślnie" });
    } catch (error) {
      return reply.code(401).send({
        error: "UNAUTHORIZED",
        message: "Nieautoryzowany",
      });
    }
  });

  // ŻĄDANIE RESETU HASŁA (z reCAPTCHA)
  fastify.post("/api/auth/request-password-reset", async (request, reply) => {
    try {
      const data = RequestPasswordResetSchema.parse(request.body);

      // Weryfikacja reCAPTCHA
      const recaptchaResult = await verifyRecaptcha(
        data.recaptchaToken || "",
        "forgot_password"
      );

      if (!recaptchaResult.success) {
        return reply.code(403).send({
          error: "RECAPTCHA_FAILED",
          message:
            "Weryfikacja bezpieczeństwa nie powiodła się. Spróbuj ponownie.",
        });
      }

      const result = await authService.requestPasswordReset(data.email);
      return reply.send(result);
    } catch (error: any) {
      console.error("Password reset request error:", error);
      // Zawsze zwracaj sukces, żeby nie ujawniać czy email istnieje
      return reply.send({
        success: true,
        message: "Jeśli konto istnieje, email został wysłany.",
      });
    }
  });

  // RESET HASŁA
  fastify.post("/api/auth/reset-password", async (request, reply) => {
    try {
      const { token, password } = ResetPasswordSchema.parse(request.body);
      const result = await authService.resetPassword(token, password);
      return reply.send(result);
    } catch (error: any) {
      console.error("Password reset error:", error);

      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: "VALIDATION_ERROR",
          message: error.errors[0].message,
        });
      }

      const errorMessages: Record<string, string> = {
        INVALID_TOKEN: "Link resetowania hasła jest nieprawidłowy lub wygasł",
        PASSWORD_TOO_SHORT: "Hasło musi mieć minimum 8 znaków",
        PASSWORD_NO_NUMBER: "Hasło musi zawierać przynajmniej jedną cyfrę",
        PASSWORD_NO_UPPERCASE:
          "Hasło musi zawierać przynajmniej jedną dużą literę",
        PASSWORD_NO_LOWERCASE:
          "Hasło musi zawierać przynajmniej jedną małą literę",
      };

      return reply.code(400).send({
        error: error.message || "RESET_FAILED",
        message: errorMessages[error.message] || "Reset hasła nie powiódł się",
      });
    }
  });

  // SPRAWDŹ STATUS WERYFIKACJI
  fastify.get("/api/auth/verification-status", async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).userId;
      const user = await authService.getMe(userId);

      return reply.send({
        emailVerified: user?.emailVerified || false,
      });
    } catch (error) {
      return reply.code(401).send({
        error: "UNAUTHORIZED",
        message: "Nieautoryzowany",
      });
    }
  });

  // POBIERZ DANE UŻYTKOWNIKA
  fastify.get("/api/auth/me", async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).userId;
      const user = await authService.getMe(userId);
      return reply.send(user);
    } catch (error) {
      return reply.code(401).send({
        error: "UNAUTHORIZED",
        message: "Nieautoryzowany",
      });
    }
  });

  // AKTUALIZUJ PROFIL
  fastify.patch("/api/auth/profile", async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).userId;

      const schema = z.object({
        name: z
          .string()
          .min(2, "Minimum 2 znaki")
          .max(50, "Maksimum 50 znaków"),
      });

      const { name } = schema.parse(request.body);
      const user = await authService.updateProfile(userId, { name });
      return reply.send(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: "VALIDATION_ERROR",
          message: error.errors[0].message,
        });
      }
      return reply.code(400).send({
        error: "UPDATE_FAILED",
        message: "Aktualizacja profilu nie powiodła się",
      });
    }
  });

  // ZMIANA HASŁA
  fastify.post("/api/auth/change-password", async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).userId;

      const schema = z.object({
        currentPassword: z.string().min(1, "Obecne hasło jest wymagane"),
        newPassword: z.string().min(8, "Nowe hasło musi mieć minimum 8 znaków"),
      });

      const { currentPassword, newPassword } = schema.parse(request.body);
      await authService.changePassword(userId, currentPassword, newPassword);

      return reply.send({
        success: true,
        message: "Hasło zostało zmienione",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: "VALIDATION_ERROR",
          message: error.errors[0].message,
        });
      }

      const errorMessages: Record<string, string> = {
        INVALID_PASSWORD: "Obecne hasło jest nieprawidłowe",
        PASSWORD_TOO_SHORT: "Nowe hasło musi mieć minimum 8 znaków",
        PASSWORD_NO_NUMBER: "Nowe hasło musi zawierać przynajmniej jedną cyfrę",
        PASSWORD_NO_UPPERCASE:
          "Nowe hasło musi zawierać przynajmniej jedną dużą literę",
        PASSWORD_NO_LOWERCASE:
          "Nowe hasło musi zawierać przynajmniej jedną małą literę",
        NO_PASSWORD_SET:
          "To konto używa logowania przez Google. Ustaw hasło w ustawieniach.",
      };

      return reply.code(400).send({
        error: error.message || "CHANGE_PASSWORD_FAILED",
        message:
          errorMessages[error.message] || "Zmiana hasła nie powiodła się",
      });
    }
  });

  // USTAW HASŁO (dla użytkowników Google, którzy chcą też mieć hasło)
  fastify.post("/api/auth/set-password", async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as any).userId;

      const schema = z.object({
        password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
      });

      const { password } = schema.parse(request.body);
      await authService.setPassword(userId, password);

      return reply.send({
        success: true,
        message:
          "Hasło zostało ustawione. Możesz teraz logować się emailem i hasłem.",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: "VALIDATION_ERROR",
          message: error.errors[0].message,
        });
      }

      const errorMessages: Record<string, string> = {
        PASSWORD_ALREADY_SET: "Hasło jest już ustawione. Użyj zmiany hasła.",
        PASSWORD_TOO_SHORT: "Hasło musi mieć minimum 8 znaków",
        PASSWORD_NO_NUMBER: "Hasło musi zawierać przynajmniej jedną cyfrę",
        PASSWORD_NO_UPPERCASE:
          "Hasło musi zawierać przynajmniej jedną dużą literę",
        PASSWORD_NO_LOWERCASE:
          "Hasło musi zawierać przynajmniej jedną małą literę",
      };

      return reply.code(400).send({
        error: error.message || "SET_PASSWORD_FAILED",
        message:
          errorMessages[error.message] || "Ustawienie hasła nie powiodło się",
      });
    }
  });
}
