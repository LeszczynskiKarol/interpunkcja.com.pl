// frontend/src/pages/Home.tsx
import { Link } from "react-router-dom";
import {
  BookOpen,
  Zap,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";

export function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors">
      {/* Hero */}
      <header className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Sprawdzanie interpunkcji z AI
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Sprawdź <span className="text-blue-600">interpunkcję</span>
            <br />w swoim tekście
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Sztuczna inteligencja pomoże Ci wyeliminować błędy interpunkcyjne.
            Wklej tekst i zobacz, gdzie brakuje przecinków.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/panel"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg"
              >
                Przejdź do panelu
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/rejestracja"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg"
                >
                  Załóż darmowe konto
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/logowanie"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-lg"
                >
                  Zaloguj się
                </Link>
              </>
            )}
          </div>

          {/* Social proof */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Darmowe konto
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Bez karty kredytowej
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Szybka rejestracja
            </div>
          </div>
        </div>
      </header>

      {/* How it works */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Jak to działa?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Załóż konto
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Szybka rejestracja - wystarczy email i hasło
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Wklej tekst
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Wklej swój tekst do korektora w panelu
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Otrzymaj poprawki
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                AI wskaże błędy i wyjaśni zasady interpunkcji
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Dlaczego warto korzystać z naszego korektora?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Szybka analiza
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sprawdzenie tekstu zajmuje kilka sekund dzięki AI
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Wyjaśnienia reguł
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Każda poprawka zawiera wyjaśnienie zasady interpunkcyjnej
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Bezpieczeństwo
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Twoje teksty nie są przechowywane ani udostępniane
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Polska interpunkcja
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Specjalizujemy się w zasadach polskiej interpunkcji
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Plany i cennik
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Zacznij za darmo, przejdź na Premium gdy potrzebujesz więcej
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Free
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                0 zł
              </p>
              <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>✓ 5 sprawdzeń dziennie</li>
                <li>✓ Do 500 znaków na raz</li>
                <li>✓ Podstawowe poprawki</li>
                <li className="text-gray-400 dark:text-gray-500">
                  ✗ Bez pełnych wyjaśnień
                </li>
                <li className="text-gray-400 dark:text-gray-500">
                  ✗ Bez historii
                </li>
              </ul>
              <Link
                to="/rejestracja"
                className="block w-full mt-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
              >
                Załóż darmowe konto
              </Link>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white">
              <h3 className="text-lg font-semibold mb-2">Premium</h3>
              <p className="text-3xl font-bold mb-4">
                29 zł<span className="text-lg font-normal">/mies</span>
              </p>
              <ul className="text-left text-sm space-y-2">
                <li>✓ 100 sprawdzeń dziennie</li>
                <li>✓ Do 10 000 znaków na raz</li>
                <li>✓ Pełne wyjaśnienia reguł</li>
                <li>✓ Historia sprawdzeń</li>
                <li>✓ Priorytetowe wsparcie</li>
              </ul>
              <Link
                to="/rejestracja"
                className="block w-full mt-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                Wybierz Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Gotowy poprawić swoją interpunkcję?
          </h2>
          <p className="text-blue-100 mb-8">
            Załóż darmowe konto i zacznij sprawdzać teksty już teraz!
          </p>
          <Link
            to="/rejestracja"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-lg"
          >
            Załóż konto za darmo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
