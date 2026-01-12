// frontend/src/pages/admin/AdminLayout.tsx
import { Outlet, NavLink, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  BarChart3,
  CreditCard,
  ArrowLeft,
  Bug,
  Activity,
  FileText,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

export function AdminLayout() {
  const { user } = useAuthStore();

  // Sprawdź czy user jest adminem
  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/panel" replace />;
  }

  const navItems = [
    {
      to: "/admin",
      icon: LayoutDashboard,
      label: "Dashboard",
      end: true,
    },
    {
      to: "/admin/uzytkownicy",
      icon: Users,
      label: "Użytkownicy",
    },
    {
      to: "/admin/sprawdzenia",
      icon: FileCheck,
      label: "Sprawdzenia",
    },
    {
      to: "/admin/zakupy",
      icon: CreditCard,
      label: "Zakupy TopUp",
    },
    {
      to: "/admin/statystyki",
      icon: BarChart3,
      label: "Statystyki",
    },
    {
      to: "/admin/analityka-api",
      icon: Activity,
      label: "Analityka API",
    },
    {
      to: "/admin/artykuly",
      icon: FileText,
      label: "Artykuły",
    },
    {
      to: "/admin/debug",
      icon: Bug,
      label: "Debug Korekty",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">Admin</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Interpunkcja.pl
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/panel"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Wróć do aplikacji</span>
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
