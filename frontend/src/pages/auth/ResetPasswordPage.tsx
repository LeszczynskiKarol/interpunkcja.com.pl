// frontend/src/pages/ResetPasswordPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, CheckCircle, Lock } from "lucide-react";
import { api } from "../../lib/api";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get("token");
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

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error("Brak tokenu resetowania hasła");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Hasła nie są identyczne");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Hasło jest zbyt słabe. Użyj mocniejszego hasła.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/auth/reset-password", {
        token,
        password: data.password,
      });

      setSuccess(true);
      toast.success("Hasło zostało zmienione!");

      setTimeout(() => {
        navigate("/logowanie");
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Nie udało się zresetować hasła. Link może być nieprawidłowy lub wygasł.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <Lock className="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Brak tokenu
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Link resetowania hasła jest nieprawidłowy.
          </p>
          <button
            onClick={() => navigate("/przypomnij-haslo")}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Wyślij nowy link
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            Hasło zmienione!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Twoje hasło zostało pomyślnie zmienione. Za chwilę zostaniesz
            przekierowany do strony logowania.
          </p>
          <button
            onClick={() => navigate("/logowanie")}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Przejdź do logowania →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Lock className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ustaw nowe hasło
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Wybierz mocne hasło dla swojego konta
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nowe hasło */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nowe hasło
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
                  <li>✓ Minimum 8 znaków</li>
                  <li>✓ Duże i małe litery</li>
                  <li>✓ Przynajmniej jedna cyfra</li>
                </ul>
              </div>
            )}
          </div>

          {/* Potwierdź hasło */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Resetowanie...
              </>
            ) : (
              "Zmień hasło"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
