import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { VENDER_WALLAPOP_PRODUCTOS, isVenderWallapopSlug } from "@/lib/seo/growth-registry";
import { venderWallapopPageContent } from "@/lib/seo/programmatic-growth-content";
import { getPublicSiteUrl } from "@/lib/site-url";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";

const siteUrl = getPublicSiteUrl();

export function generateStaticParams() {
  return VENDER_WALLAPOP_PRODUCTOS.map((producto) => ({ producto }));
}

export function generateMetadata({ params }: { params: Promise<{ producto: string }> }): Promise<Metadata> {
  return params.then(({ producto }) => {
    if (!isVenderWallapopSlug(producto)) return { title: "No encontrado" };
    const c = venderWallapopPageContent(producto);
    return {
      title: c.title,
      description: c.description,
      keywords: [
        `vender ${c.label} wallapop`,
        `${c.label} wallapop`,
        "wallapop vender rapido",
        "anuncio wallapop",
      ],
      openGraph: { title: c.title, url: `${siteUrl}/vender-${producto}-wallapop` },
      alternates: { canonical: `${siteUrl}/vender-${producto}-wallapop` },
      robots: { index: true, follow: true },
    };
  });
}

export default async function VenderProductoWallapopPage({ params }: { params: Promise<{ producto: string }> }) {
  const { producto } = await params;
  if (!isVenderWallapopSlug(producto)) notFound();
  const c = venderWallapopPageContent(producto);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: `Vender ${c.label} Wallapop`, url: `${siteUrl}/vender-${producto}-wallapop` },
  ]);

  const relatedLinks = [
    { href: "/como-vender-mas-en-wallapop", label: "Cómo vender más en Wallapop" },
    { href: `/titulo-seo/${producto}`, label: `Título SEO para ${c.label}` },
    { href: `/descripcion-producto/${producto}`, label: `Descripción para ${c.label}` },
    { href: "/seo-wallapop", label: "Guía SEO Wallapop" },
  ];

  const beforeAfter =
    producto === "iphone" ?
      {
        before: "iPhone usado barato",
        after: "iPhone 13 128 GB azul — batería 86%, pantalla sin rayas, iCloud libre · Madrid",
      }
    : producto === "coche" ?
      {
        before: "Coche diesel",
        after: "Audi A3 Sportback 2.0 TDI 150 CV 2016 — 155.000 km, ITV OK, última revisión enero",
      }
    : {
        before: `Vendo ${c.label}`,
        after: `Título específico con marca/modelo/medida/estado + logística clara (mano/envío)`,
      };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell
        breadcrumb={[
          { href: "/", label: "Inicio" },
          { href: "/como-vender-mas-en-wallapop", label: "Vender en Wallapop" },
          { label: c.label },
        ]}
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">{c.h1}</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Wallapop es conversación + confianza. Si vendes <strong className="text-foreground">{c.label}</strong>, tu
          ventaja es un anuncio que responde miedos antes del chat. Aquí va una guía práctica y un empujón de copy con{" "}
          {APP_NAME}.{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Analizar listing gratis
          </Link>
          .
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Por qué tu categoría necesita detalle extra">
          <p>
            Los compradores de {c.label} suelen filtrar por señales de riesgo: autenticidad, estado real, logística y
            prueba en mano. Si no lo dejas claro en texto y fotos, te bombardean al chat o pasan de largo.
          </p>
        </GrowthSection>

        <GrowthSection title="Checklist específica">
          <GrowthTipList items={c.specifics} />
        </GrowthSection>

        <GrowthSection title="Ejemplo de mejora rápida (título)">
          <GrowthBeforeAfter before={beforeAfter.before} after={beforeAfter.after} />
        </GrowthSection>

        <GrowthSection title="Seguridad y buenas prácticas">
          <GrowthTipList
            items={[
              "Prefiere entrega en persona en sitio público para alto valor; evita señales fuera de la app.",
              "No compartas códigos de verificación ni datos bancarios por chat.",
              "Si usas Wallapop Envíos, sigue sus reglas de embalaje y plazos.",
            ]}
          />
        </GrowthSection>

        <GrowthToolPitch />

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={relatedLinks} />
      </GrowthArticleShell>
    </>
  );
}
