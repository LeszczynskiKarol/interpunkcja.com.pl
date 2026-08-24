// frontend/src/components/Checker.tsx
import { useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  RefreshCw,
  Zap,
  Gift,
  Crown,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { checkPunctuation, getCheckStatus, type Correction } from "../lib/api";
import { useAuthStore } from "../stores/authStore";
import { clsx } from "clsx";
import { TopUpModal } from "./TopUpModal";
import { Link } from "./HardLink";

interface TopUpPackage {
  id: string;
  amount: number;
  credits: number;
  label: string;
  priceLabel: string;
  bonus?: number;
}

export function Checker() {
  const [text, setText] = useState("");
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [correctedText, setCorrectedText] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpPackages, setTopUpPackages] = useState<TopUpPackage[]>([]);

  const queryClient = useQueryClient();
  const { user, isAuthenticated, refreshUser } = useAuthStore();

  // ⭐ Odśwież dane użytkownika przy montowaniu komponentu
  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated, refreshUser]);

  // Limity zależne od planu (używamy aktualnego user.plan)
  const planMaxChars =
    user?.plan === "LIFETIME" ? 50000 : user?.plan === "PREMIUM" ? 10000 : 500;

  // Status limitów - tylko dla zalogowanych
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ["checkStatus", user?.id],
    queryFn: () => getCheckStatus(),
    enabled: !!user,
    // ⭐ Odświeżaj status co 30 sekund
    refetchInterval: 30000,
    // ⭐ Odświeżaj przy powrocie do okna
    refetchOnWindowFocus: true,
  });

  // ⭐ Synchronizuj plan z odpowiedzi API (jako backup)
  useEffect(() => {
    if (status?.plan && user && status.plan !== user.plan) {
      console.log(
        `[Checker] Plan mismatch detected: local=${user.plan}, server=${status.plan}`,
      );
      // Wymuś odświeżenie danych użytkownika
      refreshUser();
    }
  }, [status?.plan, user, refreshUser]);

  // Jeśli są bonus checks, zwiększ limit znaków do 10000 (jak PREMIUM)
  const hasBonusChecks = (status?.bonusChecks || 0) > 0;
  const maxChars = hasBonusChecks
    ? Math.max(planMaxChars, 10000)
    : planMaxChars;

  // Sprawdź czy tekst przekracza limit
  const textExceedsLimit = text.length > maxChars;
  const textExceedsPlanLimit = text.length > planMaxChars;

  // Czy można użyć bonus check dla tego tekstu (nawet jeśli przekracza plan limit)
  const canUseBonusForLongerText =
    hasBonusChecks && text.length <= 10000 && text.length > planMaxChars;

  // Mutacja sprawdzania
  const checkMutation = useMutation({
    mutationFn: (text: string) => checkPunctuation(text),
    onSuccess: (data) => {
      setCorrections(data.corrections);
      setCorrectedText(data.correctedText);
      setShowResult(true);
      refetchStatus();

      // ⭐ Odśwież też queryClient dla innych komponentów
      queryClient.invalidateQueries({ queryKey: ["checkStatus"] });

      if (data.usedBonusCheck) {
        toast.success("Użyto dodatkowego sprawdzenia!", { icon: "🎁" });
      }

      if (data.errorCount === 0) {
        toast.success("Twój tekst jest poprawny!");
      } else {
        toast.success(
          `Znaleziono ${data.errorCount} ${
            data.errorCount === 1
              ? "błąd"
              : data.errorCount < 5
                ? "błędy"
                : "błędów"
          }`,
        );
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 429) {
        const responseData = error.response.data;
        const reason: string =
          responseData.message || responseData.reason || "";

        // Wykryj blokadę IP (anti-abuse)
        const isIpBlock = /adresu IP|adresu|tego adresu/i.test(reason);

        if (isIpBlock) {
          toast.error(
            "Wykryto wiele sprawdzeń z Twojego adresu sieciowego. Jeśli korzystasz z sieci współdzielonej (firma, uczelnia, mieszkanie), skontaktuj się z nami lub przejdź na Premium.",
            { duration: 8000, icon: "🛡️" },
          );

          if (responseData.canTopUp && responseData.topUpPackages) {
            setTopUpPackages(responseData.topUpPackages);
            setShowTopUpModal(true);
          }
          return;
        }

        // Zwykły limit (dzienny/miesięczny per user)
        if (responseData.canTopUp && responseData.topUpPackages) {
          setTopUpPackages(responseData.topUpPackages);
          setShowTopUpModal(true);
        }

        toast.error(reason || "Przekroczono limit sprawdzeń");
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

  const openTopUpModal = () => {
    if (status?.topUpPackages) {
      setTopUpPackages(status.topUpPackages);
    } else {
      // Fallback packages
      setTopUpPackages([
        {
          id: "topup_5",
          amount: 500,
          credits: 10,
          label: "10 sprawdzeń",
          priceLabel: "5 zł",
        },
        {
          id: "topup_10",
          amount: 1000,
          credits: 25,
          label: "25 sprawdzeń",
          priceLabel: "10 zł",
          bonus: 5,
        },
        {
          id: "topup_20",
          amount: 2000,
          credits: 60,
          label: "60 sprawdzeń",
          priceLabel: "20 zł",
          bonus: 10,
        },
      ]);
    }
    setShowTopUpModal(true);
  };

  // Renderowanie tekstu z podświetlonymi błędami
  const renderHighlightedText = (): ReactNode => {
    if (corrections.length === 0) return text;

    const result: ReactNode[] = [];
    let keyIndex = 0;

    const sortedCorrections = [...corrections].sort(
      (a, b) => (b.original?.length || 0) - (a.original?.length || 0),
    );

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

    foundErrors.sort((a, b) => a.start - b.start);

    let lastIndex = 0;
    for (const error of foundErrors) {
      if (error.start > lastIndex) {
        result.push(
          <span key={keyIndex++}>{text.slice(lastIndex, error.start)}</span>,
        );
      }

      result.push(
        <span
          key={keyIndex++}
          className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-b-2 border-red-500 cursor-help px-0.5 rounded"
          title={`${error.correction.rule}: ${error.correction.explanation}`}
        >
          {text.slice(error.start, error.end)}
        </span>,
      );

      lastIndex = error.end;
    }

    if (lastIndex < text.length) {
      result.push(<span key={keyIndex++}>{text.slice(lastIndex)}</span>);
    }

    return result;
  };

  // ⭐ Użyj planu z API status jako źródła prawdy (bo jest świeży z bazy)
  const displayPlan = status?.plan || user?.plan || "FREE";

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Status limitów */}
      {status && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-gray-600 dark:text-gray-400">
                Plan:{" "}
                <strong
                  className={
                    displayPlan === "PREMIUM" || displayPlan === "LIFETIME"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-gray-700 dark:text-gray-300"
                  }
                >
                  {displayPlan}
                </strong>
              </span>

              {status.bonusChecks > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                  <Gift className="w-3 h-3" />
                  {status.bonusChecks} bonus
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Dzienny licznik */}
              <span
                className={clsx(
                  "px-2 py-1 rounded-md",
                  status.remainingChecks === 0
                    ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                    : "text-gray-600 dark:text-gray-400",
                )}
                title={`Wykorzystano dziś: ${(status as any).usedToday ?? 0} / ${
                  (status as any).maxChecksPerDay === null ||
                  (status as any).maxChecksPerDay === undefined
                    ? "∞"
                    : (status as any).maxChecksPerDay
                }`}
              >
                Dziś:{" "}
                <strong className="text-gray-900 dark:text-white">
                  {(status as any).usedToday ?? 0}
                </strong>
                {(status as any).maxChecksPerDay !== null &&
                  (status as any).maxChecksPerDay !== undefined &&
                  (status as any).maxChecksPerDay !== Infinity && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {" / "}
                      {(status as any).maxChecksPerDay}
                    </span>
                  )}
              </span>

              {/* Miesięczny licznik - tylko FREE */}
              {displayPlan === "FREE" &&
                (status as any).maxChecksPerMonth !== null &&
                (status as any).maxChecksPerMonth !== undefined &&
                (status as any).maxChecksPerMonth !== Infinity && (
                  <span
                    className={clsx(
                      "px-2 py-1 rounded-md",
                      (status as any).remainingMonthly === 0
                        ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                        : "text-gray-600 dark:text-gray-400",
                    )}
                    title={`Wykorzystano w tym miesiącu: ${(status as any).usedThisMonth ?? 0} / ${(status as any).maxChecksPerMonth}`}
                  >
                    Miesiąc:{" "}
                    <strong className="text-gray-900 dark:text-white">
                      {(status as any).usedThisMonth ?? 0}
                    </strong>
                    <span className="text-gray-500 dark:text-gray-400">
                      {" / "}
                      {(status as any).maxChecksPerMonth}
                    </span>
                  </span>
                )}

              {displayPlan === "FREE" && (
                <button
                  onClick={openTopUpModal}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
                >
                  <Zap className="w-3 h-3" />
                  Dokup
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pole tekstowe */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wklej lub wpisz tekst do sprawdzenia..."
          className={clsx(
            "w-full h-96 p-4 border-2 rounded-xl resize-none transition-colors",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            "placeholder-gray-400 dark:placeholder-gray-500",
            "focus:outline-none focus:border-blue-500 dark:focus:border-blue-400",
            textExceedsLimit
              ? "border-red-500 dark:border-red-400"
              : "border-gray-200 dark:border-gray-700",
          )}
          disabled={checkMutation.isPending}
        />

        {/* Licznik znaków */}
        <div
          className={clsx(
            "absolute bottom-3 right-3 text-sm",
            textExceedsLimit
              ? "text-red-600 dark:text-red-400 font-medium"
              : "text-gray-400 dark:text-gray-500",
          )}
        >
          {text.length} / {maxChars}
          {hasBonusChecks && planMaxChars < 10000 && (
            <span className="ml-1 text-green-600 dark:text-green-400">
              (+bonus)
            </span>
          )}
        </div>
      </div>

      {/* Alert gdy tekst przekracza limit */}
      {textExceedsPlanLimit && text.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div
            className={clsx(
              "p-4 rounded-xl border-2",
              canUseBonusForLongerText
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
            )}
          >
            <div className="flex items-start gap-3">
              {canUseBonusForLongerText ? (
                <Gift className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              )}

              <div className="flex-1">
                {canUseBonusForLongerText ? (
                  <>
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      Możesz użyć bonus sprawdzenia!
                    </p>
                    <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                      Twój tekst ma {text.length} znaków. Masz{" "}
                      {status?.bonusChecks} bonus sprawdzeń z limitem do 10 000
                      znaków.
                    </p>
                  </>
                ) : text.length > 10000 ? (
                  <>
                    <p className="text-amber-800 dark:text-amber-200 font-medium">
                      Tekst przekracza maksymalny limit
                    </p>
                    <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                      Maksymalny limit to 10 000 znaków (Premium) lub 50 000
                      (Lifetime). Podziel tekst na mniejsze części.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-amber-800 dark:text-amber-200 font-medium">
                      Tekst przekracza limit {planMaxChars} znaków dla planu{" "}
                      {displayPlan}
                    </p>
                    <p className="text-amber-700 dark:text-amber-300 text-sm mt-1 mb-3">
                      Twój tekst ma {text.length} znaków. Masz kilka opcji:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={openTopUpModal}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                        Dokup sprawdzenia (od 5 zł)
                      </button>

                      <Link
                        to="/cennik"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        <Crown className="w-4 h-4" />
                        Przejdź na Premium
                      </Link>
                    </div>

                    <p className="text-amber-600 dark:text-amber-400 text-xs mt-3">
                      💡 Dokupione sprawdzenia mają limit 10 000 znaków i nie
                      wygasają
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Przyciski */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleCheck}
          disabled={
            checkMutation.isPending || text.length === 0 || textExceedsLimit
          }
          className={clsx(
            "flex-1 py-3 px-6 rounded-xl font-medium transition-all",
            "flex items-center justify-center gap-2",
            checkMutation.isPending || text.length === 0 || textExceedsLimit
              ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
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
              Sprawdź tekst
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
                  : "bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200",
              )}
            >
              {corrections.length === 0 ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">Twój tekst jest poprawny!</span>
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
                        : "błędów"}
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

            {/* CTA dla Free gdy brak limitów */}
            {displayPlan === "FREE" &&
              corrections.length > 0 &&
              status?.remainingChecks === 0 && (
                <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
                  <h3 className="text-lg font-semibold mb-2">
                    Potrzebujesz więcej sprawdzeń?
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Przejdź na Premium i korzystaj bez ograniczeń, lub dokup
                    pojedyncze sprawdzenia.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/cennik"
                      className="px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Zobacz plany →
                    </Link>
                    <button
                      onClick={openTopUpModal}
                      className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-400 transition-colors flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Dokup sprawdzenia
                    </button>
                  </div>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TopUp Modal */}
      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        packages={topUpPackages}
        currentBonusChecks={status?.bonusChecks || 0}
      />
    </div>
  );
}
