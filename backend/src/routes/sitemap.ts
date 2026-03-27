// backend/src/routes/sitemap.ts
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

const SITE_URL = "https://www.interpunkcja.com.pl";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/sprawdzanie-ortografii", priority: "0.9", changefreq: "monthly" },
  { path: "/sprawdzanie-pisowni", priority: "0.9", changefreq: "monthly" },
  { path: "/korektor-tekstu", priority: "0.9", changefreq: "monthly" },
  { path: "/poprawianie-bledow", priority: "0.9", changefreq: "monthly" },
  { path: "/korekta-tekstu-online", priority: "0.9", changefreq: "monthly" },
  { path: "/cennik", priority: "0.8", changefreq: "monthly" },
  { path: "/polityka-prywatnosci", priority: "0.3", changefreq: "yearly" },
  { path: "/polityka-cookies", priority: "0.3", changefreq: "yearly" },
  { path: "/regulamin", priority: "0.3", changefreq: "yearly" },
];

export async function sitemapRoutes(fastify: FastifyInstance) {
  // Sitemap index
  fastify.get("/sitemap_index.xml", async (request, reply) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_URL}/sitemap-static.xml</loc></sitemap>
  <sitemap><loc>${SITE_URL}/sitemap-categories.xml</loc></sitemap>
  <sitemap><loc>${SITE_URL}/sitemap-articles.xml</loc></sitemap>
</sitemapindex>`;
    reply.header("Content-Type", "application/xml").send(xml);
  });

  // Static pages
  fastify.get("/sitemap-static.xml", async (request, reply) => {
    const urls = STATIC_PAGES.map(
      (p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
    ).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    reply.header("Content-Type", "application/xml").send(xml);
  });

  // Categories
  fastify.get("/sitemap-categories.xml", async (request, reply) => {
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    const urls = categories
      .map(
        (c) => `  <url>
    <loc>${SITE_URL}/category/${c.slug}</loc>
    <lastmod>${c.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    reply.header("Content-Type", "application/xml").send(xml);
  });

  // Articles
  fastify.get("/sitemap-articles.xml", async (request, reply) => {
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
        category: { select: { slug: true } },
      },
    });

    const urls = articles
      .map(
        (a) => `  <url>
    <loc>${SITE_URL}/${a.category.slug}/${a.slug}</loc>
    <lastmod>${a.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`,
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
    reply.header("Content-Type", "application/xml").send(xml);
  });
}
