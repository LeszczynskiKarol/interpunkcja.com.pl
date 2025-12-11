// frontend/src/pages/ForgotPasswordPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { api } from "../../lib/api";

interface ForgotPasswordForm {
  email: string;
}

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);

    try {
      await api.post("/api/auth/request-password-reset", {
        email: data.email,
      });

      setSuccess(true);
      toast.success("Email z instrukcją został wysłany!");
    } catch (error: any) {
      console.error("Password reset request error:", error);
      // Zawsze pokazuj sukces dla bezpieczeństwa
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sprawdź swoją skrzynkę!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Jeśli konto o adresie{" "}
            <strong className="text-gray-900 dark:text-white">{email}</strong>{" "}
            istnieje, wysłaliśmy instrukcję resetu hasła.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Email może trafić do folderu spam. Link będzie ważny przez 1
              godzinę.
            </p>
          </div>

          <Link
            to="/logowanie"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do logowania
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Zapomniałeś hasła?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Wyślemy Ci link do zresetowania hasła
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Adres email
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
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Wysyłanie...
              </>
            ) : (
              "Wyślij link resetujący"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/logowanie"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do logowania
          </Link>
        </div>
      </div>
    </div>
  );
}
