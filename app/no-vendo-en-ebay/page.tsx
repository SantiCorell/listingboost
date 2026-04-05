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
  title: "No vendo en eBay: revisa título, envío y ficha (guía rápida)",
  description:
    "Si no vendes en eBay: revisa Cassini, precio competitivo, políticas de envío y especificaciones. Mejora copy con ListingBoost y prueba gratis.",
  keywords: ["no vendo en ebay", "ebay no vendo", "vender ebay españa", "anuncio ebay sin ventas"],
  openGraph: {
    title: `No vendo en eBay · ${APP_NAME}`,
    url: `${siteUrl}/no-vendo-en-ebay`,
  },
  alternates: { canonical: `${siteUrl}/no-vendo-en-ebay` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/seo-ebay", label: "Guía SEO eBay" },
  { href: "/generador-titulos-productos", label: "Generador de títulos SEO" },
  { href: "/no-vendo-en-wallapop", label: "No vendo en Wallapop" },
];

export default function NoVendoEbayPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "No vendo en eBay", url: `${siteUrl}/no-vendo-en-ebay` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "No vendo en eBay" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          No vendo en eBay: arregla lo básico antes de pagar promoción
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          eBay castiga con invisibilidad los listados incompletos, caros en envío o con títulos que no matchean búsqueda.
          Esta checklist te saca del bloqueo; luego{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            analiza tu listing gratis
          </Link>.
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Por qué no te compran (lista realista)">
          <GrowthTipList
            items={[
              "Precio + envío más alto que competidores con misma confianza percibida.",
              "Item specifics vacíos o contradictorios con el título.",
              "Fotos pobres o genéricas de catálogo en producto usado.",
              "Políticas de devolución confusas o tiempos de envío poco competitivos.",
              "Vendedor sin historial: necesitas más prueba social y detalle que un top-rated.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Qué cambiar en 24 horas">
          <p>
            Renueva título con marca/modelo/medida/estado, completa especificaciones, ajusta envío o precio a mercado, y
            añade foto de defecto si es usado. Después evalúa promociones pagas.
          </p>
        </GrowthSection>

        <GrowthToolPitch />

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
