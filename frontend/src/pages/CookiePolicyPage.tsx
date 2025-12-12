// frontend/src/pages/CookiePolicyPage.tsx
import { Helmet } from "react-helmet-async";
import { useCookieConsentStore } from "../stores/cookieConsentStore";

export function CookiePolicyPage() {
  const { openBanner } = useCookieConsentStore();

  return (
    <>
      <Helmet>
        <title>Polityka Cookies - Interpunkcja.com.pl</title>
        <meta
          name="description"
          content="Polityka cookies serwisu Interpunkcja.com.pl"
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Polityka Cookies
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Czym są pliki cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Pliki cookies (ciasteczka) to małe pliki tekstowe zapisywane na
              Twoim urządzeniu podczas korzystania ze stron internetowych. Służą
              do zapamiętywania preferencji, logowania i analizy ruchu na
              stronie.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Rodzaje cookies, których używamy
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Cookies niezbędne (zawsze aktywne)
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Wymagane do prawidłowego działania strony. Nie można ich
                wyłączyć.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Nazwa
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Cel
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Czas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        cookie-consent
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Zapamiętanie zgód cookies
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        1 rok
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        auth-token
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Autoryzacja użytkownika
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Sesja
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        theme
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Preferencja jasny/ciemny motyw
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        1 rok
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Cookies analityczne
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Pomagają nam zrozumieć, jak użytkownicy korzystają ze strony.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Nazwa
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Dostawca
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Cel
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Czas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        _ga
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Google Analytics
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Identyfikacja użytkownika
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        2 lata
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        _ga_*
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Google Analytics
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Utrzymanie sesji
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        2 lata
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Cookies marketingowe
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Służą do personalizacji reklam i śledzenia skuteczności
                kampanii.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Nazwa
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Dostawca
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Cel
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Czas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        _gcl_*
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Google Ads
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Śledzenie konwersji
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        90 dni
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Zarządzanie cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Możesz w każdej chwili zmienić swoje preferencje dotyczące cookies
              klikając poniższy przycisk:
            </p>
            <button
              onClick={openBanner}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Zmień ustawienia cookies
            </button>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Możesz również zarządzać cookies w ustawieniach swojej
              przeglądarki. Pamiętaj, że wyłączenie niektórych cookies może
              wpłynąć na funkcjonalność strony.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Więcej informacji
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Jeśli masz pytania dotyczące naszej polityki cookies, skontaktuj
              się z nami: kontakt@interpunkcja.com.pl
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
