import { Fragment } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { organizationSameAsUrls } from "@/lib/legal/site-legal";
import { getPublicSiteUrl } from "@/lib/site-url";
import { TRUST_STATS } from "@/lib/social-proof";
import { HeroProductMock } from "@/components/landing/hero-product-mock";
import { HeroSeoMock } from "@/components/landing/hero-seo-mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ImpactMetricsChart = dynamic(
  () => import("@/components/landing/impact-metrics-chart").then((m) => ({ default: m.ImpactMetricsChart })),
  { loading: () => <div className="h-[7.5rem] rounded-xl bg-muted/25 animate-pulse" aria-hidden /> },
);

const HomeFaqSection = dynamic(
  () => import("@/components/landing/home-faq-section").then((m) => ({ default: m.HomeFaqSection })),
  { loading: () => <div className="mx-auto mt-24 h-48 max-w-3xl rounded-xl bg-muted/20 animate-pulse" aria-hidden /> },
);

const HomeHowItWorksMap = dynamic(
  () => import("@/components/landing/home-how-it-works-map").then((m) => ({ default: m.HomeHowItWorksMap })),
  { loading: () => <div className="mx-auto h-36 max-w-xl animate-pulse rounded-2xl bg-muted/30" aria-hidden /> },
);

/** Enlaces del hero a guías con sección #ejemplo (demo o listado claro). */
const HERO_MODULE_LINKS = [
  {
    href: "/producto/seo-gap-finder#ejemplo",
    label: "Huecos vs rivales",
    hint: "Demo: oportunidades desde lo que muestra Google",
  },
  {
    href: "/producto/seo-engine#ejemplo",
    label: "Posiciones en Google",
    hint: "Qué hace el motor SEO y el seguimiento",
  },
  {
    href: "/producto/scan-seo-url#ejemplo",
    label: "Revisar una web",
    hint: "Qué miramos en una página pública",
  },
  {
    href: "/producto/boost-de-ficha#ejemplo",
    label: "Anuncios y fichas",
    hint: "Qué sacas en cada análisis",
  },
] as const;

const HOME_INTERNAL_NAV = [
  { href: "/producto", label: "Producto" },
  { href: "/pricing", label: "Precios" },
  { href: "/seo-operativo-ecommerce", label: "SEO operativo" },
  { href: "/producto/seo-gap-finder", label: "Huecos en Google" },
  { href: "/producto/scan-seo-url", label: "Auditoría URL" },
  { href: "/blog", label: "Blog SEO" },
] as const;

import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Globe2,
  ImagePlus,
  LineChart,
  LayoutGrid,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: "Herramienta SEO SaaS — Google, contenido optimizado y sistemas de IA",
  description: `${APP_NAME}: mejora el SEO en Google y el contenido que entienden buscadores y algoritmos de IA. Auditoría URL, competencia y catálogo con ${ENGINE_NAME}. Gratis para empezar.`,
  keywords: [
    "herramienta SEO SaaS",
    "SEO tool España",
    "mejor herramienta SEO",
    "software posicionamiento Google",
    "auditoría SEO online",
    "suite SEO IA",
    "SaaS SEO ecommerce",
    "ListingBoost",
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: APP_NAME,
    title: `${APP_NAME} — SEO en Google y contenido para algoritmos de IA`,
    description:
      "Panel en vivo: auditoría, competencia y textos para Google y para sistemas de IA. Plan Free.",
    url: siteUrl,
  },
};

