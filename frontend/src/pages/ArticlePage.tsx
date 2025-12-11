import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Calendar, Loader2, ArrowLeft } from "lucide-react";
import { api } from "../lib/api";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

// Funkcja do czyszczenia contentu z bloków WordPress
function cleanWordPressContent(content: string): string {
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

export function ArticlePage() {
  const { categorySlug, articleSlug } = useParams<{
    categorySlug: string;
    articleSlug: string;
  }>();

  const {
    data: article,
    isLoading,
    error,
  } = useQuery<Article>({
    queryKey: ["article", categorySlug, articleSlug],
    queryFn: async () => {
      const res = await api.get(`/api/articles/${categorySlug}/${articleSlug}`);
      return res.data;
    },
    enabled: !!categorySlug && !!articleSlug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Artykuł nie został znaleziony
          </h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  const cleanedContent = cleanWordPressContent(article.content);

  return (
    <>
      <Helmet>
        <title>
          {article.metaTitle || article.title} | Interpunkcja.com.pl
        </title>
        {article.metaDescription && (
          <meta name="description" content={article.metaDescription} />
        )}
        <link
          rel="canonical"
          href={`https://www.interpunkcja.com.pl/${article.category.slug}/${article.slug}/`}
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Strona główna
          </Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <Link
            to={`/category/${article.category.slug}/`}
            className="hover:text-blue-600 transition-colors"
          >
            {article.category.name}
          </Link>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          <span className="text-gray-900 dark:text-white line-clamp-1">
            {article.title}
          </span>
        </nav>

        {/* Article */}
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 md:p-10">
            {/* Category badge */}
            <Link
              to={`/category/${article.category.slug}/`}
              className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full mb-4 hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
            >
              {article.category.name}
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Date */}
            {article.publishedAt && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString("pl-PL", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}

            {/* Content */}
            <div
              className="article-content text-gray-700 dark:text-gray-300 text-lg leading-relaxed
                [&>p]:mb-4
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:my-4 [&>ul]:space-y-2
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:my-4 [&>ol]:space-y-2
                [&_li]:pl-1
                [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800
                [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-gray-600 dark:[&_blockquote]:text-gray-400
              "
              dangerouslySetInnerHTML={{ __html: cleanedContent }}
            />
          </div>
        </article>

        {/* Back link */}
        <div className="mt-8">
          <Link
            to={`/category/${article.category.slug}/`}
            className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Więcej artykułów z kategorii {article.category.name}
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white text-center">
          <h2 className="text-2xl font-bold mb-3">
            Sprawdź interpunkcję swojego tekstu
          </h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Skorzystaj z naszego narzędzia do automatycznego sprawdzania
            przecinków i innych znaków interpunkcyjnych.
          </p>
          <Link
            to="/panel"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Sprawdź tekst za darmo
          </Link>
        </div>
      </div>
    </>
  );
}
