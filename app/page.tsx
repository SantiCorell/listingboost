import { Fragment } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { organizationSameAsUrls } from "@/lib/legal/site-legal";
import { getPublicSiteUrl } from "@/lib/site-url";
import { TRUST_STATS } from "@/lib/social-proof";
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

/** Mock del panel: chunk aparte para menos JS inicial en la primera pintura móvil. */
const HeroProductMock = dynamic(
  () => import("@/components/landing/hero-product-mock").then((m) => ({ default: m.HeroProductMock })),
  {
    loading: () => (
      <div
        className="mx-auto w-full max-w-lg min-h-[min(72vw,26rem)] rounded-2xl bg-muted/40 animate-pulse"
        aria-hidden
      />
    ),
    ssr: true,
  },
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
  Cloud,
  Globe2,
  ImagePlus,
  LineChart,
  LayoutGrid,
  Shield,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: "Herramienta SEO SaaS — posicionamiento en Google, auditoría web e IA",
  description: `${APP_NAME}: revisamos tu web, analizamos el SEO y te ayudamos con el posicionamiento en Google usando IA (${ENGINE_NAME}). Software SEO online tipo suite: competencia, URLs, rankings y catálogo. Empieza gratis.`,
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
    title: `${APP_NAME} — Herramienta SEO SaaS, Google e IA`,
    description:
      "Revisión web, análisis SEO y ayuda con el posicionamiento en Google. Datos públicos de búsqueda + IA. Plan Free.",
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

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-14">
          {/* Hero: H1 largo + bloque centrado; mock lazy-chunk; enlaces internos */}
          <section className="min-w-0 space-y-10 lg:space-y-12" aria-labelledby="home-hero-heading">
            <div className="mx-auto max-w-4xl space-y-4 text-center sm:space-y-5">
              <div className="flex justify-center">
                <p className="inline-flex max-w-[min(100%,36rem)] flex-wrap items-center justify-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-3 py-1.5 text-[11px] font-medium text-primary shadow-sm backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs">
                  <LayoutGrid className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="font-mono uppercase tracking-wider">{ENGINE_NAME}</span>
                  <span className="text-muted-foreground">·</span>
                  <span>Herramienta SEO SaaS — Google, tu web y catálogo</span>
                </p>
              </div>
              <h1
                id="home-hero-heading"
                className="text-balance px-1 text-3xl font-bold tracking-tight text-foreground sm:px-0 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
              >
                <span className="text-gradient-brand">Revisamos tu web y analizamos el SEO</span>
                {" "}— te ayudamos con el{" "}
                <span className="text-foreground">posicionamiento en Google</span> usando{" "}
                <span className="text-foreground">IA</span> y datos reales de búsqueda y competencia;{" "}
                <span className="text-foreground">anuncios y fichas</span> en el mismo panel.
              </h1>
              <ul
                className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-2 sm:max-w-4xl sm:gap-3 lg:max-w-5xl lg:grid-cols-4"
                aria-label="Ir a la guía de cada parte"
              >
                {HERO_MODULE_LINKS.map(({ href, label, hint }) => (
                  <li key={href} className="min-w-0">
                    <Link
                      href={href}
                      title={hint}
                      className="flex min-h-[4.25rem] w-full flex-col items-center justify-center gap-0.5 rounded-xl border border-border/80 bg-card/90 px-2 py-2.5 text-center shadow-sm ring-offset-background transition-colors hover:border-primary/35 hover:bg-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:min-h-0 sm:px-3 sm:py-3"
                    >
                      <span className="text-[10px] font-bold uppercase leading-tight tracking-wide text-foreground sm:text-[11px]">
                        {label}
                      </span>
                      <span className="text-[10px] font-medium text-primary sm:text-xs">Ver ejemplo →</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <nav
                aria-label="Enlaces SEO y producto"
                className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-border/50 pt-4 text-[11px] sm:text-xs"
              >
                {HOME_INTERNAL_NAV.map(({ href, label }, i) => (
                  <Fragment key={href}>
                    {i > 0 ? (
                      <span className="select-none text-muted-foreground/50" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    <Link
                      href={href}
                      className="font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {label}
                    </Link>
                  </Fragment>
                ))}
              </nav>
            </div>

            <div className="grid min-w-0 items-start gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
              <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
                <div className="relative w-full max-w-md sm:max-w-lg">
                  <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-primary/25 via-violet-500/15 to-accent/30 blur-3xl sm:-inset-6 sm:rounded-[2.5rem]" />
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_30%,hsl(var(--primary)/0.12),transparent_50%)]" />
                  <div className="relative">
                    <HeroProductMock />
                  </div>
                  <div className="pointer-events-none absolute -bottom-2 left-1/2 z-10 w-[calc(100%-1rem)] max-w-[16rem] -translate-x-1/2 rounded-xl border border-primary/25 bg-card/95 px-3 py-2 text-center shadow-lg backdrop-blur-md sm:-bottom-6 sm:left-auto sm:right-0 sm:max-w-none sm:translate-x-0 sm:text-left sm:rounded-2xl sm:px-4 sm:py-3">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary sm:justify-start sm:text-sm">
                      <TrendingUp className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                      +63% vistas típicas
                    </div>
                    <p className="text-[10px] text-muted-foreground sm:text-xs">Tras mejorar títulos y textos</p>
                  </div>
                </div>
              </div>

              <div className="order-2 mx-auto flex w-full max-w-xl flex-col items-center space-y-6 text-center lg:order-1 lg:mx-0 lg:items-stretch lg:text-left">
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Sin complicaciones: <strong className="text-foreground">consultamos Google</strong>,{" "}
                  <strong className="text-foreground">miramos páginas parecidas a la tuya</strong> y te decimos{" "}
                  <strong className="text-foreground">qué mejorar primero</strong>. Una herramienta SEO online, no diez
                  pestañas.
                </p>

                <div className="w-full">
                  <HomeHowItWorksMap />
                </div>

                <div className="w-full rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-500/[0.12] via-card/95 to-primary/[0.06] p-4 text-center shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20 sm:p-5 lg:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200/95 sm:text-xs lg:justify-start">
                    <Timer className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                    Sin tarjeta · sin instalar
                  </div>
                  <p className="mt-2 text-base font-bold leading-snug text-foreground sm:text-lg">
                    Revisar una página <span className="text-emerald-700 dark:text-emerald-300">gratis</span>
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                    Nota y primeros arreglos claros. Plan Free con créditos de verdad cada mes.
                  </p>
                  <div className="mt-3 flex flex-col items-center gap-2 sm:mt-4 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                    <Button
                      size="lg"
                      className="h-10 w-full border border-emerald-600/30 bg-emerald-600 text-white shadow-md hover:bg-emerald-600/90 dark:bg-emerald-500 dark:hover:bg-emerald-500/90 sm:h-11 sm:w-auto"
                      asChild
                    >
                      <Link href="/register?callbackUrl=/dashboard/audit">
                        Probar revisión de página
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <span className="text-center text-[10px] text-muted-foreground sm:text-[11px] lg:text-left">
                      ~1 min · luego un clic
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-start">
                  <Button
                    size="lg"
                    className="h-11 w-full border border-primary/25 bg-gradient-to-r from-primary to-primary/88 px-6 text-sm shadow-lg shadow-primary/30 sm:h-12 sm:w-auto sm:px-8 sm:text-base"
                    asChild
                  >
                    <Link href="/register">
                      Registrarse gratis
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 flex-1 border-border/80 px-4 text-sm shadow-sm sm:h-12 sm:flex-none sm:px-8 sm:text-base"
                    asChild
                  >
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-11 flex-1 px-3 text-sm text-muted-foreground sm:h-12 sm:flex-none sm:text-base"
                    asChild
                  >
                    <Link href="/pricing">Precios</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 lg:justify-start">
                  <Link
                    href="/producto"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    <Zap className="h-3 w-3 text-amber-500 sm:h-3.5 sm:w-3.5" aria-hidden />
                    SaaS en el navegador
                  </Link>
                  <Link
                    href="/producto/seo-gap-finder#ejemplo"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    <Cloud className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" aria-hidden />
                    Google público + IA
                  </Link>
                  <Link
                    href="/producto"
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/10 sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    Ver piezas del producto →
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
