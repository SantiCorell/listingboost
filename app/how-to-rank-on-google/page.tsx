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
  title: "Cómo rankear en Google: guía práctica 2026 | ListingBoost",
  description:
    "Cómo mejorar SEO y posicionar en Google: intención de búsqueda, contenido, técnico y autoridad. Improve SEO website con pasos claros + herramienta.",
  keywords: [
    "how to rank on google",
    "improve seo website",
    "posicionar en google",
    "seo google",
    "answer engine optimization",
    "ListingBoost",
  ],
  openGraph: {
    title: `Cómo rankear en Google · ${APP_NAME}`,
    description: "Pasos accionables para subir posiciones sin humo.",
    url: `${siteUrl}/how-to-rank-on-google`,
  },
  alternates: { canonical: `${siteUrl}/how-to-rank-on-google` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/what-is-seo-tool", label: "Qué es una SEO tool" },
  { href: "/seo-for-ai", label: "Optimizar también para IA" },
  { href: "/blog/seo-vs-aeo-guia-completa-2026", label: "SEO vs AEO (guía larga)" },
];

export default function HowToRankOnGooglePage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Cómo rankear en Google", url: `${siteUrl}/how-to-rank-on-google` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "Rankear en Google" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          Cómo rankear en Google (y no perder el tiempo)
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Rankear</strong> no es un truco único: es alinear{" "}
          <strong className="text-foreground">intención de búsqueda</strong>,{" "}
          <strong className="text-foreground">página que responde mejor que la competencia</strong> y{" "}
          <strong className="text-foreground">señales de confianza</strong> (enlaces, marca, experiencia). Empieza por
          una URL concreta:{" "}
          <Link href="/register?callbackUrl=/dashboard/audit" className="font-medium text-primary hover:underline">
            audítala gratis con {APP_NAME}
          </Link>{" "}
          y ataca primero lo que más impacto tiene.
        </p>

        <GrowthCtaCluster
          primaryHref="/register?callbackUrl=/dashboard/audit"
          primaryLabel="Analizar mi web gratis"
          secondaryHref="/producto/seo-gap-finder"
          secondaryLabel="Ver huecos vs rivales"
        />

        <GrowthSection title="Pasos que sí mueven la aguja">
          <GrowthTipList
            items={[
              "Elige una keyword por página y una intención (informacional, transaccional, local…).",
              "Mejora título, H1 y primeras líneas para responder la pregunta en 10 segundos.",
              "Enlaza internamente desde páginas fuertes hacia la URL objetivo.",
              "Corrige bloqueos técnicos básicos: indexación, canonicals, velocidad móvil.",
              "Actualiza contenido con datos reales, no relleno; Google y la IA premian precisión.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Cómo {APP_NAME} acelera el ciclo">
          <p>
            {ENGINE_NAME} te ayuda a pasar del diagnóstico al texto: gaps desde la SERP, auditoría on-page y sugerencias
            listas para pegar. No sustituye estrategia ni enlaces de calidad, pero reduce meses de “parálisis por
            informe”.
          </p>
        </GrowthSection>

        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
