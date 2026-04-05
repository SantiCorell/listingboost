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
  title: "Cómo vender más en Wallapop: hábitos de top sellers",
  description:
    "Estrategia para vender más en Wallapop: precio, fotos, texto, respuesta y refresco de anuncios. ListingBoost optimiza fichas con IA — empieza gratis.",
  keywords: ["como vender mas en wallapop", "vender mas wallapop", "trucos wallapop", "wallapop ventas"],
  openGraph: {
    title: `Cómo vender más en Wallapop · ${APP_NAME}`,
    url: `${siteUrl}/como-vender-mas-en-wallapop`,
  },
  alternates: { canonical: `${siteUrl}/como-vender-mas-en-wallapop` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/optimizar-listings-wallapop", label: "Optimizar listings Wallapop" },
  { href: "/vender-sofa-wallapop", label: "Guía: vender sofá en Wallapop" },
  { href: "/seo-wallapop", label: "SEO Wallapop" },
];

export default function ComoVenderMasWallapopPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Cómo vender más en Wallapop", url: `${siteUrl}/como-vender-mas-en-wallapop` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "Vender más en Wallapop" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          Cómo vender más en Wallapop: sistema simple para más conversaciones serias
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Vender más no es publicar más anuncios basura: es{" "}
          <strong className="text-foreground">convertir mejor cada visita</strong>. Estos hábitos son los que separan al
          vendedor ocupado del vendedor rentable. Prueba {APP_NAME} para acelerar el copy:{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            analizar listing gratis
          </Link>
          .
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Los 5 hábitos que más ROI dan">
          <GrowthTipList
            items={[
              "Respuesta rápida: trata el chat como WhatsApp de ventas, no como email lento.",
              "Fotos honestas: mejor un defecto visible que una disputa posterior.",
              "Títulos con datos buscables: talla, GB, cm, año.",
              "Precio anclado a mercado: revisa weekly y ajusta o justifica.",
              "Recicla anuncios muertos: reescribe texto y cambia la portada.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Por qué el texto importa tanto como el precio">
          <p>
            El comprador paga por confianza. Una descripción detallada reduce miedo y negociación absurda. Si escribes
            mal o poco, parece que escondes algo aunque el producto sea perfecto.
          </p>
        </GrowthSection>

        <GrowthSection title="Escala sin volverte loco">
          <p>
            Si tienes muchas referencias, usa plantillas mentales por categoría (moda, electrónica, hogar) y automatiza
            el borrador con IA, pero revisa siempre datos técnicos.
          </p>
        </GrowthSection>

        <GrowthToolPitch />

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
