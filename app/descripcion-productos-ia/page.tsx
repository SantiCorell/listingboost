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
  title: "Descripción de productos con IA: plantillas que convierten",
  description:
    "Escribe descripciones de producto con IA sin sonar robótico: estructura, beneficios y SEO marketplace. ListingBoost + ListingBrain™ — prueba gratis.",
  keywords: [
    "descripcion productos ia",
    "descripcion producto ia",
    "texto producto marketplace",
    "descripcion seo shopify",
    "ia para vendedores",
  ],
  openGraph: {
    title: `Descripción de productos con IA · ${APP_NAME}`,
    url: `${siteUrl}/descripcion-productos-ia`,
  },
  alternates: { canonical: `${siteUrl}/descripcion-productos-ia` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/descripcion-producto/iphone", label: "Plantilla: descripción de producto iPhone" },
  { href: "/generador-titulos-productos", label: "Generador de títulos SEO" },
  { href: "/seo-etsy", label: "SEO Etsy: descripciones que funcionan" },
];

export default function DescripcionProductosIaPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Descripción productos IA", url: `${siteUrl}/descripcion-productos-ia` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "Descripción con IA" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          Descripción de productos con IA: útil, creíble y lista para publicar
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          La IA no debe inventar especificaciones: debe{" "}
          <strong className="text-foreground">organizar lo que ya sabes</strong> en un texto que responda objeciones y
          sea fácil de escanear. Así reduces preguntas en chat y subes conversión. Prueba {APP_NAME} y{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            analiza tu listing gratis
          </Link>
          .
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Por qué muchas descripciones con IA suenan mal">
          <p>
            Prompts vagos producen párrafos genéricos (“alta calidad”, “perfecto para ti”) sin datos duros. El comprador
            no confía. La solución no es abandonar la IA: es{" "}
            <strong className="text-foreground">inyectar hechos</strong> (medidas, estado, compatibilidades) y pedir
            formato escaneable.
          </p>
        </GrowthSection>

        <GrowthSection title="Plantilla que puedes copiar (manual o con IA)">
          <GrowthTipList
            items={[
              "Bloque 1 — Qué es y para quién (1–2 líneas).",
              "Bloque 2 — Estado y defectos (honestidad explícita).",
              "Bloque 3 — Qué incluye la caja / envío / recogida.",
              "Bloque 4 — Preguntas frecuentes en viñetas (talla, garantía, autenticidad).",
              "Bloque 5 — Llamada a la acción simple (escribe para reservar, etc.).",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Ejemplo antes / después">
          <GrowthBeforeAfter
            before="Producto en buen estado. Envío rápido. Cualquier duda al privado."
            after="iPhone 13 128 GB azul — batería 87%, sin golpes en pantalla, carcasa incluida. Entrega mano en Bilbao o envío certificado. IMEI comprobable en entrega."
          />
        </GrowthSection>

        <GrowthSection title="Tips SEO y conversión en descripciones">
          <GrowthTipList
            items={[
              "Repite keywords naturales del título sin forzar; piensa en búsquedas largas del comprador.",
              "Usa negritas solo si la plataforma lo permite; si no, títulos en línea con mayúscula inicial.",
              "Si vendes en varios sitios, adapta tono y límites de caracteres por canal.",
            ]}
          />
        </GrowthSection>

        <GrowthToolPitch />
        <p className="text-muted-foreground">
          {ENGINE_NAME} está calibrado para canales reales; tú validas datos técnicos antes de publicar.
        </p>

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
