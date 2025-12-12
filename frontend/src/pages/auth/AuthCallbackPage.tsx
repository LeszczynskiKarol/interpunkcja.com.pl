// frontend/src/pages/auth/AuthCallbackPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Pobierz dane z URL
        const token = searchParams.get("token");
        const refreshToken = searchParams.get("refreshToken");
        const userJson = searchParams.get("user");
        const error = searchParams.get("error");

        // Sprawdź czy jest błąd
        if (error) {
          setStatus("error");
          const errorMessages: Record<string, string> = {
            google_auth_failed:
              "Autoryzacja Google nie powiodła się. Spróbuj ponownie.",
            email_not_verified: "Twój email Google nie jest zweryfikowany.",
            no_code: "Nie otrzymano kodu autoryzacji z Google.",
          };
          setErrorMessage(
            errorMessages[error] ||
              "Wystąpił błąd podczas logowania przez Google."
          );
          return;
        }

        // Sprawdź czy mamy wszystkie dane
        if (!token || !refreshToken || !userJson) {
          setStatus("error");
          setErrorMessage(
            "Brak danych autoryzacji. Spróbuj zalogować się ponownie."
          );
          return;
        }

        // Parsuj dane użytkownika
        const user = JSON.parse(userJson);

        // Zapisz do store
        setAuth({
          user,
          token,
          refreshToken,
        });

        setStatus("success");
        toast.success(`Witaj, ${user.name || user.email}!`);

        // Przekieruj do panelu po krótkiej chwili
        setTimeout(() => {
          navigate("/panel", { replace: true });
        }, 1500);
      } catch (err) {
        console.error("Auth callback error:", err);
        setStatus("error");
        setErrorMessage(
          "Wystąpił błąd podczas przetwarzania danych logowania."
        );
      }
    };

    processCallback();
  }, [searchParams, setAuth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Logowanie przez Google...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Proszę czekać, przetwarzamy dane logowania.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Zalogowano pomyślnie!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Za chwilę zostaniesz przekierowany do panelu...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Błąd logowania
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {errorMessage}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/logowanie")}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Wróć do logowania
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Strona główna
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
