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
  title: "SEO para IA: AI search optimization y AEO | ListingBoost",
  description:
    "SEO for AI: optimiza tu web para búsquedas asistidas y answer engine optimization. Contenido claro para Google y para modelos de lenguaje.",
  keywords: [
    "seo for ai",
    "ai search optimization",
    "answer engine optimization",
    "aeo seo",
    "ai seo tool",
    "ListingBoost",
  ],
  openGraph: {
    title: `SEO para IA (AEO) · ${APP_NAME}`,
    description: "Tu web entendible para buscadores y para asistentes.",
    url: `${siteUrl}/seo-for-ai`,
  },
  alternates: { canonical: `${siteUrl}/seo-for-ai` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/appear-in-chatgpt", label: "Aparecer en ChatGPT y asistentes" },
  { href: "/what-is-seo-tool", label: "Qué es una SEO tool" },
  { href: "/blog/seo-vs-aeo-guia-completa-2026", label: "Guía SEO vs AEO" },
];

export default function SeoForAiPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "SEO para IA", url: `${siteUrl}/seo-for-ai` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "SEO para IA" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          SEO para IA: qué es el answer engine optimization (AEO)
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          <strong className="text-foreground">AI search optimization</strong> y{" "}
          <strong className="text-foreground">AEO</strong> significan preparar tu web para que, además de rankear en
          Google, sea una <strong className="text-foreground">fuente clara</strong> cuando alguien pregunta a un
          asistente: definiciones explícitas, FAQs honestas, datos alineados con lo visible y menos jerga vacía.{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Prueba {APP_NAME}
          </Link>{" "}
          para auditar URLs y generar contenido estructurado con {ENGINE_NAME}.
        </p>

        <GrowthCtaCluster
          primaryHref="/register?callbackUrl=/dashboard/audit"
          primaryLabel="Analizar mi web gratis"
          secondaryHref="/blog/seo-vs-aeo-guia-completa-2026"
          secondaryLabel="Leer guía SEO vs AEO"
        />

        <GrowthSection title="Checklist express (lo que suelen “leer” los modelos)">
          <GrowthTipList
            items={[
              "Respuesta corta al inicio; luego profundidad y ejemplos.",
              "Entidades consistentes: mismo nombre de marca, producto y servicio en todo el sitio.",
              "Tablas y listas cuando comparas opciones (mejor que párrafos densos).",
              "Schema solo si refleja lo que el usuario ve; evita marcar humo.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Relación con el SEO clásico">
          <p>
            Sin crawl e indexación razonable, la IA tampoco tiene buen material público que sintetizar. AEO y SEO no
            compiten: se superponen. Primero base técnica + contenido útil; después capa de claridad para resúmenes
            automáticos.
          </p>
        </GrowthSection>

        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
