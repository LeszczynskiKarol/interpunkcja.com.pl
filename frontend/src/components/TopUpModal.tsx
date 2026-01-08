// frontend/src/components/TopUpModal.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { X, Loader2, Zap, Check, Gift, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../lib/api";

interface TopUpPackage {
  id: string;
  amount: number;
  credits: number;
  label: string;
  priceLabel: string;
  bonus?: number;
}

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: TopUpPackage[];
  currentBonusChecks: number;
}

export function TopUpModal({
  isOpen,
  onClose,
  packages,
  currentBonusChecks,
}: TopUpModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>(
    packages[0]?.id || "topup_5"
  );

  const createCheckoutMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const res = await api.post("/api/payments/create-topup-checkout", {
        packageId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Nie udało się utworzyć płatności"
      );
    },
  });

  const handlePurchase = () => {
    createCheckoutMutation.mutate(selectedPackage);
  };

  if (!isOpen) return null;

  const selectedPkg = packages.find((p) => p.id === selectedPackage);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Dokup sprawdzenia</h2>
              <p className="text-blue-100 text-sm">
                Jednorazowy zakup bez subskrypcji
              </p>
            </div>
          </div>
        </div>

        {/* Current bonus */}
        {currentBonusChecks > 0 && (
          <div className="px-6 pt-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Masz już <strong>{currentBonusChecks}</strong> dodatkowych
                sprawdzeń
              </span>
            </div>
          </div>
        )}

        {/* Packages */}
        <div className="p-6 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Wybierz pakiet dodatkowych sprawdzeń:
          </p>

          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                selectedPackage === pkg.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPackage === pkg.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {selectedPackage === pkg.id && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className="text-left">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pkg.label}
                  </span>
                  {pkg.bonus && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                      <Gift className="w-3 h-3 inline mr-1" />+{pkg.bonus} bonus
                    </span>
                  )}
                </div>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {pkg.priceLabel}
              </span>
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Wybrany pakiet:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {selectedPkg?.label}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600 dark:text-gray-400">
                Do zapłaty:
              </span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {selectedPkg?.priceLabel}
              </span>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={createCheckoutMutation.isPending}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {createCheckoutMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Przekierowuję...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Przejdź do płatności
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            Płatność jednorazowa • Sprawdzenia nie wygasają
          </p>
        </div>

        {/* Features */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
            Co otrzymujesz:
          </p>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-500" />
              Pełne wyjaśnienia błędów (jak Premium)
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-500" />
              Limit do 10 000 znaków na sprawdzenie
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3 h-3 text-green-500" />
              Bezterminowa ważność
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
