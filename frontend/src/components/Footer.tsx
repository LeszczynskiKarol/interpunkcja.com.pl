// frontend/src/components/Footer.tsx
import { Link } from "react-router-dom";
import { useCookieConsentStore } from "../stores/cookieConsentStore";
import { Cookie } from "lucide-react";

export function Footer() {
  const { openBanner } = useCookieConsentStore();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✏️</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Interpunkcja<span className="text-blue-600">.com.pl</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sprawdź interpunkcję w swoim tekście za pomocą sztucznej
              inteligencji. Korektor przecinków i innych znaków interpunkcyjnych
              online.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Serwis
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Strona główna
                </Link>
              </li>
              <li>
                <Link
                  to="/cennik"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Cennik
                </Link>
              </li>
              <li>
                <Link
                  to="/logowanie"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Logowanie
                </Link>
              </li>
              <li>
                <Link
                  to="/rejestracja"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Rejestracja
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Informacje
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/polityka-prywatnosci"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link
                  to="/polityka-cookies"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Polityka cookies
                </Link>
              </li>
              <li>
                <button
                  onClick={openBanner}
                  className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Cookie className="w-4 h-4" />
                  Ustawienia cookies
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Interpunkcja.com.pl. Wszelkie prawa
          zastrzeżone.
        </div>
      </div>
    </footer>
  );
}
