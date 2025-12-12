// frontend/src/pages/PrivacyPolicyPage.tsx
import { Helmet } from "react-helmet-async";

export function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Polityka Prywatności - Interpunkcja.com.pl</title>
        <meta
          name="description"
          content="Polityka prywatności serwisu Interpunkcja.com.pl"
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Polityka Prywatności
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ostatnia aktualizacja: {new Date().toLocaleDateString("pl-PL")}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Administrator danych
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Administratorem Twoich danych osobowych jest właściciel serwisu
              Interpunkcja.com.pl. W sprawach związanych z ochroną danych
              osobowych możesz skontaktować się z nami poprzez email:
              kontakt@interpunkcja.com.pl
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Jakie dane zbieramy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Zbieramy następujące kategorie danych:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Dane rejestracyjne:</strong> adres email, hasło
                (zaszyfrowane)
              </li>
              <li>
                <strong>Dane o użytkowaniu:</strong> historia sprawdzonych
                tekstów (dla zalogowanych użytkowników)
              </li>
              <li>
                <strong>Dane techniczne:</strong> adres IP, typ przeglądarki,
                czas wizyty (dla celów analitycznych)
              </li>
              <li>
                <strong>Pliki cookies:</strong> zgodnie z Polityką Cookies
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Cele przetwarzania danych
            </h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Świadczenie usługi sprawdzania interpunkcji</li>
              <li>Zarządzanie kontem użytkownika</li>
              <li>Obsługa płatności (dla planów Premium)</li>
              <li>Analiza ruchu i poprawa jakości usług</li>
              <li>Marketing (tylko za zgodą)</li>
              <li>Wypełnienie obowiązków prawnych</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Podstawy prawne przetwarzania
            </h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Art. 6 ust. 1 lit. a RODO:</strong> zgoda (cookies
                analityczne i marketingowe)
              </li>
              <li>
                <strong>Art. 6 ust. 1 lit. b RODO:</strong> wykonanie umowy
                (świadczenie usług)
              </li>
              <li>
                <strong>Art. 6 ust. 1 lit. c RODO:</strong> obowiązek prawny
                (np. faktury)
              </li>
              <li>
                <strong>Art. 6 ust. 1 lit. f RODO:</strong> prawnie uzasadniony
                interes (bezpieczeństwo, analityka)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Odbiorcy danych
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Twoje dane mogą być przekazywane:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Anthropic:</strong> dostawca AI do sprawdzania tekstów
                (teksty są przetwarzane anonimowo)
              </li>
              <li>
                <strong>Google:</strong> usługi analityczne (Google Analytics)
              </li>
              <li>
                <strong>Stripe:</strong> obsługa płatności
              </li>
              <li>
                <strong>Amazon Web Services:</strong> hosting
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Przekazywanie danych poza EOG
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Niektórzy z naszych dostawców usług (np. Google, Anthropic) mają
              siedzibę w USA. Przekazywanie danych odbywa się na podstawie
              standardowych klauzul umownych zatwierdzonych przez Komisję
              Europejską lub w ramach programu Data Privacy Framework.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Okres przechowywania danych
            </h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Dane konta:</strong> do momentu usunięcia konta
              </li>
              <li>
                <strong>Historia sprawdzeń:</strong> 90 dni od daty sprawdzenia
              </li>
              <li>
                <strong>Dane analityczne:</strong> 26 miesięcy (Google
                Analytics)
              </li>
              <li>
                <strong>Dane rozliczeniowe:</strong> 5 lat (wymóg prawny)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Twoje prawa
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Zgodnie z RODO przysługują Ci następujące prawa:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Prawo dostępu</strong> do swoich danych
              </li>
              <li>
                <strong>Prawo do sprostowania</strong> nieprawidłowych danych
              </li>
              <li>
                <strong>Prawo do usunięcia</strong> danych ("prawo do bycia
                zapomnianym")
              </li>
              <li>
                <strong>Prawo do ograniczenia</strong> przetwarzania
              </li>
              <li>
                <strong>Prawo do przenoszenia</strong> danych
              </li>
              <li>
                <strong>Prawo do sprzeciwu</strong> wobec przetwarzania
              </li>
              <li>
                <strong>Prawo do wycofania zgody</strong> w dowolnym momencie
              </li>
              <li>
                <strong>Prawo do skargi</strong> do Prezesa UODO
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Bezpieczeństwo danych
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Stosujemy odpowiednie środki techniczne i organizacyjne w celu
              ochrony Twoich danych, w tym szyfrowanie połączeń (SSL/TLS),
              hashowanie haseł oraz regularne kopie zapasowe.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Kontakt
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              W sprawach związanych z ochroną danych osobowych skontaktuj się z
              nami: kontakt@interpunkcja.com.pl
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
