// frontend/src/pages/CookiePolicyPage.tsx
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { LanguageToggle } from "../components/LanguageToggle";
import { useCookieConsentStore } from "../stores/cookieConsentStore";

const content = {
  pl: {
    title: "Polityka Cookies",
    meta: "Polityka cookies serwisu Interpunkcja.com.pl",
    lastUpdate: "Ostatnia aktualizacja",
    changeSettings: "Zmień ustawienia cookies",
    sections: [
      {
        title: "1. Czym są pliki cookies?",
        content: `Pliki cookies (ciasteczka) to małe pliki tekstowe zapisywane na Twoim urządzeniu (komputerze, tablecie, smartfonie) podczas korzystania ze stron internetowych.

Cookies służą do:
- Zapamiętywania Twoich preferencji i ustawień
- Utrzymywania sesji logowania
- Zapewnienia bezpieczeństwa
- Analizy ruchu na stronie (za zgodą)
- Personalizacji treści i reklam (za zgodą)`,
      },
      {
        title: "2. Rodzaje plików cookies",
        content: `Ze względu na czas przechowywania rozróżniamy:

**Cookies sesyjne:**
Tymczasowe pliki usuwane po zamknięciu przeglądarki.

**Cookies trwałe:**
Pliki przechowywane przez określony czas lub do momentu ich usunięcia przez użytkownika.

Ze względu na pochodzenie:

**Cookies własne (first-party):**
Ustawiane przez naszą stronę interpunkcja.com.pl.

**Cookies zewnętrzne (third-party):**
Ustawiane przez zewnętrznych dostawców usług (np. Google).`,
      },
    ],
    cookieTypes: {
      necessary: {
        title: "Cookies niezbędne (zawsze aktywne)",
        description:
          "Wymagane do prawidłowego działania strony. Nie można ich wyłączyć.",
        cookies: [
          {
            name: "cookie-consent",
            purpose: "Zapamiętanie preferencji cookies",
            duration: "1 rok",
            provider: "Interpunkcja.com.pl",
          },
          {
            name: "auth-storage",
            purpose: "Dane sesji logowania",
            duration: "7 dni",
            provider: "Interpunkcja.com.pl",
          },
          {
            name: "theme-storage",
            purpose: "Preferencja jasny/ciemny motyw",
            duration: "1 rok",
            provider: "Interpunkcja.com.pl",
          },
        ],
      },
      analytics: {
        title: "Cookies analityczne",
        description:
          "Pomagają nam zrozumieć, jak użytkownicy korzystają ze strony.",
        cookies: [
          {
            name: "_ga",
            purpose: "Rozróżnienie użytkowników Google Analytics",
            duration: "2 lata",
            provider: "Google LLC",
          },
          {
            name: "_ga_*",
            purpose: "Utrzymanie stanu sesji GA4",
            duration: "2 lata",
            provider: "Google LLC",
          },
          {
            name: "_gid",
            purpose: "Rozróżnienie użytkowników (dzienny)",
            duration: "24 godziny",
            provider: "Google LLC",
          },
        ],
      },
      marketing: {
        title: "Cookies marketingowe",
        description:
          "Służą do personalizacji reklam i śledzenia skuteczności kampanii.",
        cookies: [
          {
            name: "_gcl_*",
            purpose: "Śledzenie konwersji Google Ads",
            duration: "90 dni",
            provider: "Google LLC",
          },
          {
            name: "_gac_*",
            purpose: "Informacje o kampaniach reklamowych",
            duration: "90 dni",
            provider: "Google LLC",
          },
        ],
      },
    },
    managementSection: {
      title: "3. Zarządzanie cookies",
      content: `Możesz zarządzać ustawieniami cookies na kilka sposobów:

**Na naszej stronie:**
Kliknij przycisk poniżej, aby zmienić swoje preferencje.

**W przeglądarce:**
Każda przeglądarka umożliwia zarządzanie cookies w ustawieniach:
- Chrome: Ustawienia → Prywatność i bezpieczeństwo → Pliki cookies
- Firefox: Ustawienia → Prywatność i bezpieczeństwo → Cookies
- Safari: Preferencje → Prywatność → Zarządzaj danymi witryn
- Edge: Ustawienia → Prywatność → Pliki cookies

**Uwaga:** Wyłączenie niektórych cookies może wpłynąć na funkcjonalność strony.`,
    },
    additionalSections: [
      {
        title: "4. Google Analytics",
        content: `Korzystamy z Google Analytics 4 do analizy ruchu na stronie. Google Analytics zbiera:
- Informacje o przeglądanych stronach
- Czas spędzony na stronie
- Źródło ruchu (skąd przyszedłeś na stronę)
- Przybliżoną lokalizację (kraj, miasto)
- Typ urządzenia i przeglądarki

Dane są anonimizowane i nie pozwalają na bezpośrednią identyfikację użytkownika. Możesz zrezygnować z śledzenia Google Analytics instalując dodatek do przeglądarki: https://tools.google.com/dlpage/gaoptout`,
      },
      {
        title: "5. Google Tag Manager",
        content: `Używamy Google Tag Manager do zarządzania skryptami na stronie. GTM sam w sobie nie zbiera danych osobowych, ale umożliwia ładowanie innych skryptów (np. Google Analytics) zgodnie z Twoimi preferencjami cookies.`,
      },
      {
        title: "6. Consent Mode v2",
        content: `Stosujemy Google Consent Mode v2, który zapewnia:
- Brak ładowania skryptów analitycznych/marketingowych bez zgody
- Możliwość zbierania anonimowych danych (bez cookies) dla modelowania konwersji
- Pełną kontrolę nad Twoimi preferencjami

Gdy nie wyrażasz zgody na cookies analityczne/marketingowe, odpowiednie skrypty nie są ładowane, a dane nie są zbierane.`,
      },
      {
        title: "7. Kontakt",
        content: `W przypadku pytań dotyczących polityki cookies skontaktuj się z nami:

**Email:** kontakt@ecopywriting.pl`,
      },
    ],
    tableHeaders: {
      name: "Nazwa",
      purpose: "Cel",
      duration: "Czas",
      provider: "Dostawca",
    },
  },
  en: {
    title: "Cookie Policy",
    meta: "Cookie Policy for Interpunkcja.com.pl",
    lastUpdate: "Last updated",
    changeSettings: "Change cookie settings",
    sections: [
      {
        title: "1. What are cookies?",
        content: `Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit websites.

Cookies are used for:
- Remembering your preferences and settings
- Maintaining login sessions
- Ensuring security
- Analyzing website traffic (with consent)
- Personalizing content and ads (with consent)`,
      },
      {
        title: "2. Types of cookies",
        content: `By storage duration:

**Session cookies:**
Temporary files deleted when you close your browser.

**Persistent cookies:**
Files stored for a specified period or until deleted by the user.

By origin:

**First-party cookies:**
Set by our website interpunkcja.com.pl.

**Third-party cookies:**
Set by external service providers (e.g., Google).`,
      },
    ],
    cookieTypes: {
      necessary: {
        title: "Necessary cookies (always active)",
        description:
          "Required for the website to function properly. Cannot be disabled.",
        cookies: [
          {
            name: "cookie-consent",
            purpose: "Remember cookie preferences",
            duration: "1 year",
            provider: "Interpunkcja.com.pl",
          },
          {
            name: "auth-storage",
            purpose: "Login session data",
            duration: "7 days",
            provider: "Interpunkcja.com.pl",
          },
          {
            name: "theme-storage",
            purpose: "Light/dark mode preference",
            duration: "1 year",
            provider: "Interpunkcja.com.pl",
          },
        ],
      },
      analytics: {
        title: "Analytics cookies",
        description: "Help us understand how users interact with the website.",
        cookies: [
          {
            name: "_ga",
            purpose: "Distinguish Google Analytics users",
            duration: "2 years",
            provider: "Google LLC",
          },
          {
            name: "_ga_*",
            purpose: "Maintain GA4 session state",
            duration: "2 years",
            provider: "Google LLC",
          },
          {
            name: "_gid",
            purpose: "Distinguish users (daily)",
            duration: "24 hours",
            provider: "Google LLC",
          },
        ],
      },
      marketing: {
        title: "Marketing cookies",
        description:
          "Used for ad personalization and campaign effectiveness tracking.",
        cookies: [
          {
            name: "_gcl_*",
            purpose: "Google Ads conversion tracking",
            duration: "90 days",
            provider: "Google LLC",
          },
          {
            name: "_gac_*",
            purpose: "Advertising campaign information",
            duration: "90 days",
            provider: "Google LLC",
          },
        ],
      },
    },
    managementSection: {
      title: "3. Managing cookies",
      content: `You can manage cookie settings in several ways:

**On our website:**
Click the button below to change your preferences.

**In your browser:**
Every browser allows managing cookies in settings:
- Chrome: Settings → Privacy and security → Cookies
- Firefox: Settings → Privacy & Security → Cookies
- Safari: Preferences → Privacy → Manage Website Data
- Edge: Settings → Privacy → Cookies

**Note:** Disabling some cookies may affect website functionality.`,
    },
    additionalSections: [
      {
        title: "4. Google Analytics",
        content: `We use Google Analytics 4 to analyze website traffic. Google Analytics collects:
- Information about pages viewed
- Time spent on site
- Traffic source (where you came from)
- Approximate location (country, city)
- Device type and browser

Data is anonymized and does not allow direct user identification. You can opt out of Google Analytics tracking by installing a browser add-on: https://tools.google.com/dlpage/gaoptout`,
      },
      {
        title: "5. Google Tag Manager",
        content: `We use Google Tag Manager to manage scripts on the website. GTM itself does not collect personal data, but enables loading other scripts (e.g., Google Analytics) according to your cookie preferences.`,
      },
      {
        title: "6. Consent Mode v2",
        content: `We implement Google Consent Mode v2, which ensures:
- No loading of analytics/marketing scripts without consent
- Ability to collect anonymous data (cookieless) for conversion modeling
- Full control over your preferences

When you don't consent to analytics/marketing cookies, the respective scripts are not loaded and no data is collected.`,
      },
      {
        title: "7. Contact",
        content: `For questions about the cookie policy, contact us:

**Email:** kontakt@ecopywriting.pl`,
      },
    ],
    tableHeaders: {
      name: "Name",
      purpose: "Purpose",
      duration: "Duration",
      provider: "Provider",
    },
  },
};

