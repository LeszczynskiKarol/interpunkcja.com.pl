// frontend/src/components/DocumentPreviewView.tsx
// Podgląd bezpłatnej próbki: akapity w stylu zmian śledzonych (wstawki / skreślenia)
// i wyjaśnienie reguły pod każdym akapitem z poprawkami.
import { diffArrays } from "diff";
import { CheckCircle, MessageSquare } from "lucide-react";
import type { DocumentPreview } from "../lib/api";

// Ten sam podział co w silniku: słowa, białe znaki, pojedyncze znaki interpunkcyjne
function tokenize(text: string): string[] {
  return text.match(/\s+|[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) || [];
}

function correctionsLabel(n: number): string {
  const last = n % 10;
  const lastTwo = n % 100;
  if (n === 1) return "1 poprawka";
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${n} poprawki`;
  return `${n} poprawek`;
}

function TrackedText({ original, corrected }: { original: string; corrected: string }) {
  const parts = diffArrays(tokenize(original), tokenize(corrected));
  return (
    <p className="font-serif leading-loose text-gray-900 dark:text-gray-100">
      {parts.map((part, i) => {
        const text = part.value.join("");
        if (part.added) {
          return (
            <ins key={i} className="no-underline bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 font-semibold rounded px-0.5">
              {text}
            </ins>
          );
        }
        if (part.removed) {
          return (
            <del key={i} className="text-red-600 dark:text-red-400">
              {text}
            </del>
          );
        }
        return <span key={i}>{text}</span>;
      })}
    </p>
  );
}

export function DocumentPreviewView({ preview }: { preview: DocumentPreview }) {
  return (
    <div className="mt-4 rounded-xl border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 p-5 space-y-5">
      <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <span>
          Bezpłatna próbka: {preview.chars.toLocaleString("pl-PL")} znaków z początku pracy,{" "}
          {correctionsLabel(preview.corrections)}. W pełnej korekcie
          dostaniesz cały plik .docx z takimi poprawkami w trybie śledzenia zmian Worda.
        </span>
      </div>
      {preview.paragraphs.map((p, i) => (
        <div key={i} className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4">
          <TrackedText original={p.original} corrected={p.corrected} />
          {p.corrections.length > 0 && (
            <ul className="mt-3 space-y-1.5 border-t border-gray-100 dark:border-gray-800 pt-3">
              {p.corrections.map((c, j) => (
                <li key={j} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MessageSquare className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <b className="text-gray-800 dark:text-gray-200">{c.rule}:</b> {c.explanation}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
