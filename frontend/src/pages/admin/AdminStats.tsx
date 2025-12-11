// frontend/src/pages/admin/AdminStats.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "../../lib/api";

interface DailyData {
  date: string;
  newUsers: number;
  checks: number;
  chars: number;
}

interface PlanData {
  plan: string;
  count: number;
}

export function AdminStats() {
  const [days, setDays] = useState(30);

  const { data: dailyData, isLoading: isLoadingDaily } = useQuery<DailyData[]>({
    queryKey: ["admin-charts-daily", days],
    queryFn: async () => {
      const res = await api.get(`/api/admin/charts/daily?days=${days}`);
      return res.data;
    },
  });

  const { data: planData, isLoading: isLoadingPlans } = useQuery<PlanData[]>({
    queryKey: ["admin-charts-plans"],
    queryFn: async () => {
      const res = await api.get("/api/admin/charts/plans");
      return res.data;
    },
  });

  const maxChecks = dailyData
    ? Math.max(...dailyData.map((d) => d.checks), 1)
    : 1;
  const maxUsers = dailyData
    ? Math.max(...dailyData.map((d) => d.newUsers), 1)
    : 1;
  const totalPlanCount = planData
    ? planData.reduce((sum, p) => sum + p.count, 0)
    : 1;

  const planColors: Record<string, string> = {
    FREE: "#6B7280",
    PREMIUM: "#F59E0B",
    LIFETIME: "#8B5CF6",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Statystyki
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Szczegółowa analiza aktywności
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value={7}>Ostatnie 7 dni</option>
          <option value={30}>Ostatnie 30 dni</option>
          <option value={60}>Ostatnie 60 dni</option>
          <option value={90}>Ostatnie 90 dni</option>
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checks chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sprawdzenia dziennie
          </h2>
          {isLoadingDaily ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : dailyData ? (
            <div className="h-64 flex items-end gap-1">
              {dailyData.map((day, i) => (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="relative w-full">
                    <div
                      className="w-full bg-green-500 dark:bg-green-600 rounded-t transition-all hover:bg-green-600 dark:hover:bg-green-500"
                      style={{
                        height: `${(day.checks / maxChecks) * 200}px`,
                        minHeight: day.checks > 0 ? "4px" : "0",
                      }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {day.date}: {day.checks} sprawdzeń
                    </div>
                  </div>
                  {i % Math.ceil(dailyData.length / 7) === 0 && (
                    <span className="text-xs text-gray-400 mt-1 rotate-45 origin-left">
                      {day.date.slice(5)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Łącznie:{" "}
            {dailyData
              ?.reduce((sum, d) => sum + d.checks, 0)
              .toLocaleString("pl-PL")}{" "}
            sprawdzeń
          </div>
        </div>

        {/* Users chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Nowi użytkownicy dziennie
          </h2>
          {isLoadingDaily ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : dailyData ? (
            <div className="h-64 flex items-end gap-1">
              {dailyData.map((day, i) => (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="relative w-full">
                    <div
                      className="w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-all hover:bg-blue-600 dark:hover:bg-blue-500"
                      style={{
                        height: `${(day.newUsers / maxUsers) * 200}px`,
                        minHeight: day.newUsers > 0 ? "4px" : "0",
                      }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {day.date}: {day.newUsers} nowych
                    </div>
                  </div>
                  {i % Math.ceil(dailyData.length / 7) === 0 && (
                    <span className="text-xs text-gray-400 mt-1 rotate-45 origin-left">
                      {day.date.slice(5)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Łącznie:{" "}
            {dailyData
              ?.reduce((sum, d) => sum + d.newUsers, 0)
              .toLocaleString("pl-PL")}{" "}
            nowych użytkowników
          </div>
        </div>

        {/* Plans distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Rozkład planów
          </h2>
          {isLoadingPlans ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : planData ? (
            <div className="space-y-4">
              {planData.map((plan) => (
                <div key={plan.plan}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {plan.plan}
                    </span>
                    <span className="text-gray-900 dark:text-white font-bold">
                      {plan.count} (
                      {((plan.count / totalPlanCount) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(plan.count / totalPlanCount) * 100}%`,
                        backgroundColor: planColors[plan.plan] || "#6B7280",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Characters processed */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Przetworzone znaki
          </h2>
          {isLoadingDaily ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : dailyData ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">
                  {(
                    dailyData.reduce((sum, d) => sum + d.chars, 0) / 1000000
                  ).toFixed(2)}{" "}
                  M
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  znaków w ostatnich {days} dniach
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dailyData.length > 0
                      ? Math.round(
                          dailyData.reduce((sum, d) => sum + d.chars, 0) /
                            dailyData.length
                        ).toLocaleString("pl-PL")
                      : 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    średnio dziennie
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dailyData.length > 0 &&
                    dailyData.reduce((sum, d) => sum + d.checks, 0) > 0
                      ? Math.round(
                          dailyData.reduce((sum, d) => sum + d.chars, 0) /
                            dailyData.reduce((sum, d) => sum + d.checks, 0)
                        ).toLocaleString("pl-PL")
                      : 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    średnio na sprawdzenie
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
