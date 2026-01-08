// frontend/src/pages/landing/SprawdzanieOrtografii.tsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  BookOpen,
  ChevronRight,
  Check,
  X,
  Lightbulb,
  GraduationCap,
  Briefcase,
  PenTool,
  Users,
  Globe,
  MessageSquare,
  Clock,
  Award,
  TrendingUp,
  Edit3,
  Type,
  Infinity,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { Checker } from "../../components/Checker";

export function SprawdzanieOrtografii() {
  const { isAuthenticated } = useAuthStore();

  // Najczęstsze błędy ortograficzne
  const commonMistakes = [
    {
      wrong: "wziąść",
      correct: "wziąć",
      rule: "Czasownik bez 'ś' w bezokoliczniku",
    },
    {
      wrong: "włączyć",
      correct: "włączyć",
      rule: "Poprawna pisownia z 'ą'",
    },
    {
      wrong: "ponieważ",
      correct: "ponieważ",
      rule: "Pisownia łączna spójnika",
    },
    {
      wrong: "nie mniej jednak",
      correct: "niemniej jednak",
      rule: "Pisownia łączna przysłówka",
    },
    {
      wrong: "z przed",
      correct: "sprzed",
      rule: "Pisownia łączna przyimka złożonego",
    },
    {
      wrong: "na prawdę",
      correct: "naprawdę",
      rule: "Pisownia łączna przysłówka",
    },
    {
      wrong: "w razie gdyby",
      correct: "w razie gdyby / na wypadek gdyby",
      rule: "Poprawna konstrukcja składniowa",
    },
    {
      wrong: "być może że",
      correct: "być może",
      rule: "Zbędne 'że' po 'być może'",
    },
  ];

  // Kategorie błędów
  const errorCategories = [
    {
      icon: Type,
      title: "Błędy ortograficzne",
      description:
        "Nieprawidłowa pisownia wyrazów, literówki, błędy w zapisie ó/u, rz/ż, ch/h",
      examples: ["żółty → żułty", "chodzić → hodzić", "góra → gura"],
    },
    {
      icon: Edit3,
      title: "Błędy interpunkcyjne",
      description:
        "Brakujące lub zbędne przecinki, nieprawidłowe użycie znaków interpunkcyjnych",
      examples: [
        "Myślę że → Myślę, że",
        "Jan, który → Jan który",
        "Tak! → Tak.",
      ],
    },
    {
      icon: BookOpen,
      title: "Błędy gramatyczne",
      description:
        "Nieprawidłowa odmiana, błędy w składni, złe formy czasowników",
      examples: [
        "poszłem → poszedłem",
        "włanczam → włączam",
        "przyszłem → przyszedłem",
      ],
    },
    {
      icon: Target,
      title: "Błędy stylistyczne",
      description:
        "Pleonazmy, powtórzenia, niewłaściwy rejestr, niezręczne konstrukcje",
      examples: [
        "cofnąć się do tyłu → cofnąć się",
        "aktualna teraźniejszość → teraźniejszość",
      ],
    },
  ];

  // Dlaczego warto sprawdzać ortografię
  const benefits = [
    {
      icon: Award,
      title: "Profesjonalny wizerunek",
      description:
        "Bezbłędne teksty budują zaufanie i wiarygodność. Błędy ortograficzne mogą zniechęcić klientów, pracodawców czy czytelników.",
    },
    {
      icon: TrendingUp,
      title: "Lepsze SEO i widoczność",
      description:
        "Teksty bez błędów są lepiej oceniane przez algorytmy Google. Poprawna ortografia to podstawa skutecznego content marketingu.",
    },
    {
      icon: GraduationCap,
      title: "Wyższe oceny w nauce",
      description:
        "Prace akademickie, wypracowania i projekty bez błędów ortograficznych są lepiej oceniane przez nauczycieli i wykładowców.",
    },
    {
      icon: Briefcase,
      title: "Sukces zawodowy",
      description:
        "CV, list motywacyjny czy email biznesowy z błędami może przekreślić Twoje szanse. Sprawdzanie ortografii to must-have.",
    },
    {
      icon: Clock,
      title: "Oszczędność czasu",
      description:
        "Automatyczne sprawdzanie ortografii AI zajmuje sekundy, podczas gdy ręczna korekta może trwać godziny.",
    },
    {
      icon: Lightbulb,
      title: "Nauka przez praktykę",
      description:
        "Dzięki wyjaśnieniom każdego błędu uczysz się na bieżąco i unikasz tych samych pomyłek w przyszłości.",
    },
  ];

  // Porównanie z konkurencją
  const comparison = [
    {
      feature: "Sprawdzanie ortografii polskiej",
      others: "Ograniczone",
      us: "Pełne wsparcie",
    },
    {
      feature: "Sprawdzanie interpunkcji",
      others: "Podstawowe",
      us: "Zaawansowane AI",
    },
    { feature: "Wyjaśnienia błędów", others: "Brak", us: "Szczegółowe" },
    {
      feature: "Kontekstowa analiza",
      others: "Słaba",
      us: "AI rozumie kontekst",
    },
    { feature: "Długość tekstu", others: "500-1000 znaków", us: "Do 10 000" },
    {
      feature: "Szybkość sprawdzania",
      others: "5-10 sekund",
      us: "2-3 sekundy",
    },
    { feature: "Opcja lifetime", others: "Brak", us: "299 zł na zawsze" },
  ];

  // FAQ specyficzne dla ortografii
  const faq = [
    {
      question: "Jak działa sprawdzanie ortografii online?",
      answer:
        "Nasz korektor ortografii wykorzystuje zaawansowaną sztuczną inteligencję Claude do analizy tekstu. AI analizuje każde słowo w kontekście całego zdania, wykrywając nie tylko literówki, ale też błędy wynikające z nieznajomości zasad ortograficznych. Dzięki temu wykrywamy błędy, które omijają tradycyjne słownikowe korektory.",
    },
    {
      question: "Czy korektor sprawdza tylko ortografię czy też interpunkcję?",
      answer:
        "Nasz korektor sprawdza zarówno ortografię, jak i interpunkcję. To kompleksowe narzędzie do korekty tekstu, które wykrywa brakujące przecinki, błędne użycie znaków interpunkcyjnych oraz klasyczne błędy ortograficzne. Każda poprawka zawiera wyjaśnienie zasady.",
    },
    {
      question: "Jakie błędy ortograficzne wykrywa AI?",
      answer:
        "AI wykrywa szeroki zakres błędów: literówki i przejęzyczenia, błędy w pisowni ó/u, rz/ż, ch/h, błędną pisownię łączną i rozdzielną (np. 'naprawdę' vs 'na prawdę'), błędy w odmianie wyrazów, niepoprawne formy czasowników (np. 'wziąść' zamiast 'wziąć'), a także błędy w pisowni nazw własnych.",
    },
    {
      question: "Czy sprawdzanie ortografii jest darmowe?",
      answer:
        "Tak! Oferujemy darmowy plan z 5 sprawdzeniami dziennie do 500 znaków. To wystarczy do sprawdzenia krótkich tekstów, emaili czy postów. Dla dłuższych dokumentów polecamy plan Premium (29 zł/mies) lub Lifetime (299 zł jednorazowo).",
    },
    {
      question: "Czy mogę sprawdzić długi dokument, np. pracę magisterską?",
      answer:
        "W planie Premium i Lifetime możesz sprawdzać teksty do 10 000 znaków na raz (ok. 5 stron A4). Dłuższe dokumenty możesz sprawdzać częściami. Plan Lifetime nie ma dziennych limitów sprawdzeń, więc możesz sprawdzić nawet bardzo długą pracę.",
    },
    {
      question: "Czym różni się od korektora w Microsoft Word?",
      answer:
        "Wbudowane korektory w edytorach tekstu opierają się głównie na słownikach i prostych regułach. Nasz korektor AI analizuje kontekst całego zdania, rozumie znaczenie i wykrywa błędy, które tradycyjne narzędzia pomijają. Dodatkowo wyjaśniamy każdy błąd, co pomaga w nauce.",
    },
    {
      question: "Czy moje teksty są bezpieczne i prywatne?",
      answer:
        "Tak, Twoje teksty są w pełni bezpieczne. Przetwarzamy je w czasie rzeczywistym i nie przechowujemy ich na serwerach. Po zamknięciu strony wszystkie dane są usuwane. Nie udostępniamy tekstów osobom trzecim.",
    },
    {
      question: "Czy korektor działa na telefonie?",
      answer:
        "Tak! Nasza strona jest w pełni responsywna i działa na smartfonach i tabletach. Możesz sprawdzać ortografię z dowolnego urządzenia z dostępem do internetu.",
    },
  ];

  // Przypadki użycia
  const useCases = [
    {
      icon: GraduationCap,
      title: "Prace akademickie",
      description:
        "Sprawdź pracę licencjacką, magisterską, esej czy referat przed oddaniem",
    },
    {
      icon: Briefcase,
      title: "Dokumenty biznesowe",
      description:
        "Oferty handlowe, raporty, prezentacje, dokumentacja firmowa",
    },
    {
      icon: MessageSquare,
      title: "Komunikacja email",
      description:
        "Ważne emaile do klientów, partnerów biznesowych czy przełożonych",
    },
    {
      icon: PenTool,
      title: "Content marketing",
      description: "Artykuły blogowe, opisy produktów, teksty na stronę WWW",
    },
    {
      icon: Users,
      title: "Social media",
      description: "Posty na LinkedIn, Facebook, Instagram, Twitter",
    },
    {
      icon: Globe,
      title: "Tłumaczenia",
      description:
        "Weryfikacja tłumaczeń na język polski pod kątem poprawności",
    },
  ];

  // Statystyki
  const stats = [
    { value: "10 000+", label: "Sprawdzonych tekstów" },
    { value: "99.2%", label: "Wykrytych błędów" },
    { value: "< 3 sek", label: "Czas analizy" },
    { value: "100%", label: "Prywatności" },
  ];

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Sprawdzanie Ortografii Online - Interpunkcja.com.pl",
    description:
      "Darmowy korektor ortografii online z AI. Sprawdź pisownię tekstu, wykryj błędy ortograficzne i interpunkcyjne. Sztuczna inteligencja Claude.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PLN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
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
          Sprawdzanie Ortografii Online Za Darmo | Korektor AI 2025 -
          Interpunkcja.com.pl
        </title>
        <meta
          name="description"
          content="✓ Sprawdź ortografię online za darmo! Korektor ortografii AI wykrywa błędy w pisowni, literówki i błędy interpunkcyjne. Sprawdzanie pisowni w 3 sekundy z wyjaśnieniami."
        />
        <meta
          name="keywords"
          content="sprawdzanie ortografii, sprawdzanie ortografii online, korektor ortografii, sprawdzanie pisowni, korekta ortografii, sprawdzanie błędów ortograficznych, korektor tekstu, sprawdzanie tekstu online, korektor pisowni, błędy ortograficzne"
        />
        <link
          rel="canonical"
          href="https://interpunkcja.com.pl/sprawdzanie-ortografii"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Sprawdzanie Ortografii Online Za Darmo | Korektor AI"
        />
        <meta
          property="og:description"
          content="Sprawdź ortografię w tekście za darmo! AI wykrywa błędy pisowni, literówki i błędy interpunkcyjne. Wyjaśnienia każdej poprawki."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://interpunkcja.com.pl/sprawdzanie-ortografii"
        />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Interpunkcja.com.pl" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Sprawdzanie Ortografii Online Za Darmo"
        />
        <meta
          name="twitter:description"
          content="Korektor ortografii AI - sprawdź pisownię w 3 sekundy!"
        />

        <meta name="robots" content="index, follow" />

        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors">
        {/* Hero Section */}
        <header className="relative py-16 md:py-24 px-4 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link to="/" className="hover:text-blue-600">
                Strona główna
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-white font-medium">
                Sprawdzanie ortografii
              </span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Korektor ortografii AI • Darmowy
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Sprawdzanie{" "}
              <span className="text-green-600 dark:text-green-400">
                ortografii
              </span>{" "}
              online
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Wklej tekst i{" "}
              <strong className="text-gray-900 dark:text-white">
                sprawdź pisownię w 3 sekundy
              </strong>
              . Sztuczna inteligencja wykryje błędy ortograficzne, literówki i
              błędy interpunkcyjne.
            </p>

            {/* Value props */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Wykrywa literówki
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Sprawdza interpunkcję
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Wyjaśnia każdy błąd
                </span>
              </div>
            </div>

            {/* CTA */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  to="/rejestracja"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                >
                  Sprawdź ortografię za darmo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/logowanie"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 transition-all text-lg"
                >
                  Mam już konto
                </Link>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✓ 5 sprawdzeń dziennie za darmo &nbsp; ✓ Rejestracja w 30 sekund
            </p>
          </div>
        </header>

        {/* Checker Section - dla zalogowanych */}
        {isAuthenticated && (
          <section className="py-8 px-4 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                Wklej tekst do sprawdzenia ortografii
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
                  <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-1">
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

        {/* Czym jest sprawdzanie ortografii - SEO content */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Czym jest sprawdzanie ortografii online?
            </h2>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                <strong className="text-gray-900 dark:text-white">
                  Sprawdzanie ortografii online
                </strong>{" "}
                to proces automatycznej weryfikacji tekstu pod kątem błędów w
                pisowni. Nowoczesne korektory ortografii, takie jak nasz,
                wykorzystują{" "}
                <strong className="text-gray-900 dark:text-white">
                  sztuczną inteligencję
                </strong>{" "}
                do analizy kontekstu zdań, dzięki czemu wykrywają nie tylko
                proste literówki, ale również błędy wynikające z nieznajomości
                zasad ortograficznych.
              </p>

              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                Tradycyjne korektory opierają się na porównywaniu słów ze
                słownikiem. Nasz{" "}
                <strong className="text-gray-900 dark:text-white">
                  korektor ortografii AI
                </strong>{" "}
                idzie o krok dalej — analizuje całe zdanie, rozumie jego
                znaczenie i potrafi wykryć błędy, które tradycyjne narzędzia
                pomijają. Na przykład słowo "zamek" może być poprawne jako
                budowla lub mechanizm, ale AI rozpozna, gdy zostanie użyte w
                złym kontekście.
              </p>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 my-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-green-600" />
                  Dlaczego AI jest lepszy od tradycyjnych korektorów?
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Rozumie kontekst zdania, nie tylko pojedyncze słowa
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Wykrywa błędy w pisowni łącznej i rozdzielnej (np.
                      "naprawdę" vs "na prawdę")
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Sprawdza interpunkcję wraz z ortografią w jednym kroku
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Wyjaśnia zasadę przy każdej poprawce</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Kategorie błędów */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Jakie błędy wykrywa korektor?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Nasz AI sprawdza tekst kompleksowo — od literówek po
                zaawansowane błędy stylistyczne
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {errorCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <category.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {category.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-full"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Najczęstsze błędy ortograficzne */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Najczęstsze błędy ortograficzne Polaków
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Zobacz, które błędy popełniamy najczęściej i jak ich unikać
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-700 font-bold text-sm">
                <div className="text-red-600 dark:text-red-400">❌ Źle</div>
                <div className="text-green-600 dark:text-green-400">
                  ✓ Dobrze
                </div>
                <div className="text-gray-600 dark:text-gray-400">Zasada</div>
              </div>
              {commonMistakes.map((mistake, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 p-4 text-sm ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900/50"
                  }`}
                >
                  <div className="text-red-600 dark:text-red-400 line-through">
                    {mistake.wrong}
                  </div>
                  <div className="text-green-600 dark:text-green-400 font-medium">
                    {mistake.correct}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {mistake.rule}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Nasz korektor ortografii AI wykrywa wszystkie te błędy i wiele
                więcej!
              </p>
              {!isAuthenticated && (
                <Link
                  to="/rejestracja"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sprawdź swój tekst za darmo
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Dlaczego warto sprawdzać ortografię */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Dlaczego warto sprawdzać ortografię?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Bezbłędne teksty to inwestycja w Twój wizerunek i sukces
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jak działam - krok po kroku */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Jak sprawdzić ortografię w 4 krokach?
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Załóż darmowe konto",
                  desc: "Rejestracja zajmuje 30 sekund. Wystarczy email i hasło — bez karty kredytowej.",
                },
                {
                  step: "2",
                  title: "Wklej tekst do sprawdzenia",
                  desc: "Skopiuj tekst z dokumentu, emaila czy strony i wklej go do naszego korektora.",
                },
                {
                  step: "3",
                  title: "Kliknij 'Sprawdź ortografię'",
                  desc: "AI przeanalizuje Twój tekst w ciągu 2-3 sekund, sprawdzając ortografię i interpunkcję.",
                },
                {
                  step: "4",
                  title: "Popraw błędy z wyjaśnieniami",
                  desc: "Zobacz wykryte błędy z wyjaśnieniami zasad. Skopiuj poprawiony tekst jednym kliknięciem.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-white">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Przypadki użycia */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Dla kogo jest sprawdzanie ortografii?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Każdy, kto pisze po polsku, skorzysta z korektora ortografii
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Porównanie */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Porównanie z innymi korektorami
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Zobacz, dlaczego warto wybrać Interpunkcja.com.pl
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <div className="font-bold">Funkcja</div>
                <div className="font-bold text-center">Inne korektory</div>
                <div className="font-bold text-center">Interpunkcja.com.pl</div>
              </div>
              {comparison.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 p-4 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900"
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {row.feature}
                  </div>
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center gap-1">
                    <X className="w-4 h-4 text-red-500" />
                    {row.others}
                  </div>
                  <div className="text-center text-green-600 dark:text-green-400 font-medium text-sm flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    {row.us}
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
                Cennik sprawdzania ortografii
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
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-white relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  POPULARNY
                </div>
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold mb-1">29 zł</div>
                <p className="text-green-100 text-sm mb-4">/miesiąc</p>
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
                  className="block w-full py-3 text-center bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition-colors"
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
                Wszystko o sprawdzaniu ortografii online
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
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 group-open:rotate-180 transition-transform">
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

        {/* Dodatkowe linki SEO */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Powiązane narzędzia i zasoby
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/"
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Sprawdzanie interpunkcji
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Korektor przecinków i znaków interpunkcyjnych
                </p>
              </Link>
              <Link
                to="/category/znaki-interpunkcyjne/"
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Zasady interpunkcji
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Poradnik użycia znaków interpunkcyjnych
                </p>
              </Link>
              <Link
                to="/cennik"
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Cennik
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Porównanie planów Free, Premium i Lifetime
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Sprawdź ortografię w swoim tekście!
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Dołącz do tysięcy osób, które piszą bezbłędnie dzięki naszemu
              korektorowi AI. Za darmo, bez zobowiązań.
            </p>
            <Link
              to="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all shadow-2xl hover:scale-105 text-lg"
            >
              Załóż darmowe konto
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-green-100 mt-6 text-sm">
              ✓ 5 sprawdzeń dziennie za darmo &nbsp; ✓ Lifetime 299 zł
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
