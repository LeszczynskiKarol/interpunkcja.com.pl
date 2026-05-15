// backend/src/services/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export class EmailService {
  async sendVerificationEmail(to: string, code: string, name: string) {
    const displayName = name
      ? name.charAt(0).toUpperCase() + name.slice(1)
      : "Użytkowniku";

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #f8f9fa;
          }
          .header { 
            background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content { 
            background: white; 
            padding: 40px 30px;
            border-radius: 0 0 10px 10px;
          }
          .code-container {
            text-align: center;
            margin: 30px 0;
          }
          .verification-code {
            display: inline-block;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #3b82f6;
            background: #eff6ff;
            padding: 20px 40px;
            border-radius: 10px;
            border: 2px dashed #3b82f6;
          }
          .alert {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
          .footer { 
            background: #1f2937; 
            color: #9ca3af;
            padding: 30px; 
            text-align: center; 
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Potwierdź swój email</h1>
          </div>
          <div class="content">
            <h2>Cześć, ${displayName}!</h2>
            <p>Dziękujemy za rejestrację w Interpunkcja.com.pl!</p>
            
            <p>Skopiuj poniższy kod i wklej go na stronie weryfikacji:</p>
            
            <div class="code-container">
              <div class="verification-code">${code}</div>
            </div>
            
            <div class="alert">
              <strong>⏱️ Uwaga:</strong> Kod weryfikacyjny wygaśnie za 24 godziny.
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 13px;">
              Jeśli nie zakładałeś konta w Interpunkcja.com.pl, zignoruj ten email.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 10px 0;">© 2025 Interpunkcja.com.pl. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </body>
    </html>
    `;

    try {
      const result = await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME || "Interpunkcja.com.pl"} <${
          process.env.EMAIL_FROM || process.env.SMTP_USER
        }>`,
        to,
        subject: "Kod weryfikacyjny - Interpunkcja.com.pl",
        html,
      });
      console.log("✅ Verification email sent:", result.messageId);
      return result;
    } catch (error) {
      console.error("❌ Email error:", error);
      return null;
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    const displayName = name
      ? name.charAt(0).toUpperCase() + name.slice(1)
      : "Użytkowniku";

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: white; padding: 30px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #3b82f6; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✏️ Witaj w Interpunkcja.com.pl!</h1>
          </div>
          <div class="content">
            <h2>Cześć, ${displayName}!</h2>
            <p>Gratulacje! Twoje konto zostało zweryfikowane.</p>
            <p>Możesz teraz korzystać ze wszystkich funkcji korektora interpunkcji.</p>
            <center>
              <a href="${process.env.FRONTEND_URL}" class="button">
                Sprawdź tekst →
              </a>
            </center>
          </div>
        </div>
      </body>
    </html>
    `;

    try {
      const result = await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME || "Interpunkcja.com.pl"} <${
          process.env.EMAIL_FROM || process.env.SMTP_USER
        }>`,
        to,
        subject: "Witaj w Interpunkcja.com.pl! ✏️",
        html,
      });
      console.log("✅ Welcome email sent:", result.messageId);
      return result;
    } catch (error) {
      console.error("❌ Welcome email error:", error);
      return null;
    }
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/resetuj-haslo?token=${resetToken}`;

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #3b82f6; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔒 Reset hasła</h1>
          <p>Otrzymaliśmy prośbę o reset hasła dla Twojego konta.</p>
          <p>Kliknij przycisk poniżej, aby ustawić nowe hasło:</p>
          <p><a href="${resetUrl}" class="button">Zresetuj hasło</a></p>
          <p>Link wygaśnie za 1 godzinę.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            Jeśli nie prosiłeś o reset hasła, zignoruj ten email.
          </p>
        </div>
      </body>
    </html>
    `;

    try {
      const result = await transporter.sendMail({
        from: `${process.env.EMAIL_FROM_NAME || "Interpunkcja.com.pl"} <${
          process.env.EMAIL_FROM || process.env.SMTP_USER
        }>`,
        to,
        subject: "Reset hasła - Interpunkcja.com.pl",
        html,
      });
      console.log("✅ Password reset email sent:", result.messageId);
      return result;
    } catch (error) {
      console.error("❌ Password reset email error:", error);
      return null;
    }
  }
  async sendAbuseReport(
    adminEmail: string,
    suspicious: import("./abuseMonitor").SuspiciousIpEntry[],
  ) {
    const date = new Date().toLocaleDateString("pl-PL");

    const rows = suspicious
      .map((entry) => {
        const accountsList = entry.accounts
          .map(
            (a) =>
              `<li><strong>${a.email}</strong> – ${a.checksCount} sprawdzeń, utworzone: ${a.createdAt.toLocaleDateString("pl-PL")}</li>`,
          )
          .join("");

        return `
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:16px;background:#fafafa;">
          <h3 style="margin:0 0 8px 0;color:#dc2626;">🚨 IP: ${entry.ip}</h3>
          <p style="margin:4px 0;color:#374151;">
            <strong>${entry.accountCount}</strong> kont FREE, łącznie <strong>${entry.totalChecks}</strong> sprawdzeń
          </p>
          <ul style="margin:8px 0 0 0;padding-left:20px;color:#4b5563;font-size:14px;">
            ${accountsList}
          </ul>
        </div>`;
      })
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:20px;background:#ffffff;color:#111827;">
        <h2 style="color:#111827;">🛡️ Raport podejrzanych IP – ${date}</h2>
        <p style="color:#4b5563;">
          Wykryto <strong>${suspicious.length}</strong> ${suspicious.length === 1 ? "adres IP" : "adresów IP"} z 3 lub więcej kontami FREE w ostatnich 30 dniach.
        </p>
        ${rows}
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="color:#9ca3af;font-size:12px;">
          Automatyczny raport z systemu Interpunkcja.com.pl. Sprawdź konta w panelu admina i w razie potrzeby zablokuj.
        </p>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: adminEmail,
      subject: `🚨 Raport abuse – ${suspicious.length} podejrzanych IP (${date})`,
      html,
    });
  }
}
