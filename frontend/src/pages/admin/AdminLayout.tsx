// frontend/src/pages/admin/AdminLayout.tsx
import { Link, NavLink, Outlet, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  TrendingUp,
  ArrowLeft,
  Shield,
  FileText,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/uzytkownicy", icon: Users, label: "Użytkownicy" },
  { to: "/admin/sprawdzenia", icon: FileCheck, label: "Sprawdzenia" },
  { to: "/admin/artykuly", icon: FileText, label: "Artykuły" },
  { to: "/admin/statystyki", icon: TrendingUp, label: "Statystyki" },
];

export function AdminLayout() {
  const { user } = useAuthStore();

  // Sprawdź czy user jest adminem
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/panel" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-white">
                Interpunkcja
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 block">
                Panel admina
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Back to app */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/panel"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Wróć do aplikacji
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Zalogowany jako:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user.email}
              </span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
                ADMIN
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
