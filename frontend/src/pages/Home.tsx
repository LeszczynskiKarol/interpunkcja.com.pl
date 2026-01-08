// frontend/src/pages/Home.tsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import {
  BookOpen,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Brain,
  FileText,
  Target,
  Sparkles,
  Users,
  Check,
  X,
  MessageSquare,
  Lightbulb,
  GraduationCap,
  Briefcase,
  PenTool,
  Globe,
  Infinity,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { api } from "../lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: { name: string; slug: string };
}

const categoryDescriptions: Record<string, string> = {
  "interpunkcyjny-slownik-wyrazow":
    "Kiedy stawiać przecinek przed: że, który, ale, bo, gdy i innymi wyrazami",
  "znaki-interpunkcyjne":
    "Zasady użycia przecinka, myślnika, cudzysłowu, nawiasu i innych znaków",
  "ogolne-zasady-interpunkcji":
    "Podstawowe reguły interpunkcji w zdaniach złożonych i wyliczeniach",
};

export function Home() {
  const { isAuthenticated } = useAuthStore();

  // Pobierz kategorie z liczbą artykułów
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/api/categories");
      return res.data;
    },
  });

  // Pobierz najnowsze artykuły
  const { data: latestArticles } = useQuery<{ articles: Article[] }>({
    queryKey: ["latest-articles"],
    queryFn: async () => {
      const res = await api.get("/api/articles?limit=6");
      return res.data;
    },
  });

  const features = [
    {
      icon: Brain,
      title: "Sztuczna inteligencja Claude",
      description:
        "Wykorzystujemy najnowszy model AI Claude do analizy tekstu - ten sam, któremu ufają największe firmy na świecie.",
    },
    {
      icon: Lightbulb,
      title: "Wyjaśnienia każdej poprawki",
      description:
        "Nie tylko poprawiamy błędy - wyjaśniamy zasadę interpunkcyjną, dzięki czemu uczysz się na bieżąco.",
    },
    {
      icon: Zap,
      title: "Błyskawiczna analiza",
      description:
        "Sprawdzenie tekstu zajmuje kilka sekund. Wklej tekst i natychmiast zobacz, gdzie brakuje przecinków.",
    },
    {
      icon: Target,
      title: "Specjalizacja w polskiej interpunkcji",
      description:
        "Nasz korektor jest zoptymalizowany pod polskie zasady interpunkcyjne - przecinki, myślniki, cudzysłowy.",
    },
    {
      icon: Shield,
      title: "Prywatność i bezpieczeństwo",
      description:
        "Twoje teksty nie są przechowywane ani udostępniane. Sprawdzanie odbywa się w pełni poufnie.",
    },
    {
      icon: FileText,
      title: "Długie teksty do 10 000 znaków",
      description:
        "Plan Premium pozwala sprawdzać nawet bardzo długie dokumenty - artykuły, prace naukowe, raporty.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Załóż darmowe konto",
      description:
        "Szybka rejestracja - wystarczy email i hasło. Bez karty kredytowej.",
    },
    {
      number: "02",
      title: "Wklej swój tekst",
      description:
        "Skopiuj tekst z dokumentu, emaila czy strony i wklej go do korektora.",
    },
    {
      number: "03",
      title: "AI analizuje interpunkcję",
      description:
        "Sztuczna inteligencja sprawdza każde zdanie pod kątem zasad polskiej interpunkcji.",
    },
    {
      number: "04",
      title: "Otrzymaj poprawki z wyjaśnieniami",
      description:
        "Zobacz dokładnie, gdzie brakuje przecinków i dlaczego - z odniesieniem do reguł.",
    },
  ];

  const useCases = [
    {
      icon: GraduationCap,
      title: "Studenci i uczniowie",
      description: "Prace zaliczeniowe, wypracowania, prezentacje",
    },
    {
      icon: Briefcase,
      title: "Profesjonaliści",
      description: "Emaile biznesowe, raporty, dokumentacja",
    },
    {
      icon: PenTool,
      title: "Copywriterzy i blogerzy",
      description: "Artykuły, posty, teksty marketingowe",
    },
    {
      icon: Users,
      title: "Autorzy i pisarze",
      description: "Książki, opowiadania, scenariusze",
    },
    {
      icon: Globe,
      title: "Tłumacze",
      description: "Weryfikacja tłumaczeń na polski",
    },
    {
      icon: MessageSquare,
      title: "Social media",
      description: "Posty na LinkedIn, Facebook, Instagram",
    },
  ];

  const comparison = [
    {
      aspect: "Sprawdzanie interpunkcji",
      others: "Podstawowe",
      us: "Zaawansowane AI",
    },
    {
      aspect: "Wyjaśnienia reguł",
      others: "Brak lub minimalne",
      us: "Pełne wyjaśnienia",
    },
    {
      aspect: "Język polski",
      others: "Często słaba obsługa",
      us: "Pełna specjalizacja",
    },
    {
      aspect: "Długość tekstu",
      others: "Limit 500-1000 znaków",
      us: "Do 10 000 znaków",
    },
    {
      aspect: "Cena lifetime",
      others: "Brak opcji",
      us: "299 zł na zawsze",
    },
  ];

  const faq = [
    {
      question: "Jak działa sprawdzanie interpunkcji AI?",
      answer:
        "Nasz korektor wykorzystuje zaawansowany model sztucznej inteligencji Claude, który analizuje każde zdanie pod kątem polskich zasad interpunkcyjnych. AI rozpoznaje strukturę zdania, identyfikuje miejsca wymagające przecinków i innych znaków, a następnie wyjaśnia zastosowaną regułę.",
    },
    {
      question: "Czy moje teksty są bezpieczne?",
      answer:
        "Tak! Twoje teksty są przetwarzane w czasie rzeczywistym i nie są nigdzie przechowywane. Po zamknięciu strony wszystkie dane są usuwane. Dbamy o Twoją prywatność.",
    },
    {
      question: "Ile kosztuje korzystanie z korektora?",
      answer:
        "Oferujemy darmowy plan z 5 sprawdzeniami dziennie (do 500 znaków). Plan Premium kosztuje 29 zł/miesiąc i daje 100 sprawdzeń dziennie do 10 000 znaków. Mamy też plan Lifetime za jednorazowe 299 zł - płacisz raz, korzystasz na zawsze!",
    },
    {
      question: "Jakie błędy interpunkcyjne wykrywa AI?",
      answer:
        "Nasz korektor wykrywa: brakujące przecinki przed spójnikami (że, który, gdy, bo, ale), błędy w zdaniach złożonych, nieprawidłowe użycie myślników i półpauz, błędy w cudzysłowach, przecinki w wyliczeniach i wiele innych.",
    },
    {
      question: "Czy mogę sprawdzać długie dokumenty?",
      answer:
        "W planie FREE możesz sprawdzać teksty do 500 znaków. Plan Premium i Lifetime pozwalają na sprawdzanie tekstów do 10 000 znaków na raz - to około 5 stron A4.",
    },
    {
      question: "Czym różni się od innych korektorów?",
      answer:
        "Interpunkcja.com.pl specjalizuje się wyłącznie w polskiej interpunkcji. Nie próbujemy być uniwersalnym narzędziem - skupiamy się na tym, w czym jesteśmy najlepsi. Każda poprawka zawiera wyjaśnienie zasady, dzięki czemu uczysz się na bieżąco.",
    },
  ];

  const stats = [
    { value: "5000+", label: "Sprawdzonych tekstów" },
    { value: "99%", label: "Dokładność AI" },
    { value: "3 sek", label: "Średni czas analizy" },
    { value: "24/7", label: "Dostępność" },
  ];

  return (
    <>
      <Helmet>
        <title>
          Sprawdzanie Interpunkcji Online | Korektor Przecinków AI -
          Interpunkcja.com.pl
        </title>
        <meta
          name="description"
          content="Sprawdź interpunkcję w tekście za darmo! Korektor interpunkcji AI wykrywa brakujące przecinki i wyjaśnia zasady. Sprawdzanie pisowni i błędów interpunkcyjnych online."
        />
        <meta
          name="keywords"
          content="interpunkcja, sprawdzanie interpunkcji, korektor przecinków, sprawdzanie pisowni, sprawdzanie błędów, przecinek przed że, zasady interpunkcji, korektor tekstu online, sprawdzanie tekstu"
        />
        <link rel="canonical" href="https://interpunkcja.com.pl" />
        <meta
          property="og:title"
          content="Sprawdzanie Interpunkcji Online | Korektor AI"
        />
        <meta
          property="og:description"
          content="Sprawdź interpunkcję w tekście za darmo! AI wykrywa brakujące przecinki i wyjaśnia zasady polskiej interpunkcji."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://interpunkcja.com.pl" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Interpunkcja.com.pl" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 transition-colors">
        {/* Hero Section */}
        <header className="relative py-20 md:py-28 px-4 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Korektor interpunkcji AI
            </div>

            {/* Main Heading - SEO optimized */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Sprawdź{" "}
              <span className="text-blue-600 dark:text-blue-400">
                interpunkcję
              </span>
              <br />w swoim tekście
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              <strong className="font-semibold text-gray-900 dark:text-white">
                Sztuczna inteligencja
              </strong>{" "}
              sprawdzi Twój tekst, wskaże brakujące przecinki i wyjaśni zasady
              polskiej interpunkcji. Za darmo!
            </p>

            {/* Value props */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Sprawdzanie w 3 sekundy
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Wyjaśnienia każdej poprawki
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  100% po polsku
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {isAuthenticated ? (
                <Link
                  to="/panel"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                >
                  Przejdź do korektora
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/rejestracja"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                  >
                    Sprawdź tekst za darmo
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/logowanie"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-lg"
                  >
                    Zaloguj się
                  </Link>
                </>
              )}
            </div>

            {/* Trust indicators */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ✓ 5 sprawdzeń dziennie za darmo &nbsp; ✓ Rejestracja w 30 sekund
            </p>
          </div>
        </header>

        {/* Stats Section */}
        <section className="py-12 bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
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

        {/* How It Works */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Jak działa sprawdzanie interpunkcji?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Cztery proste kroki do bezbłędnego tekstu
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent dark:from-blue-700 -ml-4 z-0" />
                  )}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative z-10 h-full">
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl font-bold text-white">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 pr-12">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Dlaczego nasz korektor interpunkcji?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Funkcje, które wyróżniają nas na tle innych narzędzi do
                sprawdzania pisowni
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Dla kogo jest korektor interpunkcji?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Sprawdzanie błędów interpunkcyjnych przydaje się każdemu, kto
                pisze po polsku
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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

        {/* Comparison */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Interpunkcja.com.pl vs inne korektory
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Zobacz, czym się wyróżniamy
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="font-bold">Funkcja</div>
                <div className="font-bold text-center">Inne korektory</div>
                <div className="font-bold text-center">Interpunkcja.com.pl</div>
              </div>

              {/* Rows */}
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
                    {row.aspect}
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

        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Poznaj zasady polskiej interpunkcji
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Kompendium wiedzy o przecinkach, myślnikach i innych znakach
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}/`}
                    className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {categoryDescriptions[cat.slug] ||
                        `Artykuły o ${cat.name.toLowerCase()}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {cat.articleCount} artykułów
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Prosty i przejrzysty cennik
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
                  <li className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                    <X className="w-4 h-4" />
                    Pełne wyjaśnienia
                  </li>
                  <li className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                    <X className="w-4 h-4" />
                    Historia sprawdzeń
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
                <div className="text-4xl font-bold mb-1">
                  29 zł
                  <span className="text-lg font-normal opacity-80">/mies</span>
                </div>
                <p className="text-blue-100 text-sm mb-4">
                  lub 290 zł/rok (oszczędzasz 17%)
                </p>
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
                    Pełne wyjaśnienia reguł
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Historia sprawdzeń
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Priorytetowe wsparcie
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
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border-2 border-green-500 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Infinity className="w-3 h-3" />
                  LIFETIME
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Lifetime
                </h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  299 zł
                </div>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium mb-4">
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
                    Wszystkie przyszłe funkcje
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    Bez miesięcznych opłat
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    VIP support
                  </li>
                </ul>
                <Link
                  to="/rejestracja"
                  className="block w-full py-3 text-center bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Kup Lifetime
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Articles */}
        {latestArticles?.articles && latestArticles.articles.length > 0 && (
          <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Najnowsze artykuły o interpunkcji
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Poradniki i zasady polskiej interpunkcji
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestArticles.articles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/${article.category.slug}/${article.slug}/`}
                    className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all"
                  >
                    <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded mb-3">
                      {article.category.name}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Najczęściej zadawane pytania
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Wszystko o sprawdzaniu interpunkcji online
              </p>
            </div>

            <div className="space-y-4">
              {faq.map((item, index) => (
                <details
                  key={index}
                  className="group bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
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

        {/* Final CTA */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Zacznij pisać bezbłędnie już dziś!
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Dołącz do tysięcy osób, które sprawdzają interpunkcję z pomocą
              sztucznej inteligencji. Bez zobowiązań.
            </p>
            <Link
              to="/rejestracja"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-2xl hover:scale-105 text-lg"
            >
              Załóż darmowe konto
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-blue-100 mt-6 text-sm">
              ✓ 5 sprawdzeń dziennie za darmo &nbsp; ✓ Rejestracja w 30 sekund
              &nbsp; ✓ Plan Lifetime 299 zł
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
