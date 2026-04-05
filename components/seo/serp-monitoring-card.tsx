"use client";

import { useId } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  computeRankDelta,
  relativeTimeShort,
  snapshotsChronological,
  type SnapshotPoint,
} from "@/lib/serp/monitoring-display";
import Link from "next/link";
import { Loader2, RefreshCw, Sparkles, TrendingDown, TrendingUp, Minus } from "lucide-react";

export type SerpMonitoringCardProps = {
  url: string;
  keyword: string;
  cadence: string;
  lastPosition: number | null;
  lastNote: string | null;
  lastRunAt: string | null;
  snapshots: SnapshotPoint[];
  running: boolean;
  onRefresh: () => void;
  onRemove: () => void;
  /** Informe premium vs URLs por encima en la SERP (créditos). */
  insightCreditCost?: number;
  /** Enterprise / admin: no muestra coste en el botón. */
  insightCreditsWaived?: boolean;
  insightLoading?: boolean;
  onInsight?: () => void;
};

/** Serie temporal: mejor ranking (nº más bajo) arriba del gráfico. */
function Sparkline({ series }: { series: { t: number; position: number }[] }) {
  const gid = useId().replace(/:/g, "");
  if (series.length < 2) return null;

  const w = 220;
  const h = 52;
  const pad = 6;
  const positions = series.map((s) => s.position);
  const minP = Math.min(...positions);
  const maxP = Math.max(...positions);
  const t0 = series[0]!.t;
  const t1 = series[series.length - 1]!.t;

  const rx = (t: number) =>
    pad + (t1 === t0 ? (w - pad * 2) / 2 : ((t - t0) / (t1 - t0)) * (w - pad * 2));
  /** Número de posición más bajo (mejor) → arriba del SVG (y pequeño). */
  const ry = (p: number) => {
    if (maxP === minP) return h / 2;
    return pad + ((p - minP) / (maxP - minP)) * (h - pad * 2);
  };

  const pts = series.map((s) => ({ x: rx(s.t), y: ry(s.position) }));
  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaD = `${lineD} L ${pts[pts.length - 1]!.x.toFixed(1)} ${h - pad} L ${pts[0]!.x.toFixed(1)} ${h - pad} Z`;

  return (
    <svg
      width={w}
      height={h}
      className="shrink-0 text-violet-600 dark:text-violet-400"
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={`sf-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sf-${gid})`} />
      <path
        d={lineD}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={3.5}
          className="fill-background stroke-[2.5px] stroke-current"
        />
      ))}
    </svg>
  );
}

function buildSeries(chrono: SnapshotPoint[]): { t: number; position: number }[] {
  return chrono
    .filter((s) => s.position != null && s.position > 0)
    .map((s) => ({
      t: new Date(s.createdAt).getTime(),
      position: s.position!,
    }));
}

