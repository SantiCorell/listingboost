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
  title: "Generador de títulos SEO para productos (marketplaces)",
  description:
    "Crea títulos SEO para Wallapop, eBay, Shopify y Etsy: estructura, keywords y CTR. Prueba ListingBoost — ListingBrain™ — y analiza tu listing gratis.",
  keywords: [
    "generador titulos productos",
    "titulo seo producto",
    "titulo wallapop",
    "titulo ebay",
    "titulos marketplace ia",
  ],
  openGraph: {
    title: `Generador de títulos SEO · ${APP_NAME}`,
    url: `${siteUrl}/generador-titulos-productos`,
  },
  alternates: { canonical: `${siteUrl}/generador-titulos-productos` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/titulo-seo/zapatillas", label: "Ejemplos: título SEO para zapatillas" },
  { href: "/seo-wallapop", label: "SEO Wallapop completo" },
  { href: "/seo-ebay", label: "SEO eBay para productos" },
];

export default function GeneradorTitulosProductosPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Generador de títulos", url: `${siteUrl}/generador-titulos-productos` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "Generador de títulos" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          Generador de títulos SEO para productos: estructura que rankea y vende
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Un buen título de producto no es creativo por ser largo: es{" "}
          <strong className="text-foreground">específico, escaneable y honesto</strong>. Aquí aprendes la fórmula que usan
          sellers fuertes en marketplaces y cómo aplicarla con {APP_NAME} + {ENGINE_NAME}.{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Analizar listing gratis
          </Link>
          .
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Por qué el título decide si te hacen clic">
          <p>
            En listados infinitos, el cerebro del comprador filtra en milisegundos. Si no ve marca, modelo, medida o
            estado, asume riesgo o irrelevante. El CTR bajo hunde la visibilidad en muchos marketplaces porque las
            plataformas interpretan que tu oferta no satisface la intención.
          </p>
        </GrowthSection>

        <GrowthSection title="Plantilla mental (casi siempre funciona)">
          <GrowthTipList
            items={[
              "[Marca] + [Modelo] + [atributo buscable: talla/GB/cm] + [condición] + [diferencial opcional: factura, envío].",
              "Evita MAYÚSCULAS totales y símbolos raros; parecen spam.",
              "No prometas lo que el producto no cumple: devoluciones y reseñas te lo recordarán.",
              "Si hay varias unidades, diferencia en variante (color/talla) en lugar de duplicar títulos idénticos.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Ejemplo antes / después">
          <GrowthBeforeAfter
            before="Sofá grande barato"
            after="Sofá 3 plazas tela gris 220 cm — buen estado, desenfundable · recogida en Valencia"
          />
        </GrowthSection>

        <GrowthSection title="Tips SEO de títulos por tipo de producto">
          <GrowthTipList
            items={[
              "Moda: talla + género si aporta + material si es diferencial (lana merino, piel, etc.).",
              "Electrónica: modelo exacto, capacidad, color, desbloqueo/batería si aplica.",
              "Hogar: medidas en cm, tipo de tela/madera, si cabe en ascensor (sí, importa).",
              "Coche/moto: km, año, ITV, golpes claros; transparencia acorta negociación.",
            ]}
          />
        </GrowthSection>

        <GrowthToolPitch />
        <p>
          Explora páginas long-tail por categoría en{" "}
          <Link href="/titulo-seo/iphone" className="font-medium text-primary hover:underline">
            título SEO iPhone
          </Link>{" "}
          o{" "}
          <Link href="/titulo-seo/muebles" className="font-medium text-primary hover:underline">
            título SEO muebles
          </Link>
          .
        </p>

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
