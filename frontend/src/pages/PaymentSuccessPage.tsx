// frontend/src/pages/PaymentSuccessPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Crown, Loader2 } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { api } from "../lib/api";

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [_verified, setVerified] = useState(false);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Zweryfikuj płatność i zaktualizuj plan użytkownika
        const response = await api.post("/api/payments/verify", { sessionId });

        if (response.data.success) {
          setVerified(true);
          // Odśwież dane użytkownika
          const userResponse = await api.get("/api/auth/me");
          setUser(userResponse.data);
        }
      } catch (error) {
        console.error("Payment verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Weryfikacja płatności...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Płatność zakończona!
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Dziękujemy za zakup! Twoje konto zostało zaktualizowane.
          </p>

          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-4 mb-6">
            <Crown className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold">Masz teraz dostęp Premium!</p>
          </div>

          <div className="space-y-3">
            <Link
              to="/panel"
              className="block w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Przejdź do panelu
            </Link>
            <Link
              to="/historia"
              className="block w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Zobacz historię sprawdzeń
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
