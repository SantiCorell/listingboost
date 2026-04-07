import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ProductLandingFaq } from "@/components/producto/product-landing-faq";
import { SeoGapLandingDemo } from "@/components/producto/seo-gap-landing-demo";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { ArrowRight, Radar, Sparkles, Target } from "lucide-react";
import { FEATURE_CREDITS } from "@/lib/feature-credits";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "SEO Gap Finder AI — oportunidades desde Google",
  description: `${APP_NAME}: analiza la SERP en tu mercado, compara con tu dominio y obtén keywords priorizadas con acción, título y URL sugerida. Incluido en planes Pro+ y Enterprise.`,
  keywords: [
    "SEO gap analysis",
    "oportunidades keywords Google",
    "análisis SERP competencia",
    "ListingBoost SEO",
    "herramienta SEO ecommerce",
  ],
  openGraph: {
    title: `SEO Gap Finder AI · ${APP_NAME}`,
    description:
      "Mapa de oportunidades reales: qué atacar primero, con volumen estimado y tendencia. Pensado para equipos que ejecutan contenido.",
    url: `${siteUrl}/producto/seo-gap-finder`,
  },
  alternates: { canonical: `${siteUrl}/producto/seo-gap-finder` },
};

const faqs = [
  {
    q: "¿Qué es SEO Gap Finder AI?",
    a: `Es un módulo de ${APP_NAME} (planes Pro+ y Enterprise) que toma una keyword objetivo, lee lo que Google muestra en tu país e idioma, resume qué están haciendo los sitios que rankean y propone un listado priorizado de oportunidades: long-tail, intención, volumen orientativo, interés en Google Trends y acciones concretas (título y ruta sugerida). Está pensado para pasar del análisis al contenido en un clic.`,
  },
  {
    q: "¿Es comparable con una suite SEO “all-in-one”?",
    a: "Las suites SEO completas destacan en investigación masiva y reporting. ListingBoost se centra en ejecución para equipos de listings y contenido: gap desde la SERP real, priorización y conexión directa con el generador de contenido. Muchas empresas combinan ambas capas según su flujo.",
  },
  {
    q: "¿Los volúmenes son oficiales de Google?",
    a: "Mostramos una estimación orientativa de búsquedas mensuales y el interés relativo de Google Trends. Son guías de priorización, no un sustituto del Planificador de palabras clave de Google Ads.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: `Cada informe nuevo consume ${FEATURE_CREDITS.SEO_GAP_FINDER} créditos del cupo o saldo extra; la misma consulta puede reutilizarse sin coste adicional durante 24 horas.`,
  },
];

export default function SeoGapFinderProductPage() {
  const jsonLd = faqPageJsonLd(faqs);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Producto", url: `${siteUrl}/producto` },
    { name: "SEO Gap Finder AI", url: `${siteUrl}/producto/seo-gap-finder` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <nav className="text-sm text-muted-foreground">
          <Link href="/producto" className="hover:text-foreground">
            Producto
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">SEO Gap Finder AI</span>
        </nav>

        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-primary">Pro+ · Enterprise</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-balance md:text-5xl">
          SEO Gap Finder AI — de la SERP al plan de contenidos
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Cuando preguntas a Google qué está pasando con una keyword, la respuesta ya está en los resultados. Este módulo
          organiza esa señal en <strong className="text-foreground">oportunidades ordenadas</strong>, con estimación de
          demanda, tendencia y pasos claros — integrado con <strong className="text-foreground">{ENGINE_NAME}</strong>{" "}
          para generar la página cuando tú decidas.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="gap-2 shadow-md">
            <Link href="/register">
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">Ver planes Pro+</Link>
          </Button>
        </div>

        <section className="mt-14">
          <h2 className="sr-only">Vista previa del informe</h2>
          <SeoGapLandingDemo />
        </section>

        <section className="mt-14 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Qué resuelve</h2>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex gap-3">
              <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span>
                <strong className="text-foreground">Priorización real:</strong> no solo una lista de términos, sino qué
                crear o ampliar primero según score, intención y cluster temático.
              </span>
            </li>
            <li className="flex gap-3">
              <Radar className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span>
                <strong className="text-foreground">Contexto de mercado:</strong> lectura de lo que Google muestra para
                tu país e idioma, más lectura de páginas competidoras relevantes.
              </span>
            </li>
            <li className="flex gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <span>
                <strong className="text-foreground">Salida accionable:</strong> título sugerido, URL tipo{" "}
                <code className="rounded bg-muted px-1 text-foreground">/slug</code> y botón para abrir el generador de
                contenido con la keyword ya cargada.
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-primary/20 bg-primary/[0.04] p-6">
          <h2 className="text-lg font-semibold text-foreground">¿Y frente a una suite SEO clásica?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Las suites SEO completas son estándar para investigación profunda y enlaces.{" "}
            <strong className="text-foreground">{APP_NAME}</strong> destaca en el tramo{" "}
            <strong className="text-foreground">“ya sé qué quiero publicar, ayúdame a ejecutar y medir”</strong>: fichas,
            URLs, SERP, gaps y contenido en el mismo entorno — sin confundir “boost de ficha” con manipulación de métricas
            sociales: aquí significa mejorar el anuncio y el copy.
          </p>
        </section>

        <div className="mt-10">
          <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
            <Link href="/dashboard/seo-gap">
              Abrir SEO Gap Finder en el panel
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Requiere iniciar sesión y plan Pro+ o Enterprise.</p>
        </div>

        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold tracking-tight">Preguntas frecuentes</h2>
          <ProductLandingFaq items={faqs} />
        </section>
      </article>
    </>
  );
}
