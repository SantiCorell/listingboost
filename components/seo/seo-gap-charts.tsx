"use client";

import type { SeoGapDemandTier, SeoGapOpportunity } from "@/types/seo-gap-finder";
import { isLongTailGem } from "@/types/seo-gap-finder";

function aggregate(opportunities: SeoGapOpportunity[]) {
  const intent: Record<string, number> = {
    informacional: 0,
    transaccional: 0,
    navegacional: 0,
  };
  const level: Record<string, number> = { alta: 0, media: 0, baja: 0 };
  const demand: Record<SeoGapDemandTier, number> = { alto: 0, medio: 0, bajo: 0, nicho: 0 };
  for (const o of opportunities) {
    intent[o.type] = (intent[o.type] ?? 0) + 1;
    level[o.opportunityLevel] = (level[o.opportunityLevel] ?? 0) + 1;
    demand[o.demandTier] = (demand[o.demandTier] ?? 0) + 1;
  }
  return { intent, level, demand };
}

export function keywordWordCount(keyword: string): number {
  return keyword.trim().split(/\s+/).filter(Boolean).length;
}

const INTENT_LABEL: Record<string, string> = {
  informacional: "Informacional",
  transaccional: "Transaccional",
  navegacional: "Navegacional",
};

const DEMAND_LABEL: Record<SeoGapDemandTier, string> = {
  alto: "Alta demanda",
  medio: "Media",
  bajo: "Long-tail",
  nicho: "Nicho gem",
};

const DEMAND_COLOR: Record<SeoGapDemandTier, string> = {
  alto: "#f43f5e",
  medio: "#f59e0b",
  bajo: "#2dd4bf",
  nicho: "#34d399",
};

const LEVEL_COLOR: Record<string, string> = {
  alta: "#a855f7",
  media: "#f59e0b",
  baja: "hsl(var(--muted-foreground) / 0.5)",
};

export function SeoGapHeroStats({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const n = opportunities.length;
  const gems = opportunities.filter(isLongTailGem).length;
  const avg = n ? Math.round(opportunities.reduce((s, o) => s + o.score, 0) / n) : 0;
  const hot = opportunities.filter((o) => o.opportunityLevel === "alta").length;
  const items = [
    { label: "Oportunidades", value: String(n), sub: "mapa completo" },
    { label: "Long-tail & nicho", value: String(gems), sub: "bajo vol. · fácil de atacar" },
    { label: "Score medio", value: String(avg), sub: "priorización IA" },
    { label: "Prioridad alta", value: String(hot), sub: "score top" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner backdrop-blur-md dark:bg-white/[0.03]"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/20 blur-2xl" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200/80">{it.label}</p>
          <p className="mt-1 font-mono text-3xl font-bold tabular-nums tracking-tight text-white">{it.value}</p>
          <p className="mt-0.5 text-[11px] text-violet-200/70">{it.sub}</p>
        </div>
      ))}
    </div>
  );
}

