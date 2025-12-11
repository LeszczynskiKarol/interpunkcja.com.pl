// frontend/src/pages/admin/AdminChecks.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  FileText,
  X,
} from "lucide-react";
import { api } from "../../lib/api";

interface Check {
  id: string;
  originalTextPreview: string;
  charCount: number;
  errorCount: number;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

interface CheckDetail {
  id: string;
  originalText: string;
  correctedText: string;
  corrections: any[];
  charCount: number;
  errorCount: number;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    plan: string;
  } | null;
}

interface ChecksResponse {
  checks: Check[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function AdminChecks() {
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<ChecksResponse>({
    queryKey: ["admin-checks", page, userId],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (userId) params.set("userId", userId);
      const res = await api.get(`/api/admin/checks?${params}`);
      return res.data;
    },
  });

  const { data: checkDetail, isLoading: isLoadingDetail } =
    useQuery<CheckDetail>({
      queryKey: ["admin-check-detail", selectedCheckId],
      queryFn: async () => {
        const res = await api.get(`/api/admin/checks/${selectedCheckId}`);
        return res.data;
      },
      enabled: !!selectedCheckId,
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sprawdzenia
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Historia wszystkich sprawdzeń interpunkcji
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setPage(1);
            }}
            placeholder="ID użytkownika..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Tekst
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Użytkownik
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Znaki
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Błędy
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Data
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data?.checks.map((check) => (
                  <tr
                    key={check.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white text-sm truncate max-w-xs">
                          {check.originalTextPreview}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {check.user ? (
                        <div>
                          <span className="text-gray-900 dark:text-white text-sm">
                            {check.user.name || "Brak nazwy"}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs block">
                            {check.user.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Gość</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {check.charCount.toLocaleString("pl-PL")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          check.errorCount === 0
                            ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                        }`}
                      >
                        {check.errorCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(check.createdAt).toLocaleString("pl-PL")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedCheckId(check.id)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="Zobacz szczegóły"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Strona {data.pagination.page} z {data.pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                }
                disabled={page === data.pagination.totalPages}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCheckId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Szczegóły sprawdzenia
              </h2>
              <button
                onClick={() => setSelectedCheckId(null)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : checkDetail ? (
                <>
                  {/* Meta info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Użytkownik:
                      </span>{" "}
                      <span className="text-gray-900 dark:text-white font-medium">
                        {checkDetail.user?.email || "Gość"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Data:
                      </span>{" "}
                      <span className="text-gray-900 dark:text-white">
                        {new Date(checkDetail.createdAt).toLocaleString(
                          "pl-PL"
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Znaki:
                      </span>{" "}
                      <span className="text-gray-900 dark:text-white">
                        {checkDetail.charCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Błędy:
                      </span>{" "}
                      <span className="text-gray-900 dark:text-white">
                        {checkDetail.errorCount}
                      </span>
                    </div>
                  </div>

                  {/* Original text */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Oryginalny tekst
                    </h3>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {checkDetail.originalText}
                    </div>
                  </div>

                  {/* Corrected text */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Poprawiony tekst
                    </h3>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {checkDetail.correctedText}
                    </div>
                  </div>

                  {/* Corrections */}
                  {checkDetail.corrections.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Poprawki ({checkDetail.corrections.length})
                      </h3>
                      <div className="space-y-2">
                        {checkDetail.corrections.map((c: any, i: number) => (
                          <div
                            key={i}
                            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded">
                                {c.rule}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="line-through text-red-600 dark:text-red-400">
                                {c.original}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                {c.corrected}
                              </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                              {c.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
