"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatMonthlyVolumeEs } from "@/lib/seo/format-search-volume";
import type { SeoGapOpportunity } from "@/types/seo-gap-finder";
import { keywordWordCount, DEMAND_LABEL } from "@/components/seo/seo-gap-charts";
import { ArrowRight, ArrowUpDown, MousePointer2 } from "lucide-react";

type SortKey = "score" | "volume" | "trends" | "keyword";

const typeHue: Record<string, string> = {
  informacional: "#a78bfa",
  transaccional: "#f472b6",
  navegacional: "#38bdf8",
};

function sortOpportunities(opportunities: SeoGapOpportunity[], key: SortKey, dir: "asc" | "desc"): SeoGapOpportunity[] {
  const arr = [...opportunities];
  const m = dir === "asc" ? 1 : -1;
  arr.sort((a, b) => {
    if (key === "score") return m * (a.score - b.score);
    if (key === "volume")
      return m * ((a.monthlyVolumeEstimate ?? -1) - (b.monthlyVolumeEstimate ?? -1));
    if (key === "trends") return m * ((a.trendsInterest ?? -1) - (b.trendsInterest ?? -1));
    return m * a.keyword.localeCompare(b.keyword, "es", { sensitivity: "base" });
  });
  return arr;
}

export function SeoGapCockpitInteractive({
  opportunities,
  trendsDataPoints,
}: {
  opportunities: SeoGapOpportunity[];
  trendsDataPoints?: number;
}) {
  return (
    <div className="space-y-4">
      <SeoGapBubbleMapInteractive opportunities={opportunities} />
      <p className="text-center text-[10px] leading-relaxed text-slate-500">
        Volumen mensual = estimación orientativa para tu mercado (búsqueda en Google); si el modelo no fija cifra, usamos
        una banda coherente con la demanda (nicho / long-tail / medio / cabeza). Interés = escala relativa 0–100 (Google
        Trends, ventana reciente)
        {trendsDataPoints != null && trendsDataPoints > 0 ? ` · ${trendsDataPoints} términos con serie de tendencia` : ""}. Las
        cifras son guías de priorización, no un sustituto del planificador de palabras clave de Google.
      </p>
      <SeoGapRankedTable opportunities={opportunities} />
    </div>
  );
}

function SeoGapBubbleMapInteractive({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const uid = useId().replace(/:/g, "");
  const filterId = `bubbleGlow-${uid}`;
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const hover = hoverIdx != null ? opportunities[hoverIdx] ?? null : null;

  const w = 520;
  const h = 300;
  const padL = 48;
  const padR = 16;
  const padT = 28;
  const padB = 52;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const cx = (words: number) => padL + (Math.min(words, 12) / 12) * innerW;
  const cy = (score: number) => padT + innerH - (Math.max(0, Math.min(100, score)) / 100) * innerH;
  const rFor = (d: SeoGapOpportunity["demandTier"]) =>
    d === "nicho" ? 17 : d === "bajo" ? 14 : d === "medio" ? 11 : 9;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-950/40 via-white/[0.03] to-violet-950/30 p-5 shadow-lg ring-1 ring-fuchsia-500/10"
      onMouseLeave={() => setHoverIdx(null)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.14),transparent_65%)]" />
      <div className="relative mb-2 flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-100/90">Mapa score × especificidad</p>
            <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-medium text-fuchsia-200">
              <MousePointer2 className="h-3 w-3" aria-hidden />
              Interactivo
            </span>
          </div>
          <p className="mt-1 max-w-xl text-[11px] text-slate-400">
            Pasa el cursor por cada burbuja: keyword, score, volumen estimado e interés Trends.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-violet-400" /> Inf.
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-pink-400" /> Trans.
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-sky-400" /> Nav.
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="relative w-full touch-none" role="img">
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <title>Mapa de burbujas interactivo</title>
        <line
          x1={padL}
          y1={padT + innerH}
          x2={padL + innerW}
          y2={padT + innerH}
          className="stroke-white/20"
          strokeWidth={1}
        />
        <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} className="stroke-white/20" strokeWidth={1} />
        <text x={padL + innerW / 2} y={h - 14} textAnchor="middle" className="fill-slate-500 text-[10px]">
          Más palabras en la keyword →
        </text>
        <text
          x={14}
          y={padT + innerH / 2}
          textAnchor="middle"
          className="fill-slate-500 text-[10px]"
          transform={`rotate(-90 14 ${padT + innerH / 2})`}
        >
          Score ↑
        </text>
        {opportunities.map((o, i) => {
          const words = keywordWordCount(o.keyword);
          const x = cx(words);
          const y = cy(o.score);
          const r = rFor(o.demandTier);
          const fill = typeHue[o.type] ?? "#a78bfa";
          const active = hoverIdx === i;
          return (
            <g key={`${o.keyword}-${i}`} filter={`url(#${filterId})`}>
              <circle
                cx={x}
                cy={y}
                r={r + (active ? 3 : 0)}
                fill={fill}
                opacity={active ? 0.92 : 0.5}
                stroke={fill}
                strokeWidth={active ? 2.5 : 1.5}
                className="cursor-pointer transition-all duration-200 ease-out"
                onMouseEnter={() => setHoverIdx(i)}
                onFocus={() => setHoverIdx(i)}
                tabIndex={0}
              />
            </g>
          );
        })}
      </svg>

      <div
        className={cn(
          "relative mt-3 min-h-[5.5rem] rounded-xl border px-4 py-3 transition-all duration-200",
          hover
            ? "border-fuchsia-400/40 bg-gradient-to-r from-fuchsia-950/50 to-violet-950/40 shadow-lg shadow-fuchsia-900/20"
            : "border-white/10 border-dashed bg-black/20",
        )}
      >
        {hover ? (
          <div className="space-y-1 text-sm">
            <p className="font-semibold leading-snug text-white">{hover.keyword}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
              <span>
                Score: <strong className="tabular-nums text-white">{hover.score}</strong>
              </span>
              <span>
                Vol. /mes (est.):{" "}
                <strong className="tabular-nums text-white">{formatMonthlyVolumeEs(hover.monthlyVolumeEstimate)}</strong>
              </span>
              <span>
                Trends (rel.):{" "}
                <strong className="tabular-nums text-white">
                  {hover.trendsInterest != null ? `${hover.trendsInterest}/100` : "—"}
                </strong>
              </span>
              <span className="text-slate-400">{DEMAND_LABEL[hover.demandTier]}</span>
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <MousePointer2 className="h-4 w-4 shrink-0 text-fuchsia-400/80" aria-hidden />
            Coloca el cursor sobre una burbuja para ver datos de la keyword.
          </p>
        )}
      </div>
    </div>
  );
}

