// Sprawdzanie pisowni bez konta (Hunspell w backendzie, bez AI).
// Wyspa Astro (client:load) - jedyny interaktywny element stron publicznych.
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle, Loader2, Sparkles } from "lucide-react";

const MAX_CHARS = 5000;

interface Issue {
  word: string;
  start: number;
  end: number;
  suggestions: string[];
}

const SAMPLE =
  "Napewno warto sprawdzić tekst przed wysłaniem. Wogóle nie zauważyłem, że w ostatnim zdaniu jest literówka w słowie miesionc.";

function trackEvent(name: string, params: Record<string, string | number> = {}) {
  try {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    // gtag wymaga obiektu arguments; send_to - patrz frontend/src/lib/analytics.ts
    (function gtag(..._args: any[]) {
      w.dataLayer.push(arguments);
    })("event", name, { ...params, send_to: "G-RYR505E30R" });
  } catch {
    // analityka nie może zepsuć narzędzia
  }
}

function isLoggedIn(): boolean {
  try {
    const a = JSON.parse(localStorage.getItem("interpunkcja-auth") || "null");
    return !!(a && a.state && a.state.isAuthenticated && a.state.token);
  } catch {
    return false;
  }
}

interface SpellCheckerProps {
  heading?: string;
}

export function SpellChecker({ heading }: SpellCheckerProps) {
  const [text, setText] = useState("");
  const [checkedText, setCheckedText] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => setLoggedIn(isLoggedIn()), []);

  const check = async (value = text) => {
    if (!value.trim()) {
      setError("Wpisz lub wklej tekst do sprawdzenia.");
      return;
    }
    setLoading(true);
    setError("");
    setActive(null);
    try {
      const res = await fetch("/api/spellcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      if (res.status === 429) {
        throw new Error("Za dużo sprawdzeń w krótkim czasie. Spróbuj za minutę.");
      }
      if (!res.ok) throw new Error("Sprawdzanie jest chwilowo niedostępne. Spróbuj ponownie.");
      const data = await res.json();
      setIssues(data.issues);
      setCheckedText(value);
      trackEvent("spellcheck", { chars: value.length, issues: data.issues.length });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Podmiana słowa na podpowiedź - przesuwa pozycje kolejnych błędów
  const applySuggestion = (index: number, suggestion: string) => {
    if (checkedText === null) return;
    const issue = issues[index];
    const next =
      checkedText.slice(0, issue.start) + suggestion + checkedText.slice(issue.end);
    const delta = suggestion.length - (issue.end - issue.start);
    setIssues(
      issues
        .filter((_, i) => i !== index)
        .map((it) =>
          it.start > issue.start ? { ...it, start: it.start + delta, end: it.end + delta } : it,
        ),
    );
    setText(next);
    setCheckedText(next);
    setActive(null);
  };

  const segments = useMemo(() => {
    if (checkedText === null) return [];
    const out: (string | { issue: Issue; index: number })[] = [];
    let pos = 0;
    issues.forEach((issue, index) => {
      out.push(checkedText.slice(pos, issue.start));
      out.push({ issue, index });
      pos = issue.end;
    });
    out.push(checkedText.slice(pos));
    return out;
  }, [checkedText, issues]);

  const editing = checkedText === null;

  return (
    <div className="max-w-4xl mx-auto text-left">
      {heading && (
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          {heading}
        </h2>
      )}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
        {editing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Wklej tekst, a sprawdzimy pisownię każdego słowa…"
            aria-label="Tekst do sprawdzenia pisowni"
            rows={7}
            className="w-full p-5 text-base text-gray-900 dark:text-gray-100 bg-transparent resize-y focus:outline-none"
          />
        ) : (
          <div
            className="p-5 min-h-[10rem] text-base text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed"
            aria-live="polite"
          >
            {segments.map((s, i) =>
              typeof s === "string" ? (
                <span key={i}>{s}</span>
              ) : (
                <span key={i} className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => setActive(active === s.index ? null : s.index)}
                    className="underline decoration-wavy decoration-red-500 underline-offset-4 bg-red-50 dark:bg-red-950/40 rounded px-0.5"
                  >
                    {s.issue.word}
                  </button>
                  {active === s.index && (
                    <span className="absolute left-0 top-full mt-1 z-20 flex flex-wrap gap-1 min-w-[10rem] p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
                      {s.issue.suggestions.length ? (
                        s.issue.suggestions.map((sug) => (
                          <button
                            key={sug}
                            type="button"
                            onClick={() => applySuggestion(s.index, sug)}
                            className="px-2 py-1 text-sm rounded bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 hover:bg-green-200"
                          >
                            {sug}
                          </button>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Brak podpowiedzi</span>
                      )}
                    </span>
                  )}
                </span>
              ),
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {text.length} / {MAX_CHARS} znaków · bez logowania
          </span>
          <div className="flex gap-2">
            {editing ? (
              <>
                {!text && (
                  <button
                    type="button"
                    onClick={() => {
                      setText(SAMPLE);
                      check(SAMPLE);
                    }}
                    className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500"
                  >
                    Wypróbuj na przykładzie
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => check()}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Sprawdź pisownię
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCheckedText(null);
                  setIssues([]);
                }}
                className="px-5 py-2 text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500"
              >
                Edytuj tekst
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {!editing && (
        <div className="mt-4 space-y-4">
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            {issues.length === 0 ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Nie znaleźliśmy literówek ani błędów ortograficznych.
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-500" />
                Słowa do poprawy: {issues.length}. Kliknij podkreślone słowo, żeby zobaczyć
                podpowiedzi.
              </>
            )}
          </p>

          <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-5">
            <p className="flex items-start gap-2 text-gray-800 dark:text-gray-200 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                Słownik sprawdza każde słowo osobno, więc nie widzi przecinków ani błędów
                zależnych od kontekstu (np. „może” i „morze”). To sprawdzi korektor AI, który przy
                każdej poprawce wyjaśni regułę.
              </span>
            </p>
            <a
              href={loggedIn ? "/panel" : "/rejestracja"}
              onClick={() => trackEvent("spellcheck_cta", { target: loggedIn ? "panel" : "signup" })}
              className="inline-flex items-center gap-2 px-5 py-2 font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {loggedIn ? "Sprawdź przecinki w korektorze AI" : "Sprawdź przecinki za darmo z AI"}
              <ArrowRight className="w-4 h-4" />
            </a>
            {!loggedIn && (
              <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400">
                Darmowe konto: 2 sprawdzenia AI dziennie
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
