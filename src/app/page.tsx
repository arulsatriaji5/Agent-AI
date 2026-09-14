"use client";

import { useCallback, useEffect, useState } from "react";
import type { MarketReport } from "@/lib/turso";

// ═══════════════════════════════════════════════════════════════════════════
// Helper: format number with US locale
// ═══════════════════════════════════════════════════════════════════════════
function fmtPrice(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtPercent(n: number): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function fmtTimestamp(iso: string): string {
  const d = new Date(iso + "Z");
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════════════

/* ── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-surface-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 shadow-glow">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-surface-950 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">
              BTC Research
            </h1>
            <p className="text-[11px] leading-none text-slate-500 font-medium">
              AI-Powered Intelligence
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          System Online
        </div>
      </div>
    </nav>
  );
}

/* ── Hero Metric Card ──────────────────────────────────────────────────── */
function MetricCard({
  label,
  value,
  sub,
  icon,
  accent = "cyan",
  delay = 0,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: "cyan" | "violet" | "emerald" | "rose" | "amber";
  delay?: number;
}) {
  const accentColors = {
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20",
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/20",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
  };

  return (
    <div
      className={`glass-card p-5 sm:p-6 opacity-0 animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {value}
          </p>
          {sub && (
            <p className="text-sm font-medium text-slate-400">{sub}</p>
          )}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accentColors[accent]} border`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ── Sentiment Badge ───────────────────────────────────────────────────── */
function SentimentBadge({ sentiment }: { sentiment: string }) {
  const cls =
    sentiment === "Bullish"
      ? "badge-bullish"
      : sentiment === "Bearish"
      ? "badge-bearish"
      : "badge-neutral";

  const icon =
    sentiment === "Bullish"
      ? "↑"
      : sentiment === "Bearish"
      ? "↓"
      : "→";

  return (
    <span className={cls}>
      <span className="text-sm">{icon}</span>
      {sentiment}
    </span>
  );
}

/* ── Report Card ───────────────────────────────────────────────────────── */
function ReportCard({
  report,
  index,
}: {
  report: MarketReport;
  index: number;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isPositive = report.change_24h >= 0;

  return (
    <article
      className="glass-card overflow-hidden opacity-0 animate-slide-up group"
      style={{ animationDelay: `${150 + index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface-800">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 shimmer" />
        )}
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-900">
            <div className="text-center">
              <svg className="mx-auto h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
              </svg>
              <p className="mt-2 text-xs text-slate-600">Visual unavailable</p>
            </div>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={report.image_url}
            alt={`Market visualization for ${report.asset}`}
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent" />

        {/* Floating badge */}
        <div className="absolute left-4 top-4">
          <SentimentBadge sentiment={report.sentiment} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Price row */}
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              {report.asset}
            </p>
            <p className="text-xl font-bold text-white">
              {fmtPrice(report.price)}
            </p>
          </div>
          <div
            className={`text-right rounded-lg px-2.5 py-1 text-sm font-bold ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {fmtPercent(report.change_24h)}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm leading-relaxed text-slate-400">
          {report.summary}
        </p>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          {fmtTimestamp(report.created_at)}
        </div>
      </div>
    </article>
  );
}

/* ── Skeleton Card ─────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-video w-full shimmer" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-3 w-16 shimmer" />
            <div className="h-6 w-28 shimmer" />
          </div>
          <div className="h-8 w-16 shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full shimmer" />
          <div className="h-3 w-4/5 shimmer" />
        </div>
        <div className="h-3 w-32 shimmer" />
      </div>
    </div>
  );
}

/* ── Empty State ───────────────────────────────────────────────────────── */
function EmptyState({ onRun }: { onRun: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-0 animate-fade-in">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-white/[0.06]">
          <svg className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface-950 ring-2 ring-surface-800">
          <span className="text-sm">🤖</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        No Research Reports Yet
      </h3>
      <p className="max-w-sm text-sm text-slate-500 mb-6">
        Click the button below to trigger your first AI-powered market analysis.
        The system will fetch live BTC data and generate insights automatically.
      </p>
      <button onClick={onRun} className="btn-primary">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
        Run First Analysis
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const [reports, setReports] = useState<MarketReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch("/api/reports");
      const json = await res.json();
      if (json.success) {
        setReports(json.data);
        setError(null);
      } else {
        setError(json.error || "Failed to load reports");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Run research
  const runResearch = useCallback(async () => {
    setRunning(true);
    setToast(null);
    try {
      const res = await fetch("/api/cron/research");
      const json = await res.json();
      if (json.success) {
        setToast({ msg: "Research completed! New report generated.", type: "ok" });
        await fetchReports();
      } else {
        setToast({ msg: json.error || "Research failed", type: "err" });
      }
    } catch (e) {
      setToast({
        msg: e instanceof Error ? e.message : "Network error",
        type: "err",
      });
    } finally {
      setRunning(false);
    }
  }, [fetchReports]);

  // Initial load
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const latest = reports[0] ?? null;
  const isPositive = latest ? latest.change_24h >= 0 : true;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* ── Header Row ────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Market Dashboard
            </h2>
            <p className="text-sm text-slate-500">
              Real-time BTC analysis powered by Gemini AI
            </p>
          </div>

          <button
            id="run-research-btn"
            onClick={runResearch}
            disabled={running}
            className="btn-primary self-start sm:self-auto"
          >
            {running ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
                Jalankan Riset Sekarang
              </>
            )}
          </button>
        </div>

        {/* ── Toast ─────────────────────────────────────────────── */}
        {toast && (
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium animate-fade-in ${
              toast.type === "ok"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/20 bg-rose-500/10 text-rose-400"
            }`}
          >
            <span className="text-base">{toast.type === "ok" ? "✓" : "✕"}</span>
            {toast.msg}
          </div>
        )}

        {/* ── Error Banner ─────────────────────────────────────── */}
        {error && !loading && (
          <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400 animate-fade-in">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Metric Cards ─────────────────────────────────────── */}
        {latest && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="BTC Price"
              value={fmtPrice(latest.price)}
              icon={
                <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              }
              accent="cyan"
              delay={0}
            />
            <MetricCard
              label="24h Change"
              value={fmtPercent(latest.change_24h)}
              sub={isPositive ? "Trending Up" : "Trending Down"}
              icon={
                <svg className={`h-5 w-5 ${isPositive ? "text-emerald-400" : "text-rose-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {isPositive ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                  )}
                </svg>
              }
              accent={isPositive ? "emerald" : "rose"}
              delay={100}
            />
            <MetricCard
              label="Market Sentiment"
              value={latest.sentiment}
              icon={
                <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              }
              accent="violet"
              delay={200}
            />
            <MetricCard
              label="Total Reports"
              value={String(reports.length)}
              sub="AI analyses generated"
              icon={
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              }
              accent="amber"
              delay={300}
            />
          </div>
        )}

        {/* ── Reports Grid ─────────────────────────────────────── */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">
              Research History
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : reports.length === 0 ? (
              <EmptyState onRun={runResearch} />
            ) : (
              reports.map((report, i) => (
                <ReportCard key={report.id} report={report} index={i} />
              ))
            )}
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-xs text-slate-600">
              Built with Next.js · Turso · Gemini AI · Pollinations
            </p>
            <p className="text-xs text-slate-700">
              Data sourced from Binance public API — for informational purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