function buildHomeJsonLd() {
  const sameAs = organizationSameAsUrls();
  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description:
      `${APP_NAME} es software web de SEO operativo y listing intelligence: lectura de resultados en Google, auditoría on-page de URLs públicas, seguimiento de posiciones y generación de fichas multicanal con ${ENGINE_NAME}.`,
  };
  if (sameAs.length) org.sameAs = sameAs;

  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: APP_NAME,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: siteUrl,
      description:
        `Herramienta SEO SaaS y suite online para equipos de catálogo y ecommerce: revisión de páginas, análisis SEO, posicionamiento en Google con IA, brechas frente a competidores, seguimiento de posiciones y copy multicanal con ${ENGINE_NAME}.`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Tier gratuito con límites mensuales transparentes",
      },
    },
    org,
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: APP_NAME,
      url: siteUrl,
      description:
        `Herramienta SEO y listing intelligence: auditoría de páginas, oportunidades desde Google, seguimiento de posiciones y fichas listas para Wallapop, Shopify, eBay y redes. Plan gratuito con cupos mensuales.`,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/register`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `¿Qué es ${APP_NAME}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${APP_NAME} es una suite de SEO operativo y listing intelligence con ${ENGINE_NAME}: auditoría de URLs, oportunidades desde los resultados de Google, seguimiento de posiciones, comparativas y fichas multicanal listas para publicar.`,
          },
        },
        {
          "@type": "Question",
          name: `¿${APP_NAME} sirve como herramienta SEO profesional para ecommerce?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Sí. Cubre investigación práctica en Google, análisis on-page de páginas públicas, seguimiento de posiciones en búsqueda y generación de contenidos alineados con el catálogo; encaja cuando el cuello de botella es ejecutar muchas fichas bien, no solo ver datos sueltos.`,
          },
        },
        {
          "@type": "Question",
          name: `¿${APP_NAME} garantiza posiciones en Google o en marketplaces?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: "No garantizamos rankings ni ventas. Las sugerencias son orientativas; revisa y cumple las políticas de cada plataforma.",
          },
        },
        {
          "@type": "Question",
          name: "¿Necesito tarjeta para empezar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Crea cuenta, prueba con cupos mensuales claros y sube de plan cuando el volumen lo merezca.",
          },
        },
        {
          "@type": "Question",
          name: "¿Sirve para equipos y ecommerce?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Desde autónomos hasta equipos que gestionan miles de referencias en varios canales.",
          },
        },
        {
          "@type": "Question",
          name: "¿Dónde está explicado cada módulo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En /producto y en guías por módulo: boost multicanal, scan SEO de URL, SEO Engine, SEO Gap Finder AI y hashtags para redes.",
          },
        },
        {
          "@type": "Question",
          name: `¿${APP_NAME} vende seguidores, likes o reseñas?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `No. Es software de análisis SEO y textos de anuncio; los hashtags son sugerencias en texto (#) para que tú publiques. No vendemos engagement ni valoraciones en terceros.`,
          },
        },
        {
          "@type": "Question",
          name: `¿${APP_NAME} es una herramienta SEO tipo SaaS o SEO tool?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Sí. ${APP_NAME} es un software SEO en la nube (SaaS): puedes auditar URLs, ver oportunidades desde Google, seguir posiciones y generar textos con ${ENGINE_NAME}, sin instalar programas en tu ordenador.`,
          },
        },
        {
          "@type": "Question",
          name: "¿Sirve como alternativa a suites SEO grandes para equipos de ecommerce?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Muchos equipos lo usan como capa de ejecución: menos informes sueltos y más pasos claros para publicar. Combina auditoría, visión de competencia en búsqueda y catálogo multicanal en un solo flujo.`,
          },
        },
        {
          "@type": "Question",
          name: `¿${APP_NAME} ayuda con contenido entendible por algoritmos de IA y asistentes?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `No controlamos lo que citan terceros, pero el producto te orienta a páginas y textos más claros, estructurados y alineados a búsqueda: eso suele ayudar tanto a Google como a que sistemas de IA interpreten mejor tu oferta cuando un usuario pregunta por tu sector.`,
          },
        },
      ],
    },
  ];
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeJsonLd()) }}
      />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-tech-radial" />
        <div className="pointer-events-none absolute inset-0 bg-tech-grid opacity-[0.85]" />
        <div className="pointer-events-none absolute inset-0 bg-noise-soft" />
        {/* Orbes decorativos */}
        <div className="pointer-events-none absolute -right-24 top-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-[420px] h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl min-w-0 overflow-x-clip px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-14">
          {/* Hero: visual SEO/Google + IA; mock de listings más abajo */}
          <section className="min-w-0 max-w-full" aria-labelledby="home-hero-heading">
            <div className="grid min-w-0 max-w-full items-start gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
              {/* Columna visual: primero en móvil = ves el mock al abrir */}
              <div className="relative min-w-0 max-w-full space-y-2.5 sm:space-y-3 lg:col-span-5 xl:col-span-5">
                <div className="relative max-w-full rounded-2xl border border-primary/20 bg-gradient-to-b from-card via-card to-primary/[0.04] p-0.5 shadow-[0_20px_60px_-24px_hsl(var(--primary)/0.45)] ring-1 ring-primary/10 sm:p-1">
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)/0.12),transparent_42%,hsl(var(--accent)/0.08)_100%)]" />
                  <div className="relative max-w-full overflow-hidden rounded-[0.85rem] border border-white/40 bg-background/40 dark:border-white/5 dark:bg-black/20 sm:rounded-[0.9rem]">
                    <HeroSeoMock />
                  </div>
                </div>
                <div className="relative z-[1] min-w-0 max-w-full">
                  <HomeHowItWorksMap compact />
                </div>
                <div className="pointer-events-none flex justify-center lg:justify-start">
                  <div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-primary/20 bg-card/90 px-2.5 py-1.5 text-center shadow-sm backdrop-blur-sm sm:px-3 sm:text-left">
                    <TrendingUp className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold text-primary">+63% vistas típicas</p>
                      <p className="text-[10px] text-muted-foreground">Tras mejorar títulos y estructura</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna copy */}
              <div className="flex min-w-0 max-w-full flex-col gap-4 sm:gap-5 lg:col-span-7 xl:col-span-7">
                <div className="space-y-3">
                  <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border/60 bg-muted/25 px-2.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-primary/95">
                    <LayoutGrid className="h-3 w-3 shrink-0" aria-hidden />
                    <span>{ENGINE_NAME}</span>
                    <span className="text-muted-foreground/70">·</span>
                    <span className="normal-case tracking-normal text-foreground/85">SaaS SEO + IA</span>
                  </p>
                  <h1
                    id="home-hero-heading"
                    className="text-balance text-2xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-3xl lg:text-[2.125rem] lg:leading-tight"
                  >
                    <span className="text-gradient-brand">Mejora tu SEO en Google</span>
                    <span className="text-foreground">
                      {" "}
                      y crea contenido que los algoritmos de IA entienden
                    </span>
                  </h1>
                  <p className="max-w-xl text-pretty text-sm leading-snug text-muted-foreground">
                    Analizamos tu web, tu SEO y tu competencia para generar contenido optimizado que mejora tu
                    posicionamiento en Google y es entendido por buscadores y sistemas de IA.
                  </p>
                </div>

                <ul
                  className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2"
                  aria-label="Módulos con ejemplo"
                >
                  {HERO_MODULE_LINKS.map(({ href, label, hint }) => (
                    <li key={href} className="min-w-0 sm:w-auto sm:shrink-0">
                      <Link
                        href={href}
                        title={hint}
                        className="flex h-full min-h-[3.25rem] w-full flex-col justify-center gap-0.5 rounded-lg border border-border/70 bg-card/90 px-2 py-2 text-center shadow-sm transition-colors hover:border-primary/35 hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-auto sm:min-w-[7rem] sm:px-3"
                      >
                        <span className="text-[9px] font-bold uppercase leading-tight tracking-wide text-foreground">
                          {label}
                        </span>
                        <span className="text-[10px] font-medium text-primary">Ejemplo →</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <nav
                  aria-label="Enlaces SEO y producto"
                  className="flex flex-wrap gap-x-2 gap-y-1 border-l-2 border-primary/25 pl-3 text-[11px] text-muted-foreground"
                >
                  {HOME_INTERNAL_NAV.map(({ href, label }, i) => (
                    <Fragment key={href}>
                      {i > 0 ? <span className="text-border">|</span> : null}
                      <Link href={href} className="hover:text-primary hover:underline">
                        {label}
                      </Link>
                    </Fragment>
                  ))}
                </nav>

                <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.08] via-card to-transparent p-3.5 shadow-sm ring-1 ring-emerald-500/15 sm:p-4">
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-emerald-800/90 dark:text-emerald-200/90">
                    Sin tarjeta
                  </p>
                  <p className="mt-1 text-sm font-bold text-foreground">
                    Auditoría URL <span className="text-emerald-600 dark:text-emerald-400">gratis</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Puntuación + qué arreglar primero.</p>
                  <Button
                    size="sm"
                    className="mt-3 h-9 w-full border border-emerald-600/40 bg-emerald-600 text-white hover:bg-emerald-600/90 dark:bg-emerald-600 sm:w-auto"
                    asChild
                  >
                    <Link href="/register?callbackUrl=/dashboard/audit">
                      Probar ahora
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="lg"
                    className="h-10 border border-primary/30 bg-gradient-to-r from-primary to-primary/88 px-5 text-sm shadow-md sm:h-11"
                    asChild
                  >
                    <Link href="/register">
                      Crear cuenta
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-10 px-4 text-sm sm:h-11" asChild>
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button size="lg" variant="ghost" className="h-10 px-3 text-sm text-muted-foreground sm:h-11" asChild>
                    <Link href="/pricing">Precios</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                  <Link
                    href="/producto"
                    className="rounded-md border border-border/60 bg-muted/20 px-2 py-1 hover:border-primary/30 hover:text-foreground"
                  >
                    Producto
                  </Link>
                  <Link
                    href="/blog/seo-vs-aeo-guia-completa-2026"
                    className="rounded-md border border-border/60 bg-muted/20 px-2 py-1 hover:border-primary/30 hover:text-foreground"
                  >
                    Guía SEO vs AEO
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-20 lg:gap-4">
            {[
              { k: "Listings procesados", v: TRUST_STATS.productsAnalyzed },
              { k: "Operadores activos", v: TRUST_STATS.sellersActive },
              { k: "Horas ahorradas", v: TRUST_STATS.hoursSaved },
              { k: "Valor estimado", v: TRUST_STATS.estimatedValueSaved },
            ].map((item) => (
              <div
                key={item.k}
                className="card-tech-hover rounded-xl border border-border/70 bg-card/90 px-4 py-3 text-center shadow-sm backdrop-blur-sm"
              >
                <p className="text-lg font-bold tabular-nums text-foreground sm:text-xl">{item.v}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {item.k}
                </p>
              </div>
            ))}
          </div>

          {/* Listings multicanal: mock mejorado + copy dedicado */}
          <section
            id="listings-multicanal"
            className="mt-16 min-w-0 max-w-full scroll-mt-20 lg:mt-20"
            aria-labelledby="home-listings-heading"
          >
            <div className="grid min-w-0 max-w-full items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="order-2 min-w-0 max-w-full space-y-4 lg:order-1 lg:col-span-5">
                <p className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/25 px-2.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-primary/95">
                  <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Catálogo & marketplaces
                </p>
                <h2
                  id="home-listings-heading"
                  className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                >
                  Mismo producto,{" "}
                  <span className="text-gradient-brand">listings que convierten</span> en cada canal
                </h2>
                <p className="max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Cuando el SEO de tu web ya está encaminado, el cuello de botella suele ser el throughput: títulos,
                  bullets, hashtags y tono distintos para Wallapop, eBay, Shopify o redes — sin perder coherencia de
                  marca. El boost de ficha transforma tu input en copy listo para publicar con reglas por canal y{" "}
                  {ENGINE_NAME}.
                </p>
                <ul className="max-w-lg space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "Estructura pensada para escaneo rápido y CTR en buscadores internos de marketplaces.",
                    "Bloque de hashtags y variaciones para redes sin reescribir desde cero.",
                    "Salida alineada a políticas del canal: menos rechazos, más velocidad de publicación.",
                  ].map((line) => (
                    <li key={line} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button className="h-10" asChild>
                    <Link href="/producto/boost-de-ficha">
                      Ver módulo boost
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-10" asChild>
                    <Link href="/producto/boost-de-ficha#ejemplo">Ver ejemplo</Link>
                  </Button>
                </div>
              </div>
              <div className="order-1 min-w-0 max-w-full lg:order-2 lg:col-span-7">
                <div className="relative max-w-full rounded-2xl border border-primary/20 bg-gradient-to-b from-card via-card to-accent/[0.05] p-0.5 shadow-[0_24px_64px_-28px_hsl(var(--primary)/0.4)] ring-1 ring-primary/10 sm:p-1">
                  <div className="pointer-events-none absolute -inset-px rounded-2xl bg-[linear-gradient(135deg,hsl(var(--accent)/0.1),transparent_45%,hsl(var(--primary)/0.08)_100%)]" />
                  <div className="relative max-w-full overflow-hidden rounded-[0.85rem] border border-white/40 bg-background/40 dark:border-white/5 dark:bg-black/20 sm:rounded-[0.9rem]">
                    <HeroProductMock />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Value bar */}
          <div
            id="features"
            className="relative mt-16 overflow-hidden rounded-2xl border border-primary/15 value-bar-pattern bg-gradient-to-r from-primary/[0.08] via-card/90 to-accent/[0.08] px-4 py-10 sm:px-8"
          >
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: CheckCircle2,
                  t: "SEO que trae tráfico",
                  d: "Keywords, títulos y estructura alineados a intención de búsqueda real.",
                },
                {
                  icon: TrendingUp,
                  t: "Copy que cierra ventas",
                  d: "Bullets, CTAs y prueba social sugerida para subir conversión en el listing.",
                },
                {
                  icon: Timer,
                  t: "Resultados en segundos",
                  d: "Pipeline optimizado: menos tiempo en teclado, más tiempo facturando.",
                },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="flex flex-col items-center gap-3 text-center md:flex-row md:items-start md:gap-4 md:text-left">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3">
            {[
              {
                step: "01",
                t: "Ingest",
                d: "Imagen + texto. Detectamos intención de compra y señales de conversión.",
              },
              {
                step: "02",
                t: `${ENGINE_NAME}`,
                d: "Motor propietario: tono, hashtags, estructura y reglas por marketplace o tienda.",
              },
              {
                step: "03",
                t: "Ship",
                d: "Copia en un clic, export limpio, historial para iterar y escalar revenue.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="card-tech-hover relative rounded-2xl border border-border/70 bg-card/95 p-6 text-left shadow-sm backdrop-blur-sm"
              >
                <span className="mb-3 inline-flex font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  {s.step}
                </span>
                <h2 className="text-lg font-semibold">{s.t}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>

          {/* Feature cards */}
          <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-2">
            <Card className="card-tech-hover overflow-hidden border-border/80 bg-card/95 shadow-md backdrop-blur-sm">
              <CardContent className="space-y-4 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
                  <ImagePlus className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">Boost multicanal + hashtags</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Títulos con intención, descripciones escaneables, bloque de hashtags para redes y long-tail
                  sin relleno. Shopify: meta, slug, FAQs y schema sugerido.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {["CTR + visibilidad en búsqueda", "Hashtags copiables en un clic", "Tono adaptativo por canal"].map(
                    (x) => (
                      <li key={x} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                        {x}
                      </li>
                    ),
                  )}
                </ul>
                <Link
                  href="/producto/boost-de-ficha#ejemplo"
                  className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Guía boost y ejemplo →
                </Link>
              </CardContent>
            </Card>
            <Card className="card-tech-hover overflow-hidden border-border/80 bg-card/95 shadow-md backdrop-blur-sm">
              <CardContent className="space-y-4 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary">
                  <LineChart className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">Scan SEO de URL</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Meta, headings, alt, enlaces internos, schema detectado y score por bloques. Quick wins
                  ordenados por impacto — para que ejecutes y monetices antes.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {["Heurísticas explicables", "Handoff a tu equipo", "Fichas, PLP y blog"].map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                      {x}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/producto/scan-seo-url#ejemplo"
                  className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Guía auditoría URL y ejemplo →
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Social proof */}
          <div id="social" className="mx-auto mt-20 grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-center">
            <Card className="border-primary/25 bg-gradient-to-br from-card via-card to-primary/[0.07] shadow-lg ring-1 ring-primary/10">
              <CardContent className="space-y-4 p-6">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
                  Panel de impacto (ejemplo cohorte)
                </p>
                <div className="space-y-1">
                  <p className="text-2xl font-bold tracking-tight text-foreground">+450 pedidos</p>
                  <p className="text-sm leading-snug text-muted-foreground">
                    Tendencia tras optimizar títulos, descripciones y hashtags en fichas reales — patrón típico en
                    sellers Pro (datos ilustrativos).
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 font-semibold text-emerald-800 dark:text-emerald-300">
                    Revenue +27%
                  </span>
                  <span className="rounded-lg bg-primary/15 px-2.5 py-1 font-semibold text-primary">
                    Vistas +63%
                  </span>
                </div>
                <ImpactMetricsChart />
              </CardContent>
            </Card>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Prueba {APP_NAME} gratis. Únete a miles de vendedores que ya priorizan margen.
              </h2>
              <Card className="border-border/80 bg-card/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">
                      MG
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">María G.</p>
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-primary">
                          Vendedora verificada
                        </span>
                      </div>
                      <div className="mt-1 flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        “Pasé de reescribir a mano a publicar en tres marketplaces el mismo día. El bloque de
                        hashtags solo ya me ahorra una hora por lote.”
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button
                size="lg"
                className="h-12 border border-primary/20 bg-gradient-to-r from-primary to-primary/88 px-8 shadow-lg shadow-primary/25"
                asChild
              >
                <Link href="/register">Registrarse y generar mi primer boost</Link>
              </Button>
            </div>
          </div>

          {/* Why grid */}
          <div className="mx-auto mt-20 max-w-5xl">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">
              Motor diseñado para que factures más
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground">
              No es un LLM suelto: {ENGINE_NAME} entrena el output en SEO real, intención de búsqueda y reglas
              de cada canal.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Zap,
                  t: "Time-to-ship brutal",
                  d: "De input a listing publicable antes de que se enfríe la intención de compra.",
                },
                {
                  icon: BarChart3,
                  t: "Métricas que importan",
                  d: "CTR, claridad, keywords naturales — sin trucos de SEO de hace una década.",
                },
                {
                  icon: Shield,
                  t: "Datos bajo control",
                  d: "Límites claros, upgrade cuando el volumen lo justifique. Sin letra pequeña opaca.",
                },
                {
                  icon: Timer,
                  t: "UX que no frena",
                  d: "Flujos pensados para operadores: menos clics, más output listo para pegar.",
                },
                {
                  icon: Globe2,
                  t: "ES + LATAM ready",
                  d: "País e idioma objetivo para que el tono encaje con tu mercado.",
                },
                {
                  icon: Sparkles,
                  t: "Upside claro",
                  d: "Sube de plan cuando quieras más cupo, créditos baratos y prioridad.",
                },
              ].map(({ icon: Icon, t, d }) => (
                <Card key={t} className="card-tech-hover border-border/70 bg-card/90 backdrop-blur-sm">
                  <CardContent className="space-y-2 p-6">
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Guías SEO — enlazo interno a landings de adquisición */}
          <div className="mx-auto mt-20 max-w-5xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-card/90 to-violet-500/[0.05] p-6 shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">Guías gratis: más visibilidad y más ventas</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Playbooks para Wallapop, eBay, Etsy y Shopify: títulos, descripciones y diagnósticos cuando no vendes.
              Todo enlaza con el mismo motor que usas en el panel.
            </p>
            <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {[
                { href: "/seo-wallapop", label: "SEO Wallapop" },
                { href: "/optimizar-listings-wallapop", label: "Optimizar listings Wallapop" },
                { href: "/como-vender-mas-en-wallapop", label: "Cómo vender más en Wallapop" },
                { href: "/no-vendo-en-wallapop", label: "No vendo en Wallapop" },
                { href: "/seo-ebay", label: "SEO eBay productos" },
                { href: "/no-vendo-en-ebay", label: "No vendo en eBay" },
                { href: "/seo-etsy", label: "SEO Etsy" },
                { href: "/generador-titulos-productos", label: "Generador de títulos SEO" },
                { href: "/descripcion-productos-ia", label: "Descripción productos con IA" },
                { href: "/por-que-no-vendo-productos", label: "Por qué no vendo productos" },
                { href: "/seo-operativo-ecommerce", label: "Suite SEO vs SEO operativo para ecommerce" },
                { href: "/titulo-seo/iphone", label: "Título SEO iPhone" },
                { href: "/vender-iphone-wallapop", label: "Vender iPhone en Wallapop" },
              ].map((x) => (
                <li key={x.href}>
                  <Link
                    href={x.href}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {x.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button asChild className="h-11">
                <Link href="/register">Analizar listing gratis</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-5xl rounded-2xl border border-border/70 bg-card/90 p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold sm:text-3xl">Comparativa honesta: suite SEO vs SEO operativo</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Las suites SEO clásicas son excelentes para investigación y reporting a gran escala. ListingBoost destaca
              en el cuello de botella más habitual: convertir análisis en ejecución real de catálogo y páginas con IA.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Si tu objetivo es throughput SEO + ecommerce, revisa la comparativa por caso de uso y decide qué capa
              necesitas primero.
            </p>
            <div className="mt-4">
              <Button asChild variant="outline" className="h-11">
                <Link href="/seo-operativo-ecommerce">Ver comparativa completa</Link>
              </Button>
            </div>
          </div>

          <HomeFaqSection />
        </div>
      </div>
    </>
  );
}
