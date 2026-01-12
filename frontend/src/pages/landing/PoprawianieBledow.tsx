// frontend/src/pages/landing/PoprawianieBledow.tsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle,
  ArrowRight,
  Target,
  ChevronRight,
  Check,
  X,
  GraduationCap,
  Zap,
  Clock,
  AlertTriangle,
  Infinity,
  TrendingUp,
  Award,
  Search,
  RefreshCw,
  Wrench,
  Hammer,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { Checker } from "../../components/Checker";

export function PoprawianieBledow() {
  const { isAuthenticated } = useAuthStore();

  // Typy błędów do poprawienia
  const errorTypes = [
    {
      icon: AlertTriangle,
      title: "Błędy ortograficzne",
      description: "Literówki, błędna pisownia ó/u, rz/ż, ch/h",
      examples: [
        { wrong: "żułty", correct: "żółty" },
        { wrong: "hodzić", correct: "chodzić" },
        { wrong: "wziąść", correct: "wziąć" },
      ],
      color: "red",
    },
    {
      icon: Target,
      title: "Błędy interpunkcyjne",
      description: "Brakujące przecinki, złe użycie znaków",
      examples: [
        { wrong: "Myślę że", correct: "Myślę, że" },
        { wrong: "Jan który", correct: "Jan, który" },
        { wrong: "Tak więc", correct: "Tak więc," },
      ],
      color: "orange",
    },
    {
      icon: RefreshCw,
      title: "Pisownia łączna/rozdzielna",
      description: "Najczęstsze problemy Polaków",
      examples: [
        { wrong: "napewno", correct: "na pewno" },
        { wrong: "na prawdę", correct: "naprawdę" },
        { wrong: "w ogóle", correct: "w ogóle ✓" },
      ],
      color: "blue",
    },
    {
      icon: Wrench,
      title: "Błędy gramatyczne",
      description: "Odmiana, formy czasowników, składnia",
      examples: [
        { wrong: "poszłem", correct: "poszedłem" },
        { wrong: "włanczam", correct: "włączam" },
        { wrong: "bym zrobił", correct: "zrobiłbym" },
      ],
      color: "purple",
    },
    {
      icon: Hammer,
      title: "Błędy stylistyczne",
      description: "Pleonazmy, powtórzenia, niezręczności",
      examples: [
        { wrong: "cofnąć do tyłu", correct: "cofnąć się" },
        { wrong: "aktualna teraźniejszość", correct: "teraźniejszość" },
        { wrong: "spaść w dół", correct: "spaść" },
      ],
      color: "pink",
    },
    {
      icon: Search,
      title: "Błędy kontekstowe",
      description: "Poprawne słowa w złym miejscu",
      examples: [
        { wrong: "bić pianę", correct: "ubijać pianę" },
        { wrong: "robić wrażenie na", correct: "wywierać wrażenie" },
        { wrong: "grać role", correct: "odgrywać rolę" },
      ],
      color: "cyan",
    },
  ];

  // Dlaczego warto poprawiać błędy
  const whyFixErrors = [
    {
      icon: Award,
      title: "Profesjonalny wizerunek",
      description:
        "Tekst bez błędów buduje zaufanie. Błędy w CV, ofercie czy emailu mogą przekreślić Twoje szanse.",
      stat: "76%",
      statLabel: "rekruterów odrzuca CV z błędami",
    },
    {
      icon: TrendingUp,
      title: "Lepsze pozycje w Google",
      description:
        "Teksty bez błędów są lepiej oceniane przez algorytmy wyszukiwarek. SEO wymaga poprawnej polszczyzny.",
      stat: "23%",
      statLabel: "więcej ruchu na stronach bez błędów",
    },
    {
      icon: GraduationCap,
      title: "Wyższe oceny",
      description:
        "Prace akademickie bez błędów są lepiej oceniane. Błędy ortograficzne obniżają ocenę nawet o stopień.",
      stat: "1 stopień",
      statLabel: "niżej za błędy ortograficzne",
    },
    {
      icon: Clock,
      title: "Oszczędność czasu",
      description:
        "AI poprawia błędy w 3 sekundy. Ręczna korekta długiego tekstu zajmuje godziny.",
      stat: "< 3 sek",
      statLabel: "czas poprawienia tekstu",
    },
  ];

  // Proces poprawiania
  const fixProcess = [
    {
      step: "1",
      title: "Wklej tekst z błędami",
      description:
        "Skopiuj tekst z dokumentu, emaila lub strony i wklej go do naszego korektora. Obsługujemy do 10 000 znaków na raz.",
    },
    {
      step: "2",
      title: "AI wykrywa wszystkie błędy",
      description:
        "Sztuczna inteligencja Claude analizuje tekst w kontekście, wykrywając błędy ortograficzne, interpunkcyjne i gramatyczne.",
    },
    {
      step: "3",
      title: "Zobacz poprawki z wyjaśnieniami",
      description:
        "Każdy błąd jest podświetlony z wyjaśnieniem zasady. Uczysz się na bieżąco i unikasz tych samych błędów w przyszłości.",
    },
    {
      step: "4",
      title: "Skopiuj poprawiony tekst",
      description:
        "Jednym kliknięciem skopiujesz bezbłędny tekst i wkleisz go z powrotem do swojego dokumentu.",
    },
  ];

  // Najczęstsze błędy Polaków
  const commonPolishErrors = [
    {
      category: "Pisownia łączna i rozdzielna",
      errors: [
        { wrong: "napewno", correct: "na pewno", frequency: "bardzo często" },
        { wrong: "na prawdę", correct: "naprawdę", frequency: "bardzo często" },
        { wrong: "wogóle", correct: "w ogóle", frequency: "często" },
        { wrong: "ponadto", correct: "ponadto ✓", frequency: "pomyłki" },
        { wrong: "poza tym", correct: "poza tym ✓", frequency: "pomyłki" },
        { wrong: "z przed", correct: "sprzed", frequency: "często" },
      ],
    },
    {
      category: "Formy czasowników",
      errors: [
        { wrong: "wziąść", correct: "wziąć", frequency: "bardzo często" },
        { wrong: "poszłem", correct: "poszedłem", frequency: "często" },
        { wrong: "włanczam", correct: "włączam", frequency: "często" },
        { wrong: "bym zrobił", correct: "zrobiłbym", frequency: "często" },
        { wrong: "używając", correct: "używając ✓", frequency: "pomyłki" },
        { wrong: "wyłanczać", correct: "wyłączać", frequency: "często" },
      ],
    },
    {
      category: "Interpunkcja",
      errors: [
        { wrong: "Myślę że", correct: "Myślę, że", frequency: "bardzo często" },
        { wrong: "który był", correct: ", który był,", frequency: "często" },
        {
          wrong: "mimo że",
          correct: "mimo że / mimo, że",
          frequency: "często",
        },
        { wrong: "dlatego że", correct: "dlatego, że", frequency: "często" },
        { wrong: "Tak więc", correct: "Tak więc,", frequency: "często" },
        { wrong: "Poza tym", correct: "Poza tym,", frequency: "często" },
      ],
    },
  ];

  // Porównanie przed/po
  const beforeAfterExamples = [
    {
      title: "Email biznesowy",
      before:
        "Dzień dobry, chciałbym wziąść udział w spotkaniu które odbędzie się w przyszłym tygodniu. Na pewno będę na czas mimo że mam dużo pracy.",
      after:
        "Dzień dobry, chciałbym wziąć udział w spotkaniu, które odbędzie się w przyszłym tygodniu. Na pewno będę na czas, mimo że mam dużo pracy.",
      errorsFixed: 4,
    },
    {
      title: "Praca akademicka",
      before:
        "W niniejszej pracy postaram się udowodnić że teoria ta jest słuszna. Badania przeprowadzone w latach 90-tych wskazują na prawdę tego założenia.",
      after:
        "W niniejszej pracy postaram się udowodnić, że teoria ta jest słuszna. Badania przeprowadzone w latach 90. wskazują na prawdziwość tego założenia.",
      errorsFixed: 3,
    },
    {
      title: "Post na LinkedIn",
      before:
        "Wogóle nie spodziewałem się że mój projekt odniesie taki sukces. Dziękuję wszystkim którzy mnie wspierali!",
      after:
        "W ogóle nie spodziewałem się, że mój projekt odniesie taki sukces. Dziękuję wszystkim, którzy mnie wspierali!",
      errorsFixed: 4,
    },
  ];

  // FAQ
  const faq = [
    {
      question: "Jak szybko AI poprawia błędy w tekście?",
      answer:
        "Nasz korektor AI poprawia błędy w ciągu 2-3 sekund, niezależnie od długości tekstu (do 10 000 znaków). Sztuczna inteligencja Claude analizuje cały tekst jednocześnie, wykrywając błędy ortograficzne, interpunkcyjne i gramatyczne.",
    },
    {
      question: "Jakie błędy potrafi poprawić korektor?",
      answer:
        "Korektor poprawia: literówki i błędy ortograficzne, błędną pisownię łączną i rozdzielną (napewno→na pewno), brakujące przecinki, błędy gramatyczne (poszłem→poszedłem), pleonazmy i błędy stylistyczne. AI rozumie kontekst, więc wykrywa też błędy w poprawnych słowach użytych niewłaściwie.",
    },
    {
      question: "Czy poprawianie błędów jest darmowe?",
      answer:
        "Tak! Oferujemy darmowy plan z 5 poprawkami dziennie (do 500 znaków każda). Dla intensywniejszego użycia polecamy Premium (29 zł/mies) lub Lifetime (299 zł jednorazowo) z limitem 10 000 znaków i pełnymi wyjaśnieniami.",
    },
    {
      question: "Czy AI wyjaśnia poprawiane błędy?",
      answer:
        "Tak! Każda poprawka zawiera wyjaśnienie zasady, która została naruszona. Dzięki temu nie tylko poprawiasz tekst, ale też uczysz się na bieżąco i unikasz tych samych błędów w przyszłości.",
    },
    {
      question: "Czy mogę poprawić długi dokument?",
      answer:
        "W planie Free możesz poprawiać do 500 znaków. Plan Premium i Lifetime pozwalają na poprawianie do 10 000 znaków na raz (około 5 stron A4). Dłuższe dokumenty możesz poprawiać częściami.",
    },
    {
      question: "Czym różni się od korektora w Wordzie?",
      answer:
        "Wbudowany korektor Word opiera się na słowniku i prostych regułach. Nasz korektor AI rozumie kontekst zdania, wykrywa subtelne błędy i wyjaśnia każdą poprawkę. Szczególnie dobrze radzi sobie z polską interpunkcją, która jest problematyczna dla tradycyjnych korektorów.",
    },
    {
      question: "Czy moje teksty są bezpieczne?",
      answer:
        "Tak. Teksty są przetwarzane w czasie rzeczywistym i nie są przechowywane po sprawdzeniu. Nie udostępniamy ich osobom trzecim. Twoja prywatność jest priorytetem.",
    },
    {
      question: "Czy działa na telefonie?",
      answer:
        "Tak! Strona jest w pełni responsywna. Możesz poprawiać błędy na smartfonie, tablecie i komputerze — wystarczy przeglądarka z internetem.",
    },
  ];

  // Statystyki
  const stats = [
    { value: "99.2%", label: "Skuteczność poprawek" },
    { value: "< 3 sek", label: "Czas analizy" },
    { value: "10 000", label: "Znaków na raz" },
    { value: "100%", label: "Prywatności" },
  ];

  // Schema.org
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Poprawianie Błędów Online - Interpunkcja.com.pl",
    description:
      "Automatyczne poprawianie błędów ortograficznych, interpunkcyjnych i gramatycznych z AI. Szybka korekta tekstu z wyjaśnieniami.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PLN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1893",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>
          Poprawianie Błędów Online Za Darmo | Korektor AI 2025 -
          Interpunkcja.com.pl
        </title>
        <meta
          name="description"
          content="✓ Automatyczne poprawianie błędów ortograficznych i interpunkcyjnych z AI! Wklej tekst i zobacz poprawki z wyjaśnieniami w 3 sekundy. Darmowe 5 sprawdzeń dziennie."
        />
        <meta
          name="keywords"
          content="poprawianie błędów, poprawianie błędów online, korekta błędów, poprawianie ortografii, poprawianie interpunkcji, korektor błędów, naprawa tekstu, poprawki tekstu, korektor online, poprawianie tekstu"
        />
        <link
          rel="canonical"
          href="https://interpunkcja.com.pl/poprawianie-bledow"
        />

        <meta
          property="og:title"
          content="Poprawianie Błędów Online Za Darmo | AI 2025"
        />
        <meta
          property="og:description"
          content="Automatyczne poprawianie błędów z AI. Wklej tekst i zobacz poprawki z wyjaśnieniami w 3 sekundy!"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://interpunkcja.com.pl/poprawianie-bledow"
        />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Interpunkcja.com.pl" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Poprawianie Błędów Online Za Darmo"
        />
        <meta
          name="twitter:description"
          content="Korektor AI - popraw błędy w 3 sekundy!"
        />

        <meta name="robots" content="index, follow" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors">
        {/* Hero Section */}
        <header className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link to="/" className="hover:text-red-600">
                Strona główna
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-white font-medium">
                Poprawianie błędów
              </span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Automatyczne poprawki AI • Za darmo
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="text-red-600 dark:text-red-400">
                Poprawianie błędów
              </span>{" "}
              online
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Wklej tekst i{" "}
              <strong className="text-gray-900 dark:text-white">
                automatycznie popraw wszystkie błędy
              </strong>
              . AI wykryje i naprawi błędy ortograficzne, interpunkcyjne i
              gramatyczne z wyjaśnieniem każdej poprawki.
            </p>

            {/* Value props */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Wszystkie typy błędów
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Wyjaśnienia zasad
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Poprawki w 3 sekundy
                </span>
              </div>
            </div>

            {/* CTA */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  to="/rejestracja"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                >
                  Popraw błędy za darmo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/logowanie"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 transition-all text-lg"
                >
                  Zaloguj się
                </Link>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✓ 5 poprawek dziennie za darmo &nbsp; ✓ Wyniki w 3 sekundy &nbsp;
              ✓ Lifetime 299 zł
            </p>
          </div>
        </header>

        {/* Checker dla zalogowanych */}
        {isAuthenticated && (
          <section className="py-8 px-4 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                Wklej tekst do poprawienia
              </h2>
              <Checker />
            </div>
          </section>
        )}

        {/* Stats */}
        <section className="py-12 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typy błędów */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Jakie błędy poprawiamy?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                AI wykrywa i naprawia wszystkie typy błędów językowych
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {errorTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      type.color === "red"
                        ? "bg-red-100 dark:bg-red-900/50"
                        : type.color === "orange"
                        ? "bg-orange-100 dark:bg-orange-900/50"
                        : type.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : type.color === "purple"
                        ? "bg-purple-100 dark:bg-purple-900/50"
                        : type.color === "pink"
                        ? "bg-pink-100 dark:bg-pink-900/50"
                        : "bg-cyan-100 dark:bg-cyan-900/50"
                    }`}
                  >
                    <type.icon
                      className={`w-6 h-6 ${
                        type.color === "red"
                          ? "text-red-600 dark:text-red-400"
                          : type.color === "orange"
                          ? "text-orange-600 dark:text-orange-400"
                          : type.color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : type.color === "purple"
                          ? "text-purple-600 dark:text-purple-400"
                          : type.color === "pink"
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-cyan-600 dark:text-cyan-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {type.description}
                  </p>
                  <div className="space-y-2">
                    {type.examples.map((ex, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-red-500 line-through">
                          {ex.wrong}
                        </span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {ex.correct}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dlaczego warto poprawiać */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Dlaczego warto poprawiać błędy?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Bezbłędne teksty to inwestycja w Twój sukces
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyFixErrors.map((reason, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center mb-4">
                    <reason.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {reason.description}
                  </p>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {reason.stat}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {reason.statLabel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Przed i po */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Przykłady poprawek
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Zobacz, jak AI poprawia typowe błędy
              </p>
            </div>

            <div className="space-y-6">
              {beforeAfterExamples.map((example, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-red-600 text-white">
                    <span className="font-bold">{example.title}</span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {example.errorsFixed} poprawki
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <X className="w-4 h-4 text-red-500" />
                        <span className="uppercase font-medium">
                          Przed poprawką
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                        {example.before}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="uppercase font-medium">
                          Po poprawce
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800 font-medium">
                        {example.after}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proces */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Jak poprawić błędy w 4 krokach?
              </h2>
            </div>

            <div className="space-y-6">
              {fixProcess.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Najczęstsze błędy */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Najczęstsze błędy Polaków
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Sprawdź, które błędy popełniasz najczęściej
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {commonPolishErrors.map((category, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="bg-red-600 text-white px-4 py-3 font-bold">
                    {category.category}
                  </div>
                  <div className="p-4 space-y-3">
                    {category.errors.map((error, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-red-500 line-through">
                            {error.wrong}
                          </span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {error.correct}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            error.frequency === "bardzo często"
                              ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                              : error.frequency === "często"
                              ? "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {error.frequency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Cennik poprawiania błędów
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Wybierz plan dopasowany do Twoich potrzeb
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Free
                </h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  0 zł
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />5 poprawek
                    dziennie
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    Do 500 znaków
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    Podstawowe poprawki
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <X className="w-4 h-4" />
                    Pełne wyjaśnienia
                  </li>
                </ul>
                <Link
                  to="/rejestracja"
                  className="block w-full py-3 text-center bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Załóż darmowe konto
                </Link>
              </div>

              {/* Premium */}
              <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-6 text-white relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  POPULARNY
                </div>
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold mb-1">29 zł</div>
                <p className="text-red-100 text-sm mb-4">/miesiąc</p>
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    100 poprawek dziennie
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Do 10 000 znaków
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Pełne wyjaśnienia
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Historia poprawek
                  </li>
                </ul>
                <Link
                  to="/rejestracja"
                  className="block w-full py-3 text-center bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors"
                >
                  Wybierz Premium
                </Link>
              </div>

              {/* Lifetime */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border-2 border-amber-500 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Infinity className="w-3 h-3" />
                  LIFETIME
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Lifetime
                </h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  299 zł
                </div>
                <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
                  Jednorazowo, na zawsze!
                </p>
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    Wszystko z Premium
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    Dożywotni dostęp
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    Bez limitów dziennych
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    VIP support
                  </li>
                </ul>
                <Link
                  to="/rejestracja"
                  className="block w-full py-3 text-center bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Kup Lifetime
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Często zadawane pytania
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Wszystko o poprawianiu błędów online
              </p>
            </div>

            <div className="space-y-4">
              {faq.map((item, index) => (
                <details
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="font-bold text-gray-900 dark:text-white pr-4">
                      {item.question}
                    </h3>
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 group-open:rotate-180 transition-transform">
                      <ChevronRight className="w-5 h-5 text-white transform rotate-90" />
                    </div>
                  </summary>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Powiązane strony */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Powiązane narzędzia
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/"
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Sprawdzanie interpunkcji
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Korektor przecinków i znaków
                </p>
              </Link>
              <Link
                to="/korektor-tekstu"
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Korektor tekstu
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kompleksowa korekta AI
                </p>
              </Link>
              <Link
                to="/sprawdzanie-ortografii"
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-red-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Sprawdzanie ortografii
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wykrywanie błędów pisowni
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-red-600 via-orange-600 to-red-700 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Popraw błędy w swoim tekście!
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Dołącz do tysięcy osób, które piszą bezbłędnie dzięki AI. Za
              darmo, bez zobowiązań.
            </p>
            <Link
              to="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all shadow-2xl hover:scale-105 text-lg"
            >
              Załóż darmowe konto
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-red-100 mt-6 text-sm">
              ✓ 5 poprawek dziennie za darmo &nbsp; ✓ Wyniki w 3 sekundy &nbsp;
              ✓ Lifetime 299 zł
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
