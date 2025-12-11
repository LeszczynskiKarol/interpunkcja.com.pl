// frontend/src/pages/Dashboard.tsx
import { Checker } from "../components/Checker";
import { useAuthStore } from "../stores/authStore";
import { Crown, History, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Witaj, {user?.name || "Użytkowniku"}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Sprawdź interpunkcję w swoim tekście
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Plan badge */}
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  user?.plan === "PREMIUM" || user?.plan === "LIFETIME"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {user?.plan === "LIFETIME" && (
                  <>
                    <Crown className="w-4 h-4 inline mr-1" />
                    Lifetime
                  </>
                )}
                {user?.plan === "PREMIUM" && (
                  <>
                    <Crown className="w-4 h-4 inline mr-1" />
                    Premium
                  </>
                )}
                {user?.plan === "FREE" && "Plan Free"}
              </div>

              {/* Quick actions */}
              <Link
                to="/historia"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Historia sprawdzeń"
              >
                <History className="w-5 h-5" />
              </Link>
              <Link
                to="/konto"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Ustawienia konta"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Checker */}
      <main className="px-4 py-8">
        <Checker />
      </main>

      {/* Upgrade CTA for free users */}
      {user?.plan === "FREE" && (
        <section className="px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Potrzebujesz więcej sprawdzeń?
                  </h3>
                  <p className="text-blue-100">
                    Przejdź na Premium i korzystaj bez ograniczeń: 100 sprawdzeń
                    dziennie, do 10 000 znaków!
                  </p>
                </div>
                <Link
                  to="/cennik"
                  className="flex-shrink-0 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Zobacz cennik →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
