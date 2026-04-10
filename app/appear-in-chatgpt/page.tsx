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
  title: "Cómo aparecer en ChatGPT: visibilidad en IA | ListingBoost",
  description:
    "How to appear in ChatGPT results: estructura de contenido, autoridad y señales claras. No garantías — mejores prácticas AEO + SEO tool.",
  keywords: [
    "how to appear in chatgpt",
    "aparecer en chatgpt",
    "chatgpt seo",
    "ai visibility",
    "answer engine optimization",
    "ListingBoost",
  ],
  openGraph: {
    title: `Cómo aparecer en ChatGPT · ${APP_NAME}`,
    description: "Mejora cómo los sistemas de IA interpretan y citan tu negocio.",
    url: `${siteUrl}/appear-in-chatgpt`,
  },
  alternates: { canonical: `${siteUrl}/appear-in-chatgpt` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/seo-for-ai", label: "SEO para IA y AEO" },
  { href: "/how-to-rank-on-google", label: "Posicionar en Google" },
  { href: "/what-is-seo-tool", label: "Qué es una SEO tool" },
];

export default function AppearInChatgptPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Aparecer en ChatGPT", url: `${siteUrl}/appear-in-chatgpt` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "Aparecer en ChatGPT" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          Cómo aparecer cuando alguien pregunta a ChatGPT (u otro asistente)
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Nadie puede garantizar</strong> una mención en ChatGPT, Perplexity o
          similares: esos sistemas cambian y mezclan fuentes. Lo que sí controlas es que tu web sea{" "}
          <strong className="text-foreground">fácil de entender, precisa y citable</strong>. Eso mejora tanto el SEO en
          Google como la probabilidad de que un modelo resuma bien tu propuesta.{" "}
          <Link href="/register?callbackUrl=/dashboard/audit" className="font-medium text-primary hover:underline">
            Audita tu primera URL gratis
          </Link>{" "}
          con {APP_NAME}.
        </p>

        <GrowthCtaCluster
          primaryHref="/register?callbackUrl=/dashboard/audit"
          primaryLabel="Analizar mi web gratis"
          secondaryHref="/seo-for-ai"
          secondaryLabel="Guía SEO para IA"
        />

        <GrowthSection title="Qué hacer en la práctica">
          <GrowthTipList
            items={[
              "Página “qué hacemos / para quién / precio aproximado” sin ambigüedades.",
              "FAQs reales basadas en soporte y ventas, no relleno.",
              "Casos de uso y límites del producto: la IA castiga menos la honestidad que el marketing vapor.",
              "Presencia en fuentes que suelen resumirse (documentación pública, guías, medios de tu sector).",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="“AI visibility score”: qué medimos en {APP_NAME}">
          <p>
            Dentro del producto trabajamos señales proxy: claridad on-page, alineación título–H1–contenido, FAQs
            estructuradas y huecos frente a competidores en Google. No es un “ranking oficial en ChatGPT”, pero sí un
            mapa accionable para mejorar cómo te leen humanos y algoritmos con {ENGINE_NAME}.
          </p>
        </GrowthSection>

        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
