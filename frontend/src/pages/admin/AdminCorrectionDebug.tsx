// frontend/src/pages/admin/AdminCorrectionDebug.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Play,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  DollarSign,
  FileText,
  ArrowRight,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Target,
  BookOpen,
  Wand2,
  Type,
  Sparkles,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

interface Correction {
  original: string;
  corrected: string;
  position: { start: number; end: number };
  category: string;
  rule: string;
  explanation: string;
}

interface CheckResponse {
  correctedText: string;
  corrections: Correction[];
  errorCount: number;
  summary?: {
    interpunkcja: number;
    ortografia: number;
    pisownia: number;
    gramatyka: number;
    stylistyka: number;
  };
  _debug?: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    responseTimeMs: number;
    stopReason: string;
  };
  usage?: {
    remainingChecks: number;
    remainingChars: number;
    bonusChecks: number;
    plan: string;
  };
}

// Przykładowe teksty do testowania
const SAMPLE_TEXTS = [
  {
    label: "Wszystkie błędy",
    text: "Myślę że napewno poszłem do sklepu który był zamknięty. Wogóle nie spodziewałem się że tak będzie. Chciałbym wziąść to co potrzebuje ale nie moge.",
  },
  {
    label: "Interpunkcja",
    text: "Jan który mieszka w Warszawie powiedział mi że przyjedzie jutro mimo że ma dużo pracy. Chciałbym żeby przyjechał wcześniej ale rozumiem że to trudne.",
  },
  {
    label: "Pisownia łączna/rozdzielna",
    text: "Napewno pójdę na prawdę do kina. Wogóle nie wiem czy to dobry pomysł. Poza tym mam dużo pracy więc niemogę się zdecydować.",
  },
  {
    label: "Gramatyka",
    text: "Wczoraj poszłem do sklepu i wziąłem mleko. Potem włanczałem telewizor i oglądałem film. Bym chciał pojechać na wakacje.",
  },
  {
    label: "Stylistyka",
    text: "Samolot wzniósł się do góry i poleciał dalej kontynuując lot. Wspólna współpraca dała efekty w przyszłym okresie czasu.",
  },
  {
    label: "Tekst poprawny",
    text: "Wczoraj byłem w kinie i oglądałem świetny film. Potem poszedłem do restauracji, gdzie zjadłem pyszną kolację. To był naprawdę udany wieczór.",
  },
];

// Kolory dla kategorii
const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; icon: any; label: string }
> = {
  interpunkcja: {
    bg: "bg-blue-100 dark:bg-blue-900/50",
    text: "text-blue-700 dark:text-blue-300",
    icon: Type,
    label: "Interpunkcja",
  },
  ortografia: {
    bg: "bg-red-100 dark:bg-red-900/50",
    text: "text-red-700 dark:text-red-300",
    icon: AlertTriangle,
    label: "Ortografia",
  },
  pisownia: {
    bg: "bg-orange-100 dark:bg-orange-900/50",
    text: "text-orange-700 dark:text-orange-300",
    icon: BookOpen,
    label: "Pisownia",
  },
  gramatyka: {
    bg: "bg-purple-100 dark:bg-purple-900/50",
    text: "text-purple-700 dark:text-purple-300",
    icon: Wand2,
    label: "Gramatyka",
  },
  stylistyka: {
    bg: "bg-pink-100 dark:bg-pink-900/50",
    text: "text-pink-700 dark:text-pink-300",
    icon: Sparkles,
    label: "Stylistyka",
  },
};

