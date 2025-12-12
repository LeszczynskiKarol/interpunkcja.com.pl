// frontend/src/pages/auth/RegisterPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import { useRecaptcha } from "../../hooks/useRecaptcha";
//import { GoogleButton } from "../../components/GoogleButton";

interface RegisterForm {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const { executeRecaptcha } = useRecaptcha();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch("password");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: "", color: "" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;

    if (score <= 2) return { score, text: "Słabe", color: "text-red-500" };
    if (score <= 3) return { score, text: "Średnie", color: "text-yellow-500" };
    if (score <= 4) return { score, text: "Dobre", color: "text-blue-500" };
    return { score, text: "Bardzo dobre", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Hasła nie są identyczne");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Hasło jest zbyt słabe. Użyj mocniejszego hasła.");
      return;
    }

    if (!data.acceptTerms) {
      toast.error("Musisz zaakceptować regulamin i politykę prywatności");
      return;
    }

    setLoading(true);

    try {
      // Wykonaj reCAPTCHA
      let recaptchaToken = "";
      try {
        recaptchaToken = await executeRecaptcha("register");
      } catch (recaptchaError) {
        console.warn("reCAPTCHA error:", recaptchaError);
        // Kontynuuj bez tokenu - backend zdecyduje czy to akceptowalne
      }

      await api.post("/api/auth/register", {
        email: data.email,
        name: data.name,
        password: data.password,
        recaptchaToken,
      });

      toast.success("Konto utworzone! Sprawdź swoją skrzynkę email.");
      navigate(`/sprawdz-email?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error("Registration error:", error);

      // Błąd reCAPTCHA
      if (error.response?.data?.error === "RECAPTCHA_FAILED") {
        toast.error(
          "Weryfikacja bezpieczeństwa nie powiodła się. Spróbuj ponownie."
        );
        return;
      }

      // Specjalny komunikat dla użytkowników Google
      if (error.response?.data?.error === "GOOGLE_ACCOUNT_EXISTS") {
        toast.error(
          "To konto jest już połączone z Google. Użyj logowania przez Google."
        );
        return;
      }

      const errorMessage =
        error.response?.data?.message || "Błąd rejestracji. Spróbuj ponownie.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-md w-full">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do strony głównej
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Załóż konto
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sprawdzaj interpunkcję bez limitów!
            </p>
          </div>

          {/* Google Register Button 
          <div className="mb-6">
            <GoogleButton text="Zarejestruj przez Google" disabled={loading} />
          </div>*/}

          {/* Divider 
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                lub zarejestruj się emailem
              </span>
            </div>
          </div>*/}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twoje imię
              </label>
              <input
                {...register("name", {
                  required: "Imię jest wymagane",
                  minLength: { value: 2, message: "Minimum 2 znaki" },
                  maxLength: { value: 50, message: "Maksimum 50 znaków" },
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jan"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email jest wymagany",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Nieprawidłowy adres email",
                  },
                })}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="jan@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hasło
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Hasło jest wymagane",
                    minLength: {
                      value: 8,
                      message: "Hasło musi mieć minimum 8 znaków",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}

              {/* Password strength */}
              {password && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          passwordStrength.score <= 2
                            ? "bg-red-500"
                            : passwordStrength.score <= 3
                            ? "bg-yellow-500"
                            : passwordStrength.score <= 4
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span className={`font-medium ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <ul className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li className="flex items-center gap-1">
                      {/[a-z]/.test(password) && /[A-Z]/.test(password) ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" />
                      )}
                      Duże i małe litery
                    </li>
                    <li className="flex items-center gap-1">
                      {/\d/.test(password) ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" />
                      )}
                      Przynajmniej jedna cyfra
                    </li>
                    <li className="flex items-center gap-1">
                      {password.length >= 8 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600" />
                      )}
                      Minimum 8 znaków
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Potwierdź hasło
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword", {
                    required: "Potwierdź hasło",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  {...register("acceptTerms", {
                    required:
                      "Musisz zaakceptować regulamin i politykę prywatności",
                  })}
                  type="checkbox"
                  id="acceptTerms"
                  className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
              </div>
              <label
                htmlFor="acceptTerms"
                className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none"
              >
                Oświadczam, że zapoznałem/am się z{" "}
                <Link
                  to="/regulamin"
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Regulaminem
                </Link>{" "}
                oraz{" "}
                <Link
                  to="/polityka-prywatnosci"
                  target="_blank"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Polityką prywatności
                </Link>{" "}
                i akceptuję ich postanowienia.
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-red-500 text-xs -mt-2">
                {errors.acceptTerms.message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Tworzenie konta...
                </>
              ) : (
                "Załóż konto"
              )}
            </button>

            {/* reCAPTCHA notice */}
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
            Masz już konto?{" "}
            <Link
              to="/logowanie"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
