// frontend/src/components/Footer.tsx
import { Link } from "react-router-dom";
import { useCookieConsentStore } from "../stores/cookieConsentStore";
import { Cookie, Sparkles } from "lucide-react";

// Narzędzia / Landing pages
const tools = [
  {
    name: "Sprawdzanie ortografii",
    path: "/sprawdzanie-ortografii",
    description: "Wykryj błędy ortograficzne",
  },
  {
    name: "Sprawdzanie pisowni",
    path: "/sprawdzanie-pisowni",
    description: "Kompleksowa korekta tekstu",
  },
  {
    name: "Korektor tekstu",
    path: "/korektor-tekstu",
    description: "Profesjonalny korektor AI",
  },
  {
    name: "Poprawianie błędów",
    path: "/poprawianie-bledow",
    description: "Napraw wszystkie błędy",
  },
  {
    name: "Korekta online",
    path: "/korekta-tekstu-online",
    description: "Szybka korekta 24/7",
  },
];

export function Footer() {
  const { openBanner } = useCookieConsentStore();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✏️</span>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-gray-900 dark:text-white">
                  Interpunkcja<span className="text-blue-600">.com.pl</span>
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                  Sprawdzanie pisowni online
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
              Sprawdź interpunkcję, ortografię i pisownię w swoim tekście za
              pomocą sztucznej inteligencji Claude. Profesjonalny korektor
              tekstów online.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Powered by Claude AI</span>
            </div>
          </div>

          {/* Narzędzia - Landing Pages */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
              Narzędzia
            </h3>
            <ul className="space-y-2.5 text-sm">
              {tools.map((tool) => (
                <li key={tool.path}>
                  <Link
                    to={tool.path}
                    className="group flex flex-col text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span className="font-medium">{tool.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serwis */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              Serwis
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Strona główna
                </Link>
              </li>
              <li>
                <Link
                  to="/cennik"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Cennik
                </Link>
              </li>
              <li>
                <Link
                  to="/logowanie"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Logowanie
                </Link>
              </li>
              <li>
                <Link
                  to="/rejestracja"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Załóż konto
                </Link>
              </li>
            </ul>
          </div>

          {/* Informacje prawne */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
              Informacje
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/regulamin"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Regulamin
                </Link>
              </li>
              <li>
                <Link
                  to="/polityka-prywatnosci"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link
                  to="/polityka-cookies"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Polityka cookies
                </Link>
              </li>
              <li>
                <button
                  onClick={openBanner}
                  className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Cookie className="w-4 h-4" />
                  Ustawienia cookies
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} Interpunkcja.com.pl. Wszelkie prawa
              zastrzeżone.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Realizacja:</span>
              <a
                href="https://www.torweb.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                TorWeb.pl
              </a>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <a
                href="https://smart-copy.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Smart-Copy.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
