// backend/src/routes/articles.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function articleRoutes(fastify: FastifyInstance) {
  // Pobierz wszystkie kategorie
  fastify.get("/api/categories", async (request, reply) => {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { articles: { where: { published: true } } },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories.map((c) => ({
      ...c,
      articleCount: c._count.articles,
      _count: undefined,
    }));
  });

  // Pobierz kategorię po slug
  fastify.get("/api/categories/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        articles: {
          where: { published: true },
          orderBy: { publishedAt: "desc" },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            publishedAt: true,
          },
        },
      },
    });

    if (!category) {
      return reply.status(404).send({
        error: "NOT_FOUND",
        message: "Kategoria nie została znaleziona",
      });
    }

    return category;
  });

  // Pobierz artykuł po kategoria/slug
  fastify.get(
    "/api/articles/:categorySlug/:articleSlug",
    async (request, reply) => {
      const { categorySlug, articleSlug } = request.params as {
        categorySlug: string;
        articleSlug: string;
      };

      const article = await prisma.article.findFirst({
        where: {
          slug: articleSlug,
          published: true,
          category: {
            slug: categorySlug,
          },
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      if (!article) {
        return reply.status(404).send({
          error: "NOT_FOUND",
          message: "Artykuł nie został znaleziony",
        });
      }

      return article;
    }
  );

  // Lista artykułów (z paginacją)
  fastify.get("/api/articles", async (request, reply) => {
    const schema = z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(50).default(20),
      category: z.string().optional(),
    });

    const params = schema.parse(request.query);
    const skip = (params.page - 1) * params.limit;

    const where: any = { published: true };
    if (params.category) {
      where.category = { slug: params.category };
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: params.limit,
      }),
      prisma.article.count({ where }),
    ]);

    return {
      articles,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  });

  // ==================== ADMIN ROUTES ====================

  // Middleware admina
  const requireAdmin = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
      const userId = request.user.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (!user || user.role !== "ADMIN") {
        return reply.status(403).send({ error: "FORBIDDEN" });
      }
    } catch {
      return reply.status(401).send({ error: "UNAUTHORIZED" });
    }
  };

  // Admin: Lista wszystkich artykułów
  fastify.get(
    "/api/admin/articles",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const schema = z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(20),
        search: z.string().optional(),
      });

      const params = schema.parse(request.query);
      const skip = (params.page - 1) * params.limit;

      const where: any = {};
      if (params.search) {
        where.OR = [
          { title: { contains: params.search, mode: "insensitive" } },
          { slug: { contains: params.search, mode: "insensitive" } },
        ];
      }

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where,
          include: {
            category: {
              select: { name: true, slug: true },
            },
          },
          orderBy: { updatedAt: "desc" },
          skip,
          take: params.limit,
        }),
        prisma.article.count({ where }),
      ]);

      return {
        articles,
        pagination: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages: Math.ceil(total / params.limit),
        },
      };
    }
  );

  // Admin: Utwórz artykuł
  fastify.post(
    "/api/admin/articles",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const schema = z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        categoryId: z.string().uuid(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        published: z.boolean().default(true),
      });

      const data = schema.parse(request.body);

      // Sprawdź czy slug jest unikalny
      const existing = await prisma.article.findUnique({
        where: { slug: data.slug },
      });
      if (existing) {
        return reply.status(400).send({
          error: "SLUG_EXISTS",
          message: "Artykuł o tym slug już istnieje",
        });
      }

      const article = await prisma.article.create({
        data: {
          ...data,
          publishedAt: data.published ? new Date() : null,
        },
        include: {
          category: true,
        },
      });

      return reply.status(201).send(article);
    }
  );

  // Admin: Aktualizuj artykuł
  fastify.patch(
    "/api/admin/articles/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const schema = z.object({
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        categoryId: z.string().uuid().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        published: z.boolean().optional(),
      });

      const data = schema.parse(request.body);

      // Sprawdź czy slug jest unikalny (jeśli zmieniany)
      if (data.slug) {
        const existing = await prisma.article.findFirst({
          where: { slug: data.slug, NOT: { id } },
        });
        if (existing) {
          return reply.status(400).send({
            error: "SLUG_EXISTS",
            message: "Artykuł o tym slug już istnieje",
          });
        }
      }

      const article = await prisma.article.update({
        where: { id },
        data: {
          ...data,
          publishedAt: data.published ? new Date() : undefined,
        },
        include: {
          category: true,
        },
      });

      return article;
    }
  );

  // Admin: Usuń artykuł
  fastify.delete(
    "/api/admin/articles/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      await prisma.article.delete({ where: { id } });

      return { success: true };
    }
  );

  // Admin: Zarządzanie kategoriami
  fastify.post(
    "/api/admin/categories",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const schema = z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
      });

      const data = schema.parse(request.body);

      const category = await prisma.category.create({ data });
      return reply.status(201).send(category);
    }
  );

  fastify.patch(
    "/api/admin/categories/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const schema = z.object({
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
      });

      const data = schema.parse(request.body);
      const category = await prisma.category.update({ where: { id }, data });
      return category;
    }
  );

  fastify.delete(
    "/api/admin/categories/:id",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      // Sprawdź czy kategoria ma artykuły
      const count = await prisma.article.count({ where: { categoryId: id } });
      if (count > 0) {
        return reply.status(400).send({
          error: "CATEGORY_NOT_EMPTY",
          message: `Kategoria zawiera ${count} artykułów. Najpierw przenieś lub usuń artykuły.`,
        });
      }

      await prisma.category.delete({ where: { id } });
      return { success: true };
    }
  );

  // ==================== IMPORT Z WORDPRESS ====================

  // Bulk import artykułów (dla migracji z WP)
  fastify.post(
    "/api/admin/articles/import",
    { preHandler: requireAdmin },
    async (request, reply) => {
      const schema = z.object({
        articles: z.array(
          z.object({
            title: z.string(),
            slug: z.string(),
            content: z.string(),
            excerpt: z.string().optional(),
            categorySlug: z.string(),
            metaTitle: z.string().optional(),
            metaDescription: z.string().optional(),
            publishedAt: z.string().optional(),
          })
        ),
      });

      const { articles } = schema.parse(request.body);
      const results = { imported: 0, skipped: 0, errors: [] as string[] };

      for (const article of articles) {
        try {
          // Znajdź lub utwórz kategorię
          let category = await prisma.category.findUnique({
            where: { slug: article.categorySlug },
          });

          if (!category) {
            // Utwórz kategorię na podstawie sluga
            const categoryName = article.categorySlug
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            category = await prisma.category.create({
              data: {
                name: categoryName,
                slug: article.categorySlug,
              },
            });
          }

          // Sprawdź czy artykuł już istnieje
          const existing = await prisma.article.findUnique({
            where: { slug: article.slug },
          });

          if (existing) {
            results.skipped++;
            continue;
          }

          // Utwórz artykuł
          await prisma.article.create({
            data: {
              title: article.title,
              slug: article.slug,
              content: article.content,
              excerpt: article.excerpt,
              categoryId: category.id,
              metaTitle: article.metaTitle,
              metaDescription: article.metaDescription,
              published: true,
              publishedAt: article.publishedAt
                ? new Date(article.publishedAt)
                : new Date(),
            },
          });

          results.imported++;
        } catch (error: any) {
          results.errors.push(`${article.slug}: ${error.message}`);
        }
      }

      return results;
    }
  );
}
