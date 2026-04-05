import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function GrowthBreadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-sm text-muted-foreground">
      {items.map((item, i) => (
        <span key={item.label}>
          {i > 0 ? <span className="mx-2">/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function GrowthCtaCluster({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-background to-violet-500/5 p-6 sm:flex-row sm:flex-wrap sm:items-center",
        className,
      )}
    >
      <Button
        size="lg"
        className="h-12 w-full gap-2 bg-gradient-to-r from-violet-600 to-purple-600 shadow-md sm:w-auto sm:min-w-[220px]"
        asChild
      >
        <Link href="/register">
          Analizar listing gratis
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button size="lg" variant="outline" className="h-12 w-full sm:w-auto" asChild>
        <Link href="/dashboard/product">Ir al boost de ficha</Link>
      </Button>
      <p className="w-full text-sm text-muted-foreground sm:w-auto sm:flex-1 sm:pl-2">
        Sin tarjeta en Free: prueba el mismo motor que Pro con cupo mensual.
      </p>
    </div>
  );
}

export function GrowthSection({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export function GrowthTipList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground marker:text-primary">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export function GrowthBeforeAfter({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  return (
    <div className="not-prose mt-4 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-rose-200/60 bg-rose-50/50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-800 dark:text-rose-200">Antes</p>
        <p className="mt-2 text-sm text-foreground/90">{before}</p>
      </div>
      <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">Después</p>
        <p className="mt-2 text-sm text-foreground/90">{after}</p>
      </div>
    </div>
  );
}

export function GrowthToolPitch() {
  return (
    <GrowthSection title={`Cómo ${APP_NAME} te ayuda a vender más`}>
      <p>
        <strong className="text-foreground">{APP_NAME}</strong> usa <strong className="text-foreground">{ENGINE_NAME}</strong>{" "}
        para reescribir títulos y descripciones con reglas por canal (Wallapop, eBay, Etsy, Shopify). No es texto
        genérico: está pensado para búsqueda interna en marketplaces, escaneo rápido del comprador y confianza (estado,
        envíos, lo que falta en tu anuncio).
      </p>
      <p>
        En un flujo típico pegas tu borrador o datos del producto, eliges canal y obtienes una ficha lista para copiar,
        más hashtags cuando los necesites. Si quieres profundidad SEO on-page, el scan de URL te da checklist accionable.
      </p>
      <div className="not-prose mt-6">
        <Button
          size="lg"
          className="h-12 w-full gap-2 bg-gradient-to-r from-violet-600 to-purple-600 shadow-md sm:w-auto"
          asChild
        >
          <Link href="/register">
            Analizar listing gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </GrowthSection>
  );
}

export function GrowthRelatedLinks({ links }: { links: { href: string; label: string }[] }) {
  if (links.length === 0) return null;
  return (
    <section className="mt-14 rounded-2xl border border-border/70 bg-muted/20 p-6">
      <h2 className="text-lg font-semibold text-foreground">Sigue mejorando tu catálogo</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-medium text-primary underline-offset-4 hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
            Volver al inicio de {APP_NAME}
          </Link>
        </li>
        <li>
          <Link href="/pricing" className="font-medium text-primary underline-offset-4 hover:underline">
            Ver planes y cupos mensuales
          </Link>
        </li>
      </ul>
    </section>
  );
}

export function GrowthArticleShell({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb: { href?: string; label: string }[];
}) {
  return (
    <article className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
      <GrowthBreadcrumb items={breadcrumb} />
      <div className="mt-8 space-y-6">{children}</div>
    </article>
  );
}
