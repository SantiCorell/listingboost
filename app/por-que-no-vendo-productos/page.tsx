import Link from "next/link";
import type { Metadata } from "next";
import {
  GrowthArticleShell,
  GrowthCtaCluster,
  GrowthRelatedLinks,
  GrowthSection,
  GrowthTipList,
  GrowthToolPitch,
} from "@/components/seo/growth-landing-layout";
import { APP_NAME } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site-url";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: "Por qué no vendo productos online: 7 fallos y cómo corregirlos",
  description:
    "Si no vendes productos online: demanda, precio, confianza, texto y canales. Guía para marketplaces y tiendas + ListingBoost para mejorar fichas gratis.",
  keywords: ["por que no vendo productos", "no vendo online", "producto no vende", "vender marketplace"],
  openGraph: {
    title: `Por qué no vendo productos · ${APP_NAME}`,
    url: `${siteUrl}/por-que-no-vendo-productos`,
  },
  alternates: { canonical: `${siteUrl}/por-que-no-vendo-productos` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/no-vendo-en-wallapop", label: "No vendo en Wallapop" },
  { href: "/no-vendo-en-ebay", label: "No vendo en eBay" },
  { href: "/descripcion-productos-ia", label: "Descripción de productos con IA" },
];

export default function PorQueNoVendoProductosPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Por qué no vendo productos", url: `${siteUrl}/por-que-no-vendo-productos` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "Por qué no vendo productos" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          Por qué no vendo productos online (aunque el producto sea bueno)
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          La mayoría de problemas no son el algoritmo misterioso: son{" "}
          <strong className="text-foreground">mercado, mensaje y confianza</strong>. Aquí tienes los fallos más comunes y
          cómo invertirlos. Cuando toque mejorar texto,{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            analiza tu listing gratis
          </Link>{" "}
          con {APP_NAME}.
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Siete causas que vemos una y otra vez">
          <GrowthTipList
            items={[
              "Demanda débil: nadie busca eso así; necesitas nicho o canal distinto.",
              "Precio mal anclado: comparas con anuncios que no venden, no con ventas reales.",
              "Fotos que no prueban estado ni escala.",
              "Texto que no responde al miedo principal (¿funciona? ¿es falso? ¿cuánto cuesta envío?).",
              "Canal incorrecto: lo mismo no funciona en Wallapop que en Etsy.",
              "Cero prueba social: sin reseñas, necesitas más detalle y políticas claras.",
              "Inconsistencia: título dice una talla, descripción otra.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Cómo arreglarlo sin magia">
          <p>
            Elige un canal, estudia 10 listados que sí se mueven, copia estructura (no texto), supera en transparencia y
            velocidad de respuesta. Luego optimiza SEO on-page de tu tienda con{" "}
            <Link href="/dashboard/audit" className="font-medium text-primary hover:underline">
              scan de URL
            </Link>{" "}
            si tienes web propia.
          </p>
        </GrowthSection>

        <GrowthToolPitch />

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
