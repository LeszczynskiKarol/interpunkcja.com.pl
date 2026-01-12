// frontend/src/pages/landing/KorektorTekstu.tsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle,
  ArrowRight,
  Brain,
  Target,
  ChevronRight,
  Check,
  X,
  GraduationCap,
  Briefcase,
  PenTool,
  FileText,
  Mail,
  Infinity,
  Bot,
  Cpu,
  Eye,
  Wand2,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { Checker } from "../../components/Checker";

export function KorektorTekstu() {
  const { isAuthenticated } = useAuthStore();

  // Funkcje korektora
  const correctorFeatures = [
    {
      icon: Brain,
      title: "Sztuczna inteligencja Claude",
      description:
        "Najnowsza technologia AI od Anthropic. Korektor rozumie kontekst i znaczenie tekstu, nie tylko pojedyncze słowa.",
      color: "purple",
    },
    {
      icon: Eye,
      title: "Wykrywanie błędów ortograficznych",
      description:
        "Literówki, błędy w pisowni ó/u, rz/ż, ch/h oraz pisownia łączna i rozdzielna (naprawdę, na pewno).",
      color: "blue",
    },
    {
      icon: Target,
      title: "Korekta interpunkcji",
      description:
        "Brakujące przecinki przed 'że', 'który', 'gdy', 'ponieważ' oraz inne błędy w znakach interpunkcyjnych.",
      color: "green",
    },
    {
      icon: BookOpen,
      title: "Poprawa gramatyki",
      description:
        "Błędna odmiana rzeczowników, przymiotników i czasowników. Nieprawidłowe formy jak 'poszłem' czy 'wziąść'.",
      color: "orange",
    },
    {
      icon: Wand2,
      title: "Analiza stylistyczna",
      description:
        "Pleonazmy ('cofnąć się do tyłu'), powtórzenia, niezręczne konstrukcje składniowe.",
      color: "pink",
    },
    {
      icon: MessageSquare,
      title: "Wyjaśnienia każdej poprawki",
      description:
        "Przy każdym błędzie otrzymujesz wyjaśnienie zasady. Uczysz się na bieżąco i unikasz tych samych błędów.",
      color: "cyan",
    },
  ];

  // Dla kogo jest korektor
  const targetAudience = [
    {
      icon: GraduationCap,
      title: "Studenci i uczniowie",
      description: "Prace dyplomowe, eseje, wypracowania, referaty",
      examples: [
        "Praca licencjacka",
        "Praca magisterska",
        "Rozprawy doktorskie",
        "Projekty zaliczeniowe",
      ],
    },
    {
      icon: Briefcase,
      title: "Profesjonaliści",
      description: "Dokumenty biznesowe, raporty, oferty handlowe",
      examples: [
        "Raporty kwartalne",
        "Oferty handlowe",
        "Dokumentacja projektowa",
        "Prezentacje firmowe",
      ],
    },
    {
      icon: PenTool,
      title: "Twórcy treści",
      description: "Artykuły, blogi, teksty marketingowe, social media",
      examples: [
        "Artykuły blogowe",
        "Opisy produktów",
        "Newsletter",
        "Posty na LinkedIn",
      ],
    },
    {
      icon: Mail,
      title: "Każdy piszący",
      description: "Emaile, CV, listy motywacyjne, korespondencja",
      examples: [
        "CV i aplikacje",
        "Listy motywacyjne",
        "Oficjalne pisma",
        "Emaile biznesowe",
      ],
    },
  ];

  // Porównanie z konkurencją
  const competitorComparison = [
    {
      name: "Tradycyjne korektory",
      type: "Słownikowe",
      pros: ["Szybkie", "Darmowe w edytorach"],
      cons: [
        "Nie rozumieją kontekstu",
        "Słaba polska interpunkcja",
        "Brak wyjaśnień",
        "Pomijają błędy w poprawnych słowach",
      ],
    },
    {
      name: "LanguageTool",
      type: "Reguły + słownik",
      pros: ["Wiele języków", "Rozszerzenie do przeglądarki"],
      cons: [
        "Limity w wersji free",
        "Słaba polska interpunkcja",
        "Brak pełnych wyjaśnień",
      ],
    },
    {
      name: "Grammarly",
      type: "AI (angielski)",
      pros: ["Dobry dla angielskiego", "Integracje"],
      cons: ["Brak wsparcia dla polskiego", "Drogi", "Tylko angielski"],
    },
    {
      name: "Interpunkcja.com.pl",
      type: "AI Claude",
      pros: [
        "Specjalizacja w polskim",
        "AI rozumie kontekst",
        "Pełne wyjaśnienia",
        "Lifetime 299 zł",
      ],
      highlight: true,
    },
  ];

  // Jak działa korektor - kroki
  const howItWorks = [
    {
      step: "1",
      title: "Wklej tekst",
      description:
        "Skopiuj tekst z dokumentu Word, Google Docs, emaila lub innego źródła i wklej go do korektora.",
      icon: FileText,
    },
    {
      step: "2",
      title: "AI analizuje tekst",
      description:
        "Sztuczna inteligencja Claude przeanalizuje Twój tekst w ciągu 2-3 sekund, sprawdzając wszystkie aspekty języka.",
      icon: Cpu,
    },
    {
      step: "3",
      title: "Zobacz poprawki",
      description:
        "Otrzymasz listę wykrytych błędów z podświetleniem i wyjaśnieniem każdej poprawki wraz z zasadą.",
      icon: Eye,
    },
    {
      step: "4",
      title: "Skopiuj poprawiony tekst",
      description:
        "Jednym kliknięciem skopiujesz poprawiony tekst i wkleisz go z powrotem do swojego dokumentu.",
      icon: Check,
    },
  ];

  // Statystyki
  const stats = [
    { value: "99.2%", label: "Skuteczność wykrywania" },
    { value: "< 3 sek", label: "Czas analizy" },
    { value: "10 000", label: "Znaków na raz" },
    { value: "24/7", label: "Dostępność" },
  ];

  // Przykłady poprawek
  const correctionExamples = [
    {
      category: "Interpunkcja",
      before: "Myślę że to dobry pomysł",
      after: "Myślę, że to dobry pomysł",
      rule: "Przecinek przed spójnikiem 'że'",
    },
    {
      category: "Ortografia",
      before: "Chciałbym wziąść udział",
      after: "Chciałbym wziąć udział",
      rule: "Bezokolicznik bez 'ś'",
    },
    {
      category: "Pisownia łączna",
      before: "Na pewno przyjdę na prawdę",
      after: "Na pewno przyjdę naprawdę",
      rule: "'Na pewno' rozdzielnie, 'naprawdę' łącznie",
    },
    {
      category: "Gramatyka",
      before: "Wczoraj poszłem do sklepu",
      after: "Wczoraj poszedłem do sklepu",
      rule: "Forma 'poszedłem' dla rodzaju męskiego",
    },
    {
      category: "Stylistyka",
      before: "Cofnął się do tyłu",
      after: "Cofnął się",
      rule: "Pleonazm - 'cofnąć się' zawiera już kierunek",
    },
    {
      category: "Interpunkcja",
      before: "Jan który był zmęczony zasnął",
      after: "Jan, który był zmęczony, zasnął",
      rule: "Zdanie wtrącone w przecinkach",
    },
  ];

  // FAQ
  const faq = [
    {
      question: "Co to jest korektor tekstu online?",
      answer:
        "Korektor tekstu online to narzędzie do automatycznego sprawdzania i poprawiania błędów w tekstach. Nowoczesne korektory, takie jak nasz, wykorzystują sztuczną inteligencję do analizy kontekstu zdań, dzięki czemu wykrywają nie tylko literówki, ale również błędy gramatyczne, interpunkcyjne i stylistyczne.",
    },
    {
      question: "Czym różni się korektor AI od tradycyjnego?",
      answer:
        "Tradycyjne korektory porównują słowa ze słownikiem i stosują proste reguły. Korektor AI analizuje całe zdanie, rozumie jego znaczenie i wykrywa błędy wynikające z kontekstu. Na przykład AI rozpozna, że 'zamek' może być budowlą lub mechanizmem, i sprawdzi poprawność użycia w danym zdaniu.",
    },
    {
      question: "Jakie błędy wykrywa korektor tekstu?",
      answer:
        "Nasz korektor wykrywa: błędy ortograficzne (literówki, ó/u, rz/ż), błędy w pisowni łącznej i rozdzielnej, błędy interpunkcyjne (przecinki, kropki, średniki), błędy gramatyczne (odmiana, formy czasowników), oraz błędy stylistyczne (pleonazmy, powtórzenia).",
    },
    {
      question: "Czy korektor tekstu jest darmowy?",
      answer:
        "Tak, oferujemy darmowy plan z 5 sprawdzeniami dziennie (do 500 znaków każde). Dla intensywniejszego użycia polecamy plan Premium (29 zł/mies) lub Lifetime (299 zł jednorazowo) z limitem 10 000 znaków i nielimitowanymi sprawdzeniami.",
    },
    {
      question: "Czy mogę sprawdzić długi dokument?",
      answer:
        "W planie Free możesz sprawdzać do 500 znaków. Plan Premium i Lifetime pozwalają na sprawdzanie do 10 000 znaków na raz (około 5 stron A4). Dłuższe dokumenty możesz sprawdzać częściami.",
    },
    {
      question: "Czy korektor działa na telefonie?",
      answer:
        "Tak! Nasza strona jest w pełni responsywna. Możesz korzystać z korektora na smartfonie, tablecie i komputerze. Wystarczy przeglądarka z dostępem do internetu.",
    },
    {
      question: "Czy moje teksty są bezpieczne?",
      answer:
        "Absolutnie tak. Teksty są przetwarzane w czasie rzeczywistym i nie są przechowywane na serwerach po sprawdzeniu. Nie udostępniamy ich osobom trzecim. Twoja prywatność jest dla nas priorytetem.",
    },
    {
      question: "Czym różni się od korektora w Microsoft Word?",
      answer:
        "Wbudowany korektor w Word opiera się na słowniku i prostych regułach. Nasz korektor AI analizuje kontekst, rozumie znaczenie zdań i wykrywa subtelne błędy. Dodatkowo wyjaśniamy każdy błąd z odniesieniem do zasady, co pomaga w nauce poprawnej polszczyzny.",
    },
  ];

  // Schema.org
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Korektor Tekstu Online - Interpunkcja.com.pl",
    description:
      "Profesjonalny korektor tekstu online z AI. Sprawdza ortografię, interpunkcję i gramatykę. Sztuczna inteligencja Claude analizuje kontekst i wyjaśnia każdy błąd.",
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
      ratingCount: "2156",
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
          Korektor Tekstu Online Za Darmo | Korekta AI 2025 -
          Interpunkcja.com.pl
        </title>
        <meta
          name="description"
          content="✓ Profesjonalny korektor tekstu online z AI! Sprawdza ortografię, interpunkcję i gramatykę w 3 sekundy. Wyjaśnienia każdej poprawki. Darmowe 5 sprawdzeń dziennie."
        />
        <meta
          name="keywords"
          content="korektor tekstu, korektor tekstu online, korektor online, korekta tekstu, korektor polski, sprawdzanie tekstu, poprawianie tekstu, korektor AI, korektor ortografii, korektor interpunkcji"
        />
        <link
          rel="canonical"
          href="https://interpunkcja.com.pl/korektor-tekstu"
        />

        <meta
          property="og:title"
          content="Korektor Tekstu Online Za Darmo | AI 2025"
        />
        <meta
          property="og:description"
          content="Profesjonalny korektor tekstu z AI. Sprawdza ortografię, interpunkcję i gramatykę. Wyjaśnienia każdej poprawki!"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://interpunkcja.com.pl/korektor-tekstu"
        />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Interpunkcja.com.pl" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Korektor Tekstu Online Za Darmo | AI"
        />
        <meta
          name="twitter:description"
          content="Korektor tekstu AI - sprawdź tekst w 3 sekundy!"
        />

        <meta name="robots" content="index, follow" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors">
        {/* Hero Section */}
        <header className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link to="/" className="hover:text-purple-600">
                Strona główna
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-white font-medium">
                Korektor tekstu
              </span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6">
              <Bot className="w-4 h-4" />
              Korektor AI • Technologia Claude
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="text-purple-600 dark:text-purple-400">
                Korektor tekstu
              </span>{" "}
              online
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Profesjonalna{" "}
              <strong className="text-gray-900 dark:text-white">
                korekta tekstu w 3 sekundy
              </strong>
              . Sztuczna inteligencja sprawdzi ortografię, interpunkcję i
              gramatykę z wyjaśnieniem każdego błędu.
            </p>

            {/* Value props */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  AI Claude od Anthropic
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Analiza kontekstu
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Pełne wyjaśnienia
                </span>
              </div>
            </div>

            {/* CTA */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  to="/rejestracja"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                >
                  Wypróbuj korektor za darmo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/logowanie"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-all text-lg"
                >
                  Zaloguj się
                </Link>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✓ 5 sprawdzeń dziennie za darmo &nbsp; ✓ Wyniki w 3 sekundy &nbsp;
              ✓ Lifetime 299 zł
            </p>
          </div>
        </header>

        {/* Checker dla zalogowanych */}
        {isAuthenticated && (
          <section className="py-8 px-4 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                Wklej tekst do korekty
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
                  <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
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

        {/* Co to jest korektor tekstu */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Czym jest korektor tekstu online?
            </h2>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                <strong className="text-gray-900 dark:text-white">
                  Korektor tekstu online
                </strong>{" "}
                to zaawansowane narzędzie do automatycznego sprawdzania i
                poprawiania błędów językowych. W przeciwieństwie do prostych
                korektorów słownikowych, nasz korektor wykorzystuje{" "}
                <strong className="text-gray-900 dark:text-white">
                  sztuczną inteligencję Claude
                </strong>{" "}
                od Anthropic — jedną z najbardziej zaawansowanych technologii AI
                na świecie.
              </p>

              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                AI analizuje nie tylko pojedyncze słowa, ale{" "}
                <strong className="text-gray-900 dark:text-white">
                  rozumie kontekst całego zdania
                </strong>
                . Dzięki temu wykrywa błędy, które tradycyjne korektory pomijają
                — na przykład poprawne ortograficznie słowo użyte w złym
                kontekście lub subtelne błędy interpunkcyjne wymagające
                zrozumienia struktury zdania.
              </p>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800 my-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  Dlaczego nasz korektor jest wyjątkowy?
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Tradycyjne korektory:
                    </h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5" />
                        Porównują słowa ze słownikiem
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5" />
                        Stosują sztywne reguły
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5" />
                        Nie rozumieją znaczenia zdań
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-0.5" />
                        Brak wyjaśnień poprawek
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Korektor AI Claude:
                    </h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        Analizuje kontekst całego tekstu
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        Rozumie znaczenie i intencje
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        Wykrywa subtelne błędy
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        Wyjaśnia każdą poprawkę
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Funkcje korektora */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Co sprawdza korektor tekstu?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Kompleksowa analiza języka polskiego w jednym narzędziu
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {correctorFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      feature.color === "purple"
                        ? "bg-purple-100 dark:bg-purple-900/50"
                        : feature.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : feature.color === "green"
                        ? "bg-green-100 dark:bg-green-900/50"
                        : feature.color === "orange"
                        ? "bg-orange-100 dark:bg-orange-900/50"
                        : feature.color === "pink"
                        ? "bg-pink-100 dark:bg-pink-900/50"
                        : "bg-cyan-100 dark:bg-cyan-900/50"
                    }`}
                  >
                    <feature.icon
                      className={`w-6 h-6 ${
                        feature.color === "purple"
                          ? "text-purple-600 dark:text-purple-400"
                          : feature.color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : feature.color === "green"
                          ? "text-green-600 dark:text-green-400"
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

        {/* Przykłady poprawek */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Przykłady poprawek korektora
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Zobacz, jak AI poprawia różne typy błędów
              </p>
            </div>

            <div className="space-y-4">
              {correctionExamples.map((example, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium">
                    <Target className="w-4 h-4" />
                    {example.category}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                          Przed
                        </span>
                        <p className="text-red-600 dark:text-red-400 line-through">
                          {example.before}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 hidden md:block" />
                      <div className="flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                          Po
                        </span>
                        <p className="text-green-600 dark:text-green-400 font-medium">
                          {example.after}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Zasada:</strong> {example.rule}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jak działa */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Jak działa korektor tekstu?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Korekta w 4 prostych krokach
              </p>
            </div>

            <div className="space-y-6">
              {howItWorks.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dla kogo */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Dla kogo jest korektor tekstu?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Każdy piszący po polsku skorzysta z profesjonalnej korekty
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {targetAudience.map((audience, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                    <audience.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {audience.description}
                  </p>
                  <ul className="space-y-1">
                    {audience.examples.map((example, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        <Check className="w-3 h-3 text-purple-500" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Porównanie */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Porównanie z innymi korektorami
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Zobacz, dlaczego warto wybrać Interpunkcja.com.pl
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {competitorComparison.map((tool, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-5 border-2 ${
                    tool.highlight
                      ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500"
                      : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <h3
                    className={`font-bold mb-1 ${
                      tool.highlight
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {tool.type}
                  </p>
                  <div className="mb-3">
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">
                      Zalety
                    </span>
                    <ul className="mt-1 space-y-1">
                      {tool.pros.map((pro, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                        >
                          <Check className="w-3 h-3 text-green-500" />
                          {pro}
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
                Cennik korektora tekstu
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
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  POPULARNY
                </div>
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold mb-1">29 zł</div>
                <p className="text-purple-100 text-sm mb-4">/miesiąc</p>
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
                  className="block w-full py-3 text-center bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Wybierz Premium
                </Link>
              </div>

              {/* Lifetime */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-amber-500 relative">
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
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Często zadawane pytania
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Wszystko o korektorze tekstu online
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
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 group-open:rotate-180 transition-transform">
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
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors"
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
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Sprawdzanie ortografii
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wykrywanie błędów ortograficznych
                </p>
              </Link>
              <Link
                to="/sprawdzanie-pisowni"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Sprawdzanie pisowni
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kompleksowa korekta tekstu
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Wypróbuj korektor tekstu AI!
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Dołącz do tysięcy osób, które piszą bezbłędnie dzięki
              najnowocześniejszej technologii AI. Za darmo, bez zobowiązań.
            </p>
            <Link
              to="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all shadow-2xl hover:scale-105 text-lg"
            >
              Załóż darmowe konto
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-purple-100 mt-6 text-sm">
              ✓ 5 sprawdzeń dziennie za darmo &nbsp; ✓ Wyniki w 3 sekundy &nbsp;
              ✓ Lifetime 299 zł
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
