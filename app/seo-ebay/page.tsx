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
  title: "SEO eBay productos: títulos Cassini y descripciones que venden",
  description:
    "SEO para productos en eBay España e internacional: títulos de 80 caracteres, item specifics y descripción escaneable. Optimiza con ListingBoost + ListingBrain™.",
  keywords: ["seo ebay productos", "titulo ebay seo", "cassini ebay", "vender ebay españa", "descripcion ebay"],
  openGraph: {
    title: `SEO eBay · ${APP_NAME}`,
    url: `${siteUrl}/seo-ebay`,
  },
  alternates: { canonical: `${siteUrl}/seo-ebay` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/no-vendo-en-ebay", label: "Si no vendes en eBay: diagnóstico" },
  { href: "/generador-titulos-productos", label: "Generador de títulos SEO para productos" },
  { href: "/producto/boost-de-ficha", label: "Boost de ficha multicanal" },
];

export default function SeoEbayPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "SEO eBay", url: `${siteUrl}/seo-ebay` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "SEO eBay" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          SEO eBay para productos: visibilidad en Cassini y mejor CTR
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          eBay ordena resultados con su motor (a menudo llamado <strong className="text-foreground">Cassini</strong> en
          la jerga de sellers). No es solo “keywords”: importan relevancia del título, completitud de fichas, señales
          de servicio y conversión histórica. Esta guía te da un marco accionable y enlaza con{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            analizar tu listing gratis
          </Link>.
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Por qué el título importa tanto en eBay">
          <p>
            Tienes caracteres limitados y competencia global o regional. Un título genérico (“camiseta azul”) compite con
            miles de resultados irrelevantes para el comprador. Un título específico (“Camiseta Nike Dri-FIT talla L azul
            marino — nueva con etiquetas”) alinea búsqueda, expectation y clic.
          </p>
          <p>
            Además, los <strong className="text-foreground">item specifics</strong> (marca, talla, material) ayudan al
            emparejamiento: el título y las especificaciones deben decir la misma historia.
          </p>
        </GrowthSection>

        <GrowthSection title="Cómo mejorar tu ficha (orden práctico)">
          <GrowthTipList
            items={[
              "Rellena todas las especificaciones obligatorias y las recomendadas; campos vacíos = menos matching.",
              "Título: prioriza marca, modelo, talla/medida, color, condición (nuevo/usado), pack o unidad.",
              "Descripción: empieza por lo que el comprador necesita saber en 3 segundos; luego detalle técnico.",
              "Políticas claras: envíos, devoluciones, tiempo de preparación; reducen abandono y disputas.",
              "Fotos en fondo neutro y detalle de defectos en usados; eBay premia confianza.",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Ejemplo de título (antes / después)">
          <GrowthBeforeAfter
            before="Auriculares bluetooth"
            after="Sony WH-1000XM4 negros — usados, buen estado, funda original · batería OK"
          />
        </GrowthSection>

        <GrowthSection title="Tips SEO eBay que muchos sellers olvidan">
          <GrowthTipList
            items={[
              "No repitas la misma keyword cinco veces; Cassini entiende sinónimos y spam daña legibilidad.",
              "Si vendes internacional, piensa en términos que traduzcan bien (UK/US size, cm/pulgadas).",
              "Alinea palabras del título con especificaciones; contradicciones confunden al motor y al humano.",
              "Si tienes variaciones (talla/color), evita mezclar todo en un solo párrafo ilegible.",
            ]}
          />
        </GrowthSection>

        <GrowthToolPitch />
        <p className="text-muted-foreground">
          {ENGINE_NAME} puede generar variaciones de copy para eBay manteniendo tus datos; luego ajustas specifics en el
          formulario de publicación.
        </p>

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
