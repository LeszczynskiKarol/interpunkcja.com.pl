// frontend/src/pages/PricingPage.tsx
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function PricingPage() {
  const { user, isAuthenticated } = useAuthStore();

  const plans = [
    {
      id: "FREE",
      name: "Free",
      price: "0",
      period: "",
      description: "Idealne na początek",
      features: [
        { text: "5 sprawdzeń dziennie", included: true },
        { text: "Do 500 znaków na raz", included: true },
        { text: "Podstawowe poprawki", included: true },
        { text: "Wyjaśnienia reguł", included: false },
        { text: "Historia sprawdzeń", included: false },
        { text: "Priorytetowe wsparcie", included: false },
      ],
      cta: isAuthenticated ? "Twój obecny plan" : "Załóż darmowe konto",
      ctaLink: isAuthenticated ? null : "/rejestracja",
      highlighted: false,
      current: user?.plan === "FREE",
    },
    {
      id: "PREMIUM",
      name: "Premium",
      price: "29",
      period: "/mies",
      description: "Dla profesjonalistów",
      features: [
        { text: "100 sprawdzeń dziennie", included: true },
        { text: "Do 10 000 znaków na raz", included: true },
        { text: "Pełne poprawki z AI", included: true },
        { text: "Wyjaśnienia reguł", included: true },
        { text: "Historia sprawdzeń", included: true },
        { text: "Priorytetowe wsparcie", included: false },
      ],
      cta: user?.plan === "PREMIUM" ? "Twój obecny plan" : "Wybierz Premium",
      ctaLink: user?.plan === "PREMIUM" ? null : "/platnosc/premium",
      highlighted: true,
      current: user?.plan === "PREMIUM",
      badge: "Najpopularniejszy",
    },
    {
      id: "LIFETIME",
      name: "Lifetime",
      price: "299",
      period: " jednorazowo",
      description: "Płacisz raz, masz na zawsze",
      features: [
        { text: "Bez limitów sprawdzeń", included: true },
        { text: "Do 50 000 znaków na raz", included: true },
        { text: "Pełne poprawki z AI", included: true },
        { text: "Wyjaśnienia reguł", included: true },
        { text: "Historia sprawdzeń", included: true },
        { text: "Priorytetowe wsparcie", included: true },
      ],
      cta: user?.plan === "LIFETIME" ? "Twój obecny plan" : "Kup Lifetime",
      ctaLink: user?.plan === "LIFETIME" ? null : "/platnosc/lifetime",
      highlighted: false,
      current: user?.plan === "LIFETIME",
      badge: "Najlepsza wartość",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Wybierz plan dla siebie
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Zacznij za darmo, przejdź na wyższy plan gdy potrzebujesz więcej
            możliwości
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl scale-105"
                  : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      plan.highlighted
                        ? "bg-amber-400 text-amber-900"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Current plan badge */}
              {plan.current && (
                <div className="absolute -top-3 right-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500 text-white">
                    Aktywny
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-6">
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    plan.highlighted
                      ? "text-white"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </h2>
                <p
                  className={`text-sm ${
                    plan.highlighted
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <span
                  className={`text-5xl font-bold ${
                    plan.highlighted
                      ? "text-white"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-lg ${
                    plan.highlighted
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {plan.price !== "0" && " zł"}
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check
                        className={`w-5 h-5 flex-shrink-0 ${
                          plan.highlighted ? "text-green-300" : "text-green-500"
                        }`}
                      />
                    ) : (
                      <X
                        className={`w-5 h-5 flex-shrink-0 ${
                          plan.highlighted
                            ? "text-blue-300"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included
                          ? plan.highlighted
                            ? "text-white"
                            : "text-gray-700 dark:text-gray-300"
                          : plan.highlighted
                          ? "text-blue-200"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.ctaLink ? (
                <Link
                  to={plan.ctaLink}
                  className={`block w-full py-3 text-center font-medium rounded-xl transition-colors ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  disabled
                  className={`block w-full py-3 text-center font-medium rounded-xl ${
                    plan.current
                      ? plan.highlighted
                        ? "bg-white/20 text-white cursor-default"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Często zadawane pytania
          </h2>

          <div className="space-y-4">
            <details className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <summary className="font-medium text-gray-900 dark:text-white cursor-pointer">
                Jak działa limit sprawdzeń?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                Limit sprawdzeń resetuje się codziennie o północy. Każde
                kliknięcie "Sprawdź interpunkcję" to jedno sprawdzenie. Limit
                znaków to maksymalna długość tekstu w jednym sprawdzeniu.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <summary className="font-medium text-gray-900 dark:text-white cursor-pointer">
                Czy mogę anulować subskrypcję?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                Tak, subskrypcję Premium możesz anulować w dowolnym momencie w
                ustawieniach konta. Po anulowaniu będziesz mieć dostęp do
                Premium do końca opłaconego okresu.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <summary className="font-medium text-gray-900 dark:text-white cursor-pointer">
                Co oznacza plan Lifetime?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                Plan Lifetime to jednorazowa płatność, która daje Ci dostęp do
                wszystkich funkcji na zawsze. Bez odnawianej subskrypcji, bez
                dodatkowych opłat.
              </p>
            </details>

            <details className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <summary className="font-medium text-gray-900 dark:text-white cursor-pointer">
                Jakie metody płatności akceptujecie?
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                Akceptujemy karty płatnicze (Visa, Mastercard), BLIK, przelewy
                online oraz tradycyjne przelewy bankowe.
              </p>
            </details>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Masz pytania? Napisz do nas!
          </p>
          <Link
            to="/kontakt"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Skontaktuj się z nami →
          </Link>
        </div>
      </div>
    </div>
  );
}
