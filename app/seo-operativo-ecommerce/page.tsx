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
  title: "Suite SEO vs SEO operativo en ecommerce: qué priorizar",
  description:
    "Guía de decisión para ecommerce: diferencia entre suite SEO de análisis y capa SEO operativa de ejecución de catálogo y contenidos con IA.",
  keywords: [
    "suite seo ecommerce",
    "seo operativo ecommerce",
    "ejecucion seo catalogo",
    "listing intelligence ai",
    "herramienta seo para catalogo",
  ],
  alternates: { canonical: `${siteUrl}/seo-operativo-ecommerce` },
  openGraph: {
    title: `Suite SEO vs SEO operativo · ${APP_NAME}`,
    description:
      "Qué capa priorizar según fase de negocio: investigación SEO masiva o ejecución rápida de catálogo y contenidos.",
    url: `${siteUrl}/seo-operativo-ecommerce`,
  },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/producto/seo-gap-finder", label: "SEO Gap Finder AI (priorización de oportunidades)" },
  { href: "/producto/scan-seo-url", label: "Scan SEO de URL (quick wins accionables)" },
  { href: "/producto/seo-engine", label: "SEO Engine (contenido y monitorización)" },
  { href: "/sobre-listingboost", label: "Qué es y qué no es ListingBoost" },
];

export default function SeoOperativoEcommercePage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "SEO operativo ecommerce", url: `${siteUrl}/seo-operativo-ecommerce` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell
        breadcrumb={[
          { href: "/", label: "Inicio" },
          { label: "Suite SEO vs SEO operativo" },
        ]}
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          Suite SEO vs SEO operativo: cómo jugar en la misma mesa
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          La pregunta clave no es solo cuántos datos tienes, sino{" "}
          <strong className="text-foreground">qué velocidad de ejecución consigues con calidad</strong>. Las suites SEO
          clásicas destacan en investigación masiva; <strong className="text-foreground">{APP_NAME}</strong> está
          orientado a convertir ese análisis en páginas y listings publicables en minutos con {ENGINE_NAME}.
        </p>

        <GrowthCtaCluster />

        <GrowthSection title="Diferencia real: research masivo vs ejecución operativa">
          <p>
            <strong className="text-foreground">Suite SEO</strong>: ideal para base de keywords amplia, auditorías
            globales, reporting y trabajo estratégico de gran volumen.
          </p>
          <p>
            <strong className="text-foreground">{APP_NAME}</strong>: capa de ejecución para ecommerce y catálogo:
            reescritura de fichas, auditoría SEO de URL, oportunidades SEO Gap y contenido listo para publicar.
          </p>
          <p>
            En la práctica no son capas excluyentes: una guía la estrategia y la otra reduce el tiempo entre análisis y
            publicación.
          </p>
        </GrowthSection>

        <GrowthSection title="Dónde se nota más el impacto en el día a día">
          <GrowthTipList
            items={[
              "Velocidad de producción: menos tiempo de redacción manual por SKU y categoría.",
              "Consistencia multicanal: mismo criterio SEO/copy entre tienda, fichas y marketplaces.",
              "Priorización de oportunidades: SEO Gap Finder para decidir qué publicar primero.",
              "Handoff claro a negocio: recomendaciones accionables, no solo dashboards.",
              "Coste operativo más bajo para equipos que necesitan throughput semanal constante.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Cómo priorizar sin perder foco">
          <p>
            Si estás al inicio o con equipo pequeño, suele rendir más reforzar{" "}
            <strong className="text-foreground">ejecución operativa</strong> (publicar más y mejor cada semana).
          </p>
          <p>
            Si ya tienes un flujo de publicación sólido, añade una suite SEO para ampliar research y reporting. El
            objetivo es mantener una cadena continua entre estrategia y salida a producción.
          </p>
          <p>
            <Link href="/register" className="font-medium text-primary hover:underline">
              Prueba ListingBoost gratis
            </Link>{" "}
            y mide tiempo ahorrado + output publicado por semana.
          </p>
        </GrowthSection>

        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
