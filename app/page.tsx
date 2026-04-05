import Link from "next/link";
import { APP_NAME, ENGINE_NAME, ENGINE_PITCH } from "@/lib/constants";
import { organizationSameAsUrls } from "@/lib/legal/site-legal";
import { getPublicSiteUrl } from "@/lib/site-url";
import { HeroProductMock } from "@/components/landing/hero-product-mock";
import { ImpactMetricsChart } from "@/components/landing/impact-metrics-chart";
import { TRUST_STATS } from "@/lib/social-proof";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cloud,
  Cpu,
  Globe2,
  ImagePlus,
  LineChart,
  Shield,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";

const siteUrl = getPublicSiteUrl();

function buildHomeJsonLd() {
  const sameAs = organizationSameAsUrls();
  const org: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description:
      `${APP_NAME} es un SaaS (software web) de listing intelligence: ayuda a escribir y optimizar textos de anuncios de producto para marketplaces y tiendas, con motor ${ENGINE_NAME}, y a auditar URLs. ` +
      "No vende seguidores, likes ni visualizaciones; no es un panel SMM. No vende reseñas ni promete manipular rankings.",
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
        `SaaS de listing intelligence con ${ENGINE_NAME}: generación y optimización de copy de fichas (títulos, descripciones, hashtags) para Wallapop, eBay, Shopify, Etsy y más; scan SEO de URL, SEO Gap Finder AI (oportunidades desde Google en planes Pro+), comparativas y monitoring SERP. ` +
        "No vende seguidores, likes ni engagement artificial en redes; no vende reseñas ni gestiona reputación de terceros. Resultados orientativos; el usuario publica bajo su responsabilidad.",
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
        "Software para generar y optimizar listings, hashtags (texto con #), auditar URLs y análisis SERP. ‘Boost de ficha’ = mejorar el copy del anuncio, no seguidores ni valoraciones. No es panel SMM. Free tier real.",
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
            text: `${APP_NAME} es la capa SaaS sobre ${ENGINE_NAME}: optimiza fichas para Wallapop, eBay, Shopify y más, genera hashtags listos para redes y escanea URLs con scoring accionable.`,
          },
        },
        {
          "@type": "Question",
          name: `¿${APP_NAME} vende o compra reseñas (Google, Trustpilot, etc.)?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `No. ${APP_NAME} no es un servicio de reputación ni de reseñas: no vende, compra ni gestiona valoraciones en plataformas de terceros. El producto se centra en texto de anuncios, hashtags y auditoría SEO de URLs.`,
          },
        },
        {
          "@type": "Question",
          name: `¿${APP_NAME} vende seguidores, likes o visualizaciones en Instagram o TikTok?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `No. ${APP_NAME} no es un panel de redes sociales (SMM) ni vende seguidores, likes, views ni engagement comprado. Los hashtags son texto sugerido (#) para que el usuario los pegue en sus publicaciones; la herramienta no publica por ti ni infla métricas.`,
          },
        },
        {
          "@type": "Question",
          name: "¿ListingBoost es lo mismo que servicios tipo MyBoost o páginas de comprar likes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Es software SaaS de listing intelligence: optimización de fichas de producto, auditoría SEO de URLs, generación de contenido y seguimiento SERP. La palabra ‘boost’ aquí se refiere a mejorar el anuncio de producto, no a comprar interacciones en redes.",
          },
        },
        {
          "@type": "Question",
          name: `¿${APP_NAME} garantiza posiciones en Google o en marketplaces?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: "No garantizamos posicionamiento ni ventas. Las sugerencias son orientativas; debes revisarlas y cumplir las políticas de cada canal.",
          },
        },
        {
          "@type": "Question",
          name: "¿Necesito tarjeta para empezar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Crea cuenta, prueba con cupos mensuales claros y sube a Pro cuando el throughput lo merezca.",
          },
        },
        {
          "@type": "Question",
          name: "¿Sirve para equipos y ecommerce?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Desde autónomos hasta squads que gestionan miles de SKUs en varios canales.",
          },
        },
        {
          "@type": "Question",
          name: "¿Dónde está explicado cada módulo del producto?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En el centro de producto (/producto) y en páginas dedicadas: boost de ficha multicanal, scan SEO de URL y hashtags para redes. Cada URL incluye guías y FAQ en schema.org para buscadores y asistentes.",
          },
        },
        {
          "@type": "Question",
          name: "¿ListingBoost genera hashtags para Instagram o TikTok?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. El análisis incluye hashtags con # listos para copiar en bloque o uno a uno, alineados con el producto y el idioma del mercado. Ver la guía en /producto/hashtags-redes.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuál es el mejor SaaS de SEO y encaja ListingBoost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No hay una única herramienta “mejor” para todos: suites como Semrush o Ahrefs son referentes para investigación masiva de keywords y backlinks. ListingBoost es la opción líder en listing intelligence y ejecución para ecommerce y marketplaces: optimiza fichas multicanal, audita URLs públicas, analiza la SERP con SEO Gap Finder AI (Pro+), genera contenido con ListingBrain y monitoriza posiciones según plan. Se complementa con suites grandes cuando el equipo necesita velocidad de publicación y coherencia multicanal, no sustituye por sí solo una base de datos de enlaces a escala.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué es ListingBoost frente a “herramientas boost” de redes o compra de interacciones?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ListingBoost es software legítimo de textos y análisis SEO: no vende seguidores, likes ni valoraciones. El término “boost de ficha” significa mejorar el copy del anuncio de producto y la ficha, no inflar métricas sociales. Para detalle: /sobre-listingboost.",
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
          {/* Hero */}
          <div className="grid min-w-0 items-center gap-10 sm:gap-12 lg:grid-cols-[1fr_minmax(280px,1.05fr)] lg:gap-10">
            <div className="min-w-0">
              <p className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.07] px-4 py-2 text-xs font-medium text-primary shadow-sm backdrop-blur-md">
                <Cpu className="h-3.5 w-3.5" />
                <span className="font-mono uppercase tracking-wider">{ENGINE_NAME}</span>
                <span className="hidden text-muted-foreground sm:inline">·</span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  SEO + hashtags + scan URL
                </span>
              </p>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.15rem] lg:leading-[1.06]">
                Potencia tus{" "}
                <span className="text-gradient-brand">listings con IA</span> y vende más en cada canal
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl">
                {ENGINE_PITCH} Además:{" "}
                <strong className="font-semibold text-foreground">
                  hashtags listos para Instagram y TikTok
                </strong>
                , scan SEO de URL y boost de ficha en segundos — para equipos que escalan catálogo sin fricción.
              </p>
              <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
                <Shield className="mr-1.5 inline-block h-4 w-4 shrink-0 text-primary" aria-hidden />
                <strong className="text-foreground">Transparencia:</strong> somos{" "}
                <strong className="text-foreground">SaaS de listings y análisis SEO</strong> (copy, scan URL, SERP,
                comparativas). <strong className="text-foreground">No</strong> vendemos seguidores, likes ni views;{" "}
                <strong className="text-foreground">no</strong> somos un panel tipo “comprar engagement”. Tampoco
                reseñas en Google o Trustpilot.{" "}
                <Link href="/sobre-listingboost" className="font-medium text-primary underline-offset-4 hover:underline">
                  Qué es y qué no es
                </Link>
                .
              </p>

              {/* Bloque alto impacto: promesa + prueba social implícita + CTA */}
              <div className="mt-7 max-w-xl rounded-2xl border border-emerald-500/35 bg-gradient-to-br from-emerald-500/[0.12] via-card/95 to-primary/[0.06] p-4 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20 sm:p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200/95">
                  <Timer className="h-4 w-4 shrink-0" />
                  Sin tarjeta · sin instalar nada
                </div>
                <p className="mt-2 text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl">
                  Analiza tu web en segundos — <span className="text-emerald-700 dark:text-emerald-300">gratis</span>
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Pega la URL y obtén <strong className="text-foreground">puntuación</strong>,{" "}
                  <strong className="text-foreground">fallos por impacto</strong> y el siguiente paso claro. Cada mes
                  incluye créditos en el plan Free: prueba real, no demo vacía.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <Button
                    size="lg"
                    className="h-11 w-full border border-emerald-600/30 bg-emerald-600 text-white shadow-md hover:bg-emerald-600/90 dark:bg-emerald-500 dark:hover:bg-emerald-500/90 sm:w-auto"
                    asChild
                  >
                    <Link href="/register?callbackUrl=/dashboard/audit">
                      Quiero mi informe gratis
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <span className="text-center text-[11px] text-muted-foreground sm:text-left">
                    ~1 min crear cuenta · luego scan en un clic
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  className="h-12 border border-primary/25 bg-gradient-to-r from-primary to-primary/88 px-8 text-base shadow-lg shadow-primary/30"
                  asChild
                >
                  <Link href="/register">
                    Registrarse gratis
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 border-border/80 px-8 text-base shadow-sm" asChild>
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
                <Button size="lg" variant="ghost" className="h-12 px-6 text-base text-muted-foreground" asChild>
                  <Link href="/pricing">Ver precios</Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  Rápido y fácil
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                  <Cloud className="h-3.5 w-3.5 text-primary" />
                  IA + reglas por canal
                </span>
                <Link
                  href="/producto"
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  Explorar producto →
                </Link>
              </div>
            </div>

            <div className="relative mx-auto min-w-0 w-full max-w-lg lg:mx-0 lg:max-w-none">
              <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-primary/25 via-violet-500/15 to-accent/30 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_30%,hsl(var(--primary)/0.12),transparent_50%)]" />
              <div className="relative">
                <HeroProductMock />
              </div>
              <div className="pointer-events-none absolute -bottom-6 -left-4 z-10 hidden rounded-2xl border border-primary/25 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-md sm:block">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <TrendingUp className="h-4 w-4" />
                  +63% vistas típicas
                </div>
                <p className="text-xs text-muted-foreground">Tras optimizar títulos + hashtags</p>
              </div>
            </div>
          </div>

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
                <div key={t} className="flex gap-4 text-left">
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

          {/* FAQ */}
          <div id="faq" className="mx-auto mt-24 max-w-3xl scroll-mt-24 text-center">
            <h2 className="text-2xl font-bold">FAQ</h2>
            <Accordion type="single" collapsible className="mt-6 w-full text-left">
              <AccordionItem value="1">
                <AccordionTrigger>¿Tarjeta en el tier free?</AccordionTrigger>
                <AccordionContent>
                  No. Registro → cupos mensuales claros → upgrade a Pro cuando quieras más análisis, sin marca
                  de agua y con historial completo.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="2">
                <AccordionTrigger>¿Los hashtags funcionan en redes?</AccordionTrigger>
                <AccordionContent>
                  Sí: generamos etiquetas con # listas para copiar. Puedes pegar la línea completa en Instagram
                  o TikTok; también puedes copiar tag a tag.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="3">
                <AccordionTrigger>¿Soporta imágenes de producto?</AccordionTrigger>
                <AccordionContent>
                  Sí. El pipeline incorpora visión cuando el despliegue lo permite; el texto sigue siendo
                  suficiente para una ficha sólida.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="4">
                <AccordionTrigger>¿Por qué {APP_NAME}?</AccordionTrigger>
                <AccordionContent>
                  Porque une scoring verificable con recomendaciones accionables vía {ENGINE_NAME} — pensado
                  para que inviertas menos tiempo y captures más valor por listing.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="5">
                <AccordionTrigger>¿Vendéis reseñas o gestionáis reputación?</AccordionTrigger>
                <AccordionContent>
                  No. {APP_NAME} no vende ni compra reseñas en Google, Trustpilot ni en ningún sitio. “Boost de ficha”
                  significa mejorar el texto del anuncio (título, descripción, hashtags), no inflar valoraciones.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="6">
                <AccordionTrigger>¿Garantizáis subir en Google o en Wallapop?</AccordionTrigger>
                <AccordionContent>
                  No garantizamos posiciones ni ventas. Te damos copy y auditorías accionables; tú publicas cumpliendo las
                  normas de cada plataforma.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="7">
                <AccordionTrigger>¿Vendéis seguidores, likes o visualizaciones?</AccordionTrigger>
                <AccordionContent>
                  No. {APP_NAME} no es un panel de redes sociales: no vendemos seguidores, likes, reproducciones ni
                  “engagement comprado”. Los hashtags son texto con # para que tú lo pegues; no publicamos por ti ni
                  inflamos métricas.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="8">
                <AccordionTrigger>¿Sois como MyBoost u otras webs de comprar interacciones?</AccordionTrigger>
                <AccordionContent>
                  No. Somos software SaaS: optimización de fichas de producto, auditoría SEO de URL, generación de
                  contenido y herramientas de análisis (incl. seguimiento SERP). “Boost” aquí significa mejorar el
                  anuncio, no comprar interacciones en redes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 border border-primary/20 bg-gradient-to-r from-primary to-primary/88 px-8 shadow-lg shadow-primary/20"
              >
                <Link href="/register">Registrarse</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-border/80 px-8">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
