// frontend/src/pages/Home.tsx
import { Checker } from "../components/Checker";
import { BookOpen, Zap, Shield, Star } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <header className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sprawdź <span className="text-blue-600">interpunkcję</span> w swoim
            tekście
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sztuczna inteligencja pomoże Ci wyeliminować błędy interpunkcyjne.
            Wklej tekst i zobacz, gdzie brakuje przecinków.
          </p>
        </div>
      </header>

      {/* Checker */}
      <main className="px-4 pb-16">
        <Checker />
      </main>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Dlaczego warto korzystać z naszego korektora?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Szybka analiza
              </h3>
              <p className="text-gray-600 text-sm">
                Sprawdzenie tekstu zajmuje kilka sekund dzięki AI
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Wyjaśnienia reguł
              </h3>
              <p className="text-gray-600 text-sm">
                Każda poprawka zawiera wyjaśnienie zasady interpunkcyjnej
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Bezpieczeństwo
              </h3>
              <p className="text-gray-600 text-sm">
                Twoje teksty nie są przechowywane ani udostępniane
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Polska interpunkcja
              </h3>
              <p className="text-gray-600 text-sm">
                Specjalizujemy się w zasadach polskiej interpunkcji
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Plany i cennik
          </h2>
          <p className="text-gray-600 mb-8">
            Zacznij za darmo, przejdź na Premium gdy potrzebujesz więcej
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 bg-white rounded-2xl border-2 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">0 zł</p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li>✓ 5 sprawdzeń dziennie</li>
                <li>✓ Do 500 znaków na raz</li>
                <li>✓ Podstawowe poprawki</li>
                <li className="text-gray-400">✗ Bez pełnych wyjaśnień</li>
                <li className="text-gray-400">✗ Bez historii</li>
              </ul>
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
              <button className="w-full mt-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Wybierz Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>© 2025 Interpunkcja.com.pl | Wszystkie prawa zastrzeżone</p>
        </div>
      </footer>
    </div>
  );
}
