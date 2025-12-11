// backend/src/services/auth.ts
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { EmailService } from "./email";

export class AuthService {
  private emailResendCache = new Map<string, number>();
  private readonly JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
  private readonly JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "refresh-secret";
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async register(data: { email: string; name: string; password: string }) {
    // Sprawdź email
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existingEmail) throw new Error("USER_EXISTS");

    // Walidacja hasła
    this.validatePassword(data.password);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // 6-cyfrowy kod
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        passwordHash: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // Wyślij email weryfikacyjny
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.name || "Użytkowniku"
    );

    return {
      success: true,
      message: "Konto utworzone! Sprawdź email aby dokończyć rejestrację.",
      email: user.email,
    };
  }

  async verifyEmail(token: string) {
    // 1. Znajdź użytkownika po tokenie
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error("INVALID_TOKEN");
    }

    // 2. Oznacz email jako zweryfikowany
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    // 3. Wyślij email powitalny
    try {
      await this.emailService.sendWelcomeEmail(
        user.email,
        user.name || "Użytkowniku"
      );
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    // 4. Generuj tokeny dla auto-login
    const authToken = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Zapisz refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Zwróć tokeny + dane usera
    return {
      success: true,
      message: "Email został pomyślnie zweryfikowany!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        role: user.role,
        emailVerified: true,
      },
      token: authToken,
      refreshToken: refreshToken,
    };
  }

  async resendVerificationEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (user.emailVerified) {
      throw new Error("ALREADY_VERIFIED");
    }

    // Rate limiting - max 1 email na 60 sekund
    const lastSent = this.emailResendCache.get(email);
    const now = Date.now();

    if (lastSent && now - lastSent < 60000) {
      const waitTime = Math.ceil((60000 - (now - lastSent)) / 1000);
      throw new Error(`RATE_LIMIT:${waitTime}`);
    }

    // Wygeneruj nowy token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    // Wyślij email
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
      user.name || "Użytkowniku"
    );

    // Zapisz timestamp
    this.emailResendCache.set(email, now);

    return {
      success: true,
      message: "Email weryfikacyjny został wysłany ponownie.",
    };
  }

  async login(email: string, password: string) {
    // 1. Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // 2. Sprawdź hasło
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // 3. Blokuj niezweryfikowanych
    if (!user.emailVerified) {
      throw new Error("EMAIL_NOT_VERIFIED");
    }

    // 4. Zaktualizuj ostatnie logowanie
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // 5. Generuj tokeny
    const token = this.generateToken(user);
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
      },
      token,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error("INVALID_REFRESH_TOKEN");
      }

      // Generuj nowe tokeny
      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Nie ujawniaj, że użytkownik nie istnieje
      return {
        success: true,
        message: "Jeśli konto istnieje, email został wysłany.",
      };
    }

    // Wygeneruj token resetu
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date();
    resetExpiry.setHours(resetExpiry.getHours() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
    });

    // Wyślij email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      console.error("Failed to send password reset email:", error);
    }

    return {
      success: true,
      message: "Jeśli konto istnieje, email został wysłany.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error("INVALID_TOKEN");
    }

    // Walidacja nowego hasła
    this.validatePassword(newPassword);

    // Hash nowego hasła
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
        refreshToken: null, // Wyloguj ze wszystkich urządzeń
      },
    });

    return {
      success: true,
      message: "Hasło zostało zmienione. Możesz się teraz zalogować.",
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  }

  async updateProfile(userId: string, data: { name: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // Sprawdź obecne hasło
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new Error("INVALID_PASSWORD");
    }

    // Walidacja nowego hasła
    this.validatePassword(newPassword);

    // Hash nowego hasła
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
        refreshToken: null, // Wyloguj ze wszystkich urządzeń
      },
    });
  }

  // METODY POMOCNICZE

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

  private validatePassword(password: string) {
    if (password.length < 8) {
      throw new Error("PASSWORD_TOO_SHORT");
    }

    if (!/\d/.test(password)) {
      throw new Error("PASSWORD_NO_NUMBER");
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error("PASSWORD_NO_UPPERCASE");
    }

    if (!/[a-z]/.test(password)) {
      throw new Error("PASSWORD_NO_LOWERCASE");
    }
  }
}
