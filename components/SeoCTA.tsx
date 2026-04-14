import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const SEO_LANDING_CTA_SENTENCE =
  "Analiza tu web gratis en menos de 30 segundos con ListingBoost";

type SeoCTAProps = {
  className?: string;
  href?: string;
};

/**
 * CTA reutilizable para landings SEO (App Router, sin cliente).
 */
export function SeoCTA({ className, href = "/producto/scan-seo-url" }: SeoCTAProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-background to-violet-500/10 p-6 sm:p-8",
        className,
      )}
      aria-labelledby="seo-landing-cta-title"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl" />
      <div className="relative space-y-4">
        <h2 id="seo-landing-cta-title" className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          De la auditoría a la acción (sin fricción)
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          <strong className="text-foreground">{SEO_LANDING_CTA_SENTENCE}</strong>. Introduce la URL, revisa el análisis
          SEO y aplica mejoras concretas con el mismo motor que usan equipos de ecommerce y marketplaces en{" "}
          {APP_NAME}.
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            size="lg"
            className="h-12 w-full gap-2 bg-gradient-to-r from-violet-600 to-purple-600 shadow-md sm:w-auto sm:min-w-[260px]"
            asChild
          >
            <Link href={href} aria-label={SEO_LANDING_CTA_SENTENCE}>
              Escanear mi URL ahora
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 w-full sm:w-auto" asChild>
            <Link href="/register">Crear cuenta gratis</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Plan Free con cupo mensual. Sin tarjeta para empezar a probar el flujo.
        </p>
      </div>
    </section>
  );
}
