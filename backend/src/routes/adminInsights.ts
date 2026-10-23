// backend/src/routes/adminInsights.ts
// Moduł analityczny panelu admina (/admin/analityka): przegląd z porównaniem do
// poprzedniego okresu, lejek rejestracji, ruch, próby wgrania plików, zdarzenia
// i ścieżka pojedynczego użytkownika. Źródła: AnalyticsEvent (zdarzenia z
// przeglądarki i backendu) oraz tabele User / Check / Document / CreditPurchase.
// Dni liczone w strefie Europe/Warsaw; konta ADMIN domyślnie pominięte (?admins=1
// je włącza), żeby testy właściciela nie zawyżały liczb.
import { FastifyInstance } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "./admin";
import { warsawDate } from "../services/trafficStats";

interface Range {
  from: string; // pierwszy dzień (włącznie)
  to: string; // dzień po ostatnim (wyłącznie)
  prevFrom: string; // początek poprzedniego okresu tej samej długości
  days: number;
  includeAdmins: boolean;
}

const rangeSchema = z.object({
  days: z.coerce.number().int().min(1).max(400).default(30),
  admins: z.enum(["0", "1"]).default("0"),
});

function shiftDay(day: string, n: number): string {
  const t = new Date(`${day}T12:00:00Z`);
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}

function parseRange(query: unknown): Range {
  const { days, admins } = rangeSchema.parse(query);
  const today = warsawDate();
  return {
    from: shiftDay(today, -(days - 1)),
    to: shiftDay(today, 1),
    prevFrom: shiftDay(today, -(2 * days - 1)),
    days,
    includeAdmins: admins === "1",
  };
}

// Północ dnia w Warszawie jako znacznik UTC (tak Prisma trzyma DateTime)
const bound = (day: string) =>
  Prisma.sql`((${day}::date)::timestamp AT TIME ZONE 'Europe/Warsaw' AT TIME ZONE 'UTC')`;

const within = (col: string, from: string, to: string) =>
  Prisma.sql`${Prisma.raw(col)} >= ${bound(from)} AND ${Prisma.raw(col)} < ${bound(to)}`;

const dayExpr = (col: string) =>
  `to_char((${col} AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Warsaw')::date, 'YYYY-MM-DD')`;
const localDay = (col: string) => Prisma.raw(dayExpr(col));

// „Wizyta” = ta sama osoba (skrót IP) tego samego dnia
const VISIT = Prisma.raw(`e."anonId" || ':' || ${dayExpr('e."createdAt"')}`);

// Wiersze powiązane z kontem admina odpadają; anonimowe zostają
const noAdminUser = (col: string, r: Range) =>
  r.includeAdmins
    ? Prisma.empty
    : Prisma.sql`AND (${Prisma.raw(col)} IS NULL OR ${Prisma.raw(col)} NOT IN (SELECT id FROM "User" WHERE role = 'ADMIN'))`;

const noAdminRole = (alias: string, r: Range) =>
  r.includeAdmins ? Prisma.empty : Prisma.sql`AND ${Prisma.raw(alias)}.role <> 'ADMIN'`;

// BigInt i Decimal z $queryRaw -> number
function plain<T>(rows: any[]): T[] {
  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([k, v]) => [
        k,
        typeof v === "bigint" ? Number(v) : v instanceof Prisma.Decimal ? v.toNumber() : v,
      ]),
    ),
  ) as T[];
}

async function query<T>(sql: Prisma.Sql): Promise<T[]> {
  return plain<T>(await prisma.$queryRaw<any[]>(sql));
}

function dayList(r: Range): string[] {
  const out: string[] = [];
  for (let d = r.from; d < r.to; d = shiftDay(d, 1)) out.push(d);
  return out;
}

interface Kpis {
  visitors: number;
  pageViews: number;
  signups: number;
  verified: number;
  activeUsers: number;
  checksUser: number;
  checksGuest: number;
  spellchecks: number;
  uploads: number;
  uploadsRejected: number;
  previews: number;
  docsPaid: number;
  docRevenue: number;
  topupRevenue: number;
  aiCostUsd: number;
}

