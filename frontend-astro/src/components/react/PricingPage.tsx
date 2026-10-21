// Cennik: darmowe konto, doładowania do krótkich tekstów, pakiety korekty dokumentów.
import { Check, FileText, MessageSquare, Zap } from "lucide-react";

const TOPUPS = [
  { price: "5 zł", checks: "10 sprawdzeń" },
  { price: "10 zł", checks: "25 sprawdzeń" },
  { price: "20 zł", checks: "60 sprawdzeń" },
];

const DOCUMENTS = [
  { price: "39 zł", pages: "do 20 stron", chars: "36 000 znaków", example: "artykuł, raport, rozdział" },
  { price: "79 zł", pages: "do 60 stron", chars: "108 000 znaków", example: "praca licencjacka" },
  { price: "149 zł", pages: "do 150 stron", chars: "270 000 znaków", example: "praca magisterska" },
];

const FAQ = [
  {
    q: "Jak liczycie strony?",
    a: "Strona to 1800 znaków ze spacjami - tak liczą wydawnictwa i korektorzy. Po wgraniu pliku od razu pokazujemy liczbę stron i cenę. Płacisz dopiero wtedy, gdy ją zaakceptujesz.",
  },
  {
    q: "Jak wygląda poprawiony plik?",
    a: "Dostajesz ten sam plik .docx z poprawkami w trybie śledzenia zmian Worda. Przy każdej poprawce jest komentarz z regułą i krótkim wyjaśnieniem. Poprawki akceptujesz lub odrzucasz na karcie Recenzja - pojedynczo albo wszystkie naraz.",
  },
  {
    q: "Co poprawiacie, a czego nie ruszamy?",
    a: "Poprawiamy interpunkcję, ortografię, pisownię łączną i rozdzielną oraz gramatykę - w treści i w przypisach. Nie zmieniamy stylu autora, cytatów z innych źródeł, opisów źródeł, terminologii, nazw własnych ani bibliografii. Formatowanie i tabele zostają bez zmian.",
  },
  {
    q: "Czy mogę zobaczyć wynik przed zapłatą?",
    a: "Tak. Po wgraniu pliku możesz raz, bez płacenia, zobaczyć próbkę: poprawki na pierwszych dwóch stronach pracy z wyjaśnieniem każdej reguły. Plik .docx z poprawkami dostajesz po opłaceniu całej korekty.",
  },
  {
    q: "Ile trwa korekta dokumentu?",
    a: "Zwykle kilka minut, przy pracy magisterskiej kilkanaście. Postęp widzisz w panelu, a gdy skończymy, wyślemy e-mail.",
  },
  {
    q: "Mój dokument ma ponad 150 stron albo jest w innym formacie.",
    a: "Obsługujemy pliki .docx. Plik .doc, .odt albo .pdf otwórz w Wordzie i zapisz jako .docx. Dokumenty dłuższe niż 150 stron wycenimy indywidualnie - napisz do nas.",
  },
  {
    q: "Czy sprawdzenia z doładowania wygasają?",
    a: "Nie. Dokupione sprawdzenia zostają na koncie do wykorzystania, a każde obejmuje tekst do 10 000 znaków.",
  },
  {
    q: "Jak mogę zapłacić?",
    a: "Kartą płatniczą albo BLIK-iem. Płatności obsługuje Stripe. To płatności jednorazowe - nie ma żadnego abonamentu.",
  },
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Cennik</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Bez abonamentu. Krótkie teksty sprawdzisz za darmo, a za dłuższe i całe dokumenty płacisz
            raz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Darmowe konto</h2>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">0 zł</div>
            <ul className="space-y-3 mb-8">
              {[
                "2 sprawdzenia AI dziennie, do 500 znaków każde",
                "Wyjaśnienie reguły przy każdej poprawce",
                "Sprawdzanie pisowni słownikiem bez limitu",
                "Bez karty płatniczej",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="/rejestracja"
              className="block text-center py-3 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-blue-500"
            >
              Załóż darmowe konto
            </a>
          </div>

          <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" />
              Doładowanie
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Dodatkowe sprawdzenia AI do 10 000 znaków każde. Nie wygasają.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {TOPUPS.map((t) => (
                <div key={t.price} className="rounded-xl bg-gray-50 dark:bg-gray-900 p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{t.price}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t.checks}</div>
                </div>
              ))}
            </div>
            <a
              href="/panel"
              className="block text-center py-3 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-blue-500"
            >
              Doładuj w panelu
            </a>
          </div>
        </div>

        <section id="dokumenty" className="mb-16 scroll-mt-24">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              Korekta całego dokumentu
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Wgraj pracę dyplomową, artykuł albo raport w formacie .docx. Odeślemy ten sam plik z
              poprawkami w trybie śledzenia zmian Worda i komentarzem przy każdej poprawce.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {DOCUMENTS.map((d, i) => (
              <div
                key={d.price}
                className={`rounded-2xl border-2 p-6 text-center ${
                  i === 1
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}
              >
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{d.price}</div>
                <div className="text-lg font-medium text-gray-800 dark:text-gray-200">{d.pages}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">{d.chars}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">np. {d.example}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3">
            <a
              href="/panel/dokumenty"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 shadow-lg"
            >
              <FileText className="w-5 h-5" />
              Wgraj dokument i sprawdź cenę
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Cenę i bezpłatną próbkę 2 stron zobaczysz przed płatnością. Potrzebne jest darmowe konto.
            </p>
            <a href="/korekta-pracy-dyplomowej" className="text-sm text-blue-600 hover:underline">
              Jak wygląda korekta pracy licencjackiej i magisterskiej →
            </a>
          </div>
        </section>

        <section className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Często zadawane pytania
          </h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            Masz inne pytanie? Napisz na{" "}
            <a href="mailto:kontakt@ecopywriting.pl" className="text-blue-600 hover:underline">
              kontakt@ecopywriting.pl
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
