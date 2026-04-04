import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { Building2, Check, Home, LineChart, MapPin, Sparkles } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "SEO inmobiliario · Idealista, Fotocasa y web propia",
  description: `${APP_NAME}: optimiza fichas y landings para portales y tu sitio. Scan SEO de URL, boost de textos y hashtags con ${ENGINE_NAME}.`,
  alternates: { canonical: `${siteUrl}/producto/inmobiliarias` },
};

const faqs = [
  {
    q: "¿Sirve para Idealista y Fotocasa?",
    a: "Sí. El scan SEO analiza la URL pública que pegues (ficha o página de agencia). El boost de ficha te ayuda a redactar títulos y descripciones alineados con tu tono; los hashtags refuerzan redes. La web propia se beneficia de auditoría técnica on-page y priorización de mejoras.",
  },
  {
    q: "¿Puedo posicionar solo con la herramienta?",
    a: "La herramienta acelera buenas prácticas on-page y copys, pero el posicionamiento real depende de competencia, enlaces, marca y señales locales. Te damos prioridades accionables, no promesas de #1 en Google.",
  },
];

export default function InmobiliariasPage() {
  const jsonLd = faqPageJsonLd(faqs);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Producto", url: `${siteUrl}/producto` },
    { name: "Inmobiliarias", url: `${siteUrl}/producto/inmobiliarias` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <article className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-tech-radial opacity-70" />
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Sector</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Inmobiliarias: portales y{" "}
            <span className="text-gradient-brand">web propia</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
            Misma tecnología <strong className="text-foreground">{ENGINE_NAME}</strong> para quien vende pisos y
            locales: fichas en Idealista/Fotocasa, landings de captación y blog de barrio — con scan URL modular
            (desde 2 créditos) y boost de textos multicanal.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="font-semibold">
              <Link href="/dashboard/audit?sector=inmobiliaria">Abrir scan URL (inmobiliaria)</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Crear cuenta gratis</Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-14 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: LineChart,
              t: "Scan SEO de URL",
              d: "Elige preset Esencial, Estándar o Completo (+ inventario sitemaps). Ideal para una ficha o tu home.",
            },
            {
              icon: Home,
              t: "Boost de ficha",
              d: "Títulos, bullets y tono coherentes para copiar en portales o en tu CRM.",
            },
            {
              icon: MapPin,
              t: "Local + intención",
              d: "Keyword con zona y tipo de inmueble; el motor adapta salidas al mercado español.",
            },
          ].map((x) => (
            <Card key={x.t} className="border-border/80 bg-card/90 shadow-sm">
              <CardContent className="p-5">
                <x.icon className="h-8 w-8 text-primary" />
                <h2 className="mt-3 font-semibold">{x.t}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{x.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="relative mt-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-card to-violet-500/[0.06] p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Building2 className="mt-1 h-7 w-7 shrink-0 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Flujo recomendado</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {[
                  "Pega la URL pública de una ficha o de tu página de equipo.",
                  "Tipo de página: Producto/ficha u Otro si es landing de servicio.",
                  "Keyword: ej. «piso venta Chamberí» o «local alquiler Valencia».",
                  "Si quieres mapa del sitio, elige preset Completo (incluye sitemaps).",
                  "Exporta PDF del informe por 1 crédito cuando ya tengas el análisis guardado.",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-14 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Preguntas frecuentes
          </h2>
          <dl className="space-y-4 text-sm">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <dt className="font-semibold text-foreground">{f.q}</dt>
                <dd className="mt-2 text-muted-foreground leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          <Link href="/producto" className="font-medium text-primary hover:underline">
            ← Volver al centro de producto
          </Link>
        </p>
      </article>
    </>
  );
}
