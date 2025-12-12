// frontend/src/stores/cookieConsentStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentState {
  consent: CookieConsent | null;
  showBanner: boolean;
  setConsent: (consent: CookieConsent) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openBanner: () => void;
  closeBanner: () => void;
}

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set) => ({
      consent: null,
      showBanner: true,

      setConsent: (consent) => {
        set({ consent, showBanner: false });
        updateGoogleConsent(consent);
      },

      acceptAll: () => {
        const consent: CookieConsent = {
          necessary: true,
          analytics: true,
          marketing: true,
        };
        set({ consent, showBanner: false });
        updateGoogleConsent(consent);
      },

      rejectAll: () => {
        const consent: CookieConsent = {
          necessary: true,
          analytics: false,
          marketing: false,
        };
        set({ consent, showBanner: false });
        updateGoogleConsent(consent);
      },

      openBanner: () => set({ showBanner: true }),
      closeBanner: () => set({ showBanner: false }),
    }),
    {
      name: "cookie-consent",
      onRehydrateStorage: () => (state) => {
        if (state?.consent) {
          updateGoogleConsent(state.consent);
          state.showBanner = false;
        }
      },
    }
  )
);

// Funkcja aktualizująca Google Consent Mode v2 - użyj dataLayer bezpośrednio
function updateGoogleConsent(consent: CookieConsent) {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];

    // Push consent update do dataLayer
    window.dataLayer.push({
      event: "consent_update",
      consent_analytics: consent.analytics ? "granted" : "denied",
      consent_marketing: consent.marketing ? "granted" : "denied",
    });

    // Użyj gtag do oficjalnego consent update
    function gtag(..._args: any[]) {
      window.dataLayer.push(arguments);
    }

    gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });

    console.log("Consent updated:", consent);
  }
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
