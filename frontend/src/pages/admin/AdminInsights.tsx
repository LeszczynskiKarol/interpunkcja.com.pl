// frontend/src/pages/admin/AdminInsights.tsx
// Moduł analityczny: przegląd z porównaniem okresów i lejkiem, ruch, próby
// wgrania plików (formaty, powody odrzucenia), surowe zdarzenia i ścieżka
// pojedynczego użytkownika. Dane: /api/admin/insights/* (backend/src/routes/adminInsights.ts).
// Zakładka i filtry siedzą w adresie, więc da się podlinkować np. ścieżkę konta.
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  CreditCard,
  Eye,
  FileText,
  FileUp,
  Filter,
  Globe,
  Loader2,
  Route as RouteIcon,
  Search,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../../lib/api";

// ==================== formatowanie ====================

const nf = new Intl.NumberFormat("pl-PL");
const num = (n: number | null | undefined) => nf.format(Math.round(n ?? 0));
const pln = (grosze: number) =>
  (grosze / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 2 });
const usd = (v: number) => `$${(v ?? 0).toFixed(2)}`;
const pct = (part: number, whole: number) => (whole > 0 ? `${((part / whole) * 100).toFixed(1).replace(".", ",")}%` : "–");
const bytes = (b: number | undefined) => {
  if (b === undefined || b === null) return "–";
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1048576).toFixed(1).replace(".", ",")} MB`;
};
const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("pl-PL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const shortDay = (day: string) => `${day.slice(8, 10)}.${day.slice(5, 7)}`;
const hours = (h: number | null | undefined) => {
  if (h === null || h === undefined) return "–";
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 48) return `${h.toFixed(1).replace(".", ",")} h`;
  return `${(h / 24).toFixed(1).replace(".", ",")} dni`;
};

const UPLOAD_REASONS: Record<string, string> = {
  UNSUPPORTED_FORMAT: "Nieobsługiwany format",
  FILE_TOO_LARGE: "Plik ponad 15 MB",
  INVALID_FILE: "Uszkodzony / nieczytelny .docx",
  EMPTY_DOCUMENT: "Brak tekstu w dokumencie",
  TOO_LONG: "Ponad 150 stron",
  TOO_MANY_DOCUMENTS: "Limit nieopłaconych / dzienny",
  EMAIL_NOT_VERIFIED: "Niepotwierdzony e-mail",
};

const PREVIEW_REASONS: Record<string, string> = {
  PREVIEW_DISABLED: "Próbki wyłączone (brak klucza)",
  PREVIEW_USED: "Próbka już wykorzystana",
  PREVIEW_IP_LIMIT: "Limit na adres IP",
  PREVIEW_DAILY_LIMIT: "Dzienna pula wyczerpana",
  PREVIEW_BUSY: "Próbka w toku",
  PREVIEW_NO_TEXT: "Brak tekstu do próbki",
};

const EVENT_LABELS: Record<string, string> = {
  page_view: "Wyświetlenie strony",
  spellcheck: "Sprawdzenie pisowni (Hunspell)",
  spellcheck_cta: "Klik CTA pod sprawdzaniem pisowni",
  guest_check: "Sprawdzenie AI bez konta",
  guest_check_refused: "Odmowa AI bez konta",
  article_cta: "Klik CTA w artykule",
  sign_up: "Rejestracja",
  login: "Logowanie",
  email_verified: "Potwierdzenie e-maila",
  check_text: "Sprawdzenie AI w panelu",
  limit_reached: "Wyczerpany limit",
  begin_checkout: "Przejście do płatności",
  purchase: "Zakup (powrót ze Stripe)",
  document_quote: "Wycena dokumentu",
  document_preview: "Bezpłatna próbka",
  document_upload: "Próba wgrania pliku",
  document_preview_refused: "Odmowa próbki",
};

const SOURCE_LABELS: Record<string, string> = { web: "strony publiczne", app: "panel", server: "backend" };

// ==================== typy ====================

interface Range {
  from: string;
  to: string;
  days: number;
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

interface Overview {
  range: Range;
  trackingSince: string | null;
  current: Kpis;
  previous: Kpis;
  daily: {
    day: string;
    visitors: number;
    pageViews: number;
    signups: number;
    checksUser: number;
    checksGuest: number;
    uploads: number;
    uploadsRejected: number;
    docsPaid: number;
    revenue: number;
  }[];
  funnel: Record<string, number>;
  timing: { firstCheckHours: number | null; firstPaymentHours: number | null };
}

interface Traffic {
  pages: { path: string; views: number; visitors: number }[];
  entries: { path: string; entries: number }[];
  referrers: { referrer: string; views: number; visitors: number }[];
  campaigns: { source: string; medium: string | null; campaign: string | null; visitors: number }[];
  devices: { device: string; visitors: number; views: number }[];
  sources: { source: string; views: number; visitors: number }[];
  heatmap: { dow: number; hour: number; views: number }[];
}

interface UploadEvent {
  id: string;
  createdAt: string;
  device: string | null;
  email: string | null;
  props: { result: string; reason?: string; ext: string; size?: number; pages?: number; truncated?: boolean };
}

interface DocRow {
  id: string;
  fileName: string;
  pages: number;
  amount: number;
  status: string;
  corrections: number | null;
  costUsd: number | null;
  createdAt: string;
  previewAt: string | null;
  consentAt: string | null;
  paidAt: string | null;
  completedAt: string | null;
  error: string | null;
  email: string;
}

interface Uploads {
  byExt: { ext: string; attempts: number; accepted: number; rejected: number; people: number }[];
  byReason: { reason: string; count: number; people: number }[];
  sizes: { label: string; count: number }[];
  pages: { label: string; count: number }[];
  recent: UploadEvent[];
  documents: {
    status: { status: string; count: number }[];
    summary: {
      created: number;
      previewed: number;
      checkout: number;
      paid: number;
      revenue: number;
      costUsd: number;
      previewCostUsd: number;
      avgPages: number;
      avgCorrections: number;
      avgProcessingSec: number;
    };
    refusedPreviews: { reason: string; count: number }[];
    list: DocRow[];
  };
}

interface EventRow {
  id: string;
  name: string;
  source: string;
  path: string | null;
  device: string | null;
  props: Record<string, unknown> | null;
  anonId: string | null;
  userId: string | null;
  createdAt: string;
  email: string | null;
}

interface Events {
  summary: { name: string; sources: string; count: number; people: number; users: number; lastAt: string }[];
  daily: { day: string; name: string; count: number }[];
  dayList: string[];
  props: { key: string; value: string; count: number }[];
  stream: EventRow[];
}

interface Journey {
  matches: { id: string; email: string; createdAt: string }[];
  user?: {
    id: string;
    email: string;
    name: string | null;
    plan: string;
    role: string;
    authProvider: string;
    emailVerified: boolean;
    bonusChecks: number;
    isActive: boolean;
    createdAt: string;
    lastLogin: string | null;
  };
  stats?: { checks: number; documents: number; paidDocuments: number; revenue: number; events: number };
  timeline?: { at: string; kind: string; title: string; detail?: any; anonymous?: boolean }[];
}

// ==================== klocki UI ====================

const card = "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700";
const th = "px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide";
const td = "px-3 py-2 text-sm text-gray-700 dark:text-gray-300";
const tooltipStyle = { backgroundColor: "#1F2937", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 };

function Section({ title, icon: Icon, children, right }: { title: string; icon?: any; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className={`${card} p-5`}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          {title}
        </h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function Delta({ now, before }: { now: number; before: number }) {
  if (!before && !now) return null;
  if (!before) return <span className="text-xs text-green-600">nowe</span>;
  const change = ((now - before) / before) * 100;
  const up = change >= 0;
  return (
    <span className={`inline-flex items-center text-xs ${up ? "text-green-600" : "text-red-600"}`}>
      {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {Math.abs(change).toFixed(0)}%
    </span>
  );
}

function Kpi({
  label,
  value,
  sub,
  icon: Icon,
  now,
  before,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: any;
  now: number;
  before: number;
}) {
  return (
    <div className={`${card} p-4`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Icon className="w-4 h-4" />
          {label}
        </span>
        <Delta now={now} before={before} />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</div>
      {sub && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

function BarList({ rows, empty = "Brak danych" }: { rows: { label: React.ReactNode; value: number; hint?: string }[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <p className="text-sm text-gray-500 dark:text-gray-400">{empty}</p>;
  return (
    <div className="space-y-1.5">
      {rows.map((r, i) => (
        <div key={i} className="relative">
          <div className="absolute inset-y-0 left-0 rounded bg-blue-100 dark:bg-blue-900/40" style={{ width: `${(r.value / max) * 100}%` }} />
          <div className="relative flex justify-between gap-3 px-2 py-1 text-sm">
            <span className="text-gray-800 dark:text-gray-200 truncate">{r.label}</span>
            <span className="text-gray-600 dark:text-gray-300 tabular-nums whitespace-nowrap">
              {num(r.value)}
              {r.hint && <span className="text-gray-400 ml-1">{r.hint}</span>}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}

function ErrorBox({ error }: { error: unknown }) {
  const msg = (error as any)?.response?.data?.message || (error as Error)?.message || "Nie udało się pobrać danych";
  return <div className={`${card} p-6 text-red-600`}>{msg}</div>;
}

// ==================== zakładki ====================

function OverviewTab({ qs }: { qs: string }) {
  const { data, isLoading, error } = useQuery<Overview>({
    queryKey: ["insights-overview", qs],
    queryFn: async () => (await api.get(`/api/admin/insights/overview?${qs}`)).data,
  });
  if (isLoading) return <Loading />;
  if (error || !data) return <ErrorBox error={error} />;
  const c = data.current;
  const p = data.previous;
  const f = data.funnel;

  const steps: [string, number][] = [
    ["Rejestracja", f.registered],
    ["Potwierdzony e-mail", f.verified],
    ["Pierwsze sprawdzenie AI", f.checked],
    ["3+ sprawdzenia", f.checked3],
    ["Próba wgrania pliku", f.uploadTried],
    ["Wgrany dokument (wycena)", f.uploaded],
    ["Bezpłatna próbka", f.previewed],
    ["Przejście do płatności", f.checkout],
    ["Płatność (dokument lub sprawdzenia)", f.paid],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <Kpi label="Odwiedzający" icon={Users} value={num(c.visitors)} now={c.visitors} before={p.visitors}
          sub={`${num(c.pageViews)} wyświetleń · ${c.visitors ? (c.pageViews / c.visitors).toFixed(1).replace(".", ",") : "–"} / os.`} />
        <Kpi label="Rejestracje" icon={UserPlus} value={num(c.signups)} now={c.signups} before={p.signups}
          sub={`${num(c.verified)} potwierdzonych · ${pct(c.signups, c.visitors)} odwiedzających`} />
        <Kpi label="Aktywne konta" icon={UserCheck} value={num(c.activeUsers)} now={c.activeUsers} before={p.activeUsers}
          sub="co najmniej 1 sprawdzenie AI" />
        <Kpi label="Sprawdzenia AI" icon={Sparkles} value={num(c.checksUser + c.checksGuest)} now={c.checksUser + c.checksGuest}
          before={p.checksUser + p.checksGuest} sub={`${num(c.checksUser)} z kont · ${num(c.checksGuest)} gości`} />
        <Kpi label="Sprawdzenia pisowni" icon={FileText} value={num(c.spellchecks)} now={c.spellchecks} before={p.spellchecks}
          sub="Hunspell, strony publiczne" />
        <Kpi label="Próby wgrania pliku" icon={FileUp} value={num(c.uploads)} now={c.uploads} before={p.uploads}
          sub={`${num(c.uploadsRejected)} odrzuconych (${pct(c.uploadsRejected, c.uploads)})`} />
        <Kpi label="Bezpłatne próbki" icon={Eye} value={num(c.previews)} now={c.previews} before={p.previews} />
        <Kpi label="Opłacone dokumenty" icon={CreditCard} value={num(c.docsPaid)} now={c.docsPaid} before={p.docsPaid} />
        <Kpi label="Przychód" icon={Coins} value={pln(c.docRevenue + c.topupRevenue)} now={c.docRevenue + c.topupRevenue}
          before={p.docRevenue + p.topupRevenue} sub={`dokumenty ${pln(c.docRevenue)} · sprawdzenia ${pln(c.topupRevenue)}`} />
        <Kpi label="Koszt AI" icon={Activity} value={usd(c.aiCostUsd)} now={c.aiCostUsd} before={p.aiCostUsd}
          sub="sprawdzenia + dokumenty + próbki" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3">
        Strzałki: zmiana względem poprzednich {data.range.days} dni. Odwiedzający = suma dziennych unikalnych osób
        (skrót IP zmieniany codziennie - ta sama osoba w dwa dni liczy się dwa razy).
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Section title="Ruch, rejestracje i sprawdzenia" icon={Activity}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" opacity={0.2} />
                <XAxis dataKey="day" tickFormatter={shortDay} tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                <YAxis yAxisId="l" tick={{ fill: "#9CA3AF", fontSize: 11 }} allowDecimals={false} />
                <YAxis yAxisId="r" orientation="right" tick={{ fill: "#9CA3AF", fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar yAxisId="l" dataKey="visitors" name="Odwiedzający" fill="#93C5FD" />
                <Line yAxisId="r" dataKey="checksUser" name="Sprawdzenia (konta)" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line yAxisId="r" dataKey="checksGuest" name="Sprawdzenia (goście)" stroke="#F59E0B" strokeWidth={2} dot={false} />
                <Line yAxisId="r" dataKey="signups" name="Rejestracje" stroke="#8B5CF6" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Pliki i płatności" icon={FileUp}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.daily.map((d) => ({ ...d, accepted: d.uploads - d.uploadsRejected, revenuePln: d.revenue / 100 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" opacity={0.2} />
                <XAxis dataKey="day" tickFormatter={shortDay} tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                <YAxis yAxisId="l" tick={{ fill: "#9CA3AF", fontSize: 11 }} allowDecimals={false} />
                <YAxis yAxisId="r" orientation="right" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar yAxisId="l" dataKey="accepted" stackId="u" name="Przyjęte pliki" fill="#10B981" />
                <Bar yAxisId="l" dataKey="uploadsRejected" stackId="u" name="Odrzucone pliki" fill="#EF4444" />
                <Line yAxisId="r" dataKey="revenuePln" name="Przychód (zł)" stroke="#2563EB" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <Section
        title={`Lejek kont założonych w tym okresie (${num(f.registered)})`}
        icon={Filter}
        right={
          <span className="text-xs text-gray-500 dark:text-gray-400">
            mediana do 1. sprawdzenia: <b>{hours(data.timing.firstCheckHours)}</b> · do płatności:{" "}
            <b>{hours(data.timing.firstPaymentHours)}</b>
          </span>
        }
      >
        <div className="space-y-2">
          {steps.map(([label, value], i) => {
            const prev = i > 0 ? steps[i - 1][1] : value;
            return (
              <div key={label} className="flex items-center gap-3">
                <div className="w-56 shrink-0 text-sm text-gray-700 dark:text-gray-300">{label}</div>
                <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-700/50 rounded relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded"
                    style={{ width: f.registered ? `${(value / f.registered) * 100}%` : 0 }}
                  />
                  <span className="absolute inset-y-0 left-2 flex items-center text-xs font-semibold text-white mix-blend-difference">
                    {num(value)}
                  </span>
                </div>
                <div className="w-28 text-right text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                  {pct(value, f.registered)}
                  {i > 0 && <span className="block">krok: {pct(value, prev)}</span>}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Kohorta: konta założone w wybranym okresie i to, co zrobiły do dziś. Kroki nie muszą być po kolei (np. ktoś
          wgrał dokument bez sprawdzenia AI), więc „krok” bywa ponad 100%.
        </p>
      </Section>
    </div>
  );
}

const DOW = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

function TrafficTab({ qs }: { qs: string }) {
  const { data, isLoading, error } = useQuery<Traffic>({
    queryKey: ["insights-traffic", qs],
    queryFn: async () => (await api.get(`/api/admin/insights/traffic?${qs}`)).data,
  });
  if (isLoading) return <Loading />;
  if (error || !data) return <ErrorBox error={error} />;
  const heat = new Map(data.heatmap.map((h) => [`${h.dow}-${h.hour}`, h.views]));
  const heatMax = Math.max(1, ...data.heatmap.map((h) => h.views));
  const totalVisitors = data.devices.reduce((s, d) => s + d.visitors, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Section title="Najczęściej oglądane strony" icon={Eye}>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Ścieżka</th>
                <th className={`${th} text-right`}>Wyświetlenia</th>
                <th className={`${th} text-right`}>Osoby</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.pages.map((p) => (
                <tr key={p.path}>
                  <td className={`${td} font-mono text-xs truncate max-w-xs`}>{p.path}</td>
                  <td className={`${td} text-right tabular-nums`}>{num(p.views)}</td>
                  <td className={`${td} text-right tabular-nums`}>{num(p.visitors)}</td>
                </tr>
              ))}
              {!data.pages.length && (
                <tr>
                  <td className={td} colSpan={3}>Brak danych</td>
                </tr>
              )}
            </tbody>
          </table>
        </Section>
        <div className="space-y-6">
          <Section title="Strony wejścia" icon={RouteIcon}>
            <BarList rows={data.entries.map((e) => ({ label: <span className="font-mono text-xs">{e.path}</span>, value: e.entries }))} />
          </Section>
          <Section title="Skąd przychodzą (referrer)" icon={Globe}>
            <BarList
              rows={data.referrers.map((r) => ({ label: r.referrer, value: r.visitors, hint: `/ ${num(r.views)} wyśw.` }))}
              empty="Brak wejść z innych stron (lub tylko bezpośrednie)"
            />
          </Section>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Section title="Urządzenia" icon={Users}>
          <BarList rows={data.devices.map((d) => ({ label: d.device, value: d.visitors, hint: pct(d.visitors, totalVisitors) }))} />
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <BarList rows={data.sources.map((s) => ({ label: SOURCE_LABELS[s.source] || s.source, value: s.views, hint: "wyśw." }))} />
          </div>
        </Section>
        <Section title="Kampanie (utm)" icon={Filter}>
          <BarList
            rows={data.campaigns.map((c) => ({
              label: [c.source, c.medium, c.campaign].filter(Boolean).join(" / "),
              value: c.visitors,
            }))}
            empty="Brak wejść z parametrami utm"
          />
        </Section>
        <Section title="Kiedy (dzień tygodnia × godzina)" icon={Activity}>
          <div className="overflow-x-auto">
            <div className="grid gap-px" style={{ gridTemplateColumns: "24px repeat(24, minmax(8px, 1fr))" }}>
              <div />
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="text-[9px] text-gray-400 text-center">{h % 6 === 0 ? h : ""}</div>
              ))}
              {DOW.map((d, i) => (
                <div key={d} className="contents">
                  <div className="text-[10px] text-gray-500">{d}</div>
                  {Array.from({ length: 24 }, (_, h) => {
                    const v = heat.get(`${i + 1}-${h}`) ?? 0;
                    return (
                      <div
                        key={h}
                        title={`${d} ${h}:00 - ${v} wyśw.`}
                        className="h-4 rounded-sm bg-blue-600"
                        style={{ opacity: v ? 0.12 + (v / heatMax) * 0.88 : 0.04 }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function UploadsTab({ qs, openJourney }: { qs: string; openJourney: (q: string) => void }) {
  const { data, isLoading, error } = useQuery<Uploads>({
    queryKey: ["insights-uploads", qs],
    queryFn: async () => (await api.get(`/api/admin/insights/uploads?${qs}`)).data,
  });
  if (isLoading) return <Loading />;
  if (error || !data) return <ErrorBox error={error} />;
  const s = data.documents.summary;
  const missing = data.byExt.filter((e) => e.ext !== "docx" && e.rejected > 0);
  const totalAttempts = data.byExt.reduce((sum, e) => sum + e.attempts, 0);
  const margin = s.revenue / 100 - (s.costUsd + s.previewCostUsd) * 4; // ~4 zł za USD, orientacyjnie

  return (
    <div className="space-y-6">
      {missing.length > 0 && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 dark:text-amber-200">
            <b>Formaty, których nie obsługujemy, a ludzie próbują je wgrać:</b>{" "}
            {missing.map((m) => `.${m.ext} (${m.attempts}× / ${m.people} os.)`).join(", ")}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Section title={`Formaty plików (${num(totalAttempts)} prób)`} icon={FileUp}>
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Format</th>
                <th className={`${th} text-right`}>Próby</th>
                <th className={`${th} text-right`}>Przyjęte</th>
                <th className={`${th} text-right`}>Osoby</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.byExt.map((e) => (
                <tr key={e.ext}>
                  <td className={`${td} font-mono`}>{e.ext === "(brak)" ? e.ext : `.${e.ext}`}</td>
                  <td className={`${td} text-right tabular-nums`}>{num(e.attempts)}</td>
                  <td className={`${td} text-right tabular-nums`}>
                    {num(e.accepted)} <span className="text-gray-400 text-xs">{pct(e.accepted, e.attempts)}</span>
                  </td>
                  <td className={`${td} text-right tabular-nums`}>{num(e.people)}</td>
                </tr>
              ))}
              {!data.byExt.length && (
                <tr>
                  <td className={td} colSpan={4}>Brak prób w tym okresie</td>
                </tr>
              )}
            </tbody>
          </table>
        </Section>
        <Section title="Powody odrzucenia" icon={AlertTriangle}>
          <BarList
            rows={data.byReason.map((r) => ({ label: UPLOAD_REASONS[r.reason] || r.reason, value: r.count, hint: `/ ${r.people} os.` }))}
            empty="Nic nie odrzucono"
          />
          {data.documents.refusedPreviews.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 mb-2">Odmowy bezpłatnej próbki</p>
              <BarList rows={data.documents.refusedPreviews.map((r) => ({ label: PREVIEW_REASONS[r.reason] || r.reason, value: r.count }))} />
            </div>
          )}
        </Section>
        <Section title="Rozmiar i długość" icon={FileText}>
          <p className="text-xs font-medium text-gray-500 mb-2">Rozmiar pliku (wszystkie próby)</p>
          <BarList rows={data.sizes.map((x) => ({ label: x.label, value: x.count }))} />
          <p className="text-xs font-medium text-gray-500 mt-4 mb-2">Długość (odczytane .docx)</p>
          <BarList rows={data.pages.map((x) => ({ label: x.label, value: x.count }))} />
        </Section>
      </div>

      <Section title="Dokumenty wgrane w tym okresie" icon={CreditCard}>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-5">
          {[
            ["Wycenione", num(s.created)],
            ["Próbka", `${num(s.previewed)} (${pct(s.previewed, s.created)})`],
            ["Do płatności", `${num(s.checkout)} (${pct(s.checkout, s.created)})`],
            ["Opłacone", `${num(s.paid)} (${pct(s.paid, s.created)})`],
            ["Przychód", pln(s.revenue)],
            ["Koszt AI", `${usd(s.costUsd)} + próbki ${usd(s.previewCostUsd)}`],
            ["Śr. długość", `${s.avgPages.toFixed(1).replace(".", ",")} str.`],
            ["Śr. czas korekty", s.avgProcessingSec ? `${Math.round(s.avgProcessingSec / 60)} min` : "–"],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
            </div>
          ))}
        </div>
        {s.paid > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Marża po kosztach AI (orientacyjnie, 1 USD ≈ 4 zł): <b>{margin.toFixed(0)} zł</b> · śr.{" "}
            {s.avgCorrections.toFixed(0)} poprawek na dokument
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Wgrany</th>
                <th className={th}>Konto</th>
                <th className={th}>Plik</th>
                <th className={`${th} text-right`}>Str.</th>
                <th className={`${th} text-right`}>Cena</th>
                <th className={th}>Status</th>
                <th className={th}>Etapy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.documents.list.map((d) => (
                <tr key={d.id}>
                  <td className={`${td} whitespace-nowrap`}>{dateTime(d.createdAt)}</td>
                  <td className={td}>
                    <button onClick={() => openJourney(d.email)} className="text-blue-600 hover:underline">{d.email}</button>
                  </td>
                  <td className={`${td} truncate max-w-[220px]`} title={d.fileName}>{d.fileName}</td>
                  <td className={`${td} text-right`}>{d.pages}</td>
                  <td className={`${td} text-right`}>{pln(d.amount)}</td>
                  <td className={td} title={d.error || ""}>
                    <StatusPill status={d.status} />
                  </td>
                  <td className={`${td} text-xs text-gray-500`}>
                    {[d.previewAt && "próbka", d.consentAt && "checkout", d.paidAt && "opłacony", d.completedAt && `gotowy (${d.corrections ?? 0} popr.)`]
                      .filter(Boolean)
                      .join(" → ") || "tylko wycena"}
                  </td>
                </tr>
              ))}
              {!data.documents.list.length && (
                <tr>
                  <td className={td} colSpan={7}>Brak dokumentów</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Ostatnie próby wgrania" icon={FileUp}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Kiedy</th>
                <th className={th}>Konto</th>
                <th className={th}>Format</th>
                <th className={`${th} text-right`}>Rozmiar</th>
                <th className={`${th} text-right`}>Str.</th>
                <th className={th}>Wynik</th>
                <th className={th}>Urządzenie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.recent.map((e) => (
                <tr key={e.id}>
                  <td className={`${td} whitespace-nowrap`}>{dateTime(e.createdAt)}</td>
                  <td className={td}>
                    {e.email ? (
                      <button onClick={() => openJourney(e.email!)} className="text-blue-600 hover:underline">{e.email}</button>
                    ) : (
                      "–"
                    )}
                  </td>
                  <td className={`${td} font-mono`}>{e.props.ext ? `.${e.props.ext}` : "(brak)"}</td>
                  <td className={`${td} text-right`}>{bytes(e.props.size)}{e.props.truncated ? "+" : ""}</td>
                  <td className={`${td} text-right`}>{e.props.pages ?? "–"}</td>
                  <td className={td}>
                    {e.props.result === "accepted" ? (
                      <span className="text-green-600">przyjęty</span>
                    ) : (
                      <span className="text-red-600">{UPLOAD_REASONS[e.props.reason || ""] || e.props.reason}</span>
                    )}
                  </td>
                  <td className={`${td} text-xs text-gray-500`}>{e.device || "–"}</td>
                </tr>
              ))}
              {!data.recent.length && (
                <tr>
                  <td className={td} colSpan={7}>Brak prób w tym okresie</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    AWAITING_PAYMENT: ["czeka na płatność", "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"],
    PAID: ["opłacony", "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"],
    PROCESSING: ["w korekcie", "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"],
    DONE: ["gotowy", "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"],
    FAILED: ["błąd", "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"],
  };
  const [label, cls] = map[status] || [status, "bg-gray-100 text-gray-700"];
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{label}</span>;
}

function PropsInline({ props }: { props: Record<string, unknown> | null }) {
  if (!props || !Object.keys(props).length) return <span className="text-gray-400">–</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {Object.entries(props).map(([k, v]) => (
        <span key={k} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-[11px] font-mono text-gray-700 dark:text-gray-300">
          {k}={String(v)}
        </span>
      ))}
    </span>
  );
}

function EventsTab({
  qs,
  name,
  source,
  q,
  setParam,
  openJourney,
}: {
  qs: string;
  name: string;
  source: string;
  q: string;
  setParam: (k: string, v: string) => void;
  openJourney: (q: string) => void;
}) {
  const [search, setSearch] = useState(q);
  const full = `${qs}${name ? `&name=${encodeURIComponent(name)}` : ""}${source ? `&source=${source}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
  const { data, isLoading, error } = useQuery<Events>({
    queryKey: ["insights-events", full],
    queryFn: async () => (await api.get(`/api/admin/insights/events?${full}`)).data,
  });

  const chart = useMemo(() => {
    if (!data) return [];
    const by = new Map<string, number>();
    for (const d of data.daily) by.set(d.day, (by.get(d.day) ?? 0) + d.count);
    return data.dayList.map((day) => ({ day, count: by.get(day) ?? 0 }));
  }, [data]);

  const propGroups = useMemo(() => {
    const g = new Map<string, { value: string; count: number }[]>();
    for (const p of data?.props ?? []) g.set(p.key, [...(g.get(p.key) ?? []), { value: p.value, count: p.count }]);
    return [...g.entries()];
  }, [data]);

  if (isLoading) return <Loading />;
  if (error || !data) return <ErrorBox error={error} />;

  return (
    <div className="space-y-6">
      <Section title="Wszystkie zdarzenia w okresie" icon={Activity}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Zdarzenie</th>
                <th className={th}>Źródło</th>
                <th className={`${th} text-right`}>Liczba</th>
                <th className={`${th} text-right`}>Osoby</th>
                <th className={`${th} text-right`}>Zalogowani</th>
                <th className={th}>Ostatnio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.summary.map((s) => (
                <tr
                  key={s.name}
                  onClick={() => setParam("name", name === s.name ? "" : s.name)}
                  className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 ${name === s.name ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                >
                  <td className={td}>
                    <span className="font-mono text-xs">{s.name}</span>
                    {EVENT_LABELS[s.name] && <span className="text-gray-500 ml-2">{EVENT_LABELS[s.name]}</span>}
                  </td>
                  <td className={`${td} text-xs`}>{s.sources.split(", ").map((x) => SOURCE_LABELS[x] || x).join(", ")}</td>
                  <td className={`${td} text-right tabular-nums`}>{num(s.count)}</td>
                  <td className={`${td} text-right tabular-nums`}>{num(s.people)}</td>
                  <td className={`${td} text-right tabular-nums`}>{num(s.users)}</td>
                  <td className={`${td} whitespace-nowrap`}>{dateTime(s.lastAt)}</td>
                </tr>
              ))}
              {!data.summary.length && (
                <tr>
                  <td className={td} colSpan={6}>Brak zdarzeń w tym okresie</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Kliknij wiersz, żeby filtrować wykres, parametry i strumień.</p>
      </Section>

      <div className={`${card} p-4 flex flex-wrap items-center gap-3`}>
        <span className="text-sm text-gray-600 dark:text-gray-300">Filtr:</span>
        {name && (
          <button onClick={() => setParam("name", "")} className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-mono">
            {name} ✕
          </button>
        )}
        <select
          value={source}
          onChange={(e) => setParam("source", e.target.value)}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
        >
          <option value="">wszystkie źródła</option>
          <option value="web">strony publiczne</option>
          <option value="app">panel</option>
          <option value="server">backend</option>
        </select>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setParam("q", search.trim());
          }}
          className="flex items-center gap-2"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e-mail, ścieżka albo anonId"
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white w-64"
          />
          <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm">Szukaj</button>
        </form>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Section title={name ? `Dziennie: ${name}` : "Dziennie: wszystkie zdarzenia"} icon={Activity}>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" opacity={0.2} />
                  <XAxis dataKey="day" tickFormatter={shortDay} tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Zdarzenia" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>
        <Section title="Parametry" icon={Filter}>
          {!name ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Wybierz zdarzenie, żeby zobaczyć rozkład jego parametrów.</p>
          ) : propGroups.length ? (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {propGroups.map(([key, values]) => (
                <div key={key}>
                  <p className="text-xs font-mono font-medium text-gray-500 mb-1">{key}</p>
                  <BarList rows={values.map((v) => ({ label: v.value, value: v.count }))} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">To zdarzenie nie ma parametrów.</p>
          )}
        </Section>
      </div>

      <Section title={`Strumień (ostatnie ${data.stream.length})`} icon={RouteIcon}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={th}>Kiedy</th>
                <th className={th}>Zdarzenie</th>
                <th className={th}>Kto</th>
                <th className={th}>Strona</th>
                <th className={th}>Parametry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.stream.map((e) => (
                <tr key={e.id}>
                  <td className={`${td} whitespace-nowrap`}>{dateTime(e.createdAt)}</td>
                  <td className={td}>
                    <span className="font-mono text-xs">{e.name}</span>
                    <span className="block text-[11px] text-gray-400">
                      {SOURCE_LABELS[e.source] || e.source}
                      {e.device ? ` · ${e.device}` : ""}
                    </span>
                  </td>
                  <td className={td}>
                    {e.email ? (
                      <button onClick={() => openJourney(e.email!)} className="text-blue-600 hover:underline">{e.email}</button>
                    ) : e.anonId ? (
                      <button onClick={() => { setSearch(e.anonId!); setParam("q", e.anonId!); }} className="font-mono text-xs text-gray-500 hover:underline" title="Pokaż wszystkie zdarzenia tej osoby z tego dnia">
                        anon {e.anonId.slice(0, 6)}
                      </button>
                    ) : (
                      "–"
                    )}
                  </td>
                  <td className={`${td} font-mono text-xs truncate max-w-[200px]`} title={e.path || ""}>{e.path || "–"}</td>
                  <td className={td}>
                    <PropsInline props={e.props} />
                  </td>
                </tr>
              ))}
              {!data.stream.length && (
                <tr>
                  <td className={td} colSpan={5}>Brak zdarzeń dla tego filtra</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

const KIND_STYLES: Record<string, string> = {
  account: "bg-purple-500",
  event: "bg-gray-400",
  check: "bg-green-500",
  document: "bg-blue-500",
  payment: "bg-amber-500",
  purchase: "bg-gray-400",
};

function JourneyTab({ q, setParam }: { q: string; setParam: (k: string, v: string) => void }) {
  const [search, setSearch] = useState(q);
  const [hideAnon, setHideAnon] = useState(false);
  const { data, isLoading, error } = useQuery<Journey>({
    queryKey: ["insights-journey", q],
    queryFn: async () => (await api.get(`/api/admin/insights/journey?q=${encodeURIComponent(q)}`)).data,
    enabled: q.length >= 2,
  });

  const timeline = (data?.timeline ?? []).filter((t) => !hideAnon || !t.anonymous);

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParam("q", search.trim());
        }}
        className={`${card} p-4 flex items-center gap-3`}
      >
        <Search className="w-5 h-5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="E-mail albo fragment e-maila, albo ID konta"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">Pokaż ścieżkę</button>
      </form>

      {q.length < 2 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Wpisz e-mail, żeby zobaczyć wszystko, co dana osoba zrobiła: strony, sprawdzenia, pliki (także odrzucone),
          płatności - oraz anonimowe zdarzenia z tego samego adresu IP w te same dni (np. co czytała przed rejestracją).
        </p>
      ) : isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorBox error={error} />
      ) : data && !data.user ? (
        <Section title="Kilka kont pasuje - wybierz" icon={Users}>
          <div className="space-y-1">
            {data.matches.map((m) => (
              <button key={m.id} onClick={() => { setSearch(m.email); setParam("q", m.email); }} className="block text-blue-600 hover:underline text-sm">
                {m.email} <span className="text-gray-400">· {dateTime(m.createdAt)}</span>
              </button>
            ))}
          </div>
        </Section>
      ) : data?.user ? (
        <>
          <div className={`${card} p-5 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4`}>
            <div className="col-span-2">
              <div className="font-semibold text-gray-900 dark:text-white">{data.user.email}</div>
              <div className="text-xs text-gray-500">
                {data.user.name || "bez nazwy"} · {data.user.authProvider === "GOOGLE" ? "Google" : "e-mail"} ·{" "}
                {data.user.emailVerified ? "potwierdzony" : "niepotwierdzony"}
                {!data.user.isActive && " · nieaktywne"}
              </div>
            </div>
            {[
              ["Konto od", dateTime(data.user.createdAt)],
              ["Ostatnie logowanie", data.user.lastLogin ? dateTime(data.user.lastLogin) : "–"],
              ["Sprawdzenia AI", num(data.stats!.checks)],
              ["Dokumenty", `${data.stats!.documents} (opł. ${data.stats!.paidDocuments})`],
              ["Wydał", pln(data.stats!.revenue)],
              ["Zdarzenia", num(data.stats!.events)],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{value}</div>
              </div>
            ))}
          </div>
          {data.matches.length > 0 && (
            <p className="text-xs text-gray-500">
              Pasuje też: {data.matches.filter((m) => m.id !== data.user!.id).map((m) => m.email).join(", ")}
            </p>
          )}

          <Section
            title={`Oś czasu (${timeline.length})`}
            icon={RouteIcon}
            right={
              <label className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <input type="checkbox" checked={hideAnon} onChange={(e) => setHideAnon(e.target.checked)} />
                ukryj zdarzenia bez logowania
              </label>
            }
          >
            <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-2">
              {timeline.map((t, i) => (
                <li key={i} className={`ml-5 pb-3 ${t.anonymous ? "opacity-60" : ""}`}>
                  <span className={`absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full ${KIND_STYLES[t.kind] || "bg-gray-400"}`} />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-xs text-gray-500 tabular-nums w-24">{dateTime(t.at)}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {t.kind === "event" ? EVENT_LABELS[t.title] || t.title : t.title}
                    </span>
                    {t.anonymous && <span className="text-[11px] text-gray-500">(bez logowania, ten sam IP)</span>}
                  </div>
                  <TimelineDetail kind={t.kind} detail={t.detail} />
                </li>
              ))}
            </ol>
          </Section>
        </>
      ) : null}
    </div>
  );
}

function TimelineDetail({ kind, detail }: { kind: string; detail: any }) {
  if (!detail) return null;
  const text = "ml-[108px] text-xs text-gray-500 dark:text-gray-400";
  if (kind === "event") {
    return (
      <div className={`${text} flex flex-wrap items-center gap-2`}>
        {detail.path && <span className="font-mono">{detail.path}</span>}
        <PropsInline props={detail.props} />
      </div>
    );
  }
  if (kind === "check") return <div className={text}>{num(detail.chars)} znaków · {detail.errors} błędów{detail.bonus ? " · bonus" : ""}</div>;
  if (kind === "document" || kind === "payment") {
    if (detail.fileName) {
      return (
        <div className={text}>
          {detail.fileName} · {detail.pages} str. · {pln(detail.amount)}
          {detail.corrections !== undefined && ` · ${detail.corrections} poprawek`}
        </div>
      );
    }
    return <div className={text}>{pln(detail.amount)} · {detail.credits} sprawdzeń</div>;
  }
  if (kind === "purchase") return <div className={text}>{pln(detail.amount)}</div>;
  return null;
}

// ==================== strona ====================

const TABS = [
  { id: "overview", label: "Przegląd", icon: Activity },
  { id: "traffic", label: "Ruch", icon: Globe },
  { id: "uploads", label: "Pliki i dokumenty", icon: FileUp },
  { id: "events", label: "Zdarzenia", icon: Filter },
  { id: "journey", label: "Ścieżka użytkownika", icon: RouteIcon },
] as const;

export function AdminInsights() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "overview";
  const days = params.get("days") || "30";
  const admins = params.get("admins") === "1";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: key !== "tab" });
  };
  const openJourney = (email: string) => {
    const next = new URLSearchParams(params);
    next.set("tab", "journey");
    next.set("q", email);
    setParams(next);
  };

  const qs = `days=${days}&admins=${admins ? 1 : 0}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analityka</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Własne zdarzenia (bez cookies) + dane z bazy. GA4 widzi tylko osoby, które zgodziły się na cookies.
          </p>
        </div>
        {tab !== "journey" && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <input type="checkbox" checked={admins} onChange={(e) => setParam("admins", e.target.checked ? "1" : "")} />
              z kontami admina
            </label>
            <select
              value={days}
              onChange={(e) => setParam("days", e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="1">Dziś</option>
              <option value="7">Ostatnie 7 dni</option>
              <option value="30">Ostatnie 30 dni</option>
              <option value="90">Ostatnie 90 dni</option>
              <option value="365">Ostatnie 365 dni</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setParam("tab", t.id === "overview" ? "" : t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <TrackingNotice />

      {tab === "overview" && <OverviewTab qs={qs} />}
      {tab === "traffic" && <TrafficTab qs={qs} />}
      {tab === "uploads" && <UploadsTab qs={qs} openJourney={openJourney} />}
      {tab === "events" && (
        <EventsTab
          qs={qs}
          name={params.get("name") || ""}
          source={params.get("source") || ""}
          q={params.get("q") || ""}
          setParam={setParam}
          openJourney={openJourney}
        />
      )}
      {tab === "journey" && <JourneyTab key={params.get("q") || ""} q={params.get("q") || ""} setParam={setParam} />}
    </div>
  );
}

// Informacja, od kiedy zbieramy zdarzenia - bez niej spadek „z zera” wygląda jak błąd
function TrackingNotice() {
  const { data } = useQuery<Overview>({
    queryKey: ["insights-overview", "days=1&admins=1"],
    queryFn: async () => (await api.get(`/api/admin/insights/overview?days=1&admins=1`)).data,
    staleTime: 5 * 60 * 1000,
  });
  if (!data) return null;
  const since = data.trackingSince ? new Date(data.trackingSince) : null;
  if (since && Date.now() - since.getTime() > 400 * 24 * 3600 * 1000) return null;
  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
      <AlertTriangle className="w-3.5 h-3.5" />
      {since
        ? `Zdarzenia (odwiedzający, strony, próby wgrania plików) zbieramy od ${since.toLocaleDateString("pl-PL")} - wcześniejsze dni mają tylko dane z bazy (konta, sprawdzenia, dokumenty, płatności).`
        : "Nie zebrano jeszcze żadnych zdarzeń - pojawią się po pierwszych wejściach na stronę."}
    </div>
  );
}
