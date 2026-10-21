// frontend/src/lib/analytics.ts
// Zdarzenia GA4. GTM ładuje tag Google (G-RYR505E30R), który czyta ten sam
// dataLayer, więc gtag("event", ...) trafia do GA4 bez dodatkowych tagów w GTM.

type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // gtag wymaga obiektu arguments, nie zwykłej tablicy
  function gtag(..._args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag("event", name, params);
}
