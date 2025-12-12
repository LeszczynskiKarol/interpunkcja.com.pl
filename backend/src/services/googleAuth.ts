// backend/src/services/googleAuth.ts
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

export class GoogleAuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  private readonly JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "refresh-secret";

  private readonly GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
  private readonly GOOGLE_CLIENT_SECRET =
    process.env.GOOGLE_CLIENT_SECRET || "";
  private readonly GOOGLE_REDIRECT_URI =
    process.env.GOOGLE_REDIRECT_URI ||
    "https://interpunkcja.com.pl/api/auth/google/callback";

  /**
   * Generuje URL do autoryzacji Google
   */
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.GOOGLE_CLIENT_ID,
      redirect_uri: this.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "select_account", // Zawsze pokaż wybór konta
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Wymienia kod autoryzacyjny na tokeny
   */
  async exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: this.GOOGLE_CLIENT_ID,
        client_secret: this.GOOGLE_CLIENT_SECRET,
        redirect_uri: this.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Google token exchange error:", error);
      throw new Error("GOOGLE_TOKEN_EXCHANGE_FAILED");
    }

    return response.json();
  }

  /**
   * Pobiera informacje o użytkowniku z Google
   */
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Google userinfo error:", error);
      throw new Error("GOOGLE_USERINFO_FAILED");
    }

    return response.json();
  }

  /**
   * Loguje lub rejestruje użytkownika przez Google
   */
  async authenticateWithGoogle(code: string) {
    // 1. Wymień kod na tokeny
    const tokens = await this.exchangeCodeForTokens(code);

    // 2. Pobierz informacje o użytkowniku
    const googleUser = await this.getUserInfo(tokens.access_token);

    if (!googleUser.verified_email) {
      throw new Error("GOOGLE_EMAIL_NOT_VERIFIED");
    }

    // 3. Sprawdź czy użytkownik już istnieje
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleUser.id },
          { email: googleUser.email.toLowerCase() },
        ],
      },
    });

    if (user) {
      // Użytkownik istnieje - zaktualizuj dane Google jeśli brak
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleUser.id,
            avatarUrl: googleUser.picture || user.avatarUrl,
            emailVerified: true, // Google już zweryfikował email
            authProvider: user.passwordHash ? "LOCAL" : "GOOGLE", // Zachowaj LOCAL jeśli ma hasło
          },
        });
      } else {
        // Zaktualizuj avatar jeśli się zmienił
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            avatarUrl: googleUser.picture || user.avatarUrl,
            lastLogin: new Date(),
          },
        });
      }
    } else {
      // Nowy użytkownik - utwórz konto
      user = await prisma.user.create({
        data: {
          email: googleUser.email.toLowerCase(),
          name: googleUser.name || googleUser.given_name || "Użytkownik",
          googleId: googleUser.id,
          avatarUrl: googleUser.picture,
          emailVerified: true, // Google już zweryfikował email
          authProvider: "GOOGLE",
          passwordHash: null, // Brak hasła dla użytkowników Google
        },
      });
    }

    // 4. Zaktualizuj ostatnie logowanie
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // 5. Generuj tokeny JWT
    const jwtToken = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // 6. Zapisz refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        role: user.role,
        emailVerified: user.emailVerified,
        avatarUrl: user.avatarUrl,
        authProvider: user.authProvider,
      },
      token: jwtToken,
      refreshToken,
    };
  }

  private generateToken(user: any) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        plan: user.plan,
      },
      this.JWT_SECRET,
      { expiresIn: "24h" }
    );
  }

  private generateRefreshToken(user: any) {
    return jwt.sign(
      {
        userId: user.id,
        type: "refresh",
      },
      this.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );
  }
}
