// frontend/src/pages/auth/LoginPage.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import { useAuthStore } from "../../stores/authStore";
import { useRecaptcha } from "../../hooks/useRecaptcha";
import { GoogleButton } from "../../components/GoogleButton";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [googleAccountError, setGoogleAccountError] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { executeRecaptcha } = useRecaptcha();

  // Sprawdź czy jest błąd z Google OAuth
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      const errorMessages: Record<string, string> = {
        google_auth_failed:
          "Autoryzacja Google nie powiodła się. Spróbuj ponownie.",
        email_not_verified: "Twój email Google nie jest zweryfikowany.",
        no_code: "Nie otrzymano kodu autoryzacji z Google.",
      };
      toast.error(errorMessages[error] || "Wystąpił błąd podczas logowania.");
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setVerificationError(null);
    setGoogleAccountError(false);

    try {
      // Wykonaj reCAPTCHA
      let recaptchaToken = "";
      try {
        recaptchaToken = await executeRecaptcha("login");
      } catch (recaptchaError) {
        console.warn("reCAPTCHA error:", recaptchaError);
      }

      const response = await api.post("/api/auth/login", {
        ...data,
        recaptchaToken,
      });

      if (response.data.user && response.data.token) {
        setAuth({
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken || "",
        });

        toast.success("Zalogowano pomyślnie!");
        navigate("/panel");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response?.data?.error === "RECAPTCHA_FAILED") {
        toast.error(
          "Weryfikacja bezpieczeństwa nie powiodła się. Spróbuj ponownie."
        );
        return;
      }

      if (error.response?.data?.error === "EMAIL_NOT_VERIFIED") {
        setVerificationError(data.email);
        return;
      }

      if (error.response?.data?.error === "GOOGLE_ACCOUNT") {
        setGoogleAccountError(true);
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        "Błąd logowania. Sprawdź email i hasło.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do strony głównej
        </Link>

        {/* Email not verified warning */}
        {verificationError && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-1">
                  Email niepotwierdzony
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                  Musisz potwierdzić swój adres email przed zalogowaniem.
                </p>
                <Link
                  to={`/wyslij-ponownie?email=${encodeURIComponent(
                    verificationError
                  )}&auto=true`}
                  className="text-sm text-yellow-900 dark:text-yellow-200 underline font-medium"
                >
                  Wyślij ponownie email weryfikacyjny →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Google account warning */}
        {googleAccountError && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                  Konto Google
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  To konto jest połączone z Google. Użyj przycisku "Kontynuuj z
                  Google" poniżej.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Zaloguj się
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Sprawdzaj interpunkcję bez limitów
          </p>

          {/* Google Login Button */}
          <div className="mb-6">
            <GoogleButton text="Kontynuuj z Google" disabled={isLoading} />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                lub zaloguj się emailem
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register("email", {
                    required: "Email jest wymagany",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Nieprawidłowy adres email",
                    },
                  })}
                  type="email"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="jan@example.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hasło
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register("password", {
                    required: "Hasło jest wymagane",
                  })}
                  type="password"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end text-sm">
              <Link
                to="/przypomnij-haslo"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Zapomniałeś hasła?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logowanie...
                </>
              ) : (
                <>
                  Zaloguj się
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* reCAPTCHA notice - WYMAGANE przez Google */}
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              Strona chroniona przez reCAPTCHA.{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Polityka prywatności
              </a>{" "}
              i{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Regulamin
              </a>{" "}
              Google.
            </p>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Nie masz konta?{" "}
            <Link
              to="/rejestracja"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Załóż konto
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
