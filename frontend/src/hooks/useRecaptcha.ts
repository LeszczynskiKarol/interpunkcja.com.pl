// frontend/src/hooks/useRecaptcha.ts
import { useCallback, useEffect } from "react";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

export function useRecaptcha() {
  useEffect(() => {
    // Załaduj skrypt reCAPTCHA jeśli jeszcze nie istnieje
    if (
      !document.querySelector('script[src*="recaptcha"]') &&
      RECAPTCHA_SITE_KEY
    ) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      document.head.appendChild(script);
    }

    // Ukryj badge reCAPTCHA (dozwolone gdy masz tekst o reCAPTCHA pod formularzem)
    // https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed
    const style = document.createElement("style");
    style.innerHTML = `
      .grecaptcha-badge {
        visibility: hidden !important;
        opacity: 0 !important;
        position: fixed !important;
        right: -300px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup przy unmount
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string> => {
      if (!RECAPTCHA_SITE_KEY) {
        console.warn("reCAPTCHA site key not configured");
        return "";
      }

      return new Promise((resolve, reject) => {
        if (!window.grecaptcha) {
          // Poczekaj na załadowanie skryptu
          const checkInterval = setInterval(() => {
            if (window.grecaptcha) {
              clearInterval(checkInterval);
              window.grecaptcha.ready(() => {
                window.grecaptcha
                  .execute(RECAPTCHA_SITE_KEY, { action })
                  .then(resolve)
                  .catch(reject);
              });
            }
          }, 100);

          // Timeout po 5 sekundach
          setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error("reCAPTCHA failed to load"));
          }, 5000);
        } else {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(RECAPTCHA_SITE_KEY, { action })
              .then(resolve)
              .catch(reject);
          });
        }
      });
    },
    []
  );

  return { executeRecaptcha };
}
