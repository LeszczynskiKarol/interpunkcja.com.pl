// frontend/src/components/CookieBanner.tsx
import { useState } from "react";
import { X, Settings, Cookie } from "lucide-react";
import {
  useCookieConsentStore,
  CookieConsent,
} from "../stores/cookieConsentStore";
import { Link } from "react-router-dom";

export function CookieBanner() {
  const { consent, showBanner, setConsent, acceptAll, rejectAll, closeBanner } =
    useCookieConsentStore();
  const [showSettings, setShowSettings] = useState(false);
  const [localConsent, setLocalConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: consent?.analytics ?? false,
    marketing: consent?.marketing ?? false,
  });

  // Nie pokazuj jeśli banner zamknięty lub już jest consent
  if (!showBanner) return null;

  const handleSaveSettings = () => {
    setConsent(localConsent);
    setShowSettings(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={closeBanner}
      />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {!showSettings ? (
            // Główny widok
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Ta strona używa plików cookies
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Używamy plików cookies, aby zapewnić najlepsze doświadczenie
                    na naszej stronie, analizować ruch i personalizować treści.
                    Możesz zaakceptować wszystkie cookies lub dostosować swoje
                    preferencje.
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Link
                      to="/polityka-prywatnosci"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={closeBanner}
                    >
                      Polityka prywatności
                    </Link>
                    <span className="text-gray-400">•</span>
                    <Link
                      to="/polityka-cookies"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={closeBanner}
                    >
                      Polityka cookies
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={rejectAll}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Odrzuć opcjonalne
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Dostosuj
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex-1 sm:flex-none"
                >
                  Zaakceptuj wszystkie
                </button>
              </div>
            </div>
          ) : (
            // Widok ustawień
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ustawienia cookies
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Niezbędne */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Niezbędne
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Wymagane do działania strony. Nie można ich wyłączyć.
                      </p>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Analityczne */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Analityczne
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Pomagają nam zrozumieć, jak użytkownicy korzystają ze
                        strony (Google Analytics).
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setLocalConsent((prev) => ({
                          ...prev,
                          analytics: !prev.analytics,
                        }))
                      }
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        localConsent.analytics
                          ? "bg-blue-600 justify-end"
                          : "bg-gray-300 dark:bg-gray-600 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>

                {/* Marketingowe */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Marketingowe
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Służą do personalizacji reklam i śledzenia skuteczności
                        kampanii.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setLocalConsent((prev) => ({
                          ...prev,
                          marketing: !prev.marketing,
                        }))
                      }
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        localConsent.marketing
                          ? "bg-blue-600 justify-end"
                          : "bg-gray-300 dark:bg-gray-600 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex-1"
                >
                  Zapisz ustawienia
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
