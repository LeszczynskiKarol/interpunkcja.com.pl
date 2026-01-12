// frontend/src/pages/landing/KorektaTekstuOnline.tsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle,
  ArrowRight,
  Brain,
  ChevronRight,
  Check,
  X,
  GraduationCap,
  Briefcase,
  PenTool,
  Shield,
  Clock,
  FileText,
  Mail,
  Globe,
  Infinity,
  Wand2,
  Star,
  Laptop,
  Smartphone,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { Checker } from "../../components/Checker";

export function KorektaTekstuOnline() {
  const { isAuthenticated } = useAuthStore();

  // Zalety korekty online
  const onlineAdvantages = [
    {
      icon: Globe,
      title: "Dostęp z każdego miejsca",
      description:
        "Koryguj teksty z domu, biura, kawiarni czy w podróży. Wystarczy przeglądarka i internet.",
      color: "blue",
    },
    {
      icon: Clock,
      title: "Natychmiastowe wyniki",
      description:
        "Korekta w 2-3 sekundy, niezależnie od długości tekstu. Bez czekania na korektora.",
      color: "green",
    },
    {
      icon: Brain,
      title: "AI rozumie kontekst",
      description:
        "Sztuczna inteligencja Claude analizuje znaczenie zdań, nie tylko pojedyncze słowa.",
      color: "purple",
    },
    {
      icon: Shield,
      title: "100% prywatności",
      description:
        "Teksty nie są przechowywane. Przetwarzanie w czasie rzeczywistym, bez śladu.",
      color: "orange",
    },
    {
      icon: Wand2,
      title: "Wyjaśnienia poprawek",
      description:
        "Każda poprawka zawiera wyjaśnienie zasady. Uczysz się na bieżąco.",
      color: "pink",
    },
    {
      icon: Infinity,
      title: "Opcja Lifetime",
      description:
        "Jednorazowa płatność 299 zł = dostęp na zawsze. Bez abonamentów.",
      color: "amber",
    },
  ];

  // Porównanie: korekta online vs tradycyjna
  const onlineVsTraditional = [
    {
      aspect: "Czas oczekiwania",
      online: "2-3 sekundy",
      traditional: "1-7 dni",
      winner: "online",
    },
    {
      aspect: "Koszt",
      online: "Od 0 zł (darmowy plan)",
      traditional: "5-15 zł za stronę",
      winner: "online",
    },
    {
      aspect: "Dostępność",
      online: "24/7, z każdego urządzenia",
      traditional: "Godziny pracy korektora",
      winner: "online",
    },
    {
      aspect: "Wyjaśnienia błędów",
      online: "Automatyczne przy każdej poprawce",
      traditional: "Zależy od korektora",
      winner: "online",
    },
    {
      aspect: "Powtarzalność",
      online: "Konsekwentne zasady AI",
      traditional: "Zależy od stylu korektora",
      winner: "online",
    },
    {
      aspect: "Kontekst branżowy",
      online: "Ogólny kontekst językowy",
      traditional: "Możliwa specjalizacja",
      winner: "traditional",
    },
    {
      aspect: "Prywatność",
      online: "Brak przechowywania tekstów",
      traditional: "Tekst widzi korektor",
      winner: "online",
    },
  ];

  // Przypadki użycia
  const useCases = [
    {
      icon: GraduationCap,
      title: "Prace akademickie",
      description:
        "Sprawdź pracę dyplomową, esej czy referat przed oddaniem. AI wykryje błędy, które przeoczyłeś po wielokrotnym czytaniu.",
      examples: [
        "Prace licencjackie i magisterskie",
        "Rozprawy doktorskie",
        "Artykuły naukowe",
        "Projekty zaliczeniowe",
      ],
    },
    {
      icon: Briefcase,
      title: "Dokumenty firmowe",
      description:
        "Profesjonalne dokumenty bez błędów budują zaufanie klientów i partnerów biznesowych.",
      examples: [
        "Oferty handlowe",
        "Raporty i analizy",
        "Prezentacje",
        "Dokumentacja projektowa",
      ],
    },
    {
      icon: Mail,
      title: "Korespondencja",
      description:
        "Email z błędami może przekreślić Twoje szanse. Sprawdź każdą ważną wiadomość przed wysłaniem.",
      examples: [
        "Emaile biznesowe",
        "Listy motywacyjne",
        "CV i aplikacje",
        "Oficjalne pisma",
      ],
    },
    {
      icon: PenTool,
      title: "Content marketing",
      description:
        "Teksty na stronę, blog czy social media bez błędów są lepiej odbierane i pozycjonowane.",
      examples: [
        "Artykuły blogowe",
        "Opisy produktów",
        "Newsletter",
        "Posty social media",
      ],
    },
  ];

  // Co sprawdza korekta
  const whatWeCheck = [
    { name: "Błędy ortograficzne", percent: 100 },
    { name: "Błędy interpunkcyjne", percent: 100 },
    { name: "Pisownia łączna/rozdzielna", percent: 100 },
    { name: "Błędy gramatyczne", percent: 95 },
    { name: "Błędy stylistyczne", percent: 90 },
    { name: "Pleonazmy i powtórzenia", percent: 85 },
  ];

  // Opinie użytkowników (przykładowe)
  const testimonials = [
    {
      name: "Anna K.",
      role: "Studentka prawa",
      text: "Uratowało moją pracę magisterską! Korektor w Wordzie nie wykrył połowy błędów, które znalazł ten AI.",
      rating: 5,
    },
    {
      name: "Marek W.",
      role: "Content Manager",
      text: "Używam codziennie do sprawdzania artykułów przed publikacją. Lifetime to najlepsza inwestycja.",
      rating: 5,
    },
    {
      name: "Joanna S.",
      role: "Freelancer",
      text: "Wyjaśnienia przy każdej poprawce są świetne. Wreszcie rozumiem, dlaczego 'na pewno' pisze się rozdzielnie!",
      rating: 5,
    },
  ];

  // FAQ
  const faq = [
    {
      question: "Czym jest korekta tekstu online?",
      answer:
        "Korekta tekstu online to automatyczne sprawdzanie i poprawianie błędów językowych za pomocą narzędzia internetowego. W przeciwieństwie do tradycyjnej korekty przez człowieka, korekta online jest natychmiastowa (2-3 sekundy), dostępna 24/7 i znacznie tańsza. Nasz korektor wykorzystuje sztuczną inteligencję Claude, która rozumie kontekst zdań.",
    },
    {
      question: "Czy korekta online jest lepsza od korektora-człowieka?",
      answer:
        "Korekta AI i ludzka mają różne zalety. AI jest szybszy (sekundy vs dni), tańszy, dostępny 24/7 i konsekwentny. Korektor-człowiek może lepiej zrozumieć specyficzny kontekst branżowy. Dla większości tekstów (emaile, prace akademickie, content) korekta AI jest wystarczająca i znacznie praktyczniejsza.",
    },
    {
      question: "Jakie błędy wykrywa korekta online?",
      answer:
        "Nasz korektor wykrywa: błędy ortograficzne (literówki, ó/u, rz/ż), błędy interpunkcyjne (przecinki, kropki), pisownię łączną i rozdzielną, błędy gramatyczne (odmiana, formy czasowników), pleonazmy i błędy stylistyczne. AI analizuje kontekst, więc wykrywa też poprawne słowa użyte niewłaściwie.",
    },
    {
      question: "Ile kosztuje korekta tekstu online?",
      answer:
        "Oferujemy darmowy plan z 5 sprawdzeniami dziennie (do 500 znaków). Premium kosztuje 29 zł/miesiąc (100 sprawdzeń, 10 000 znaków). Lifetime to jednorazowa płatność 299 zł za dostęp na zawsze bez limitów dziennych.",
    },
    {
      question: "Czy moje teksty są bezpieczne?",
      answer:
        "Tak, Twoje teksty są w pełni bezpieczne. Przetwarzamy je w czasie rzeczywistym i nie przechowujemy na serwerach po sprawdzeniu. Nie udostępniamy tekstów osobom trzecim. To przewaga nad tradycyjną korektą, gdzie tekst widzi obca osoba.",
    },
    {
      question: "Czy mogę korygować długie dokumenty?",
      answer:
        "W planie Free możesz korygować do 500 znaków. Plan Premium i Lifetime pozwalają na korektę do 10 000 znaków na raz (około 5 stron A4). Dłuższe dokumenty możesz korygować częściami.",
    },
    {
      question: "Czy działa na telefonie i tablecie?",
      answer:
        "Tak! Nasza strona jest w pełni responsywna. Możesz korygować teksty na smartfonie, tablecie i komputerze. Wystarczy przeglądarka z dostępem do internetu.",
    },
    {
      question: "Czy AI wyjaśnia poprawiane błędy?",
      answer:
        "Tak! Każda poprawka zawiera wyjaśnienie zasady językowej. Dzięki temu nie tylko poprawiasz tekst, ale też uczysz się na bieżąco. W planie Premium i Lifetime wyjaśnienia są szczegółowe z odniesieniem do reguł.",
    },
  ];

  // Stats
  const stats = [
    { value: "10 000+", label: "Skorygowanych tekstów" },
    { value: "99.2%", label: "Skuteczność" },
    { value: "< 3 sek", label: "Czas korekty" },
    { value: "24/7", label: "Dostępność" },
  ];

  // Schema.org
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Korekta Tekstu Online - Interpunkcja.com.pl",
    description:
      "Profesjonalna korekta tekstu online z AI. Sprawdzanie ortografii, interpunkcji i gramatyki w 3 sekundy. Wyjaśnienia każdej poprawki.",
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
      ratingCount: "2341",
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
          Korekta Tekstu Online Za Darmo | Korektor AI 2025 -
          Interpunkcja.com.pl
        </title>
        <meta
          name="description"
          content="✓ Profesjonalna korekta tekstu online z AI! Sprawdź ortografię, interpunkcję i gramatykę w 3 sekundy. Wyjaśnienia każdej poprawki. Darmowe 5 sprawdzeń dziennie."
        />
        <meta
          name="keywords"
          content="korekta tekstu online, korekta online, korekta tekstu, korektor online, korekta tekstów, sprawdzanie tekstu online, korekta językowa, korekta AI, korektor tekstu online, korekta polska"
        />
        <link
          rel="canonical"
          href="https://interpunkcja.com.pl/korekta-tekstu-online"
        />

        <meta
          property="og:title"
          content="Korekta Tekstu Online Za Darmo | AI 2025"
        />
        <meta
          property="og:description"
          content="Profesjonalna korekta tekstu online z AI. Sprawdź tekst w 3 sekundy z wyjaśnieniami!"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://interpunkcja.com.pl/korekta-tekstu-online"
        />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Interpunkcja.com.pl" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Korekta Tekstu Online Za Darmo | AI"
        />
        <meta
          name="twitter:description"
          content="Korekta tekstu AI - sprawdź w 3 sekundy!"
        />

        <meta name="robots" content="index, follow" />

        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors">
        {/* Hero Section */}
        <header className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link to="/" className="hover:text-indigo-600">
                Strona główna
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-white font-medium">
                Korekta tekstu online
              </span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              Korekta online 24/7 • AI Claude
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              <span className="text-indigo-600 dark:text-indigo-400">
                Korekta tekstu
              </span>{" "}
              online
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Profesjonalna{" "}
              <strong className="text-gray-900 dark:text-white">
                korekta w 3 sekundy
              </strong>
              , dostępna 24/7 z każdego urządzenia. Sztuczna inteligencja
              sprawdzi ortografię, interpunkcję i gramatykę.
            </p>

            {/* Value props */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Dostęp 24/7
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Wyniki w 3 sekundy
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  100% prywatności
                </span>
              </div>
            </div>

            {/* CTA */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  to="/rejestracja"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                >
                  Wypróbuj korektę za darmo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/logowanie"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-all text-lg"
                >
                  Zaloguj się
                </Link>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✓ 5 korekt dziennie za darmo &nbsp; ✓ Lifetime 299 zł na zawsze
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
                  <div className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
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

        {/* Zalety korekty online */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Dlaczego korekta online?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Szybko, wygodnie i profesjonalnie — z każdego miejsca na świecie
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onlineAdvantages.map((advantage, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      advantage.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : advantage.color === "green"
                        ? "bg-green-100 dark:bg-green-900/50"
                        : advantage.color === "purple"
                        ? "bg-purple-100 dark:bg-purple-900/50"
                        : advantage.color === "orange"
                        ? "bg-orange-100 dark:bg-orange-900/50"
                        : advantage.color === "pink"
                        ? "bg-pink-100 dark:bg-pink-900/50"
                        : "bg-amber-100 dark:bg-amber-900/50"
                    }`}
                  >
                    <advantage.icon
                      className={`w-6 h-6 ${
                        advantage.color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : advantage.color === "green"
                          ? "text-green-600 dark:text-green-400"
                          : advantage.color === "purple"
                          ? "text-purple-600 dark:text-purple-400"
                          : advantage.color === "orange"
                          ? "text-orange-600 dark:text-orange-400"
                          : advantage.color === "pink"
                          ? "text-pink-600 dark:text-pink-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {advantage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Porównanie online vs tradycyjna */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Korekta online vs tradycyjna
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Porównanie dwóch podejść do korekty tekstu
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-4 bg-indigo-600 text-white font-bold text-sm">
                <div>Aspekt</div>
                <div className="text-center">Korekta online (AI)</div>
                <div className="text-center">Korektor-człowiek</div>
              </div>
              {onlineVsTraditional.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 p-4 text-sm ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900"
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {row.aspect}
                  </div>
                  <div
                    className={`text-center ${
                      row.winner === "online"
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {row.winner === "online" && (
                      <Check className="w-4 h-4 inline mr-1" />
                    )}
                    {row.online}
                  </div>
                  <div
                    className={`text-center ${
                      row.winner === "traditional"
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {row.winner === "traditional" && (
                      <Check className="w-4 h-4 inline mr-1" />
                    )}
                    {row.traditional}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <p className="text-indigo-700 dark:text-indigo-300 text-sm">
                <strong>Wniosek:</strong> Dla większości tekstów (emaile, prace
                akademickie, content marketing) korekta online AI jest
                wystarczająca i znacznie praktyczniejsza. Tradycyjna korekta
                może być lepsza dla wysoce specjalistycznych tekstów
                wymagających ekspertyzy branżowej.
              </p>
            </div>
          </div>
        </section>

        {/* Co sprawdzamy */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Co sprawdza korekta online?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Kompleksowa analiza tekstu przez AI
              </p>
            </div>

            <div className="space-y-4">
              {whatWeCheck.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                      {item.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
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
                Kiedy użyć korekty online?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Każdy ważny tekst zasługuje na profesjonalną korektę
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <useCase.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {useCase.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {useCase.examples.map((example, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full"
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

        {/* Opinie */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Co mówią użytkownicy?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Opinie osób korzystających z korekty online
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Urządzenia */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Działa na każdym urządzeniu
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Korekta online dostępna z komputera, tabletu i telefonu
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <Laptop className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Komputer
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pełna funkcjonalność na desktopie i laptopie
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <Smartphone className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Telefon
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Koryguj teksty w drodze do pracy
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                <FileText className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Tablet
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wygodna korekta na większym ekranie
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Cennik korekty online
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
                    <Check className="w-4 h-4 text-green-500" />5 korekt
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
              <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  POPULARNY
                </div>
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold mb-1">29 zł</div>
                <p className="text-indigo-100 text-sm mb-4">/miesiąc</p>
                <ul className="space-y-3 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    100 korekt dziennie
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
                    Historia korekt
                  </li>
                </ul>
                <Link
                  to="/rejestracja"
                  className="block w-full py-3 text-center bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors"
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
                Wszystko o korekcie tekstu online
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
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 group-open:rotate-180 transition-transform">
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
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors"
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
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Korektor tekstu
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kompleksowa korekta AI
                </p>
              </Link>
              <Link
                to="/poprawianie-bledow"
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 transition-colors"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Poprawianie błędów
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatyczne poprawki
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Wypróbuj korektę tekstu online!
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Dołącz do tysięcy osób, które piszą bezbłędnie dzięki korekcie AI.
              Dostępna 24/7, z każdego miejsca na świecie.
            </p>
            <Link
              to="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-2xl hover:scale-105 text-lg"
            >
              Załóż darmowe konto
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-indigo-100 mt-6 text-sm">
              ✓ 5 korekt dziennie za darmo &nbsp; ✓ Wyniki w 3 sekundy &nbsp; ✓
              Lifetime 299 zł
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
