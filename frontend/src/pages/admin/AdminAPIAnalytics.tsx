// frontend/src/pages/admin/AdminAPIAnalytics.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Cpu,
  DollarSign,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  Activity,
  BarChart3,
  PieChart,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { api } from "../../lib/api";

interface APIStats {
  totals: {
    totalChecks: number;
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    totalCostUsd: number;
    avgResponseTimeMs: number;
    avgTokensPerCheck: number;
    avgCostPerCheck: number;
  };
  byCategory: {
    interpunkcja: number;
    ortografia: number;
    pisownia: number;
    gramatyka: number;
    stylistyka: number;
  };
  daily: Array<{
    date: string;
    checks: number;
    tokens: number;
    costUsd: number;
    avgTimeMs: number;
    errors: number;
  }>;
  recentChecks: Array<{
    id: string;
    createdAt: string;
    charCount: number;
    errorCount: number;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    responseTimeMs: number;
    costUsd: number;
    userEmail: string | null;
  }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  interpunkcja: "#3B82F6",
  ortografia: "#EF4444",
  pisownia: "#F59E0B",
  gramatyka: "#10B981",
  stylistyka: "#8B5CF6",
};

const CATEGORY_LABELS: Record<string, string> = {
  interpunkcja: "Interpunkcja",
  ortografia: "Ortografia",
  pisownia: "Pisownia",
  gramatyka: "Gramatyka",
  stylistyka: "Stylistyka",
};

export function AdminAPIAnalytics() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const { data, isLoading, refetch, isFetching } = useQuery<APIStats>({
    queryKey: ["admin-api-analytics", timeRange],
    queryFn: async () => {
      const res = await api.get(`/api/admin/analytics/api?range=${timeRange}`);
      return res.data;
    },
    refetchInterval: 60000,
  });

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("pl-PL").format(Math.round(value));
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatDateTick = (value: string): string => {
    const date = new Date(value);
    return `${date.getDate()}.${date.getMonth() + 1}`;
  };

  const formatDateLabel = (label: string): string => {
    return new Date(label).toLocaleDateString("pl-PL");
  };

  const categoryData = data
    ? Object.entries(data.byCategory)
        .filter(([, count]) => count > 0)
        .map(([category, count]) => ({
          name: CATEGORY_LABELS[category] || category,
          value: count,
          color: CATEGORY_COLORS[category] || "#6B7280",
        }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-blue-600" />
            Analityka API
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Szczegółowa analiza procesu korekty i zużycia API Claude
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {range === "7d"
                  ? "7 dni"
                  : range === "30d"
                  ? "30 dni"
                  : "90 dni"}
              </button>
            ))}
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <RefreshCw
              className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : data ? (
        <>
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tokeny łącznie
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.totals.totalTokens)}
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Input:{" "}
                  <strong>{formatNumber(data.totals.inputTokens)}</strong>
                </span>
                <span>
                  Output:{" "}
                  <strong>{formatNumber(data.totals.outputTokens)}</strong>
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Koszt API
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.totals.totalCostUsd)}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Średnio {formatCurrency(data.totals.avgCostPerCheck)} /
                sprawdzenie
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Średni czas
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(data.totals.avgResponseTimeMs)}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Średnio {formatNumber(data.totals.avgTokensPerCheck)} tokenów /
                spr.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Sprawdzeń
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(data.totals.totalChecks)}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                W wybranym okresie (
                {timeRange === "7d"
                  ? "7 dni"
                  : timeRange === "30d"
                  ? "30 dni"
                  : "90 dni"}
                )
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Zużycie dzienne
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.daily}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      opacity={0.2}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#9CA3AF", fontSize: 11 }}
                      tickFormatter={formatDateTick}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: "#9CA3AF", fontSize: 11 }}
                      tickFormatter={(value: number) => `$${value.toFixed(2)}`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      labelFormatter={formatDateLabel}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="costUsd"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                      name="Koszt ($)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="checks"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                      name="Sprawdzeń"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                Błędy wg kategorii
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Response Time Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              Czas odpowiedzi i tokeny (dziennie)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    tickFormatter={formatDateTick}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    tickFormatter={(value: number) =>
                      `${(value / 1000).toFixed(0)}s`
                    }
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#9CA3AF", fontSize: 11 }}
                    tickFormatter={(value: number) =>
                      `${(value / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    labelFormatter={formatDateLabel}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="avgTimeMs"
                    fill="#F59E0B"
                    name="Śr. czas (ms)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="tokens"
                    fill="#8B5CF6"
                    name="Tokeny"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Checks with Metadata */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Ostatnie sprawdzenia (z metadanymi)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Czas
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
                      Input
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Output
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Razem
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Czas odp.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Koszt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.recentChecks.map((check) => (
                    <tr
                      key={check.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(check.createdAt).toLocaleString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {check.userEmail || (
                          <span className="text-gray-400">Gość</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {formatNumber(check.charCount)}
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
                      <td className="px-4 py-3 text-sm text-blue-600 dark:text-blue-400 font-mono">
                        {check.inputTokens > 0
                          ? formatNumber(check.inputTokens)
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-purple-600 dark:text-purple-400 font-mono">
                        {check.outputTokens > 0
                          ? formatNumber(check.outputTokens)
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono font-medium">
                        {check.totalTokens > 0
                          ? formatNumber(check.totalTokens)
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {check.responseTimeMs > 0 ? (
                          <span
                            className={`font-mono ${
                              check.responseTimeMs > 20000
                                ? "text-red-600 dark:text-red-400"
                                : check.responseTimeMs > 10000
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {formatTime(check.responseTimeMs)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-mono">
                        {check.costUsd > 0
                          ? formatCurrency(check.costUsd)
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Breakdown Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Informacje o kosztach API
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-gray-900 dark:text-white">
                  Model
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Claude Sonnet 4.5
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-gray-900 dark:text-white">
                  Input
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  $3.00 / 1M tokenów
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-gray-900 dark:text-white">
                  Output
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  $15.00 / 1M tokenów
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