export function SeoGapIntentChart({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const { intent } = aggregate(opportunities);
  const entries = Object.entries(intent).filter(([, n]) => n > 0);
  const max = Math.max(1, ...entries.map(([, n]) => n));
  const w = 340;
  const barH = 28;
  const gap = 12;
  const h = entries.length * (barH + gap) + 24;

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/25 via-white/[0.04] to-fuchsia-600/10 p-5 shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.25),transparent_55%)]" />
      <p className="relative mb-4 text-xs font-bold uppercase tracking-widest text-violet-100/90">
        Intención de búsqueda
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="relative w-full" role="img" aria-label="Intención">
        <defs>
          <linearGradient id="barIntent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <title>Distribución por intención</title>
        {entries.map(([key, n], i) => {
          const y = i * (barH + gap) + 10;
          const bw = Math.round((n / max) * (w - 138));
          return (
            <g key={key}>
              <text x={0} y={y + 19} className="fill-slate-100 text-[12px] font-semibold">
                {INTENT_LABEL[key] ?? key}
              </text>
              <rect
                x={126}
                y={y + 4}
                width={bw}
                height={barH - 8}
                rx={8}
                fill="url(#barIntent)"
                className="drop-shadow-md"
              />
              <text x={126 + bw + 8} y={y + 18} className="fill-slate-400 text-[11px] font-medium tabular-nums">
                {n}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SeoGapLevelChart({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const { level } = aggregate(opportunities);
  const order = ["alta", "media", "baja"] as const;
  const total = opportunities.length || 1;
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 72;
  const inner = 44;
  let angle = -Math.PI / 2;

  const slices = order.map((k) => {
    const n = level[k] ?? 0;
    const frac = n / total;
    const a0 = angle;
    angle += frac * Math.PI * 2;
    return { k, n, a0, a1: angle, frac };
  });

  function arcPath(outer: number, a0: number, a1: number) {
    const x0 = cx + outer * Math.cos(a0);
    const y0 = cy + outer * Math.sin(a0);
    const x1 = cx + outer * Math.cos(a1);
    const y1 = cy + outer * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x0} ${y0} A ${outer} ${outer} 0 ${large} 1 ${x1} ${y1} Z`;
  }

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-600/20 via-white/[0.04] to-cyan-600/10 p-5 shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.2),transparent_50%)]" />
      <p className="relative mb-3 text-xs font-bold uppercase tracking-widest text-sky-100/90">
        Prioridad del score
      </p>
      <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-48 w-48 shrink-0 drop-shadow-[0_0_28px_rgba(168,85,247,0.35)]" role="img">
          <defs>
            <filter id="glowDonut" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <title>Oportunidades por nivel</title>
          {slices.map(
            (s) =>
              s.frac > 0 && (
                <path
                  key={s.k}
                  d={arcPath(r, s.a0, s.a1)}
                  fill={LEVEL_COLOR[s.k] ?? "#888"}
                  opacity={0.95}
                  filter="url(#glowDonut)"
                />
              ),
          )}
          <path
            d={`M ${cx} ${cy} m -${inner} 0 a ${inner} ${inner} 0 1 0 ${inner * 2} 0 a ${inner} ${inner} 0 1 0 -${inner * 2} 0`}
            className="fill-[#0f172a]"
          />
          <text x={cx} y={cy + 6} textAnchor="middle" className="fill-slate-100 text-2xl font-bold tabular-nums">
            {total}
          </text>
          <text x={cx} y={cy + 22} textAnchor="middle" className="fill-slate-400 text-[9px] font-medium uppercase tracking-wide">
            total
          </text>
        </svg>
        <ul className="w-full min-w-0 space-y-2.5 text-sm sm:max-w-[200px]">
          {order.map((k) => (
            <li key={k} className="flex items-center justify-between gap-2 rounded-lg bg-black/5 px-3 py-2 dark:bg-white/5">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full shadow-sm" style={{ background: LEVEL_COLOR[k] }} />
                <span className="capitalize font-medium text-slate-100">{k}</span>
              </span>
              <span className="tabular-nums text-slate-400">{level[k] ?? 0}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SeoGapDemandChart({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const { demand } = aggregate(opportunities);
  const order: SeoGapDemandTier[] = ["nicho", "bajo", "medio", "alto"];
  const max = Math.max(1, ...order.map((k) => demand[k] ?? 0));
  const w = 300;
  const barH = 26;
  const gap = 10;
  const entries = order.filter((k) => (demand[k] ?? 0) > 0);
  const h = entries.length * (barH + gap) + 20;

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-600/20 via-white/[0.04] to-teal-600/10 p-5 shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(52,211,153,0.2),transparent_55%)]" />
      <p className="relative mb-1 text-xs font-bold uppercase tracking-widest text-emerald-100/90">
        Volumen estimado
      </p>
      <p className="relative mb-4 text-[11px] leading-snug text-emerald-100/65">
        Head vs long-tail: prioriza gems con poca competencia aparente en la SERP.
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="relative w-full" role="img">
        <title>Distribución por tipo de demanda</title>
        {entries.map((k, i) => {
          const n = demand[k] ?? 0;
          const y = i * (barH + gap) + 8;
          const bw = Math.round((n / max) * (w - 150));
          return (
            <g key={k}>
              <text x={0} y={y + 17} className="fill-slate-100 text-[11px] font-semibold">
                {DEMAND_LABEL[k]}
              </text>
              <rect x={132} y={y + 4} width={bw} height={barH - 8} rx={6} fill={DEMAND_COLOR[k]} className="opacity-90" />
              <text x={132 + bw + 6} y={y + 17} className="fill-slate-400 text-[10px] font-medium tabular-nums">
                {n}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SeoGapBubbleMap({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const w = 520;
  const h = 300;
  const padL = 48;
  const padR = 16;
  const padT = 28;
  const padB = 44;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const cx = (words: number) => padL + (Math.min(words, 12) / 12) * innerW;
  const cy = (score: number) => padT + innerH - (Math.max(0, Math.min(100, score)) / 100) * innerH;
  const rFor = (d: SeoGapDemandTier) => (d === "nicho" ? 16 : d === "bajo" ? 13 : d === "medio" ? 10 : 8);

  const typeHue: Record<string, string> = {
    informacional: "#a78bfa",
    transaccional: "#f472b6",
    navegacional: "#38bdf8",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-950/35 via-white/[0.03] to-violet-950/25 p-5 shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.12),transparent_65%)]" />
      <div className="relative mb-2 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-100/90">Mapa score × especificidad</p>
          <p className="mt-1 max-w-xl text-[11px] text-slate-400">
            Eje horizontal: palabras en la query (más a la derecha = más long-tail). Eje vertical: score. Radio mayor =
            nicho / bajo volumen.
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
      <svg viewBox={`0 0 ${w} ${h}`} className="relative w-full" role="img">
        <defs>
          <filter id="bubbleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <title>Burbujas de oportunidad</title>
        <line
          x1={padL}
          y1={padT + innerH}
          x2={padL + innerW}
          y2={padT + innerH}
          className="stroke-white/20"
          strokeWidth={1}
        />
        <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} className="stroke-white/20" strokeWidth={1} />
        <text x={padL + innerW / 2} y={h - 10} textAnchor="middle" className="fill-muted-foreground text-[10px]">
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
          return (
            <g key={`${o.keyword}-${i}`} filter="url(#bubbleGlow)">
              <circle cx={x} cy={y} r={r} fill={fill} opacity={0.55} stroke={fill} strokeWidth={1.5} />
              <title>
                {o.keyword} — score {o.score} — {DEMAND_LABEL[o.demandTier]}
              </title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SeoGapScoreBars({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const top = [...opportunities].sort((a, b) => b.score - a.score).slice(0, 10);
  const max = Math.max(1, ...top.map((o) => o.score));
  const w = 560;
  const rowH = 30;
  const chartH = top.length * rowH + 12;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-white/[0.06] p-5 shadow-lg backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-500/[0.07] to-transparent" />
      <p className="relative mb-4 text-xs font-bold uppercase tracking-widest text-slate-100">
        Top por score
      </p>
      <svg viewBox={`0 0 ${w} ${chartH}`} className="relative w-full" role="img">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <title>Keywords con mayor score</title>
        {top.map((o, i) => {
          const y = i * rowH + 8;
          const bw = Math.round((o.score / max) * (w - 168));
          const short = o.keyword.length > 36 ? `${o.keyword.slice(0, 34)}…` : o.keyword;
          return (
            <g key={o.keyword + i}>
              <text x={0} y={y + 16} className="fill-slate-100 text-[10px] font-semibold">
                {short}
              </text>
              <rect x={148} y={y + 4} width={bw} height={16} rx={5} fill="url(#scoreGrad)" opacity={0.92} />
              <text x={148 + bw + 6} y={y + 16} className="fill-slate-400 text-[10px] font-bold tabular-nums">
                {o.score}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SeoGapClusterMini({ opportunities }: { opportunities: SeoGapOpportunity[] }) {
  const counts = new Map<string, number>();
  for (const o of opportunities) {
    counts.set(o.cluster, (counts.get(o.cluster) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const max = Math.max(1, ...sorted.map(([, n]) => n));
  const w = 400;
  const rowH = 22;
  const h = sorted.length * rowH + 16;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-inner">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Clusters de contenido</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img">
        <title>Temas por frecuencia</title>
        {sorted.map(([label, n], i) => {
          const y = i * rowH + 10;
          const bw = Math.round((n / max) * (w - 120));
          const lab = label.length > 22 ? `${label.slice(0, 20)}…` : label;
          return (
            <g key={label}>
              <text x={0} y={y + 14} className="fill-slate-100 text-[10px] font-medium">
                {lab}
              </text>
              <rect x={108} y={y + 2} width={bw} height={14} rx={4} className="fill-violet-400/60" />
              <text x={108 + bw + 4} y={y + 13} className="fill-slate-400 text-[9px] tabular-nums">
                {n}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export { DEMAND_LABEL };
