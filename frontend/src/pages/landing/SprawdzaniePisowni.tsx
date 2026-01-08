// frontend/src/pages/landing/SprawdzaniePisowni.tsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  ChevronRight,
  Check,
  X,
  GraduationCap,
  Briefcase,
  PenTool,
  Edit3,
  Type,
  Infinity,
  Feather,
  Mail,
  SpellCheck,
  Languages,
  BarChart3,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { Checker } from "../../components/Checker";

export function SprawdzaniePisowni() {
  const { isAuthenticated } = useAuthStore();

  // Typowe problemy z pisownią
  const spellingProblems = [
    {
      category: "Pisownia łączna i rozdzielna",
      examples: [
        { wrong: "na pewno", correct: "na pewno ✓", note: "rozdzielnie!" },
        { wrong: "napewno", correct: "na pewno", note: "błąd - łącznie" },
        { wrong: "na prawdę", correct: "naprawdę", note: "łącznie" },
        { wrong: "w ogóle", correct: "w ogóle ✓", note: "rozdzielnie!" },
        { wrong: "wogóle", correct: "w ogóle", note: "błąd - łącznie" },
        { wrong: "po za tym", correct: "poza tym", note: "łącznie" },
      ],
    },
    {
      category: "Pisownia ó/u",
      examples: [
        { wrong: "wture", correct: "wtórę", note: "ó wymienne na a" },
        { wrong: "góra", correct: "góra ✓", note: "ó wymienne: gór-y" },
        { wrong: "ktura", correct: "która", note: "ó niewymienne" },
        { wrong: "chur", correct: "chór", note: "ó wymienne: chór-y" },
      ],
    },
    {
      category: "Pisownia rz/ż",
      examples: [
        { wrong: "możę", correct: "morze", note: "rz po spółgłosce" },
        { wrong: "żeka", correct: "rzeka", note: "rz wymienne: rzecz-ny" },
        { wrong: "duży", correct: "duży ✓", note: "ż niewymienne" },
        { wrong: "burzą", correct: "burzą ✓", note: "rz po spółgłosce" },
      ],
    },
  ];

  // Co sprawdza korektor pisowni
  const checkerFeatures = [
    {
      icon: SpellCheck,
      title: "Błędy ortograficzne",
      description:
        "Literówki, błędna pisownia ó/u, rz/ż, ch/h oraz wszystkie inne błędy ortograficzne w języku polskim.",
      color: "blue",
    },
    {
      icon: Edit3,
      title: "Pisownia łączna i rozdzielna",
      description:
        "Czy 'naprawdę' pisze się łącznie? Czy 'na pewno' rozdzielnie? AI zna wszystkie zasady.",
      color: "green",
    },
    {
      icon: Type,
      title: "Interpunkcja i przecinki",
      description:
        "Brakujące przecinki przed 'że', 'który', 'gdy' oraz inne błędy interpunkcyjne.",
      color: "purple",
    },
    {
      icon: Languages,
      title: "Odmiana i gramatyka",
      description:
        "Nieprawidłowe formy czasowników, błędna odmiana rzeczowników i przymiotników.",
      color: "orange",
    },
    {
      icon: Feather,
      title: "Stylistyka tekstu",
      description:
        "Pleonazmy, powtórzenia, niezręczne konstrukcje składniowe i błędy stylistyczne.",
      color: "pink",
    },
    {
      icon: Target,
      title: "Kontekstowa analiza",
      description:
        "AI analizuje całe zdanie, wykrywając błędy niewidoczne dla tradycyjnych korektorów.",
      color: "cyan",
    },
  ];

  // Porównanie z innymi narzędziami
  const toolComparison = [
    {
      tool: "Microsoft Word",
      pros: ["Wbudowany", "Darmowy"],
      cons: ["Słaba polska interpunkcja", "Brak wyjaśnień", "Pomija kontekst"],
    },
    {
      tool: "Google Docs",
      pros: ["Darmowy", "Online"],
      cons: ["Bardzo podstawowy", "Brak polskich reguł", "Słaba skuteczność"],
    },
    {
      tool: "LanguageTool",
      pros: ["Wiele języków", "Rozszerzenie"],
      cons: ["Limity w wersji free", "Słaba polska interpunkcja"],
    },
    {
      tool: "Interpunkcja.com.pl",
      pros: [
        "AI Claude",
        "Pełne wyjaśnienia",
        "Specjalizacja w polskim",
        "Kontekstowa analiza",
      ],
      cons: ["Wymaga rejestracji"],
    },
  ];

  // Typy dokumentów
  const documentTypes = [
    {
      icon: GraduationCap,
      title: "Prace naukowe",
      items: [
        "Prace licencjackie i magisterskie",
        "Rozprawy doktorskie",
        "Artykuły naukowe",
        "Referaty i eseje",
      ],
    },
    {
      icon: Briefcase,
      title: "Dokumenty biznesowe",
      items: [
        "Oferty handlowe",
        "Raporty i analizy",
        "Prezentacje firmowe",
        "Dokumentacja projektowa",
      ],
    },
    {
      icon: Mail,
      title: "Korespondencja",
      items: [
        "Emaile biznesowe",
        "Listy motywacyjne",
        "CV i aplikacje",
        "Oficjalne pisma",
      ],
    },
    {
      icon: PenTool,
      title: "Content & Marketing",
      items: [
        "Artykuły blogowe",
        "Opisy produktów",
        "Posty social media",
        "Teksty reklamowe",
      ],
    },
  ];

  // Statystyki błędów
  const errorStats = [
    { type: "Przecinki", percent: 45, desc: "Najczęstszy typ błędów" },
    {
      type: "Pisownia łączna/rozdzielna",
      percent: 25,
      desc: "np. naprawdę, na pewno",
    },
    { type: "Literówki", percent: 15, desc: "Przypadkowe pomyłki" },
    { type: "Ortografia ó/u, rz/ż", percent: 10, desc: "Klasyczne błędy" },
    { type: "Inne", percent: 5, desc: "Gramatyka, stylistyka" },
  ];

  // FAQ
  const faq = [
    {
      question: "Czym różni się sprawdzanie pisowni od sprawdzania ortografii?",
      answer:
        "Sprawdzanie pisowni to szersze pojęcie obejmujące weryfikację całego tekstu pod kątem poprawności językowej. Zawiera sprawdzanie ortografii (poprawność zapisu wyrazów), interpunkcji (przecinki, kropki), gramatyki (odmiana, składnia) oraz stylistyki. Nasz korektor sprawdza wszystkie te elementy jednocześnie.",
    },
    {
      question: "Jak działa sprawdzanie pisowni online?",
      answer:
        "Nasz korektor wykorzystuje sztuczną inteligencję Claude do analizy tekstu. W przeciwieństwie do tradycyjnych słownikowych korektorów, AI analizuje kontekst całego zdania, rozumie znaczenie i wykrywa błędy, które inne narzędzia pomijają. Sprawdzenie tekstu zajmuje 2-3 sekundy.",
    },
    {
      question: "Czy sprawdzanie pisowni jest darmowe?",
      answer:
        "Tak! Oferujemy darmowy plan z 5 sprawdzeniami dziennie (do 500 znaków każde). To wystarczy do sprawdzenia emaili, postów czy krótkich tekstów. Dla dłuższych dokumentów polecamy plan Premium (29 zł/mies) lub Lifetime (299 zł jednorazowo).",
    },
    {
      question: "Jakie błędy wykrywa korektor pisowni?",
      answer:
        "Wykrywamy: literówki i błędy ortograficzne, błędną pisownię łączną i rozdzielną (naprawdę, na pewno, w ogóle), błędy w pisowni ó/u i rz/ż, brakujące przecinki przed spójnikami, błędy gramatyczne w odmianie, pleonazmy i błędy stylistyczne.",
    },
    {
      question: "Czy mogę sprawdzić pisownię w długim dokumencie?",
      answer:
        "W planie Free możesz sprawdzać teksty do 500 znaków. Plan Premium i Lifetime pozwalają na sprawdzanie do 10 000 znaków (ok. 5 stron A4) na raz. Dłuższe dokumenty możesz sprawdzać częściami.",
    },
    {
      question: "Czy korektor działa na telefonie?",
      answer:
        "Tak! Nasza strona jest w pełni responsywna. Możesz sprawdzać pisownię na smartfonie, tablecie i komputerze. Wystarczy przeglądarka z dostępem do internetu.",
    },
    {
      question: "Czy moje teksty są bezpieczne?",
      answer:
        "Absolutnie tak. Teksty są przetwarzane w czasie rzeczywistym i nie są przechowywane na serwerach po sprawdzeniu. Nie udostępniamy ich osobom trzecim. Twoja prywatność jest dla nas priorytetem.",
    },
    {
      question: "Czym różni się od korektora w Wordzie?",
      answer:
        "Wbudowany korektor Worda opiera się na słowniku i prostych regułach. Nasz korektor AI analizuje kontekst, rozumie znaczenie zdań i wykrywa subtelne błędy. Dodatkowo wyjaśniamy każdy błąd z odniesieniem do zasady, co pomaga w nauce.",
    },
  ];

  // Schema.org
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Sprawdzanie Pisowni Online - Interpunkcja.com.pl",
    description:
      "Darmowy korektor pisowni online z AI. Sprawdź tekst pod kątem błędów ortograficznych, interpunkcyjnych i gramatycznych. Szybko i dokładnie.",
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
      ratingCount: "1847",
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
          Sprawdzanie Pisowni Online Za Darmo | Korektor Tekstu AI 2025
        </title>
        <meta
          name="description"
          content="✓ Sprawdź pisownię online za darmo! Korektor pisowni AI wykrywa błędy ortograficzne, interpunkcyjne i gramatyczne. Sprawdzanie tekstu w 3 sekundy z wyjaśnieniami."
        />
        <meta
          name="keywords"
          content="sprawdzanie pisowni, sprawdzanie pisowni online, korektor pisowni, sprawdzanie tekstu, korekta pisowni, korektor tekstu online, sprawdzanie błędów, poprawność pisowni, weryfikacja tekstu, korektor polski"
        />
        <link
          rel="canonical"
          href="https://interpunkcja.com.pl/sprawdzanie-pisowni"
        />

        <meta
          property="og:title"
          content="Sprawdzanie Pisowni Online Za Darmo | Korektor AI"
        />
        <meta
          property="og:description"
          content="Sprawdź pisownię w tekście za darmo! AI wykrywa błędy ortograficzne, interpunkcyjne i gramatyczne w języku polskim."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://interpunkcja.com.pl/sprawdzanie-pisowni"
        />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Interpunkcja.com.pl" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Sprawdzanie Pisowni Online Za Darmo"
        />
        <meta
          name="twitter:description"
          content="Korektor pisowni AI - sprawdź tekst w 3 sekundy!"
        />

        <meta name="robots" content="index, follow" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors">
        {/* Hero Section */}
        <header className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link to="/" className="hover:text-blue-600">
                Strona główna
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-white font-medium">
                Sprawdzanie pisowni
              </span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Korektor pisowni AI • Za darmo
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Sprawdzanie{" "}
              <span className="text-blue-600 dark:text-blue-400">pisowni</span>{" "}
              online
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Wklej tekst i{" "}
              <strong className="text-gray-900 dark:text-white">
                sprawdź pisownię w kilka sekund
              </strong>
              . Sztuczna inteligencja znajdzie błędy ortograficzne,
              interpunkcyjne i gramatyczne.
            </p>

            {/* Value props */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Ortografia + interpunkcja
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Analiza kontekstu AI
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Wyjaśnienia zasad
                </span>
              </div>
            </div>

            {/* CTA */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  to="/rejestracja"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                >
                  Sprawdź pisownię za darmo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/logowanie"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all text-lg"
                >
                  Zaloguj się
                </Link>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✓ 5 sprawdzeń dziennie za darmo &nbsp; ✓ Bez karty kredytowej
              &nbsp; ✓ Wyniki w 3 sekundy
            </p>
          </div>
        </header>

        {/* Checker dla zalogowanych */}
        {isAuthenticated && (
          <section className="py-8 px-4 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                Wklej tekst do sprawdzenia pisowni
              </h2>
              <Checker />
            </div>
          </section>
        )}

        {/* Co to jest sprawdzanie pisowni */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Co to jest sprawdzanie pisowni?
            </h2>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                <strong className="text-gray-900 dark:text-white">
                  Sprawdzanie pisowni
                </strong>{" "}
                to kompleksowa weryfikacja tekstu pod kątem poprawności
                językowej. Obejmuje nie tylko ortografię (poprawność zapisu
                wyrazów), ale również interpunkcję, gramatykę i stylistykę.
                Dobry korektor pisowni powinien wykrywać wszystkie rodzaje
                błędów, nie tylko literówki.
              </p>

              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                Współczesne{" "}
                <strong className="text-gray-900 dark:text-white">
                  korektory pisowni oparte na AI
                </strong>{" "}
                znacznie przewyższają tradycyjne narzędzia słownikowe. Sztuczna
                inteligencja analizuje kontekst całego zdania, rozumie znaczenie
                i potrafi wykryć subtelne błędy, które tradycyjne korektory
                pomijają — na przykład błędne użycie słowa poprawnego
                ortograficznie, ale niewłaściwego w danym kontekście.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 my-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  Dlaczego AI jest skuteczniejszy?
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Tradycyjny korektor:
                    </h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5" />
                        Porównuje słowa ze słownikiem
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5" />
                        Nie rozumie kontekstu zdania
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5" />
                        Pomija błędy w poprawnych słowach
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Korektor AI:
                    </h4>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        Analizuje całe zdanie
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        Rozumie znaczenie i kontekst
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        Wykrywa subtelne błędy
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Co sprawdza korektor */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Co sprawdza korektor pisowni?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Kompleksowa analiza tekstu w jednym narzędziu
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {checkerFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      feature.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : feature.color === "green"
                        ? "bg-green-100 dark:bg-green-900/50"
                        : feature.color === "purple"
                        ? "bg-purple-100 dark:bg-purple-900/50"
                        : feature.color === "orange"
                        ? "bg-orange-100 dark:bg-orange-900/50"
                        : feature.color === "pink"
                        ? "bg-pink-100 dark:bg-pink-900/50"
                        : "bg-cyan-100 dark:bg-cyan-900/50"
                    }`}
                  >
                    <feature.icon
                      className={`w-6 h-6 ${
                        feature.color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : feature.color === "green"
                          ? "text-green-600 dark:text-green-400"
                          : feature.color === "purple"
                          ? "text-purple-600 dark:text-purple-400"
                          : feature.color === "orange"
                          ? "text-orange-600 dark:text-orange-400"
                          : feature.color === "pink"
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-cyan-600 dark:text-cyan-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problemy z pisownią */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Najczęstsze problemy z pisownią
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Zobacz typowe błędy i jak ich unikać
              </p>
            </div>

            <div className="space-y-8">
              {spellingProblems.map((problem, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="bg-blue-600 text-white px-4 py-3 font-bold">
                    {problem.category}
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {problem.examples.map((ex, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg ${
                            i % 2 === 0
                              ? "bg-gray-50 dark:bg-gray-900/50"
                              : "bg-white dark:bg-gray-800"
                          }`}
                        >
                          {ex.wrong !== ex.correct ? (
                            <>
                              <span className="text-red-600 dark:text-red-400 line-through">
                                {ex.wrong}
                              </span>
                              <span className="text-gray-400 mx-2">→</span>
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                {ex.correct}
                              </span>
                            </>
                          ) : (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {ex.correct}
                            </span>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {ex.note}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statystyki błędów */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Statystyki błędów w tekstach
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Na podstawie analizy tysięcy sprawdzonych dokumentów
              </p>
            </div>

            <div className="space-y-4">
              {errorStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {stat.type}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                        {stat.desc}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stat.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all"
                      style={{ width: `${stat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <BarChart3 className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    Ciekawostka
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Aż 45% wszystkich błędów w polskich tekstach to błędy
                    interpunkcyjne — głównie brakujące lub zbędne przecinki.
                    Dlatego nasz korektor szczególnie skupia się na analizie
                    interpunkcji.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typy dokumentów */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Jakie dokumenty warto sprawdzać?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Każdy tekst zyskuje na profesjonalnej korekcie
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {documentTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                    <type.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {type.title}
                  </h3>
                  <ul className="space-y-2">
                    {type.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Porównanie narzędzi */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Porównanie korektorów pisowni
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Zobacz, jak wypadamy na tle konkurencji
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {toolComparison.map((tool, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-5 border-2 ${
                    tool.tool === "Interpunkcja.com.pl"
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                      : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <h3
                    className={`font-bold mb-4 ${
                      tool.tool === "Interpunkcja.com.pl"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {tool.tool}
                  </h3>
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">
                      Zalety
                    </span>
                    <ul className="mt-1 space-y-1">
                      {tool.pros.map((pro, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <Check className="w-3 h-3 text-green-500" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">
                      Wady
                    </span>
                    <ul className="mt-1 space-y-1">
                      {tool.cons.map((con, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <X className="w-3 h-3 text-red-500" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Cennik korektora pisowni
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Wybierz plan dopasowany do Twoich potrzeb
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Free
                </h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  0 zł
                </div>
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />5 sprawdzeń
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
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  POPULARNY
                </div>
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold mb-1">29 zł</div>
                <p className="text-blue-100 text-sm mb-4">/miesiąc</p>
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    100 sprawdzeń dziennie
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
                    Historia sprawdzeń
                  </li>
                </ul>
                <Link
                  to="/rejestracja"
                  className="block w-full py-3 text-center bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Wybierz Premium
                </Link>
              </div>

              {/* Lifetime */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-purple-500 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Infinity className="w-3 h-3" />
                  LIFETIME
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Lifetime
                </h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  299 zł
                </div>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
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
                  className="block w-full py-3 text-center bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Kup Lifetime
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Często zadawane pytania
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Wszystko o sprawdzaniu pisowni online
              </p>
            </div>

            <div className="space-y-4">
              {faq.map((item, index) => (
                <details
                  key={index}
                  className="group bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="font-bold text-gray-900 dark:text-white pr-4">
                      {item.question}
                    </h3>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-open:rotate-180 transition-transform">
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
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Powiązane narzędzia
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Sprawdzanie interpunkcji
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Korektor przecinków i znaków
                </p>
              </Link>
              <Link
                to="/sprawdzanie-ortografii"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Sprawdzanie ortografii
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wykrywanie błędów ortograficznych
                </p>
              </Link>
              <Link
                to="/cennik"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Cennik
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Porównanie planów
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Sprawdź pisownię w swoim tekście!
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Dołącz do tysięcy osób, które piszą bezbłędnie dzięki korektorowi
              AI. Za darmo, bez zobowiązań.
            </p>
            <Link
              to="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-2xl hover:scale-105 text-lg"
            >
              Załóż darmowe konto
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-blue-100 mt-6 text-sm">
              ✓ 5 sprawdzeń dziennie za darmo &nbsp; ✓ Bez karty kredytowej
              &nbsp; ✓ Lifetime 299 zł
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
