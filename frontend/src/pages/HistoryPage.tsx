// frontend/src/pages/HistoryPage.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  History,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { useAuthStore } from "../stores/authStore";

interface CheckHistory {
  id: string;
  originalText: string;
  correctedText: string;
  corrections: Array<{
    original: string;
    corrected: string;
    rule: string;
    explanation: string;
  }>;
  errorCount: number;
  charCount: number;
  createdAt: string;
}

export function HistoryPage() {
  const { user } = useAuthStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sprawdź czy użytkownik ma dostęp do historii
  const hasAccess = user?.plan === "PREMIUM" || user?.plan === "LIFETIME";

  const {
    data: history,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["checkHistory"],
    queryFn: async () => {
      const response = await api.get("/api/check/history");
      return response.data as CheckHistory[];
    },
    enabled: hasAccess,
  });

  // Filtruj po wyszukiwaniu
  const filteredHistory = history?.filter(
    (item) =>
      item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.correctedText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Skopiowano do schowka");
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Historia sprawdzeń
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Historia sprawdzeń jest dostępna tylko dla użytkowników Premium i
            Lifetime.
          </p>
          <Link
            to="/cennik"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Przejdź na Premium →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <History className="w-8 h-8" />
            Historia sprawdzeń
          </h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj w historii..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Ładowanie historii...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">
              Błąd ładowania historii
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredHistory?.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery
                ? "Brak wyników dla tego wyszukiwania"
                : "Brak sprawdzeń w historii"}
            </p>
          </div>
        )}

        {/* History list */}
        <div className="space-y-4">
          {filteredHistory?.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <p className="text-gray-900 dark:text-white line-clamp-1">
                    {item.originalText.slice(0, 100)}...
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.createdAt).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>{item.charCount} znaków</span>
                    <span
                      className={
                        item.errorCount > 0
                          ? "text-amber-600"
                          : "text-green-600"
                      }
                    >
                      {item.errorCount}{" "}
                      {item.errorCount === 1
                        ? "błąd"
                        : item.errorCount < 5
                        ? "błędy"
                        : "błędów"}
                    </span>
                  </div>
                </div>
                {expandedId === item.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Expanded content */}
              {expandedId === item.id && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Original text */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Oryginalny tekst
                      </h4>
                      <button
                        onClick={() => copyText(item.originalText)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Kopiuj
                      </button>
                    </div>
                    <p className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {item.originalText}
                    </p>
                  </div>

                  {/* Corrected text */}
                  {item.errorCount > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Poprawiony tekst
                        </h4>
                        <button
                          onClick={() => copyText(item.correctedText)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Kopiuj
                        </button>
                      </div>
                      <p className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {item.correctedText}
                      </p>
                    </div>
                  )}

                  {/* Corrections list */}
                  {item.corrections.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Poprawki ({item.corrections.length})
                      </h4>
                      <div className="space-y-2">
                        {item.corrections.map((correction, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs rounded">
                                {correction.rule}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="line-through text-red-600 dark:text-red-400">
                                {correction.original || "(brak)"}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                {correction.corrected || "(usuń)"}
                              </span>
                            </div>
                            <p className="mt-1 text-gray-600 dark:text-gray-400 text-xs">
                              {correction.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
