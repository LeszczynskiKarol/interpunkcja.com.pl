// frontend/src/pages/admin/AdminPurchases.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";

interface Purchase {
  id: string;
  amount: number;
  amountPLN: number;
  creditsGranted: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  stripeSessionId: string;
  createdAt: string;
  completedAt: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
    plan: string;
  };
}

interface PurchasesResponse {
  purchases: Purchase[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    pageRevenue: number;
  };
}

export function AdminPurchases() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data, isLoading } = useQuery<PurchasesResponse>({
    queryKey: ["admin-purchases", page, userId, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        status: statusFilter,
      });
      if (userId) params.set("userId", userId);
      const res = await api.get(`/api/admin/purchases?${params}`);
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      refundCredits,
    }: {
      id: string;
      status: string;
      refundCredits?: boolean;
    }) => {
      const res = await api.patch(`/api/admin/purchases/${id}`, {
        status,
        refundCredits,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-purchases"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Status zaktualizowany");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Błąd aktualizacji");
    },
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; icon: any }> = {
      PENDING: {
        bg: "bg-yellow-100 dark:bg-yellow-900/50",
        text: "text-yellow-700 dark:text-yellow-300",
        icon: Clock,
      },
      COMPLETED: {
        bg: "bg-green-100 dark:bg-green-900/50",
        text: "text-green-700 dark:text-green-300",
        icon: CheckCircle,
      },
      FAILED: {
        bg: "bg-red-100 dark:bg-red-900/50",
        text: "text-red-700 dark:text-red-300",
        icon: XCircle,
      },
      REFUNDED: {
        bg: "bg-purple-100 dark:bg-purple-900/50",
        text: "text-purple-700 dark:text-purple-300",
        icon: RotateCcw,
      },
    };
    const badge = badges[status] || badges.PENDING;
    const Icon = badge.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getPackageLabel = (amount: number) => {
    const labels: Record<number, string> = {
      5: "10 spr.",
      10: "25 spr.",
      20: "60 spr.",
    };
    return labels[amount] || `${amount} zł`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Zakupy TopUp
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Historia zakupów dodatkowych sprawdzeń
          </p>
        </div>
        {data && (
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Łącznie</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {data.pagination.total} zakupów
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
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
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="ALL">Wszystkie statusy</option>
          <option value="COMPLETED">Zakończone</option>
          <option value="PENDING">Oczekujące</option>
          <option value="FAILED">Nieudane</option>
          <option value="REFUNDED">Zwrócone</option>
        </select>
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
                    Użytkownik
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Pakiet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Kwota
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
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
                {data?.purchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {purchase.user.name || "Brak nazwy"}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm block">
                          {purchase.user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {purchase.creditsGranted} sprawdzeń
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          ({getPackageLabel(purchase.amountPLN)})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {purchase.amountPLN} zł
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(purchase.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-gray-900 dark:text-white text-sm">
                          {new Date(purchase.createdAt).toLocaleDateString(
                            "pl-PL"
                          )}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs block">
                          {new Date(purchase.createdAt).toLocaleTimeString(
                            "pl-PL",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {purchase.status === "COMPLETED" && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Czy na pewno chcesz oznaczyć jako zwrócone? Kredyty zostaną odjęte użytkownikowi."
                                )
                              ) {
                                updateStatusMutation.mutate({
                                  id: purchase.id,
                                  status: "REFUNDED",
                                  refundCredits: true,
                                });
                              }
                            }}
                            className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                            title="Oznacz jako zwrócone"
                          >
                            Refund
                          </button>
                        )}
                        {purchase.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Czy na pewno oznaczyć jako zakończone?"
                                  )
                                ) {
                                  updateStatusMutation.mutate({
                                    id: purchase.id,
                                    status: "COMPLETED",
                                  });
                                }
                              }}
                              className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                            >
                              Zakończ
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Czy na pewno oznaczyć jako nieudane?"
                                  )
                                ) {
                                  updateStatusMutation.mutate({
                                    id: purchase.id,
                                    status: "FAILED",
                                  });
                                }
                              }}
                              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              Anuluj
                            </button>
                          </>
                        )}
                        <a
                          href={`https://dashboard.stripe.com/checkout/sessions/${purchase.stripeSessionId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Zobacz w Stripe"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}

                {data?.purchases.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      Brak zakupów do wyświetlenia
                    </td>
                  </tr>
                )}
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

      {/* Summary */}
      {data && data.purchases.length > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">
              Przychód z tej strony (COMPLETED):
            </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {data.summary.pageRevenue.toLocaleString("pl-PL")} zł
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
