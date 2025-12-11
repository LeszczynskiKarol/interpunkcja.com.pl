// frontend/src/pages/Checker.tsx
import { useState, ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { checkPunctuation, getCheckStatus, type Correction } from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import { clsx } from "clsx";

export function Checker() {
  const [text, setText] = useState("");
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [correctedText, setCorrectedText] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const { user } = useAuthStore();

  // Limity zależne od planu
  const maxChars =
    user?.plan === "PREMIUM" || user?.plan === "LIFETIME" ? 10000 : 500;

  // Status limitów - tylko dla zalogowanych
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ["checkStatus", user?.id],
    queryFn: () => getCheckStatus(),
    enabled: !!user,
  });

  // Mutacja sprawdzania - wymaga logowania
  const checkMutation = useMutation({
    mutationFn: (text: string) => checkPunctuation(text),
    onSuccess: (data) => {
      setCorrections(data.corrections);
      setCorrectedText(data.correctedText);
      setShowResult(true);
      refetchStatus();

      if (data.errorCount === 0) {
        toast.success("Twój tekst jest poprawny interpunkcyjnie!");
      } else {
        toast.success(
          `Znaleziono ${data.errorCount} ${
            data.errorCount === 1
              ? "błąd"
              : data.errorCount < 5
              ? "błędy"
              : "błędów"
          }`
        );
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 429) {
        toast.error(
          error.response.data.message || "Przekroczono limit sprawdzeń"
        );
      } else {
        toast.error("Wystąpił błąd podczas sprawdzania tekstu");
      }
    },
  });

  const handleCheck = () => {
    if (!text.trim()) {
      toast.error("Wpisz tekst do sprawdzenia");
      return;
    }
    if (text.length > maxChars) {
      toast.error(`Tekst przekracza limit ${maxChars} znaków`);
      return;
    }
    checkMutation.mutate(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(correctedText);
    toast.success("Skopiowano poprawiony tekst");
  };

  const handleReset = () => {
    setText("");
    setCorrections([]);
    setCorrectedText("");
    setShowResult(false);
  };

  // Renderowanie tekstu z podświetlonymi błędami
  const renderHighlightedText = (): ReactNode => {
    if (corrections.length === 0) return text;

    const result: ReactNode[] = [];
    let keyIndex = 0;

    // Sortuj poprawki po długości original (od najdłuższych) żeby uniknąć nakładania się
    const sortedCorrections = [...corrections].sort(
      (a, b) => (b.original?.length || 0) - (a.original?.length || 0)
    );

    // Znajdź wszystkie wystąpienia błędów
    interface FoundError {
      start: number;
      end: number;
      correction: Correction;
    }

    const foundErrors: FoundError[] = [];

    for (const correction of sortedCorrections) {
      if (!correction.original) continue;

      const index = text.indexOf(correction.original);
      if (index === -1) continue;

      // Sprawdź czy ten zakres nie nakłada się z już znalezionym
      let overlaps = false;
      for (const found of foundErrors) {
        if (
          index < found.end &&
          index + correction.original.length > found.start
        ) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        foundErrors.push({
          start: index,
          end: index + correction.original.length,
          correction,
        });
      }
    }

    // Sortuj znalezione błędy po pozycji
    foundErrors.sort((a, b) => a.start - b.start);

    // Buduj wynik
    let lastIndex = 0;
    for (const error of foundErrors) {
      // Tekst przed błędem
      if (error.start > lastIndex) {
        result.push(
          <span key={keyIndex++}>{text.slice(lastIndex, error.start)}</span>
        );
      }

      // Błędny fragment
      result.push(
        <span
          key={keyIndex++}
          className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-b-2 border-red-500 cursor-help px-0.5 rounded"
          title={`${error.correction.rule}: ${error.correction.explanation}`}
        >
          {text.slice(error.start, error.end)}
        </span>
      );

      lastIndex = error.end;
    }

    // Reszta tekstu
    if (lastIndex < text.length) {
      result.push(<span key={keyIndex++}>{text.slice(lastIndex)}</span>);
    }

    return result;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Status limitów */}
      {status && (
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Plan:{" "}
            <strong
              className={
                user?.plan === "PREMIUM"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-gray-700 dark:text-gray-300"
              }
            >
              {user?.plan || "FREE"}
            </strong>
          </span>
          <span>
            Pozostało:{" "}
            <strong className="text-gray-900 dark:text-white">
              {status.remainingChecks === Infinity
                ? "∞"
                : status.remainingChecks}
            </strong>{" "}
            sprawdzeń
            {" | "}
            <strong className="text-gray-900 dark:text-white">
              {status.remainingChars === Infinity ? "∞" : status.remainingChars}
            </strong>{" "}
            znaków dziś
          </span>
        </div>
      )}

      {/* Pole tekstowe */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wklej lub wpisz tekst do sprawdzenia interpunkcji..."
          className={clsx(
            "w-full h-96 p-4 border-2 rounded-xl resize-none transition-colors",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            "placeholder-gray-400 dark:placeholder-gray-500",
            "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400",
            text.length > maxChars
              ? "border-red-500 dark:border-red-400"
              : "border-gray-200 dark:border-gray-700"
          )}
          disabled={checkMutation.isPending}
        />

        {/* Licznik znaków */}
        <div
          className={clsx(
            "absolute bottom-3 right-3 text-sm",
            text.length > maxChars
              ? "text-red-600 dark:text-red-400 font-medium"
              : "text-gray-400 dark:text-gray-500"
          )}
        >
          {text.length} / {maxChars}
        </div>
      </div>

      {/* Przyciski */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleCheck}
          disabled={
            checkMutation.isPending ||
            text.length === 0 ||
            text.length > maxChars
          }
          className={clsx(
            "flex-1 py-3 px-6 rounded-xl font-medium transition-all",
            "flex items-center justify-center gap-2",
            checkMutation.isPending ||
              text.length === 0 ||
              text.length > maxChars
              ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
          )}
        >
          {checkMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sprawdzam...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Sprawdź interpunkcję
            </>
          )}
        </button>

        {showResult && (
          <button
            onClick={handleReset}
            className="py-3 px-6 rounded-xl font-medium border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Nowy tekst
          </button>
        )}
      </div>

      {/* Wyniki */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 space-y-6"
          >
            {/* Podsumowanie */}
            <div
              className={clsx(
                "p-4 rounded-xl flex items-center gap-3",
                corrections.length === 0
                  ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  : "bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200"
              )}
            >
              {corrections.length === 0 ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">
                    Twój tekst jest poprawny interpunkcyjnie!
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-medium">
                    Znaleziono {corrections.length}{" "}
                    {corrections.length === 1
                      ? "błąd"
                      : corrections.length < 5
                      ? "błędy"
                      : "błędów"}{" "}
                    interpunkcyjnych
                  </span>
                </>
              )}
            </div>

            {/* Oryginalny tekst z podświetlonymi błędami */}
            {corrections.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Twój tekst z zaznaczonymi błędami:
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                  {renderHighlightedText()}
                </div>
              </div>
            )}

            {/* Poprawiony tekst */}
            {corrections.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    Poprawiony tekst:
                  </h3>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <Copy className="w-4 h-4" />
                    Kopiuj
                  </button>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                  {correctedText}
                </div>
              </div>
            )}

            {/* Lista poprawek */}
            {corrections.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Szczegóły poprawek:
                </h3>
                <div className="space-y-3">
                  {corrections.map((correction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                              {correction.rule}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="line-through text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">
                              {correction.original || "(brak)"}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded font-medium">
                              {correction.corrected || "(usuń)"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {correction.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA dla Free */}
            {(!user || user.plan === "FREE") && corrections.length > 0 && (
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">Chcesz więcej?</h3>
                <p className="text-blue-100 mb-4">
                  Przejdź na Premium i odblouj pełne wyjaśnienia, brak limitów i
                  historię sprawdzeń.
                </p>
                <button className="px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                  Zobacz plany →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