export function AdminCorrectionDebug() {
  const [inputText, setInputText] = useState(SAMPLE_TEXTS[0].text);
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [expandedCorrections, setExpandedCorrections] = useState<Set<number>>(
    new Set()
  );

  const checkMutation = useMutation({
    mutationFn: async (text: string) => {
      const startTime = performance.now();
      const res = await api.post("/api/check", { text });
      const endTime = performance.now();

      // Dodaj czas klienta do debug info
      return {
        ...res.data,
        _clientTime: Math.round(endTime - startTime),
      };
    },
    onSuccess: (data) => {
      setResult(data);
      toast.success(`Znaleziono ${data.errorCount} błędów`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Błąd sprawdzania");
    },
  });

  const handleCheck = () => {
    if (!inputText.trim()) {
      toast.error("Wprowadź tekst do sprawdzenia");
      return;
    }
    checkMutation.mutate(inputText);
  };

  const toggleCorrection = (index: number) => {
    const newSet = new Set(expandedCorrections);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedCorrections(newSet);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Skopiowano do schowka");
  };

  // Funkcja do podświetlania błędów w tekście
  const highlightErrors = (text: string, corrections: Correction[]) => {
    if (!corrections.length) return text;

    // Sortuj poprawki od końca, żeby nie zmieniać indeksów
    const sortedCorrections = [...corrections].sort(
      (a, b) => b.position.start - a.position.start
    );

    let result = text;
    for (const correction of sortedCorrections) {
      const { start, end } = correction.position;
      const before = result.substring(0, start);
      const error = result.substring(start, end);
      const after = result.substring(end);

      const categoryColor =
        CATEGORY_COLORS[correction.category] || CATEGORY_COLORS.interpunkcja;

      result = `${before}<mark class="${categoryColor.bg} ${categoryColor.text} px-1 rounded" title="${correction.rule}">${error}</mark>${after}`;
    }

    return result;
  };

  // Oblicz szacunkowy koszt
  const estimateCost = (inputTokens: number, outputTokens: number) => {
    // Claude Sonnet: $3/1M input, $15/1M output
    const inputCost = (inputTokens / 1_000_000) * 3;
    const outputCost = (outputTokens / 1_000_000) * 15;
    return (inputCost + outputCost).toFixed(6);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Debug Korekty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Testuj i analizuj proces korekty tekstu w czasie rzeczywistym
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Tekst wejściowy
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {inputText.length} znaków
            </span>
          </div>

          {/* Sample texts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {SAMPLE_TEXTS.map((sample, index) => (
              <button
                key={index}
                onClick={() => setInputText(sample.text)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  inputText === sample.text
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-40 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Wklej tekst do sprawdzenia..."
          />

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setInputText("")}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Wyczyść
            </button>

            <button
              onClick={handleCheck}
              disabled={checkMutation.isPending || !inputText.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {checkMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sprawdzam...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Sprawdź tekst
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <>
          {/* Debug Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Errors */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                <AlertTriangle className="w-4 h-4" />
                Błędy
              </div>
              <div
                className={`text-2xl font-bold ${
                  result.errorCount > 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {result.errorCount}
              </div>
            </div>

            {/* Time */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                <Clock className="w-4 h-4" />
                Czas
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result._debug?.responseTimeMs ||
                  (result as any)._clientTime ||
                  0}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  ms
                </span>
              </div>
            </div>

            {/* Input Tokens */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                <Zap className="w-4 h-4" />
                Input
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result._debug?.inputTokens?.toLocaleString() || "N/A"}
              </div>
            </div>

            {/* Output Tokens */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                <Zap className="w-4 h-4" />
                Output
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result._debug?.outputTokens?.toLocaleString() || "N/A"}
              </div>
            </div>

            {/* Total Tokens */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                <BarChart3 className="w-4 h-4" />
                Total
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result._debug?.totalTokens?.toLocaleString() || "N/A"}
              </div>
            </div>

            {/* Cost */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Koszt
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                $
                {result._debug
                  ? estimateCost(
                      result._debug.inputTokens,
                      result._debug.outputTokens
                    )
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Summary by Category */}
          {result.summary && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Podsumowanie według kategorii
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(result.summary).map(([category, count]) => {
                  const categoryInfo =
                    CATEGORY_COLORS[category] || CATEGORY_COLORS.interpunkcja;
                  const Icon = categoryInfo.icon;
                  return (
                    <div
                      key={category}
                      className={`p-4 rounded-lg ${categoryInfo.bg}`}
                    >
                      <div
                        className={`flex items-center gap-2 ${categoryInfo.text} mb-1`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {categoryInfo.label}
                        </span>
                      </div>
                      <div
                        className={`text-3xl font-bold ${categoryInfo.text}`}
                      >
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Original Text with Highlights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Tekst z podświetlonymi błędami
              </h3>
              <button
                onClick={() => copyToClipboard(inputText)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div
              className="p-4 text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: highlightErrors(inputText, result.corrections),
              }}
            />
          </div>

          {/* Corrected Text */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Tekst poprawiony
              </h3>
              <button
                onClick={() => copyToClipboard(result.correctedText)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
              {result.correctedText}
            </div>
          </div>

          {/* Corrections List */}
          {result.corrections.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Lista poprawek ({result.corrections.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {result.corrections.map((correction, index) => {
                  const categoryInfo =
                    CATEGORY_COLORS[correction.category] ||
                    CATEGORY_COLORS.interpunkcja;
                  const Icon = categoryInfo.icon;
                  const isExpanded = expandedCorrections.has(index);

                  return (
                    <div key={index} className="p-4">
                      <div
                        className="flex items-start gap-4 cursor-pointer"
                        onClick={() => toggleCorrection(index)}
                      >
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${categoryInfo.bg}`}
                        >
                          <Icon className={`w-5 h-5 ${categoryInfo.text}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${categoryInfo.bg} ${categoryInfo.text}`}
                            >
                              {categoryInfo.label}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Pozycja: {correction.position.start}-
                              {correction.position.end}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-lg">
                            <span className="line-through text-red-600 dark:text-red-400 font-medium">
                              "{correction.original}"
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              "{correction.corrected}"
                            </span>
                          </div>

                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {correction.rule}
                            </span>
                          </div>
                        </div>

                        <button className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 ml-14 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Wyjaśnienie:
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {correction.explanation}
                          </p>

                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Dane techniczne:
                            </h4>
                            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                              {JSON.stringify(correction, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Raw Response */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setShowRawResponse(!showRawResponse)}
              className="w-full p-4 flex items-center justify-between text-left"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {showRawResponse ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
                Surowa odpowiedź API
              </h3>
              {showRawResponse ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {showRawResponse && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!result && !checkMutation.isPending && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Gotowy do testowania
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Wprowadź tekst powyżej i kliknij "Sprawdź tekst", aby zobaczyć
            szczegółową analizę procesu korekty.
          </p>
        </div>
      )}
    </div>
  );
}
