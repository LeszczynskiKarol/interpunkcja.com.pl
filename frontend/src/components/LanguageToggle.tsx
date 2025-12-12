// frontend/src/components/LanguageToggle.tsx
interface LanguageToggleProps {
  language: "pl" | "en";
  onChange: (lang: "pl" | "en") => void;
}

export function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <button
        onClick={() => onChange("pl")}
        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          language === "pl"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        🇵🇱 Polski
      </button>
      <button
        onClick={() => onChange("en")}
        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          language === "en"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        🇬🇧 English
      </button>
    </div>
  );
}
