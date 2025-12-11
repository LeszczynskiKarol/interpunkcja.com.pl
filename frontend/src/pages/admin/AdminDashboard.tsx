// frontend/src/pages/admin/AdminDashboard.tsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Users,
  FileCheck,
  TrendingUp,
  Crown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { api } from "../../lib/api";

interface Stats {
  users: {
    total: number;
    premium: number;
    lifetime: number;
    free: number;
    newToday: number;
    newWeek: number;
    newMonth: number;
    active: number;
  };
  checks: {
    total: number;
    today: number;
    week: number;
    month: number;
    totalChars: number;
    totalErrors: number;
  };
  revenue: {
    premiumMonthly: number;
    lifetimeTotal: number;
    estimatedMRR: number;
  };
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: { value: number; label: string };
  color?: "blue" | "green" | "amber" | "purple" | "red";
}) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    amber:
      "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    red: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend.value >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.value >= 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
        {value}
      </p>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<Stats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await api.get("/api/admin/stats");
      return res.data;
    },
    refetchInterval: 30000, // Odśwież co 30 sekund
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
        Błąd ładowania statystyk
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Panel administracyjny
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Przegląd statystyk i zarządzanie aplikacją
        </p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Wszyscy użytkownicy"
          value={stats.users.total.toLocaleString("pl-PL")}
          subtitle={`+${stats.users.newWeek} w tym tygodniu`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Sprawdzenia"
          value={stats.checks.total.toLocaleString("pl-PL")}
          subtitle={`${stats.checks.today} dzisiaj`}
          icon={FileCheck}
          color="green"
        />
        <StatCard
          title="Premium"
          value={stats.users.premium}
          subtitle={`+ ${stats.users.lifetime} Lifetime`}
          icon={Crown}
          color="amber"
        />
        <StatCard
          title="MRR (szacunkowe)"
          value={`${stats.revenue.estimatedMRR.toLocaleString("pl-PL")} zł`}
          subtitle="Miesięczny przychód"
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Użytkownicy według planu
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Free</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-500 rounded-full"
                    style={{
                      width: `${(stats.users.free / stats.users.total) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-medium text-gray-900 dark:text-white w-12 text-right">
                  {stats.users.free}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Premium</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${
                        (stats.users.premium / stats.users.total) * 100
                      }%`,
                    }}
                  />
                </div>
                <span className="font-medium text-gray-900 dark:text-white w-12 text-right">
                  {stats.users.premium}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lifetime</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: `${
                        (stats.users.lifetime / stats.users.total) * 100
                      }%`,
                    }}
                  />
                </div>
                <span className="font-medium text-gray-900 dark:text-white w-12 text-right">
                  {stats.users.lifetime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Aktywność
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Aktywni (7 dni)
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.users.active}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Nowi (miesiąc)
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.users.newMonth}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Sprawdzeń (tydzień)
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.checks.week.toLocaleString("pl-PL")}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Znalezione błędy
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.checks.totalErrors.toLocaleString("pl-PL")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/uzytkownicy"
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Zarządzaj użytkownikami
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Edytuj, blokuj, zmieniaj plany
            </p>
          </div>
        </Link>
        <Link
          to="/admin/sprawdzenia"
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-colors"
        >
          <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <FileCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Historia sprawdzeń
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Przeglądaj wszystkie sprawdzenia
            </p>
          </div>
        </Link>
        <Link
          to="/admin/statystyki"
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
        >
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              Szczegółowe statystyki
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Wykresy i analityka
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