async function kpis(from: string, to: string, r: Range): Promise<Kpis> {
  const [row] = await query<Kpis>(Prisma.sql`
    SELECT
      (SELECT COALESCE(SUM(n), 0)::int FROM (
         SELECT COUNT(DISTINCT e."anonId") AS n FROM "AnalyticsEvent" e
         WHERE e.name = 'page_view' AND ${within('e."createdAt"', from, to)} ${noAdminUser('e."userId"', r)}
         GROUP BY ${localDay('e."createdAt"')}) v) AS "visitors",
      (SELECT COUNT(*)::int FROM "AnalyticsEvent" e
         WHERE e.name = 'page_view' AND ${within('e."createdAt"', from, to)} ${noAdminUser('e."userId"', r)}) AS "pageViews",
      (SELECT COUNT(*)::int FROM "User" u WHERE ${within('u."createdAt"', from, to)} ${noAdminRole("u", r)}) AS "signups",
      (SELECT COUNT(*)::int FROM "User" u WHERE u."emailVerified" AND ${within('u."createdAt"', from, to)} ${noAdminRole("u", r)}) AS "verified",
      (SELECT COUNT(DISTINCT c."userId")::int FROM "Check" c
         WHERE c."userId" IS NOT NULL AND ${within('c."createdAt"', from, to)} ${noAdminUser('c."userId"', r)}) AS "activeUsers",
      (SELECT COUNT(*)::int FROM "Check" c
         WHERE c."userId" IS NOT NULL AND ${within('c."createdAt"', from, to)} ${noAdminUser('c."userId"', r)}) AS "checksUser",
      (SELECT COUNT(*)::int FROM "Check" c WHERE c."userId" IS NULL AND ${within('c."createdAt"', from, to)}) AS "checksGuest",
      (SELECT COUNT(*)::int FROM "AnalyticsEvent" e
         WHERE e.name = 'spellcheck' AND ${within('e."createdAt"', from, to)} ${noAdminUser('e."userId"', r)}) AS "spellchecks",
      (SELECT COUNT(*)::int FROM "AnalyticsEvent" e
         WHERE e.name = 'document_upload' AND ${within('e."createdAt"', from, to)} ${noAdminUser('e."userId"', r)}) AS "uploads",
      (SELECT COUNT(*)::int FROM "AnalyticsEvent" e
         WHERE e.name = 'document_upload' AND e.props->>'result' = 'rejected'
           AND ${within('e."createdAt"', from, to)} ${noAdminUser('e."userId"', r)}) AS "uploadsRejected",
      (SELECT COUNT(*)::int FROM "Document" d WHERE ${within('d."previewAt"', from, to)} ${noAdminUser('d."userId"', r)}) AS "previews",
      (SELECT COUNT(*)::int FROM "Document" d WHERE ${within('d."paidAt"', from, to)} ${noAdminUser('d."userId"', r)}) AS "docsPaid",
      (SELECT COALESCE(SUM(d.amount), 0)::int FROM "Document" d
         WHERE ${within('d."paidAt"', from, to)} ${noAdminUser('d."userId"', r)}) AS "docRevenue",
      (SELECT COALESCE(SUM(p.amount), 0)::int FROM "CreditPurchase" p
         WHERE p.status = 'COMPLETED' AND ${within('p."completedAt"', from, to)} ${noAdminUser('p."userId"', r)}) AS "topupRevenue",
      (SELECT COALESCE(SUM((c.metadata->>'estimatedCostUsd')::float), 0) FROM "Check" c
         WHERE ${within('c."createdAt"', from, to)})
      + (SELECT COALESCE(SUM(d."costUsd"), 0) FROM "Document" d WHERE ${within('d."completedAt"', from, to)})
      + (SELECT COALESCE(SUM((d.preview->>'costUsd')::float), 0) FROM "Document" d WHERE ${within('d."previewAt"', from, to)})
        AS "aiCostUsd"
  `);
  return row;
}

