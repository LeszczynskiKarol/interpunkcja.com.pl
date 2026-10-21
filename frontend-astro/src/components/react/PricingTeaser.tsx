// Skrót cennika na stronie głównej i landingach (pełny cennik: /cennik).
// Darmowe konto + doładowania do krótkich tekstów, pakiety do całych dokumentów.
import { Check, FileText } from "lucide-react";

const TIERS = [
  {
    name: "Darmowe konto",
    price: "0 zł",
    note: "bez karty",
    features: [
      "2 sprawdzenia AI dziennie",
      "Do 500 znaków na raz",
      "Wyjaśnienie każdej poprawki",
      "Sprawdzanie pisowni bez limitu",
    ],
    cta: "Załóż konto",
    href: "/rejestracja",
    highlighted: false,
  },
  {
    name: "Doładowanie",
    price: "od 5 zł",
    note: "jednorazowo, bez abonamentu",
    features: [
      "10 sprawdzeń za 5 zł, 60 za 20 zł",
      "Do 10 000 znaków na raz",
      "Sprawdzenia nie wygasają",
      "Karta albo BLIK",
    ],
    cta: "Zobacz cennik",
    href: "/cennik",
    highlighted: false,
  },
  {
    name: "Korekta całego dokumentu",
    price: "od 39 zł",
    note: "39 zł do 20 stron · 79 zł do 60 · 149 zł do 150",
    features: [
      "Wgrywasz plik .docx, np. pracę dyplomową",
      "Poprawki w trybie śledzenia zmian Worda",
      "Komentarz z regułą przy każdej poprawce",
      "Formatowanie i bibliografia nietknięte",
    ],
    cta: "Korekta pracy dyplomowej",
    href: "/korekta-pracy-dyplomowej",
    highlighted: true,
  },
];

export function PricingTeaser() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cennik bez abonamentu
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Krótkie teksty sprawdzisz za darmo, za całe dokumenty płacisz raz
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl p-6 border-2 flex flex-col ${
                t.highlighted
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              }`}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                {t.highlighted && <FileText className="w-5 h-5 text-blue-600" />}
                {t.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">{t.price}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.note}</div>
              <ul className="space-y-3 mb-6 text-sm flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={t.href}
                className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                  t.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500"
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
