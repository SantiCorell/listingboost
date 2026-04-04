/**
 * Visualización de impacto (marketing) — SVG propio, sin placeholder vacío.
 */
export function ImpactMetricsChart() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/70 bg-gradient-to-b from-background/95 via-muted/20 to-muted/40 p-3 shadow-inner">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,hsl(var(--primary)/0.12),transparent)]" />
      <div className="relative">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Pedidos · cohorte Pro
          </span>
          <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
            T12 +27%
          </span>
        </div>

        <svg
          viewBox="0 0 400 112"
          className="chart-impact h-[7.5rem] w-full"
          role="img"
          aria-label="Gráfico de tendencia al alza: pedidos y vistas en 12 semanas"
        >
          <title>Tendencia de pedidos y vistas tras optimizar listings</title>
          <defs>
            <linearGradient id="impact-area-main" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
              <stop offset="55%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="impact-area-views" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.35" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="impact-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(280 85% 58%)" />
            </linearGradient>
          </defs>

          {/* Rejilla */}
          <g className="text-border/50" stroke="currentColor" strokeWidth="0.35">
            <line x1="0" y1="22" x2="400" y2="22" />
            <line x1="0" y1="44" x2="400" y2="44" />
            <line x1="0" y1="66" x2="400" y2="66" />
            <line x1="0" y1="88" x2="400" y2="88" />
            <line x1="100" y1="8" x2="100" y2="104" strokeDasharray="2 4" opacity="0.6" />
            <line x1="200" y1="8" x2="200" y2="104" strokeDasharray="2 4" opacity="0.6" />
            <line x1="300" y1="8" x2="300" y2="104" strokeDasharray="2 4" opacity="0.6" />
          </g>

          {/* Área secundaria: vistas (más volátil) */}
          <path
            fill="url(#impact-area-views)"
            d="M0,92 L36,88 L72,82 L108,78 L144,70 L180,62 L216,58 L252,48 L288,42 L324,35 L360,28 L400,22 L400,104 L0,104 Z"
          />
          <path
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
            d="M0,92 L36,88 L72,82 L108,78 L144,70 L180,62 L216,58 L252,48 L288,42 L324,35 L360,28 L400,22"
          />

          {/* Área principal: pedidos */}
          <path
            fill="url(#impact-area-main)"
            d="M0,96 L40,90 L80,84 L120,74 L160,64 L200,52 L240,42 L280,32 L320,24 L360,16 L400,10 L400,104 L0,104 Z"
          />
          <path
            className="chart-impact-line"
            pathLength="1"
            fill="none"
            stroke="url(#impact-stroke)"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M0,96 L40,90 L80,84 L120,74 L160,64 L200,52 L240,42 L280,32 L320,24 L360,16 L400,10"
          />

          {/* Punto final + anillo */}
          <circle cx="400" cy="10" r="5" className="fill-primary" />
          <circle cx="400" cy="10" r="9" className="fill-none stroke-primary/35" strokeWidth="1.5" />

          {/* Etiqueta flotante */}
          <g transform="translate(232, 4)">
            <rect width="156" height="22" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="0.75" opacity="0.97" />
            <text x="10" y="15" fill="hsl(var(--foreground))" className="text-[10px] font-sans font-semibold">
              Pico post-optimización
            </text>
          </g>
        </svg>

        <div className="mt-1.5 flex items-center justify-between font-mono text-[9px] text-muted-foreground">
          <span>Sem 1 · baseline</span>
          <span className="text-primary">Sem 12 · informes ListingBoost</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-3 border-t border-border/50 pt-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Pedidos normalizados
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Vistas listing
          </span>
        </div>
      </div>
    </div>
  );
}
