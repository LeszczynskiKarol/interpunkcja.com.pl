// frontend/src/components/Footer.tsx
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Interpunkcyjny słownik wyrazów",
    slug: "interpunkcyjny-slownik-wyrazow",
  },
  { name: "Znaki interpunkcyjne", slug: "znaki-interpunkcyjne" },
  { name: "Ogólne zasady interpunkcji", slug: "ogolne-zasady-interpunkcji" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✏️</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                Interpunkcja<span className="text-blue-600">.com.pl</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sprawdź interpunkcję w swoim tekście za pomocą sztucznej
              inteligencji.
            </p>
          </div>

          {/* Narzędzia */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Narzędzia
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/panel"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                  Sprawdź tekst
                </Link>
              </li>
              <li>
                <Link
                  to="/cennik"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                  Cennik
                </Link>
              </li>
            </ul>
          </div>

          {/* Zasady interpunkcji */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Zasady interpunkcji
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}/`}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Informacje
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/regulamin"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                  Regulamin
                </Link>
              </li>
              <li>
                <Link
                  to="/prywatnosc"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                  Polityka prywatności
                </Link>
              </li>
              <li>
                <Link
                  to="/kontakt"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-500 text-sm">
            © {currentYear} Interpunkcja.com.pl. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
