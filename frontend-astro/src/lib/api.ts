// Serwerowe pobieranie danych bloga z backendu (Fastify, port 3000 na prod).
// INTERNAL_API_URL pozwala testować lokalnie przeciwko prod API.
const API_URL =
  import.meta.env.INTERNAL_API_URL ||
  process.env.INTERNAL_API_URL ||
  "http://localhost:3000";

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface ArticleSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  category: { name: string; slug: string };
}

export interface CategoryDetail {
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

export interface ArticleDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  category: { id: string; name: string; slug: string };
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function getCategories() {
  return fetchJson<CategorySummary[]>("/api/categories");
}

export function getLatestArticles(limit = 6) {
  return fetchJson<{ articles: ArticleSummary[] }>(
    `/api/articles?limit=${limit}`
  );
}

export function getCategory(slug: string) {
  return fetchJson<CategoryDetail>(
    `/api/categories/${encodeURIComponent(slug)}`
  );
}

export function getArticle(categorySlug: string, articleSlug: string) {
  return fetchJson<ArticleDetail>(
    `/api/articles/${encodeURIComponent(categorySlug)}/${encodeURIComponent(articleSlug)}`
  );
}
