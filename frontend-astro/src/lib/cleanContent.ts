// Czyszczenie treści artykułów z bloków WordPress + dodanie klas Tailwind.
// Przeniesione 1:1 z frontend/src/pages/ArticlePage.tsx.
export function cleanWordPressContent(content: string): string {
  return (
    content
      // Usuń bloki WordPress
      .replace(/<!--\s*wp:[^>]*-->/g, "")
      .replace(/<!--\s*\/wp:[^>]*-->/g, "")
      // Usuń <!--more-->
      .replace(/<!--more-->/g, "")
      // Zamień <ul> bez klas na ładniejsze
      .replace(/<ul>/g, '<ul class="list-disc pl-6 my-4 space-y-2">')
      .replace(
        /<ul class="[^"]*wp-block[^"]*">/g,
        '<ul class="list-disc pl-6 my-4 space-y-2">'
      )
      // Zamień <ol> bez klas
      .replace(/<ol>/g, '<ol class="list-decimal pl-6 my-4 space-y-2">')
      // Popraw nagłówki
      .replace(
        /<h2([^>]*)class="[^"]*"([^>]*)>/g,
        '<h2$1$2 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">'
      )
      .replace(
        /<h2>/g,
        '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">'
      )
      .replace(
        /<h3([^>]*)>/g,
        '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">'
      )
      .replace(
        /<h4([^>]*)>/g,
        '<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">'
      )
      // Popraw tabele
      .replace(
        /<table([^>]*)>/g,
        '<div class="overflow-x-auto my-6"><table class="w-full border-collapse text-sm"$1>'
      )
      .replace(/<\/table>/g, "</table></div>")
      .replace(
        /<td([^>]*)>/g,
        '<td class="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center"$1>'
      )
      .replace(
        /<th([^>]*)>/g,
        '<th class="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-700 font-semibold"$1>'
      )
      // Popraw strong/bold
      .replace(
        /<strong>/g,
        '<strong class="font-semibold text-gray-900 dark:text-white">'
      )
      .replace(
        /<stron>/g,
        '<strong class="font-semibold text-gray-900 dark:text-white">'
      )
      .replace(/<\/stron>/g, "</strong>")
      // Wyczyść puste paragrafy i klasy WP
      .replace(
        /<p[^>]*class="[^"]*has-text-align[^"]*"[^>]*>/g,
        '<p class="mb-4 text-center">'
      )
      .replace(/<p[^>]*>\s*<\/p>/g, "")
      // Wyczyść wielokrotne br
      .replace(/(<br\s*\/?>\s*){2,}/g, "<br>")
      .trim()
  );
}