export function CookiePolicyPage() {
  const [language, setLanguage] = useState<"pl" | "en">("pl");
  const { openBanner } = useCookieConsentStore();
  const t = content[language];

  const renderCookieTable = (
    cookies: {
      name: string;
      purpose: string;
      duration: string;
      provider: string;
    }[]
  ) => (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              {t.tableHeaders.name}
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              {t.tableHeaders.purpose}
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              {t.tableHeaders.duration}
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              {t.tableHeaders.provider}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {cookies.map((cookie, i) => (
            <tr key={i}>
              <td className="px-4 py-2 text-sm font-mono text-gray-600 dark:text-gray-400">
                {cookie.name}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                {cookie.purpose}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                {cookie.duration}
              </td>
              <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                {cookie.provider}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{t.title} - Interpunkcja.com.pl</title>
        <meta name="description" content={t.meta} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <LanguageToggle language={language} onChange={setLanguage} />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t.title}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t.lastUpdate}:{" "}
          {new Date().toLocaleDateString(language === "pl" ? "pl-PL" : "en-US")}
        </p>

        <div className="space-y-8">
          {/* Basic sections */}
          {t.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {section.content
                  .split("**")
                  .map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
              </div>
            </section>
          ))}

          {/* Cookie tables */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.cookieTypes.necessary.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t.cookieTypes.necessary.description}
            </p>
            {renderCookieTable(t.cookieTypes.necessary.cookies)}
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.cookieTypes.analytics.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t.cookieTypes.analytics.description}
            </p>
            {renderCookieTable(t.cookieTypes.analytics.cookies)}
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.cookieTypes.marketing.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t.cookieTypes.marketing.description}
            </p>
            {renderCookieTable(t.cookieTypes.marketing.cookies)}
          </section>

          {/* Management section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t.managementSection.title}
            </h2>
            <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line mb-4">
              {t.managementSection.content
                .split("**")
                .map((part, i) =>
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
            </div>
            <button
              onClick={openBanner}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.changeSettings}
            </button>
          </section>

          {/* Additional sections */}
          {t.additionalSections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {section.content
                  .split("**")
                  .map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
