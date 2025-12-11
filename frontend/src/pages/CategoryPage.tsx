// frontend/src/pages/CategoryPage.tsx
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Calendar, Loader2, FileText } from "lucide-react";
import { api } from "../lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: string | null;
  }>;
}

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: category,
    isLoading,
    error,
  } = useQuery<Category>({
    queryKey: ["category", slug],
    queryFn: async () => {
      const res = await api.get(`/api/categories/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Kategoria nie została znaleziona
          </h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  const categoryTitles: Record<string, string> = {
    "interpunkcyjny-slownik-wyrazow": "Interpunkcyjny słownik wyrazów",
    "znaki-interpunkcyjne": "Znaki interpunkcyjne",
    "ogolne-zasady-interpunkcji": "Ogólne zasady interpunkcji",
  };

  const categoryDescriptions: Record<string, string> = {
    "interpunkcyjny-slownik-wyrazow":
      'Sprawdź zasady użycia przecinka przed konkretnymi słowami. Czy stawiamy przecinek przed "że", "który", "gdy" i innymi?',
    "znaki-interpunkcyjne":
      "Poznaj funkcje i zasady stosowania poszczególnych znaków interpunkcyjnych: przecinka, myślnika, cudzysłowu i innych.",
    "ogolne-zasady-interpunkcji":
      "Ogólne zasady interpunkcji polskiej. Dowiedz się, jak poprawnie używać znaków interpunkcyjnych w zdaniach złożonych.",
  };

  return (
    <>
      <Helmet>
        <title>
          {categoryTitles[category.slug] || category.name} | Interpunkcja.com.pl
        </title>
        <meta
          name="description"
          content={
            categoryDescriptions[category.slug] ||
            category.description ||
            `Artykuły z kategorii ${category.name}`
          }
        />
        <link
          rel="canonical"
          href={`https://www.interpunkcja.com.pl/category/${category.slug}/`}
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-blue-600">
            Strona główna
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white">
            {categoryTitles[category.slug] || category.name}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {categoryTitles[category.slug] || category.name}
          </h1>
          {(categoryDescriptions[category.slug] || category.description) && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {categoryDescriptions[category.slug] || category.description}
            </p>
          )}
        </div>

        {/* Articles list */}
        {category.articles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Brak artykułów w tej kategorii
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {category.articles.map((article) => (
              <Link
                key={article.id}
                to={`/${category.slug}/${article.slug}/`}
                className="block bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                {article.publishedAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString(
                        "pl-PL",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white text-center">
          <h2 className="text-xl font-bold mb-2">
            Sprawdź interpunkcję swojego tekstu
          </h2>
          <p className="text-blue-100 mb-4">
            Skorzystaj z naszego narzędzia do automatycznego sprawdzania
            przecinków i innych znaków interpunkcyjnych.
          </p>
          <Link
            to="/panel"
            className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Sprawdź tekst za darmo
          </Link>
        </div>
      </div>
    </>
  );
}