function SeoGapRankedTable({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const setSort = (k: SortKey) => {
    if (k === sortKey) setDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(k);
      setDir(k === "keyword" ? "asc" : "desc");
    }
  };

  const sorted = useMemo(() => sortOpportunities(opportunities, sortKey, dir), [opportunities, sortKey, dir]);

  const maxScore = Math.max(1, ...sorted.map((o) => o.score));
  const maxVol = Math.max(1, ...sorted.map((o) => o.monthlyVolumeEstimate ?? 0));

  const pills: { key: SortKey; label: string }[] = [
    { key: "score", label: "Score" },
    { key: "volume", label: "Vol. mensual" },
    { key: "trends", label: "Trends" },
    { key: "keyword", label: "Keyword A→Z" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-white/[0.06] p-5 shadow-lg backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-500/[0.08] to-transparent" />
      <div className="relative mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-100">Ranking de oportunidades</p>
          <span className="hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:inline">
            <ArrowUpDown className="mr-0.5 inline h-3 w-3" aria-hidden />
            ordenación
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pills.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setSort(p.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all",
                sortKey === p.key
                  ? "border-violet-400/60 bg-violet-500/25 text-white shadow-md shadow-violet-900/30"
                  : "border-white/10 bg-black/20 text-slate-400 hover:border-white/20 hover:text-slate-200",
              )}
            >
              {p.label}
              {sortKey === p.key ? (dir === "desc" ? " ↓" : " ↑") : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-h-[min(70vh,520px)] overflow-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-[#0f172a]/95 backdrop-blur-md">
            <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-3 py-3 pl-4">Keyword</th>
              <th className="px-2 py-3">Score</th>
              <th className="px-2 py-3">Vol. /mes (est.)</th>
              <th className="px-2 py-3">Trends</th>
              <th className="px-3 py-3 pr-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((o, i) => {
              const scoreW = Math.round((o.score / maxScore) * 100);
              const vol = o.monthlyVolumeEstimate;
              const volW = vol != null && maxVol > 0 ? Math.round((vol / maxVol) * 100) : 0;
              const tr = o.trendsInterest;
              return (
                <tr
                  key={`${o.keyword}-${i}`}
                  className="group border-b border-white/[0.06] transition-colors hover:bg-white/[0.06]"
                >
                  <td className="max-w-[220px] px-3 py-2.5 pl-4 align-middle">
                    <span className="line-clamp-2 font-medium text-slate-100" title={o.keyword}>
                      {o.keyword}
                    </span>
                  </td>
                  <td className="px-2 py-2 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-black/40">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all group-hover:brightness-110"
                          style={{ width: `${scoreW}%` }}
                        />
                      </div>
                      <span className="tabular-nums font-bold text-slate-200">{o.score}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-black/40">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all group-hover:brightness-110"
                          style={{ width: `${volW}%` }}
                        />
                      </div>
                      <span className="tabular-nums text-slate-300">{formatMonthlyVolumeEs(vol)}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 align-middle">
                    {tr != null ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-black/40">
                          <div
                            className="h-full rounded-full bg-sky-500 transition-all group-hover:brightness-110"
                            style={{ width: `${tr}%` }}
                          />
                        </div>
                        <span className="tabular-nums text-slate-400">{tr}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 pr-4 text-right align-middle">
                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="h-8 border border-violet-500/30 bg-violet-600/20 text-[11px] text-white hover:bg-violet-600/35"
                    >
                      <Link href={`/dashboard/seo-engine?tab=content&kw=${encodeURIComponent(o.keyword)}`}>
                        Generar
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
