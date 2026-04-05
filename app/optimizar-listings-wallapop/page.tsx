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
import { APP_NAME } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site-url";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: "Optimizar listings Wallapop: guía 2026 para vender antes",
  description:
    "Pasos para optimizar listings en Wallapop: título, descripción, fotos y precio. Mejora visibilidad con ListingBoost (ListingBrain™) y analiza tu anuncio gratis.",
  keywords: ["optimizar listings wallapop", "mejorar anuncio wallapop", "titulo wallapop", "fotos wallapop ventas"],
  openGraph: {
    title: `Optimizar listings Wallapop · ${APP_NAME}`,
    url: `${siteUrl}/optimizar-listings-wallapop`,
  },
  alternates: { canonical: `${siteUrl}/optimizar-listings-wallapop` },
  robots: { index: true, follow: true },
};

const related = [
  { href: "/seo-wallapop", label: "Fundamentos de SEO Wallapop" },
  { href: "/descripcion-productos-ia", label: "Descripción de productos con IA que suena humana" },
  { href: "/vender-iphone-wallapop", label: "Ejemplo: vender iPhone en Wallapop" },
];

export default function OptimizarListingsWallapopPage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Optimizar listings Wallapop", url: `${siteUrl}/optimizar-listings-wallapop` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell breadcrumb={[{ href: "/", label: "Inicio" }, { label: "Optimizar listings Wallapop" }]}>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">
          Optimizar listings en Wallapop: de invisible a vendible
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Optimizar un listing no es “poner palabras mágicas”. Es <strong className="text-foreground">ordenar la información</strong> para que el comprador entienda valor, estado y logística en segundos. Aquí tienes un método repetible — y una forma de{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            analizar tu listing gratis
          </Link>{" "}
          con {APP_NAME}.
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Por qué muchos anuncios fallan aunque el producto sea bueno">
          <p>
            La mayoría de anuncios fallan por mezclar tres problemas: título poco específico, descripción que no responde
            a miedos (¿funciona? ¿es robado? ¿hay talle equivocado?) y fotos que no muestran el defecto real. El comprador
            no odia tu producto: <strong className="text-foreground">no confía</strong> o no tiene tiempo para
            preguntarte diez cosas por chat.
          </p>
          <p>
            Wallapop premia anuncios que generan conversación útil y cierre. Cuanto menos fricción inicial, más probabilidad
            de que te escriban compradores serios.
          </p>
        </GrowthSection>

        <GrowthSection title="Cómo optimizarlo (paso a paso)">
          <GrowthTipList
            items={[
              "Paso 1 — Hechos: marca, modelo, medidas, año, estado real, lo que incluye y lo que no.",
              "Paso 2 — Título: mezcla modelo + atributo buscable + estado en pocas palabras (sin clickbait).",
              "Paso 3 — Descripción en bloques: estado · accesorios · entrega · política simple.",
              "Paso 4 — Fotos: portada nítida + detalle de defectos + prueba de funcionamiento si aplica.",
              "Paso 5 — Precio: mira referencias cercanas; si pides premium, justifícalo en texto (factura, garantía).",
            ]}
          />
        </GrowthSection>

        <GrowthSection title="Ejemplo antes / después (zapatillas)">
          <GrowthBeforeAfter
            before="Zapatillas deportivas usadas"
            after="Adidas Ultraboost 22 talla 43 — usadas, buen estado, suela con uso normal · originales · Madrid"
          />
        </GrowthSection>

        <GrowthSection title="Tips SEO y conversión en Wallapop">
          <GrowthTipList
            items={[
              "Repite palabras que la gente busca de forma natural (marca + modelo + talla/medida).",
              "Si el producto tiene IMEI, número de serie o tallaje europeo, ponlo (sin datos personales).",
              "Evita descripciones de una sola línea: parecen estafa o pereza.",
              "Actualiza si cambias precio: un refresh honesto ayuda más que dejar un anuncio muerto.",
            ]}
          />
        </GrowthSection>

        <GrowthToolPitch />
        <p className="text-muted-foreground">
          Si publicas a menudo, combina boost de ficha con{" "}
          <Link href="/producto/hashtags-redes" className="font-medium text-primary hover:underline">
            hashtags para redes
          </Link>{" "}
          cuando quieras reutilizar el mismo activo en Instagram o TikTok.
        </p>

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={related} />
      </GrowthArticleShell>
    </>
  );
}
