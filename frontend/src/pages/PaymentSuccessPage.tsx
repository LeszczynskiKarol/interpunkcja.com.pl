// frontend/src/pages/PaymentSuccessPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Crown, Loader2, Gift, Zap } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { api } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

type PaymentType = "plan" | "topup";

interface VerificationResult {
  success: boolean;
  type?: PaymentType;
  plan?: string;
  creditsAdded?: number;
  totalBonusChecks?: number;
  alreadyProcessed?: boolean;
}

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const type = searchParams.get("type") as PaymentType | null;

  const [loading, setLoading] = useState(true);
  const [_verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setLoading(false);
        setError(true);
        return;
      }

      try {
        let response;

        // Wybierz endpoint w zależności od typu płatności
        if (type === "topup") {
          response = await api.post("/api/payments/verify-topup", {
            sessionId,
          });
        } else {
          response = await api.post("/api/payments/verify", { sessionId });
        }

        if (response.data.success) {
          setVerified(true);
          setResult({
            ...response.data,
            type: response.data.type || type || "plan",
          });

          // Odśwież dane użytkownika
          const userResponse = await api.get("/api/auth/me");
          setUser(userResponse.data);

          // Odśwież status limitów (dla topup)
          queryClient.invalidateQueries({ queryKey: ["checkStatus"] });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, type]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Weryfikacja płatności...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Błąd weryfikacji
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Nie udało się zweryfikować płatności. Jeśli pieniądze zostały
            pobrane, skontaktuj się z nami.
          </p>
          <Link
            to="/panel"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Przejdź do panelu
          </Link>
        </div>
      </div>
    );
  }

  // Sukces - dokupienie sprawdzeń (topup)
  if (result?.type === "topup") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          {/* Ikona sukcesu */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>

          {/* Nagłówek */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sprawdzenia dodane!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Dziękujemy za zakup! Twoje dodatkowe sprawdzenia są już dostępne.
          </p>

          {/* Box z liczbą sprawdzeń */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
              <span className="text-5xl font-bold text-green-600 dark:text-green-400">
                +{result.creditsAdded || 0}
              </span>
            </div>
            <p className="text-green-700 dark:text-green-300 font-medium">
              dodatkowych sprawdzeń
            </p>
            {result.totalBonusChecks !== undefined && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                Łącznie masz teraz: <strong>{result.totalBonusChecks}</strong>{" "}
                bonus sprawdzeń
              </p>
            )}
          </div>

          {/* Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
              Co zyskujesz z bonus sprawdzeniami:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                Pełne wyjaśnienia błędów (jak Premium)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                Limit do 10 000 znaków na sprawdzenie
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                Sprawdzenia nie wygasają
              </li>
            </ul>
          </div>

          {/* Przyciski */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/panel"
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Sprawdź tekst teraz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sukces - zakup planu (premium/lifetime)
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Ikona sukcesu */}
        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Crown className="w-10 h-10 text-white" />
        </div>

        {/* Nagłówek */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Płatność zakończona!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Dziękujemy za zakup! Twoje konto zostało zaktualizowane.
        </p>

        {/* Box z planem */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 mb-6">
          <p className="text-amber-800 dark:text-amber-200 font-medium mb-1">
            Masz teraz dostęp Premium!
          </p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {result?.plan || "PREMIUM"}
          </p>
        </div>

        {/* Lista korzyści */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
            Masz teraz dostęp do:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {result?.plan === "LIFETIME"
                ? "Nielimitowane sprawdzenia"
                : "100 sprawdzeń dziennie"}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              Teksty do 10 000 znaków
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              Pełne wyjaśnienia błędów
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              Historia sprawdzeń
            </li>
          </ul>
        </div>

        {/* Przyciski */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/panel"
            className="px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
          >
            Przejdź do panelu
          </Link>
          <Link
            to="/historia"
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Zobacz historię sprawdzeń
          </Link>
        </div>
      </div>
    </div>
  );
}
