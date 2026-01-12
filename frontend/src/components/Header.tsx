// frontend/src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { useThemeStore } from "../stores/themeStore";
import { useAuthStore } from "../stores/authStore";

const categories = [
  {
    name: "Interpunkcyjny słownik wyrazów",
    slug: "interpunkcyjny-slownik-wyrazow",
    description: "Przecinek przed: że, który, gdy...",
  },
  {
    name: "Znaki interpunkcyjne",
    slug: "znaki-interpunkcyjne",
    description: "Przecinek, myślnik, cudzysłów...",
  },
  {
    name: "Ogólne zasady interpunkcji",
    slug: "ogolne-zasady-interpunkcji",
    description: "Zdania złożone, wyliczenia...",
  },
];

export function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [zasadyMenuOpen, setZasadyMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo z claimem */}
          <Link
            to={isAuthenticated ? "/panel" : "/"}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">✏️</span>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 dark:text-white leading-tight">
                Interpunkcja<span className="text-blue-600">.com.pl</span>
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 tracking-wide uppercase hidden sm:block">
                Sprawdzanie pisowni online
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to={isAuthenticated ? "/panel" : "/"}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Sprawdź tekst
            </Link>

            {/* Zasady dropdown - TYLKO gdy niezalogowany */}
            {!isAuthenticated && (
              <div
                className="relative"
                onMouseEnter={() => setZasadyMenuOpen(true)}
                onMouseLeave={() => setZasadyMenuOpen(false)}
              >
                <button className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Zasady interpunkcji
                  <ChevronDown className="w-4 h-4" />
                </button>

                {zasadyMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}/`}
                        className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() => setZasadyMenuOpen(false)}
                      >
                        <span className="font-medium text-gray-900 dark:text-white block">
                          {cat.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {cat.description}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cennik - TYLKO gdy niezalogowany */}
            {!isAuthenticated && (
              <Link
                to="/cennik"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cennik
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Przełącz motyw"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Auth buttons / User menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase() ||
                        user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                    {user.name || user.email.split("@")[0]}
                  </span>
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white truncate"
                        title={user.email}
                      >
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Plan: {user.plan}
                      </p>
                    </div>
                    <Link
                      to="/konto"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <User className="w-4 h-4" />
                      Moje konto
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Shield className="w-4 h-4" />
                        Panel admina
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Wyloguj się
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/logowanie"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Zaloguj się
                </Link>
                <Link
                  to="/rejestracja"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Załóż konto
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col gap-2">
              <Link
                to={isAuthenticated ? "/panel" : "/"}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Sprawdź tekst
              </Link>

              {/* Mobile categories - TYLKO gdy niezalogowany */}
              {!isAuthenticated && (
                <>
                  <div className="px-4 py-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Zasady interpunkcji
                    </span>
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}/`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm"
                    >
                      {cat.name}
                    </Link>
                  ))}

                  <Link
                    to="/cennik"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    Cennik
                  </Link>
                </>
              )}

              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-800 mt-2">
                  <Link
                    to="/logowanie"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-center text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    Zaloguj się
                  </Link>
                  <Link
                    to="/rejestracja"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-center text-white bg-blue-600 rounded-lg"
                  >
                    Załóż konto
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
