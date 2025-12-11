// frontend/src/pages/PaymentPage.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Crown,
  Check,
  Shield,
  CreditCard,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";
import { api } from "../lib/api";

const PLANS = {
  premium: {
    id: "premium",
    name: "Premium",
    price: 29,
    period: "miesięcznie",
    description: "Dla profesjonalistów",
    features: [
      "100 sprawdzeń dziennie",
      "Do 10 000 znaków na raz",
      "Pełne wyjaśnienia reguł",
      "Historia sprawdzeń",
    ],
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime",
    price: 299,
    period: "jednorazowo",
    description: "Płacisz raz, masz na zawsze",
    features: [
      "Bez limitów sprawdzeń",
      "Do 50 000 znaków na raz",
      "Pełne wyjaśnienia reguł",
      "Historia sprawdzeń",
      "Priorytetowe wsparcie",
    ],
  },
};

export function PaymentPage() {
  const { plan } = useParams<{ plan: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const selectedPlan =
    plan === "premium" || plan === "lifetime" ? PLANS[plan] : null;

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Nie znaleziono planu
          </h1>
          <Link to="/cennik" className="text-blue-600 hover:underline">
            Zobacz dostępne plany →
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Zaloguj się, aby kontynuować
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Musisz być zalogowany, aby dokonać zakupu.
          </p>
          <Link
            to={`/logowanie?redirect=/platnosc/${plan}`}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Zaloguj się
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Wywołaj backend, który utworzy sesję Stripe
      const response = await api.post("/api/payments/create-checkout", {
        plan: selectedPlan.id,
      });

      // Przekieruj do Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Nie udało się utworzyć sesji płatności");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message || "Błąd podczas inicjowania płatności"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <Link
          to="/cennik"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do cennika
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Podsumowanie zamówienia
            </h2>

            <div
              className={`p-6 rounded-xl mb-6 ${
                selectedPlan.id === "lifetime"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5" />
                <span className="text-lg font-bold">{selectedPlan.name}</span>
              </div>
              <p className="text-sm opacity-90 mb-4">
                {selectedPlan.description}
              </p>
              <div className="text-3xl font-bold">
                {selectedPlan.price} zł
                <span className="text-sm font-normal opacity-75 ml-1">
                  {selectedPlan.period}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {selectedPlan.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                >
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                <span>Razem do zapłaty:</span>
                <span>{selectedPlan.price} zł</span>
              </div>
              {selectedPlan.id === "premium" && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Subskrypcja odnawiana co miesiąc. Możesz anulować w dowolnym
                  momencie.
                </p>
              )}
            </div>
          </div>

          {/* Payment form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Dane do płatności
            </h2>

            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Kupujesz jako:
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>

            {/* Security badges */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Shield className="w-8 h-8 text-green-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Bezpieczna płatność
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Szyfrowane połączenie SSL • Stripe Payments
                </p>
              </div>
            </div>

            {/* Payment methods */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Akceptowane metody płatności:
              </p>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                  Visa
                </div>
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                  Mastercard
                </div>
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                  BLIK
                </div>
                <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                  Przelewy24
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Przetwarzanie...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Zapłać {selectedPlan.price} zł
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Klikając "Zapłać" zgadzasz się z{" "}
              <Link to="/regulamin" className="text-blue-600 hover:underline">
                Regulaminem
              </Link>{" "}
              i{" "}
              <Link to="/prywatnosc" className="text-blue-600 hover:underline">
                Polityką prywatności
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
