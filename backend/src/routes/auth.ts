// backend/src/routes/auth.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Rejestracja
  fastify.post("/api/auth/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const { email, password, name } = body;

    // Sprawdź czy email już istnieje
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return reply.status(400).send({
        error: "EMAIL_EXISTS",
        message: "Użytkownik z tym adresem email już istnieje",
      });
    }

    // Hash hasła
    const passwordHash = await bcrypt.hash(password, 12);

    // Utwórz użytkownika
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        createdAt: true,
      },
    });

    // Wygeneruj token
    const token = fastify.jwt.sign({ id: user.id, email: user.email });

    return {
      user,
      token,
    };
  });

  // Logowanie
  fastify.post("/api/auth/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const { email, password } = body;

    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({
        error: "INVALID_CREDENTIALS",
        message: "Nieprawidłowy email lub hasło",
      });
    }

    // Sprawdź hasło
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return reply.status(401).send({
        error: "INVALID_CREDENTIALS",
        message: "Nieprawidłowy email lub hasło",
      });
    }

    // Wygeneruj token
    const token = fastify.jwt.sign({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        createdAt: user.createdAt,
      },
      token,
    };
  });

  // Pobierz aktualnego użytkownika
  fastify.get("/api/auth/me", async (request, reply) => {
    try {
      const decoded = await request.jwtVerify<{ id: string }>();

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          createdAt: true,
        },
      });

      if (!user) {
        return reply.status(404).send({
          error: "USER_NOT_FOUND",
          message: "Użytkownik nie znaleziony",
        });
      }

      return { user };
    } catch {
      return reply.status(401).send({
        error: "UNAUTHORIZED",
        message: "Nie jesteś zalogowany",
      });
    }
  });
}
