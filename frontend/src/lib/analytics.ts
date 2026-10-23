// frontend/src/lib/analytics.ts
// Zdarzenia trafiają w dwa miejsca:
// 1. GA4 - GTM ładuje tag Google (G-RYR505E30R), który czyta ten sam dataLayer,
//    więc gtag("event", ...) trafia do GA4 bez dodatkowych tagów w GTM.
//    Wymagane send_to - bez niego tag wczytany przez GTM ignoruje zdarzenie
//    (sprawdzone 21.10.2026: bez send_to brak żądania /g/collect).
// 2. Własna analityka (/api/events -> tabela AnalyticsEvent, panel /admin/analityka).
//    Bez cookies, więc działa także bez zgody - GA4 przy małym ruchu i zgodach
//    widzi pojedyncze sztuki.
import { api } from "./api";
import { useAuthStore } from "../stores/authStore";

const GA4_ID = "G-RYR505E30R";

type EventParams = Record<string, string | number | boolean | undefined>;

function sendToGa(name: string, params: EventParams) {
  window.dataLayer = window.dataLayer || [];
  // gtag wymaga obiektu arguments, nie zwykłej tablicy
  function gtag(..._args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag("event", name, { ...params, send_to: GA4_ID });
}

function sendToBackend(name: string, params: EventParams) {
  const props = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  const token = useAuthStore.getState().token;
  // keepalive - zdarzenie dochodzi także przy przejściu do Stripe albo zamknięciu karty
  fetch(`${api.defaults.baseURL}/api/events`, {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name, source: "app", path: location.pathname, props }),
  }).catch(() => undefined);
}

// gaOnly - zdarzenia, które backend zapisuje sam (zna prawdziwy powód odrzucenia)
export function trackEvent(name: string, params: EventParams = {}, opts: { gaOnly?: boolean } = {}) {
  if (typeof window === "undefined") return;
  try {
    sendToGa(name, params);
    if (!opts.gaOnly) sendToBackend(name, params);
  } catch {
    // analityka nie może zepsuć aplikacji
  }
}

let firstView = true;

// Wyświetlenie ekranu SPA - tylko do własnej analityki (GA4 liczy page_view sam).
// Źródło wejścia (referrer, utm) tylko przy pierwszym ekranie - document.referrer
// nie zmienia się przy nawigacji wewnątrz SPA.
export function trackPageView() {
  if (typeof window === "undefined") return;
  const params: EventParams = {};
  if (firstView) {
    firstView = false;
    try {
      const ref = document.referrer ? new URL(document.referrer).hostname : "";
      if (ref && ref !== location.hostname) params.ref = ref.replace(/^www\./, "");
      const q = new URLSearchParams(location.search);
      for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
        const v = q.get(key);
        if (v) params[key] = v.slice(0, 100);
      }
    } catch {
      // niepoprawny referrer - pomijamy
    }
  }
  sendToBackend("page_view", params);
}
