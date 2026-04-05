import Link from "next/link";
import type { Metadata } from "next";
import {
  GrowthArticleShell,
  GrowthBeforeAfter,
  GrowthCtaCluster,
  GrowthRelatedLinks,
  GrowthSection,
  GrowthTipList,
  GrowthToolPitch,
} from "@/components/seo/growth-landing-layout";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site-url";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: "SEO Etsy 2026: títulos, tags y descripciones que rankean",
  description:
    "Guía SEO Etsy: títulos legibles, 13 tags, atributos y descripción que convierte. Optimiza listings hechos a mano y vintage con ListingBoost.",
  keywords: ["seo etsy", "tags etsy", "titulo etsy", "vender etsy españa", "descripcion etsy seo"],
  openGraph: {
    title: `SEO Etsy · ${APP_NAME}`,
    url: `${siteUrl}/seo-etsy`,
  },
  alternates: { canonical: `${siteUrl}/seo-etsy` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/descripcion-productos-ia", label: "Descripción de productos con IA" },
  { href: "/generador-titulos-productos", label: "Generador de títulos SEO" },
  { href: "/por-que-no-vendo-productos", label: "Por qué no vendo productos online" },
];

export default function SeoEtsyPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "SEO Etsy", url: `${siteUrl}/seo-etsy` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "SEO Etsy" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          SEO en Etsy: títulos, tags y descripción que traen tráfico cualificado
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Etsy combina búsqueda interna con señales de engagement. Tu objetivo es que el listado sea{" "}
          <strong className="text-foreground">relevante para la intención</strong> (regalo boda, decoración boho, etc.) y
          que, al entrar, la descripción cierre la duda. Usa esta guía y{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            analiza tu listing gratis
          </Link>{" "}
          con {APP_NAME}.
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Por qué fallan muchos listados en Etsy">
          <p>
            Título bonito pero sin palabras de búsqueda, tags repetidos o demasiado genéricos (“gift”, “love”) y
            descripción que empieza por la historia del taller sin decir tamaño, material o plazo. El visitante se va
            antes de ver lo artesanal de verdad.
          </p>
        </GrowthSection>

        <GrowthSection title="Cómo mejorarlo (framework simple)">
          <GrowthTipList
            items={[
              "Título: intención + material + uso (ej. ‘pendientes plata ley novia’). Evita relleno sin significado.",
              "Tags: 13 distintos; mezcla sinónimos, ocasiones y long-tail (‘regalo madre’, ‘minimalista’).",
              "Atributos: rellena todo lo que Etsy sugera; ayuda a filtros y a confianza.",
              "Descripción: primeras líneas = datos duros (medidas, peso, cuidados, plazo); luego historia de marca.",
              "Fotos: escala, contexto de uso, detalle; primera imagen clara en miniatura.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Ejemplo (antes / después)">
          <GrowthBeforeAfter
            before="Pulsera bonita hecha a mano"
            after="Pulsera macramé ajustable beige — algodón reciclado, regalo boho, envío 24–48h desde España"
          />
        </GrowthSection>

        <GrowthSection title="Tips SEO Etsy avanzados (pero honestos)">
          <GrowthTipList
            items={[
              "Investiga frases en el buscador de Etsy y en autocompletado; copia intenciones, no textos ajenos.",
              "Renueva listados con datos reales cuando cambies fotos o variantes; consistencia importa.",
              "Evita keyword stuffing en título; legibilidad humana sigue siendo venta.",
            ]}
          />
        </GrowthSection>

        <GrowthToolPitch />
        <p className="text-muted-foreground">
          {ENGINE_NAME} te ayuda a producir borradores coherentes para Etsy y otros canales; tú mantienes la voz de tu
          marca y cumples políticas de la plataforma.
        </p>

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
