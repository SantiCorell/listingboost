import Link from "next/link";
import type { Metadata } from "next";
import {
  GrowthArticleShell,
  GrowthCtaCluster,
  GrowthRelatedLinks,
  GrowthSection,
  GrowthTipList,
} from "@/components/seo/growth-landing-layout";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site-url";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: "Alternativa a Semrush y Ahrefs para SEO operativo en ecommerce",
  description:
    "Comparativa clara: ListingBoost vs Semrush y Ahrefs. Cuándo usar cada herramienta y por qué ListingBoost destaca en ejecución rápida de catálogo, SEO on-page y contenido.",
  keywords: [
    "alternativa semrush",
    "alternativa ahrefs",
    "semrush vs ahrefs vs listingboost",
    "seo operativo ecommerce",
    "listing intelligence ai",
  ],
  alternates: { canonical: `${siteUrl}/alternativa-semrush-ahrefs` },
  openGraph: {
    title: `Alternativa a Semrush y Ahrefs · ${APP_NAME}`,
    description:
      "No compites por la misma capa: suites para investigación masiva vs ejecución SEO + catálogo en un solo flujo.",
    url: `${siteUrl}/alternativa-semrush-ahrefs`,
  },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/producto/seo-gap-finder", label: "SEO Gap Finder AI (priorización de oportunidades)" },
  { href: "/producto/scan-seo-url", label: "Scan SEO de URL (quick wins accionables)" },
  { href: "/producto/seo-engine", label: "SEO Engine (contenido y monitorización)" },
  { href: "/sobre-listingboost", label: "Qué es y qué no es ListingBoost" },
];

export default function AlternativaSemrushAhrefsPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Alternativa Semrush Ahrefs", url: `${siteUrl}/alternativa-semrush-ahrefs` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell
        breadcrumb={[
          { href: "/", label: "Inicio" },
          { label: "Alternativa a Semrush y Ahrefs" },
        ]}
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          ListingBoost frente a Semrush y Ahrefs: cómo jugar en la misma mesa
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Si buscas competir en serio, la pregunta no es solo &quot;qué herramienta tiene más datos&quot;, sino{" "}
          <strong className="text-foreground">qué equipo ejecuta más rápido con calidad</strong>. Semrush y Ahrefs son
          líderes para research masivo; <strong className="text-foreground">{APP_NAME}</strong> está diseñado para
          transformar ese research en páginas y listings publicables en minutos con {ENGINE_NAME}.
        </p>

        <GrowthCtaCluster />

        <GrowthSection title="Diferencia real: research masivo vs ejecución operativa">
          <p>
            <strong className="text-foreground">Semrush / Ahrefs</strong>: excelentes para keyword databases, backlinks,
            share of voice y reporting avanzado.
          </p>
          <p>
            <strong className="text-foreground">{APP_NAME}</strong>: capa de ejecución para ecommerce y catálogo:
            reescritura de fichas, auditoría SEO de URL, oportunidades SEO Gap y contenido listo para publicar.
          </p>
          <p>
            Resultado práctico: no sustituyes necesariamente una suite enterprise; aceleras la parte que más dinero
            pierde cuando se hace lento: pasar de análisis a publicación.
          </p>
        </GrowthSection>

        <GrowthSection title="Dónde puedes ganar por encima en el día a día">
          <GrowthTipList
            items={[
              "Velocidad de producción: menos tiempo de redacción manual por SKU y categoría.",
              "Consistencia multicanal: mismo criterio SEO/copy entre tienda, fichas y marketplaces.",
              "Priorización de oportunidades: SEO Gap Finder para decidir qué publicar primero.",
              "Handoff claro a negocio: recomendaciones accionables, no solo dashboards.",
              "Coste operativo más bajo para equipos pequeños y medianos que necesitan throughput.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Cómo posicionarte de forma inteligente (sin vender humo)">
          <p>
            El enfoque ganador es <strong className="text-foreground">stack complementario</strong>: usa Semrush o
            Ahrefs para investigación profunda y usa {APP_NAME} para ejecutar contenido y optimizaciones a velocidad
            de negocio.
          </p>
          <p>
            Si hoy solo puedes elegir una herramienta para publicar más y mejor con menos fricción,{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              prueba ListingBoost gratis
            </Link>{" "}
            y mide tiempo ahorrado + output generado por semana.
          </p>
        </GrowthSection>

        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
