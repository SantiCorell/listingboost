import Link from "next/link";
import { BookOpen, ChevronRight, FileText, Sparkles } from "lucide-react";
import { URL_AUDIT_DOCS } from "@/lib/url-audit/doc-links";
import { cn } from "@/lib/utils";

/**
 * Enlaces a documentación para elegir preset y entender el flujo del scan.
 */
export function UrlAuditDocLinks({ className, compact = false }: { className?: string; compact?: boolean }) {
  if (compact) {
    return (
      <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground", className)}>
        <span className="font-medium text-foreground">Documentación:</span>
        <Link
          href={URL_AUDIT_DOCS.productPresets}
          className="inline-flex items-center gap-0.5 font-medium text-primary underline-offset-4 hover:underline"
        >
          Guía Scan SEO
          <ChevronRight className="h-3 w-3 opacity-70" />
        </Link>
        <span className="text-border">·</span>
        <Link
          href={URL_AUDIT_DOCS.blogAuditVsBoost}
          className="inline-flex items-center gap-0.5 font-medium text-primary underline-offset-4 hover:underline"
        >
          Elegir preset
          <ChevronRight className="h-3 w-3 opacity-70" />
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card to-violet-500/[0.06] p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            Cómo funciona · qué preset elegir
          </p>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            <strong className="font-semibold text-foreground">Esencial</strong>: crawl técnico + puntuación + lista de
            issues (rápido, sin informe largo de IA).{" "}
            <strong className="font-semibold text-foreground">Estándar</strong>: lo anterior + informe con IA (títulos,
            meta, FAQs, prioridades). <strong className="font-semibold text-foreground">Completo</strong>: añade
            inventario de sitemaps del dominio. El PDF del informe se exporta aparte (+1 crédito) cuando ya tengas el
            análisis.
          </p>
        </div>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        <li>
          <Link
            href={URL_AUDIT_DOCS.productPresets}
            className="group flex items-start gap-3 rounded-xl border border-border/70 bg-background/80 p-3 transition-colors hover:border-primary/35 hover:bg-background"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <FileText className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground group-hover:text-primary">
                Guía del producto
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                Qué analizamos, límites y mejores prácticas — documentación oficial.
              </span>
            </span>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
        <li>
          <Link
            href={URL_AUDIT_DOCS.blogAuditVsBoost}
            className="group flex items-start gap-3 rounded-xl border border-border/70 bg-background/80 p-3 transition-colors hover:border-primary/35 hover:bg-background"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/12 text-violet-700 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground group-hover:text-primary">
                Blog: auditar URL vs optimizar lo nuevo
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                Criterios para decidir preset y priorizar impacto en tu negocio.
              </span>
            </span>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
