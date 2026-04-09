import { Check, ChevronDown, Crown, Sparkles, Zap } from "lucide-react";

/**
 * Mock UI boost de listing — móvil: sin overflow, padding compacto, texto que rompe bien.
 */
export function HeroProductMock() {
  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden select-none" aria-hidden>
      <div className="pointer-events-none absolute -right-4 top-0 h-24 w-24 rounded-full bg-accent/25 blur-2xl sm:-right-8 sm:h-32 sm:w-32 sm:blur-3xl" />
      <div className="pointer-events-none absolute -left-3 bottom-6 h-20 w-20 rounded-full bg-primary/15 blur-2xl sm:-left-6 sm:bottom-8 sm:h-28 sm:w-28 sm:blur-3xl" />

      <div className="glass-panel relative max-w-full min-w-0 overflow-hidden p-2 shadow-xl sm:p-3 sm:shadow-2xl md:p-4">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.06)_0%,transparent_45%,hsl(var(--accent)/0.08)_100%)]" />

        <div className="relative flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-white/70 px-2 py-2 dark:bg-black/40 sm:rounded-xl sm:px-3 sm:py-2.5">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md sm:h-8 sm:w-8">
              <Zap className="h-3.5 w-3.5 text-primary-foreground sm:h-4 sm:w-4" strokeWidth={2.5} />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[12px] font-bold tracking-tight sm:text-[13px]">
                <span className="text-foreground">Listing</span>
                <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  Boost
                </span>
              </p>
              <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground sm:text-[9px] sm:tracking-[0.2em]">
                boost panel
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <span className="rounded-md bg-muted/80 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground sm:px-2 sm:py-1 sm:text-[10px]">
              Preview
            </span>
            <span className="flex items-center gap-0.5 rounded-full border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[9px] font-semibold text-amber-900 dark:text-amber-100 sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[10px]">
              <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              Pro
            </span>
          </div>
        </div>

        <div className="relative mt-2 grid min-w-0 max-w-full gap-2 sm:mt-3 sm:gap-3 sm:grid-cols-[1.12fr_0.88fr] sm:gap-4">
          {/* Entrada */}
          <div className="min-w-0 max-w-full rounded-xl border border-border/60 bg-white/80 p-2.5 shadow-inner dark:bg-black/35 sm:rounded-2xl sm:p-4">
            <div className="mb-2 flex items-center gap-2 sm:mb-3">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
              <span className="text-[13px] font-semibold sm:text-sm">Nuevo boost</span>
            </div>
            <div className="space-y-2.5 sm:space-y-3.5">
              <div className="space-y-1 sm:space-y-1.5">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[10px]">
                  Título del producto
                </p>
                <div className="min-h-[2.25rem] rounded-lg border border-border/70 bg-background/80 px-2 py-1.5 text-[11px] leading-snug text-foreground break-words sm:min-h-[2.5rem] sm:px-3 sm:py-2 sm:text-xs">
                  Auriculares ANC · hasta 40h batería · multipunto
                </div>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[10px]">
                  Categoría
                </p>
                <button
                  type="button"
                  tabIndex={-1}
                  className="flex min-h-9 w-full items-center justify-between gap-2 rounded-lg border border-border/70 bg-background/80 px-2 text-left text-[11px] text-foreground sm:px-3 sm:text-xs"
                >
                  <span className="min-w-0 truncate">Electrónica › Audio › Auriculares</span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[10px]">
                  Descripción
                </p>
                <div className="max-w-full space-y-1.5 rounded-lg border border-border/70 bg-background/60 p-2 sm:space-y-2 sm:p-3">
                  <div className="h-1.5 w-full max-w-full rounded bg-muted/80 sm:h-2" />
                  <div className="h-1.5 max-w-[92%] rounded bg-muted/60 sm:h-2" />
                  <div className="h-1.5 max-w-[78%] rounded bg-muted/50 sm:h-2" />
                  <div className="h-1.5 max-w-[56%] rounded bg-muted/40 sm:h-2" />
                </div>
              </div>

              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[9px] font-semibold text-primary sm:px-2 sm:py-1 sm:text-[10px]">
                  SEO
                </span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground sm:px-2 sm:py-1 sm:text-[10px]">
                  Keywords
                </span>
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground sm:px-2 sm:py-1 sm:text-[10px]">
                  Hashtags
                </span>
              </div>

              <div className="flex min-h-[2.5rem] w-full max-w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary via-primary to-violet-500 px-2 py-2 text-center text-[11px] font-semibold leading-tight text-primary-foreground shadow-lg shadow-primary/25 sm:min-h-[2.75rem] sm:gap-2 sm:px-4 sm:text-sm">
                <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-90 sm:h-4 sm:w-4" />
                <span className="min-w-0">Generar listing optimizado</span>
              </div>
              <p className="text-right font-mono text-[8px] text-muted-foreground sm:text-[9px]">0 / 2000</p>
            </div>
          </div>

          {/* Salida */}
          <div className="flex min-w-0 max-w-full flex-col gap-2 rounded-xl border border-primary/20 bg-gradient-to-b from-primary/[0.08] to-transparent p-2.5 sm:gap-3 sm:rounded-2xl sm:p-4">
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-primary sm:gap-2 sm:text-sm">
              <Check className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              Salida optimizada
            </div>
            <div className="rounded-lg border border-border/50 bg-card/80 p-2 text-[10px] dark:bg-black/25 sm:p-2.5 sm:text-[11px]">
              <p className="break-words font-semibold leading-snug text-foreground">
                ANC Pro — envío gratis 24h · devolución 30 días
              </p>
              <ul className="mt-1.5 space-y-1 text-muted-foreground sm:mt-2 sm:space-y-1.5">
                <li className="flex gap-1.5">
                  <span className="shrink-0 text-primary">•</span>
                  <span className="min-w-0 break-words">Bullets con beneficios medibles (batería, peso, multipunto).</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="shrink-0 text-primary">•</span>
                  <span className="min-w-0 break-words">CTA y prueba social alineados al canal.</span>
                </li>
              </ul>
              <p className="mt-1.5 break-all font-mono text-[8px] leading-relaxed text-muted-foreground sm:mt-2 sm:break-words sm:text-[9px]">
                #auriculares #anc #audio #envio24h #oferta
              </p>
            </div>
            <ul className="space-y-1.5 text-[10px] text-muted-foreground sm:space-y-2 sm:text-[11px]">
              {[
                "Título con intención de compra",
                "Bullets escaneables + CTA",
                "Bloque hashtags copiable",
              ].map((t) => (
                <li key={t} className="flex items-start gap-1.5 sm:gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400 sm:h-3.5 sm:w-3.5" />
                  <span className="min-w-0 leading-snug">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto rounded-lg border border-dashed border-primary/25 bg-card/50 p-2 text-center sm:p-2.5">
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground sm:text-[9px]">
                listingbrain™ pipeline
              </p>
              <p className="mt-0.5 text-[9px] text-muted-foreground sm:mt-1 sm:text-[10px]">
                Wallapop, eBay, Shopify…
              </p>
            </div>
          </div>
        </div>

        <p className="relative mt-2 px-0.5 text-center text-[8px] font-mono uppercase leading-tight tracking-wide text-muted-foreground sm:mt-3 sm:text-[10px] sm:tracking-[0.2em]">
          UI propia · sin stock · export listo
        </p>
      </div>
    </div>
  );
}
