// Statyczny przykład korekty na stronie głównej - bez wywołania AI.
// Poprawki i wyjaśnienia to zapisany wynik produkcyjnego korektora
// (Claude Sonnet 5.5, 21.10.2026) dla tekstu poniżej.
import { ArrowRight, BookOpen } from "lucide-react";

type Part = string | number; // tekst albo numer poprawki wstawiającej przecinek

const PARTS: Part[] = [
  "Wydaje mi się",
  1,
  " że ten projekt uda się skończyć przed końcem miesiąca. Zespół",
  2,
  " który nad nim pracuje",
  2,
  " ma duże doświadczenie, ale czasu jest niewiele. Wracając wczoraj z biura",
  3,
  " zastanawiałam się",
  3,
  " czy nie warto poprosić kogoś o pomoc. Daj mi znać",
  4,
  " czy masz w tym tygodniu chwilę na rozmowę.",
];

const CORRECTIONS = [
  {
    rule: "Przecinek przed spójnikiem „że”",
    explanation:
      "Zdanie podrzędne wprowadzone spójnikiem „że” oddzielamy przecinkiem od zdania nadrzędnego.",
    links: [
      { label: "Przecinek przed „że”", href: "/interpunkcyjny-slownik-wyrazow/przecinek-przed-ze/" },
    ],
  },
  {
    rule: "Zdanie podrzędne przydawkowe wtrącone w zdanie nadrzędne",
    explanation:
      "Zdanie z zaimkiem „który” wplecione w środek zdania nadrzędnego wydzielamy przecinkami z obu stron: przed „który” i po „pracuje”.",
    links: [
      { label: "Przecinek przed „który”", href: "/interpunkcyjny-slownik-wyrazow/przecinek-przed-ktory/" },
    ],
  },
  {
    rule: "Imiesłowowy równoważnik zdania oraz przecinek przed „czy”",
    explanation:
      "Imiesłowowy równoważnik zdania („Wracając wczoraj z biura”) oddzielamy przecinkiem od reszty zdania. Przed „czy” wprowadzającym zdanie podrzędne również stawiamy przecinek.",
    links: [
      { label: "Przecinek przy imiesłowach", href: "/ogolne-zasady-interpunkcji/przecinek-przy-imieslowach/" },
      { label: "Przecinek przed „czy”", href: "/interpunkcyjny-slownik-wyrazow/przecinek-przed-czy/" },
    ],
  },
  {
    rule: "Przecinek przed zdaniem podrzędnym z „czy”",
    explanation:
      "Zdanie podrzędne dopełnieniowe (pytanie zależne) wprowadzone spójnikiem „czy” oddzielamy przecinkiem od zdania nadrzędnego.",
    links: [
      { label: "Przecinek przed „czy”", href: "/interpunkcyjny-slownik-wyrazow/przecinek-przed-czy/" },
    ],
  },
];

function Marker({ n }: { n: number }) {
  return (
    <sup className="ml-0.5 text-[10px] font-bold text-gray-500 dark:text-gray-400">
      {n}
    </sup>
  );
}

export function PunctuationDemo() {
  return (
    <section
      id="przyklad"
      className="py-16 px-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tak wygląda wynik korekty
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Prawdziwy wynik naszego korektora dla przykładowego tekstu: 4
            poprawki, każda z wyjaśnieniem reguły. Przecinek przed „ale” stał
            na swoim miejscu, więc korektor go nie ruszył.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
            <div className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 mb-3">
              Przed korektą
            </div>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {PARTS.map((p, i) =>
                typeof p === "string" ? (
                  <span key={i}>{p}</span>
                ) : (
                  <span
                    key={i}
                    aria-label={`brakujący przecinek ${p}`}
                    className="inline-block w-1.5 h-4 align-middle mx-px border-b-2 border-red-500"
                  />
                ),
              )}
            </p>
          </div>

          <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/40 p-6">
            <div className="text-sm font-semibold uppercase tracking-wide text-green-700 dark:text-green-400 mb-3">
              Po korekcie
            </div>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {PARTS.map((p, i) =>
                typeof p === "string" ? (
                  <span key={i}>{p}</span>
                ) : (
                  <span key={i}>
                    <mark className="bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 font-bold rounded px-0.5">
                      ,
                    </mark>
                    <Marker n={p} />
                  </span>
                ),
              )}
            </p>
          </div>
        </div>

        <ol className="grid md:grid-cols-2 gap-4 mb-10">
          {CORRECTIONS.map((c, i) => (
            <li
              key={i}
              className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {c.rule}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {c.explanation}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {c.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <BookOpen className="w-4 h-4" />
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="text-center guest-only">
          <a
            href="/rejestracja"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg text-lg"
          >
            Sprawdź własny tekst za darmo
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Darmowe konto: 2 sprawdzenia dziennie do 500 znaków, z wyjaśnieniami
          </p>
        </div>
      </div>
    </section>
  );
}
