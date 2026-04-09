import { Check, ChevronDown, Crown, Sparkles, Zap } from "lucide-react";

/**
 * Mock UI boost de listing — sección catálogo / marketplaces; layout espaciado sin solapes.
 */
export function HeroProductMock() {
  return (
    <div className="relative w-full select-none" aria-hidden>
      <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-6 bottom-8 h-28 w-28 rounded-full bg-primary/25 blur-3xl" />

      <div className="glass-panel relative overflow-hidden p-3 shadow-2xl sm:p-4">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.06)_0%,transparent_45%,hsl(var(--accent)/0.08)_100%)]" />

        <div className="relative flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-white/70 px-3 py-2.5 dark:bg-black/40">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md">
              <Zap className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[13px] font-bold tracking-tight">
                <span className="text-foreground">Listing</span>
                <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  Boost
                </span>
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">boost panel</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-md bg-muted/80 px-2 py-1 text-[10px] font-medium text-muted-foreground">
              Preview
            </span>
            <span className="flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/15 px-2.5 py-1 text-[10px] font-semibold text-amber-900 dark:text-amber-100">
              <Crown className="h-3 w-3" />
              Pro
            </span>
          </div>
        </div>

        <div className="relative mt-3 grid gap-3 sm:grid-cols-[1.12fr_0.88fr] sm:gap-4">
          {/* Entrada */}
          <div className="rounded-2xl border border-border/60 bg-white/80 p-4 shadow-inner dark:bg-black/35">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm font-semibold">Nuevo boost</span>
            </div>
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Título del producto
                </p>
                <div className="min-h-[2.5rem] rounded-lg border border-border/70 bg-background/80 px-3 py-2 text-xs leading-snug text-foreground">
                  Auriculares ANC · hasta 40h batería · multipunto
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Categoría</p>
                <button
                  type="button"
                  tabIndex={-1}
                  className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-border/70 bg-background/80 px-3 text-left text-xs text-foreground"
                >
                  <span className="truncate">Electrónica › Audio › Auriculares</span>
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Descripción
                </p>
                <div className="space-y-2 rounded-lg border border-border/70 bg-background/60 p-3">
                  <div className="h-2 w-full rounded bg-muted/80" />
                  <div className="h-2 w-[92%] rounded bg-muted/60" />
                  <div className="h-2 w-[78%] rounded bg-muted/50" />
                  <div className="h-2 w-[56%] rounded bg-muted/40" />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-md bg-primary/15 px-2 py-1 text-[10px] font-semibold text-primary">SEO</span>
                <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                  Keywords
                </span>
                <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                  Hashtags
                </span>
              </div>

              <div className="flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary to-violet-500 px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25">
                <Sparkles className="h-4 w-4 shrink-0 opacity-90" />
                Generar listing optimizado
              </div>
              <p className="text-right font-mono text-[9px] text-muted-foreground">0 / 2000</p>
            </div>
          </div>

          {/* Salida */}
          <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.08] to-transparent p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Check className="h-4 w-4 shrink-0" />
              Salida optimizada
            </div>
            <div className="rounded-lg border border-border/50 bg-card/80 p-2.5 text-[11px] dark:bg-black/25">
              <p className="font-semibold leading-snug text-foreground">
                ANC Pro — envío gratis 24h · devolución 30 días
              </p>
              <ul className="mt-2 space-y-1.5 text-muted-foreground">
                <li className="flex gap-1.5">
                  <span className="text-primary">•</span>
                  <span>Bullets con beneficios medibles (batería, peso, multipunto).</span>
                </li>
                <li className="flex gap-1.5">
                  <span className="text-primary">•</span>
                  <span>CTA y prueba social alineados al canal.</span>
                </li>
              </ul>
              <p className="mt-2 font-mono text-[9px] leading-relaxed text-muted-foreground">
                #auriculares #anc #audio #envio24h #oferta
              </p>
            </div>
            <ul className="space-y-2 text-[11px] text-muted-foreground">
              {[
                "Título con intención de compra",
                "Bullets escaneables + CTA",
                "Bloque hashtags copiable",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-auto rounded-lg border border-dashed border-primary/25 bg-card/50 p-2.5 text-center">
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                listingbrain™ pipeline
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">Listo para Wallapop, eBay, Shopify…</p>
            </div>
          </div>
        </div>

        <p className="relative mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          UI propia · sin stock · export listo
        </p>
      </div>
    </div>
  );
}