export async function adminInsightsRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", requireAdmin);

  // ==================== PRZEGLĄD ====================
  fastify.get("/api/admin/insights/overview", async (request) => {
    const r = parseRange(request.query);

    const [current, previous, evDaily, checkDaily, userDaily, docDaily, topupDaily, funnelRows, timing] =
      await Promise.all([
        kpis(r.from, r.to, r),
        kpis(r.prevFrom, r.from, r),
        query<{ day: string; pageViews: number; visitors: number; uploads: number; rejected: number }>(Prisma.sql`
          SELECT ${localDay('e."createdAt"')} AS day,
                 COUNT(*) FILTER (WHERE e.name = 'page_view')::int AS "pageViews",
                 COUNT(DISTINCT e."anonId") FILTER (WHERE e.name = 'page_view')::int AS "visitors",
                 COUNT(*) FILTER (WHERE e.name = 'document_upload')::int AS "uploads",
                 COUNT(*) FILTER (WHERE e.name = 'document_upload' AND e.props->>'result' = 'rejected')::int AS "rejected"
          FROM "AnalyticsEvent" e
          WHERE ${within('e."createdAt"', r.from, r.to)} ${noAdminUser('e."userId"', r)}
          GROUP BY 1`),
        query<{ day: string; checksUser: number; checksGuest: number }>(Prisma.sql`
          SELECT ${localDay('c."createdAt"')} AS day,
                 COUNT(*) FILTER (WHERE c."userId" IS NOT NULL)::int AS "checksUser",
                 COUNT(*) FILTER (WHERE c."userId" IS NULL)::int AS "checksGuest"
          FROM "Check" c
          WHERE ${within('c."createdAt"', r.from, r.to)} ${noAdminUser('c."userId"', r)}
          GROUP BY 1`),
        query<{ day: string; signups: number }>(Prisma.sql`
          SELECT ${localDay('u."createdAt"')} AS day, COUNT(*)::int AS signups
          FROM "User" u WHERE ${within('u."createdAt"', r.from, r.to)} ${noAdminRole("u", r)}
          GROUP BY 1`),
        query<{ day: string; docsPaid: number; revenue: number }>(Prisma.sql`
          SELECT ${localDay('d."paidAt"')} AS day, COUNT(*)::int AS "docsPaid", SUM(d.amount)::int AS revenue
          FROM "Document" d WHERE ${within('d."paidAt"', r.from, r.to)} ${noAdminUser('d."userId"', r)}
          GROUP BY 1`),
        query<{ day: string; revenue: number }>(Prisma.sql`
          SELECT ${localDay('p."completedAt"')} AS day, SUM(p.amount)::int AS revenue
          FROM "CreditPurchase" p
          WHERE p.status = 'COMPLETED' AND ${within('p."completedAt"', r.from, r.to)} ${noAdminUser('p."userId"', r)}
          GROUP BY 1`),
        // Lejek kohorty: konta założone w okresie i jak daleko doszły (do dziś)
        query<Record<string, number>>(Prisma.sql`
          WITH cohort AS (
            SELECT u.id, u."emailVerified" FROM "User" u
            WHERE ${within('u."createdAt"', r.from, r.to)} ${noAdminRole("u", r)}
          )
          SELECT
            COUNT(*)::int AS registered,
            COUNT(*) FILTER (WHERE k."emailVerified")::int AS verified,
            COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM "Check" c WHERE c."userId" = k.id))::int AS checked,
            COUNT(*) FILTER (WHERE (SELECT COUNT(*) FROM "Check" c WHERE c."userId" = k.id) >= 3)::int AS "checked3",
            COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM "Document" d WHERE d."userId" = k.id)
              OR EXISTS (SELECT 1 FROM "AnalyticsEvent" e WHERE e."userId" = k.id AND e.name = 'document_upload'))::int AS "uploadTried",
            COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM "Document" d WHERE d."userId" = k.id))::int AS uploaded,
            COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM "Document" d WHERE d."userId" = k.id AND d."previewAt" IS NOT NULL))::int AS previewed,
            COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM "Document" d WHERE d."userId" = k.id AND d."consentAt" IS NOT NULL))::int AS checkout,
            COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM "Document" d WHERE d."userId" = k.id AND d."paidAt" IS NOT NULL)
              OR EXISTS (SELECT 1 FROM "CreditPurchase" p WHERE p."userId" = k.id AND p.status = 'COMPLETED'))::int AS paid
          FROM cohort k`),
        query<{ firstCheckHours: number | null; firstPaymentHours: number | null }>(Prisma.sql`
          WITH cohort AS (
            SELECT u.id, u."createdAt" FROM "User" u
            WHERE ${within('u."createdAt"', r.from, r.to)} ${noAdminRole("u", r)}
          )
          SELECT
            (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY h) FROM (
               SELECT EXTRACT(EPOCH FROM (MIN(c."createdAt") - k."createdAt")) / 3600 AS h
               FROM cohort k JOIN "Check" c ON c."userId" = k.id GROUP BY k.id, k."createdAt") a) AS "firstCheckHours",
            (SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY h) FROM (
               SELECT EXTRACT(EPOCH FROM (MIN(d."paidAt") - k."createdAt")) / 3600 AS h
               FROM cohort k JOIN "Document" d ON d."userId" = k.id AND d."paidAt" IS NOT NULL
               GROUP BY k.id, k."createdAt") b) AS "firstPaymentHours"`),
      ]);

    const byDay = <T extends { day: string }>(rows: T[]) => new Map(rows.map((x) => [x.day, x]));
    const ev = byDay(evDaily);
    const ch = byDay(checkDaily);
    const us = byDay(userDaily);
    const dc = byDay(docDaily);
    const tu = byDay(topupDaily);

    const daily = dayList(r).map((day) => ({
      day,
      visitors: ev.get(day)?.visitors ?? 0,
      pageViews: ev.get(day)?.pageViews ?? 0,
      signups: us.get(day)?.signups ?? 0,
      checksUser: ch.get(day)?.checksUser ?? 0,
      checksGuest: ch.get(day)?.checksGuest ?? 0,
      uploads: ev.get(day)?.uploads ?? 0,
      uploadsRejected: ev.get(day)?.rejected ?? 0,
      docsPaid: dc.get(day)?.docsPaid ?? 0,
      revenue: (dc.get(day)?.revenue ?? 0) + (tu.get(day)?.revenue ?? 0),
    }));

    // Od kiedy w ogóle zbieramy zdarzenia - liczby sprzed tej daty są niepełne
    const firstEvent = await prisma.analyticsEvent.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } });

    return {
      range: r,
      trackingSince: firstEvent?.createdAt ?? null,
      current,
      previous,
      daily,
      funnel: funnelRows[0],
      timing: timing[0],
    };
  });

  // ==================== RUCH ====================
  fastify.get("/api/admin/insights/traffic", async (request) => {
    const r = parseRange(request.query);
    const pv = Prisma.sql`e.name = 'page_view' AND ${within('e."createdAt"', r.from, r.to)} ${noAdminUser('e."userId"', r)}`;

    const [pages, entries, referrers, campaigns, devices, sources, heatmap] = await Promise.all([
      query(Prisma.sql`
        SELECT e.path, COUNT(*)::int AS views, COUNT(DISTINCT ${VISIT})::int AS visitors
        FROM "AnalyticsEvent" e WHERE ${pv}
        GROUP BY e.path ORDER BY views DESC LIMIT 30`),
      // Strona wejścia = pierwsze wyświetlenie danej osoby danego dnia
      query(Prisma.sql`
        SELECT path, COUNT(*)::int AS entries FROM (
          SELECT DISTINCT ON (${VISIT}) e.path
          FROM "AnalyticsEvent" e WHERE ${pv}
          ORDER BY ${VISIT}, e."createdAt"
        ) f GROUP BY path ORDER BY entries DESC LIMIT 20`),
      query(Prisma.sql`
        SELECT e.props->>'ref' AS referrer, COUNT(*)::int AS views, COUNT(DISTINCT ${VISIT})::int AS visitors
        FROM "AnalyticsEvent" e WHERE ${pv} AND e.props->>'ref' IS NOT NULL
        GROUP BY 1 ORDER BY visitors DESC LIMIT 20`),
      query(Prisma.sql`
        SELECT e.props->>'utm_source' AS source, e.props->>'utm_medium' AS medium,
               e.props->>'utm_campaign' AS campaign, COUNT(DISTINCT ${VISIT})::int AS visitors
        FROM "AnalyticsEvent" e WHERE ${pv} AND e.props->>'utm_source' IS NOT NULL
        GROUP BY 1, 2, 3 ORDER BY visitors DESC LIMIT 20`),
      query(Prisma.sql`
        SELECT COALESCE(e.device, 'nieznane') AS device, COUNT(DISTINCT ${VISIT})::int AS visitors, COUNT(*)::int AS views
        FROM "AnalyticsEvent" e WHERE ${pv}
        GROUP BY 1 ORDER BY visitors DESC`),
      query(Prisma.sql`
        SELECT e.source, COUNT(*)::int AS views, COUNT(DISTINCT ${VISIT})::int AS visitors
        FROM "AnalyticsEvent" e WHERE ${pv}
        GROUP BY 1`),
      query(Prisma.sql`
        SELECT EXTRACT(ISODOW FROM e."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Warsaw')::int AS dow,
               EXTRACT(HOUR FROM e."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Warsaw')::int AS hour,
               COUNT(*)::int AS views
        FROM "AnalyticsEvent" e WHERE ${pv}
        GROUP BY 1, 2`),
    ]);
    return { range: r, pages, entries, referrers, campaigns, devices, sources, heatmap };
  });

  // ==================== PLIKI I DOKUMENTY ====================
  fastify.get("/api/admin/insights/uploads", async (request) => {
    const r = parseRange(request.query);
    const up = Prisma.sql`e.name = 'document_upload' AND ${within('e."createdAt"', r.from, r.to)} ${noAdminUser('e."userId"', r)}`;

    const [byExt, byReason, sizes, pages, recent, docStatus, docSummary, refusedPreviews, documents] = await Promise.all([
      query(Prisma.sql`
        SELECT COALESCE(NULLIF(e.props->>'ext', ''), '(brak)') AS ext,
               COUNT(*)::int AS attempts,
               COUNT(*) FILTER (WHERE e.props->>'result' = 'accepted')::int AS accepted,
               COUNT(*) FILTER (WHERE e.props->>'result' = 'rejected')::int AS rejected,
               COUNT(DISTINCT COALESCE(e."userId", e."anonId"))::int AS people
        FROM "AnalyticsEvent" e WHERE ${up}
        GROUP BY 1 ORDER BY attempts DESC`),
      query(Prisma.sql`
        SELECT e.props->>'reason' AS reason, COUNT(*)::int AS count,
               COUNT(DISTINCT COALESCE(e."userId", e."anonId"))::int AS people
        FROM "AnalyticsEvent" e WHERE ${up} AND e.props->>'result' = 'rejected'
        GROUP BY 1 ORDER BY count DESC`),
      query(Prisma.sql`
        SELECT bucket, COUNT(*)::int AS count FROM (
          SELECT CASE
            WHEN (e.props->>'size')::bigint < 102400 THEN '1|< 100 KB'
            WHEN (e.props->>'size')::bigint < 1048576 THEN '2|100 KB – 1 MB'
            WHEN (e.props->>'size')::bigint < 5242880 THEN '3|1–5 MB'
            WHEN (e.props->>'size')::bigint < 15728640 THEN '4|5–15 MB'
            ELSE '5|≥ 15 MB' END AS bucket
          FROM "AnalyticsEvent" e WHERE ${up} AND e.props->>'size' IS NOT NULL) s
        GROUP BY bucket ORDER BY bucket`),
      query(Prisma.sql`
        SELECT bucket, COUNT(*)::int AS count FROM (
          SELECT CASE
            WHEN (e.props->>'pages')::int <= 20 THEN '1|1–20 str.'
            WHEN (e.props->>'pages')::int <= 60 THEN '2|21–60 str.'
            WHEN (e.props->>'pages')::int <= 150 THEN '3|61–150 str.'
            ELSE '4|> 150 str.' END AS bucket
          FROM "AnalyticsEvent" e WHERE ${up} AND e.props->>'pages' IS NOT NULL) s
        GROUP BY bucket ORDER BY bucket`),
      query(Prisma.sql`
        SELECT e.id, e."createdAt", e.props, e.device, u.email
        FROM "AnalyticsEvent" e LEFT JOIN "User" u ON u.id = e."userId"
        WHERE ${up}
        ORDER BY e."createdAt" DESC LIMIT 60`),
      query(Prisma.sql`
        SELECT d.status::text AS status, COUNT(*)::int AS count
        FROM "Document" d WHERE ${within('d."createdAt"', r.from, r.to)} ${noAdminUser('d."userId"', r)}
        GROUP BY 1`),
      query(Prisma.sql`
        SELECT COUNT(*)::int AS created,
               COUNT(*) FILTER (WHERE d."previewAt" IS NOT NULL)::int AS previewed,
               COUNT(*) FILTER (WHERE d."consentAt" IS NOT NULL)::int AS checkout,
               COUNT(*) FILTER (WHERE d."paidAt" IS NOT NULL)::int AS paid,
               COALESCE(SUM(d.amount) FILTER (WHERE d."paidAt" IS NOT NULL), 0)::int AS revenue,
               COALESCE(SUM(d."costUsd"), 0)::float AS "costUsd",
               COALESCE(SUM((d.preview->>'costUsd')::float), 0)::float AS "previewCostUsd",
               COALESCE(AVG(d.pages), 0)::float AS "avgPages",
               COALESCE(AVG(d.corrections) FILTER (WHERE d.status = 'DONE'), 0)::float AS "avgCorrections",
               COALESCE(AVG(EXTRACT(EPOCH FROM (d."completedAt" - d."paidAt"))) FILTER (WHERE d."completedAt" IS NOT NULL), 0)::float AS "avgProcessingSec"
        FROM "Document" d WHERE ${within('d."createdAt"', r.from, r.to)} ${noAdminUser('d."userId"', r)}`),
      query(Prisma.sql`
        SELECT e.props->>'reason' AS reason, COUNT(*)::int AS count
        FROM "AnalyticsEvent" e
        WHERE e.name = 'document_preview_refused' AND ${within('e."createdAt"', r.from, r.to)} ${noAdminUser('e."userId"', r)}
        GROUP BY 1 ORDER BY count DESC`),
      query(Prisma.sql`
        SELECT d.id, d."fileName", d.pages, d.amount, d.status::text AS status, d.corrections, d."costUsd",
               d."createdAt", d."previewAt", d."consentAt", d."paidAt", d."completedAt", d.error, u.email
        FROM "Document" d JOIN "User" u ON u.id = d."userId"
        WHERE ${within('d."createdAt"', r.from, r.to)} ${noAdminUser('d."userId"', r)}
        ORDER BY d."createdAt" DESC LIMIT 50`),
    ]);

    const unbucket = (rows: any[]) => rows.map((x) => ({ label: String(x.bucket).split("|")[1], count: x.count }));
    return {
      range: r,
      byExt,
      byReason,
      sizes: unbucket(sizes),
      pages: unbucket(pages),
      recent,
      documents: { status: docStatus, summary: docSummary[0], refusedPreviews, list: documents },
    };
  });

  // ==================== ZDARZENIA ====================
  fastify.get("/api/admin/insights/events", async (request) => {
    const r = parseRange(request.query);
    const { name, source, q } = z
      .object({
        name: z.string().max(40).optional(),
        source: z.enum(["web", "app", "server"]).optional(),
        q: z.string().max(200).optional(),
      })
      .parse(request.query);

    const base = Prisma.sql`${within('e."createdAt"', r.from, r.to)} ${noAdminUser('e."userId"', r)}`;
    const filters = Prisma.sql`${base}
      ${name ? Prisma.sql`AND e.name = ${name}` : Prisma.empty}
      ${source ? Prisma.sql`AND e.source = ${source}` : Prisma.empty}
      ${q ? Prisma.sql`AND (u.email ILIKE ${"%" + q + "%"} OR e.path ILIKE ${"%" + q + "%"} OR e."anonId" = ${q})` : Prisma.empty}`;

    const [summary, daily, props, stream] = await Promise.all([
      query(Prisma.sql`
        SELECT e.name, string_agg(DISTINCT e.source, ', ') AS sources, COUNT(*)::int AS count,
               COUNT(DISTINCT COALESCE(e."userId", e."anonId"))::int AS people,
               COUNT(DISTINCT e."userId")::int AS users, MAX(e."createdAt") AS "lastAt"
        FROM "AnalyticsEvent" e WHERE ${base}
        GROUP BY e.name ORDER BY count DESC`),
      query(Prisma.sql`
        SELECT ${localDay('e."createdAt"')} AS day, e.name, COUNT(*)::int AS count
        FROM "AnalyticsEvent" e LEFT JOIN "User" u ON u.id = e."userId" WHERE ${filters}
        GROUP BY 1, 2`),
      // Rozkład wartości parametrów - tylko gdy wybrano jedno zdarzenie
      name
        ? query(Prisma.sql`
            SELECT key, value, count FROM (
              SELECT kv.key, kv.value, COUNT(*)::int AS count,
                     ROW_NUMBER() OVER (PARTITION BY kv.key ORDER BY COUNT(*) DESC) AS rn
              FROM "AnalyticsEvent" e LEFT JOIN "User" u ON u.id = e."userId",
                   jsonb_each_text(COALESCE(e.props, '{}'::jsonb)) kv
              WHERE ${filters}
              GROUP BY kv.key, kv.value) t
            WHERE rn <= 10 ORDER BY key, count DESC`)
        : Promise.resolve([]),
      query(Prisma.sql`
        SELECT e.id, e.name, e.source, e.path, e.device, e.props, e."anonId", e."userId", e."createdAt", u.email
        FROM "AnalyticsEvent" e LEFT JOIN "User" u ON u.id = e."userId"
        WHERE ${filters}
        ORDER BY e."createdAt" DESC LIMIT 150`),
    ]);

    return { range: r, summary, daily, dayList: dayList(r), props, stream };
  });

  // ==================== ŚCIEŻKA UŻYTKOWNIKA ====================
  fastify.get("/api/admin/insights/journey", async (request, reply) => {
    const { q } = z.object({ q: z.string().min(2).max(200) }).parse(request.query);
    const term = q.trim();

    const matches = await prisma.user.findMany({
      where: { OR: [{ id: term }, { email: { contains: term, mode: "insensitive" } }] },
      select: { id: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    const exact = matches.find((m) => m.id === term || m.email.toLowerCase() === term.toLowerCase());
    const target = exact ?? (matches.length === 1 ? matches[0] : null);
    if (!target) {
      if (!matches.length) return reply.status(404).send({ error: "NOT_FOUND", message: "Nie znaleziono konta" });
      return { matches };
    }

    const user = await prisma.user.findUnique({
      where: { id: target.id },
      select: {
        id: true, email: true, name: true, plan: true, role: true, authProvider: true,
        emailVerified: true, bonusChecks: true, isActive: true, createdAt: true, lastLogin: true,
      },
    });

    const [events, checks, documents, purchases] = await Promise.all([
      prisma.analyticsEvent.findMany({ where: { userId: target.id }, orderBy: { createdAt: "desc" }, take: 500 }),
      prisma.check.findMany({
        where: { userId: target.id },
        select: { id: true, createdAt: true, charCount: true, errorCount: true, usedBonusCheck: true },
        orderBy: { createdAt: "desc" },
        take: 300,
      }),
      prisma.document.findMany({ where: { userId: target.id }, orderBy: { createdAt: "desc" } }),
      prisma.creditPurchase.findMany({ where: { userId: target.id }, orderBy: { createdAt: "desc" } }),
    ]);

    // Anonimowe zdarzenia z tych samych dni i tego samego skrótu IP - co robił,
    // zanim się zalogował (np. strony, które czytał przed rejestracją)
    const anonKeys = [...new Set(events.map((e) => e.anonId).filter(Boolean))] as string[];
    const anonEvents = anonKeys.length
      ? await prisma.analyticsEvent.findMany({
          where: { userId: null, anonId: { in: anonKeys } },
          orderBy: { createdAt: "desc" },
          take: 300,
        })
      : [];

    type Item = { at: Date; kind: string; title: string; detail?: any; anonymous?: boolean };
    const items: Item[] = [];
    items.push({ at: user!.createdAt, kind: "account", title: "Założenie konta", detail: { provider: user!.authProvider } });
    for (const e of events) items.push({ at: e.createdAt, kind: "event", title: e.name, detail: { path: e.path, props: e.props, source: e.source, device: e.device } });
    for (const e of anonEvents) items.push({ at: e.createdAt, kind: "event", title: e.name, anonymous: true, detail: { path: e.path, props: e.props, source: e.source, device: e.device } });
    for (const c of checks) items.push({ at: c.createdAt, kind: "check", title: "Sprawdzenie AI", detail: { id: c.id, chars: c.charCount, errors: c.errorCount, bonus: c.usedBonusCheck } });
    for (const d of documents) {
      const base = { id: d.id, fileName: d.fileName, pages: d.pages, amount: d.amount, status: d.status };
      items.push({ at: d.createdAt, kind: "document", title: "Wgrany dokument (wycena)", detail: base });
      if (d.previewAt) items.push({ at: d.previewAt, kind: "document", title: "Bezpłatna próbka", detail: base });
      if (d.consentAt) items.push({ at: d.consentAt, kind: "document", title: "Przejście do płatności", detail: base });
      if (d.paidAt) items.push({ at: d.paidAt, kind: "payment", title: "Opłacony dokument", detail: base });
      if (d.completedAt) items.push({ at: d.completedAt, kind: "document", title: "Korekta gotowa", detail: { ...base, corrections: d.corrections } });
    }
    for (const p of purchases) {
      items.push({
        at: p.completedAt ?? p.createdAt,
        kind: p.status === "COMPLETED" ? "payment" : "purchase",
        title: p.status === "COMPLETED" ? "Zakup sprawdzeń" : `Zakup sprawdzeń (${p.status})`,
        detail: { amount: p.amount, credits: p.creditsGranted },
      });
    }
    items.sort((a, b) => b.at.getTime() - a.at.getTime());

    return {
      user,
      matches: matches.length > 1 ? matches : [],
      stats: {
        checks: await prisma.check.count({ where: { userId: target.id } }),
        documents: documents.length,
        paidDocuments: documents.filter((d) => d.paidAt).length,
        revenue:
          documents.filter((d) => d.paidAt).reduce((s, d) => s + d.amount, 0) +
          purchases.filter((p) => p.status === "COMPLETED").reduce((s, p) => s + p.amount, 0),
        events: events.length,
      },
      timeline: items.slice(0, 600),
    };
  });
}
