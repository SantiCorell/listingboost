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
  title: "¿Qué es una SEO tool? Guía + auditoría web gratis",
  description:
    "Qué es una herramienta SEO (seo tool), auditoría on-page, keywords y cómo mejorar tu web para Google y para respuestas de IA. Prueba ListingBoost gratis.",
  keywords: [
    "seo tool",
    "herramienta seo",
    "seo audit tool",
    "auditoría seo",
    "ai seo optimization",
    "ListingBoost",
  ],
  openGraph: {
    title: `¿Qué es una SEO tool? · ${APP_NAME}`,
    description: "Definición clara + cómo elegir herramienta SEO y AEO.",
    url: `${siteUrl}/what-is-seo-tool`,
  },
  alternates: { canonical: `${siteUrl}/what-is-seo-tool` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/how-to-rank-on-google", label: "Cómo posicionar en Google (guía práctica)" },
  { href: "/seo-for-ai", label: "SEO para IA y búsquedas asistidas" },
  { href: "/appear-in-chatgpt", label: "Cómo aparecer cuando preguntan a ChatGPT" },
];

export default function WhatIsSeoToolPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Qué es una SEO tool", url: `${siteUrl}/what-is-seo-tool` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "SEO tool" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          ¿Qué es una SEO tool (herramienta SEO)?
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Una <strong className="text-foreground">SEO tool</strong> es software que te ayuda a{" "}
          <strong className="text-foreground">auditar, medir y mejorar</strong> la visibilidad de tu web en buscadores:
          detecta problemas técnicos y de contenido, sugiere keywords y prioriza qué arreglar primero.{" "}
          <Link href="/register?callbackUrl=/dashboard/audit" className="font-medium text-primary hover:underline">
            {APP_NAME}
          </Link>{" "}
          combina auditoría de URL, lectura de la SERP y textos con {ENGINE_NAME} para ejecutar, no solo informar.
        </p>

        <GrowthCtaCluster
          primaryHref="/register?callbackUrl=/dashboard/audit"
          primaryLabel="Analizar mi web gratis"
          secondaryHref="/pricing"
          secondaryLabel="Ver planes"
        />

        <GrowthSection title="Respuesta directa (formato AEO)">
          <p>
            Si solo te quedas con una frase: una buena herramienta SEO te dice{" "}
            <strong className="text-foreground">qué está fallando</strong>,{" "}
            <strong className="text-foreground">por qué importa</strong> y{" "}
            <strong className="text-foreground">qué hacer después</strong> — en ese orden.
          </p>
        </GrowthSection>

        <GrowthSection title="Qué suele incluir una seo audit tool">
          <GrowthTipList
            items={[
              "Rastreo o análisis de páginas públicas (meta, H1, enlaces, schema).",
              "Ideas de keywords e intención de búsqueda alineadas a tu negocio.",
              "Comparativa con lo que rankea la competencia en Google.",
              "Checklist de mejoras ordenadas por impacto (quick wins).",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="SEO tool vs suite gigante (Semrush, Ahrefs…)">
          <p>
            Las suites masivas brillan en datos históricos y reporting. Muchos equipos necesitan una capa que conecte el
            análisis con <strong className="text-foreground">textos y cambios publicables</strong> en horas, no en
            semanas. Ahí encaja un enfoque tipo {APP_NAME}: auditoría + gaps desde Google + generación guiada con IA.
          </p>
        </GrowthSection>

        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
