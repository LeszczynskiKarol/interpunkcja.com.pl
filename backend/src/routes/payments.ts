// backend/src/routes/payments.ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import Stripe from "stripe";
import { prisma } from "../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const PLANS = {
  premium: {
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || "",
    name: "Premium",
    amount: 2900, // 29 PLN w groszach
    mode: "subscription" as const,
  },
  lifetime: {
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID || "",
    name: "Lifetime",
    amount: 29900, // 299 PLN w groszach
    mode: "payment" as const,
  },
};

export async function paymentRoutes(fastify: FastifyInstance) {
  // Utwórz sesję checkout Stripe
  fastify.post("/api/payments/create-checkout", async (request, reply) => {
    // Wymagaj autoryzacji
    let userId: string;
    try {
      await request.jwtVerify();
      userId = (request.user as any).userId;
    } catch {
      return reply.status(401).send({
        error: "UNAUTHORIZED",
        message: "Musisz być zalogowany",
      });
    }

    const schema = z.object({
      plan: z.enum(["premium", "lifetime"]),
    });

    const { plan } = schema.parse(request.body);
    const selectedPlan = PLANS[plan];

    // Pobierz użytkownika
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, stripeCustomerId: true },
    });

    if (!user) {
      return reply.status(404).send({
        error: "USER_NOT_FOUND",
        message: "Użytkownik nie został znaleziony",
      });
    }

    // Utwórz lub pobierz klienta Stripe
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;

      // Zapisz ID klienta Stripe
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Utwórz sesję checkout
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    try {
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        customer: customerId,
        payment_method_types: ["card", "p24", "blik"],
        mode: selectedPlan.mode,
        success_url: `${frontendUrl}/platnosc/sukces?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/platnosc/${plan}`,
        metadata: {
          userId,
          plan,
        },
      };

      // Dla subskrypcji użyj price ID, dla jednorazowej płatności użyj line_items
      if (selectedPlan.mode === "subscription") {
        sessionConfig.line_items = [
          {
            price: selectedPlan.priceId,
            quantity: 1,
          },
        ];
      } else {
        sessionConfig.line_items = [
          {
            price_data: {
              currency: "pln",
              product_data: {
                name: `Interpunkcja.com.pl - ${selectedPlan.name}`,
                description: "Dożywotni dostęp do wszystkich funkcji",
              },
              unit_amount: selectedPlan.amount,
            },
            quantity: 1,
          },
        ];
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      return { url: session.url };
    } catch (error: any) {
      console.error("Stripe session error:", error);
      return reply.status(500).send({
        error: "PAYMENT_ERROR",
        message: "Nie udało się utworzyć sesji płatności",
      });
    }
  });

  // Weryfikuj płatność po powrocie z checkout
  fastify.post("/api/payments/verify", async (request, reply) => {
    let userId: string;
    try {
      await request.jwtVerify();
      userId = (request.user as any).userId;
    } catch {
      return reply.status(401).send({
        error: "UNAUTHORIZED",
        message: "Musisz być zalogowany",
      });
    }

    const schema = z.object({
      sessionId: z.string(),
    });

    const { sessionId } = schema.parse(request.body);

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        return reply.status(400).send({
          error: "PAYMENT_NOT_COMPLETED",
          message: "Płatność nie została zakończona",
        });
      }

      // Sprawdź czy sesja należy do tego użytkownika
      if (session.metadata?.userId !== userId) {
        return reply.status(403).send({
          error: "FORBIDDEN",
          message: "Ta płatność nie należy do Ciebie",
        });
      }

      // Zaktualizuj plan użytkownika
      const plan =
        session.metadata?.plan === "lifetime" ? "LIFETIME" : "PREMIUM";

      await prisma.user.update({
        where: { id: userId },
        data: { plan },
      });

      return { success: true, plan };
    } catch (error: any) {
      console.error("Payment verification error:", error);
      return reply.status(500).send({
        error: "VERIFICATION_ERROR",
        message: "Nie udało się zweryfikować płatności",
      });
    }
  });

  // Webhook Stripe - automatyczne aktualizacje
  fastify.post(
    "/api/payments/webhook",
    {
      config: {
        rawBody: true,
      },
    },
    async (request, reply) => {
      const sig = request.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          (request as any).rawBody,
          sig,
          webhookSecret
        );
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return reply.status(400).send({ error: "Webhook Error" });
      }

      // Obsłuż różne eventy
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const plan = session.metadata?.plan;

          if (userId && plan) {
            const newPlan = plan === "lifetime" ? "LIFETIME" : "PREMIUM";
            await prisma.user.update({
              where: { id: userId },
              data: { plan: newPlan },
            });
            console.log(`User ${userId} upgraded to ${newPlan}`);
          }
          break;
        }

        case "customer.subscription.deleted": {
          // Subskrypcja anulowana - przywróć plan FREE
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
          });

          if (user && user.plan === "PREMIUM") {
            await prisma.user.update({
              where: { id: user.id },
              data: { plan: "FREE" },
            });
            console.log(`User ${user.id} downgraded to FREE`);
          }
          break;
        }

        case "invoice.payment_failed": {
          // Płatność nie powiodła się
          const invoice = event.data.object as Stripe.Invoice;
          console.log(`Payment failed for invoice ${invoice.id}`);
          // Tu można wysłać email do użytkownika
          break;
        }
      }

      return { received: true };
    }
  );

  // Anuluj subskrypcję - działa do końca okresu rozliczeniowego
  fastify.post("/api/payments/cancel-subscription", async (request, reply) => {
    let userId: string;
    try {
      await request.jwtVerify();
      userId = (request.user as any).userId;
    } catch {
      return reply.status(401).send({
        error: "UNAUTHORIZED",
        message: "Musisz być zalogowany",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, plan: true },
    });

    if (!user?.stripeCustomerId) {
      return reply.status(400).send({
        error: "NO_SUBSCRIPTION",
        message: "Nie masz aktywnej subskrypcji",
      });
    }

    if (user.plan === "LIFETIME") {
      return reply.status(400).send({
        error: "LIFETIME_PLAN",
        message: "Plan Lifetime nie może być anulowany",
      });
    }

    try {
      // Pobierz aktywne subskrypcje
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "active",
      });

      if (subscriptions.data.length === 0) {
        return reply.status(400).send({
          error: "NO_ACTIVE_SUBSCRIPTION",
          message: "Nie masz aktywnej subskrypcji do anulowania",
        });
      }

      // Ustaw anulowanie na koniec okresu (nie natychmiast!)
      const subscription = subscriptions.data[0];
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      });

      const periodEnd = new Date(subscription.current_period_end * 1000);

      return {
        success: true,
        message: `Subskrypcja zostanie anulowana ${periodEnd.toLocaleDateString(
          "pl-PL"
        )}`,
        cancelAt: periodEnd.toISOString(),
      };
    } catch (error: any) {
      console.error("Cancel subscription error:", error);
      return reply.status(500).send({
        error: "CANCEL_ERROR",
        message: "Nie udało się anulować subskrypcji",
      });
    }
  });

  // Pobierz status subskrypcji
  fastify.get("/api/payments/subscription-status", async (request, reply) => {
    let userId: string;
    try {
      await request.jwtVerify();
      userId = (request.user as any).userId;
    } catch {
      return reply.status(401).send({
        error: "UNAUTHORIZED",
        message: "Musisz być zalogowany",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, plan: true },
    });

    if (!user?.stripeCustomerId || user.plan !== "PREMIUM") {
      return {
        hasSubscription: false,
        plan: user?.plan || "FREE",
      };
    }

    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        return {
          hasSubscription: false,
          plan: user.plan,
        };
      }

      const subscription = subscriptions.data[0];
      const periodEnd = new Date(subscription.current_period_end * 1000);

      return {
        hasSubscription: true,
        plan: user.plan,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: periodEnd.toISOString(),
        currentPeriodEndFormatted: periodEnd.toLocaleDateString("pl-PL"),
      };
    } catch (error: any) {
      console.error("Get subscription status error:", error);
      return {
        hasSubscription: false,
        plan: user.plan,
        error: "Nie udało się pobrać statusu subskrypcji",
      };
    }
  });

  // Wznów anulowaną subskrypcję (przed końcem okresu)
  fastify.post("/api/payments/resume-subscription", async (request, reply) => {
    let userId: string;
    try {
      await request.jwtVerify();
      userId = (request.user as any).userId;
    } catch {
      return reply.status(401).send({
        error: "UNAUTHORIZED",
        message: "Musisz być zalogowany",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return reply.status(400).send({
        error: "NO_SUBSCRIPTION",
        message: "Nie masz subskrypcji",
      });
    }

    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "active",
      });

      if (subscriptions.data.length === 0) {
        return reply.status(400).send({
          error: "NO_ACTIVE_SUBSCRIPTION",
          message: "Nie masz aktywnej subskrypcji",
        });
      }

      const subscription = subscriptions.data[0];

      if (!subscription.cancel_at_period_end) {
        return reply.status(400).send({
          error: "NOT_CANCELLED",
          message: "Subskrypcja nie jest anulowana",
        });
      }

      // Wznów subskrypcję
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: false,
      });

      return {
        success: true,
        message: "Subskrypcja została wznowiona",
      };
    } catch (error: any) {
      console.error("Resume subscription error:", error);
      return reply.status(500).send({
        error: "RESUME_ERROR",
        message: "Nie udało się wznowić subskrypcji",
      });
    }
  });
}