export function SerpMonitoringCard({
  url,
  keyword,
  cadence,
  lastPosition,
  lastNote,
  lastRunAt,
  snapshots,
  running,
  onRefresh,
  onRemove,
  insightCreditCost,
  insightCreditsWaived,
  insightLoading,
  onInsight,
}: SerpMonitoringCardProps) {
  const ordered = snapshotsChronological(snapshots);
  const withPosition = ordered.filter((s) => s.position != null && s.position > 0);
  const newest = withPosition[withPosition.length - 1]?.position ?? null;
  const prev =
    withPosition.length >= 2 ? withPosition[withPosition.length - 2]!.position : null;
  const delta = computeRankDelta(newest, prev);
  const series = buildSeries(ordered);

  const showPending = lastPosition == null && !lastNote;

  return (
    <li className="group relative overflow-hidden rounded-2xl border border-violet-200/50 bg-gradient-to-br from-violet-50/80 via-background to-background shadow-md ring-1 ring-violet-500/10 dark:border-violet-500/20 dark:from-violet-950/40 dark:ring-violet-400/10">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-violet-400/20 to-transparent blur-2xl" />
      <div className="relative grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-stretch">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="border-violet-200/80 bg-violet-100/80 font-normal text-violet-900 dark:border-violet-500/30 dark:bg-violet-950/60 dark:text-violet-100"
            >
              {cadence === "daily" ? "Diario" : "Semanal"}
            </Badge>
            {lastRunAt ? (
              <span className="text-xs text-muted-foreground">
                Última comprobación · {relativeTimeShort(lastRunAt)}
              </span>
            ) : null}
          </div>
          <p className="break-all font-mono text-[13px] leading-snug text-foreground">{url}</p>
          <p className="text-sm">
            <span className="text-muted-foreground">Consulta: </span>
            <span className="font-semibold text-foreground">«{keyword}»</span>
          </p>
          {lastPosition == null && lastNote ? (
            <p className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-xs leading-relaxed text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100">
              {lastNote}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:min-w-[240px] sm:items-end">
          <div className="flex w-full flex-col items-center gap-1 rounded-xl border border-violet-300/40 bg-white/70 px-4 py-3 text-center shadow-sm dark:border-violet-500/25 dark:bg-zinc-900/60 sm:items-end sm:text-right">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Posición actual
            </span>
            {showPending ? (
              <div className="flex items-center gap-2 py-1">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-violet-500" />
                <span className="text-lg font-medium text-muted-foreground">Comprobando…</span>
              </div>
            ) : lastPosition != null ? (
              <div className="flex flex-wrap items-baseline justify-center gap-2 sm:justify-end">
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-black tabular-nums tracking-tight text-transparent sm:text-5xl">
                  {lastPosition}
                </span>
                <span className="text-sm font-medium text-muted-foreground">en Google</span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">—</span>
            )}

            {delta && lastPosition != null ? (
              <div
                className={`mt-1 flex items-center justify-center gap-1 text-sm font-semibold sm:justify-end ${
                  delta.improved === true
                    ? "text-emerald-600 dark:text-emerald-400"
                    : delta.improved === false
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-muted-foreground"
                }`}
              >
                {delta.improved === true ? (
                  <TrendingUp className="h-4 w-4 shrink-0" aria-hidden />
                ) : delta.improved === false ? (
                  <TrendingDown className="h-4 w-4 shrink-0" aria-hidden />
                ) : (
                  <Minus className="h-4 w-4 shrink-0" aria-hidden />
                )}
                {delta.label}
                <span className="sr-only">
                  {delta.improved === true
                    ? "Mejor que la lectura anterior"
                    : delta.improved === false
                      ? "Peor que la lectura anterior"
                      : "Igual que la lectura anterior"}
                </span>
              </div>
            ) : lastPosition != null && withPosition.length < 2 ? (
              <p className="max-w-[18rem] text-xs text-muted-foreground">
                Con la siguiente comprobación verás si subes o bajas respecto a esta lectura.
              </p>
            ) : null}
          </div>

          {series.length >= 2 ? (
            <div className="flex w-full flex-col items-center gap-1.5 sm:items-end">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Evolución (mejor arriba)
              </span>
              <Sparkline series={series} />
            </div>
          ) : null}

          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
              <Button
                type="button"
                variant="default"
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 shadow-sm hover:from-violet-500 hover:to-purple-500"
                disabled={running}
                onClick={onRefresh}
              >
                {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Comprobar ahora
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={onRemove}>
                Quitar
              </Button>
            </div>
            {onInsight != null && insightCreditCost != null ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-1.5 border border-amber-400/40 bg-gradient-to-r from-amber-500/15 to-orange-500/10 font-semibold text-amber-950 shadow-sm hover:from-amber-500/25 hover:to-orange-500/15 dark:border-amber-400/25 dark:text-amber-50"
                disabled={running || insightLoading}
                onClick={onInsight}
              >
                {insightLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                Informe vs competidores
                {insightCreditsWaived ? " (sin cargo)" : ` (${insightCreditCost} cr)`}
              </Button>
            ) : null}
            {onInsight != null ? (
              <p className="max-w-[20rem] text-center text-[11px] leading-snug text-muted-foreground sm:text-right">
                Cada informe queda en{" "}
                <Link href="/dashboard/history#informes-serp" className="font-medium text-primary underline-offset-4 hover:underline">
                  Historial → Informes SERP
                </Link>
                . Vuelve a abrirlo o descarga PDF desde ahí.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}
