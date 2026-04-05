import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  GrowthArticleShell,
  GrowthCtaCluster,
  GrowthRelatedLinks,
  GrowthSection,
  GrowthTipList,
  GrowthToolPitch,
} from "@/components/seo/growth-landing-layout";
import { APP_NAME } from "@/lib/constants";
import { SEO_CATEGORIAS, isSeoCategoria, isVenderWallapopSlug } from "@/lib/seo/growth-registry";
import { descripcionProductoPageContent } from "@/lib/seo/programmatic-growth-content";
import { getPublicSiteUrl } from "@/lib/site-url";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";

const siteUrl = getPublicSiteUrl();

export function generateStaticParams() {
  return SEO_CATEGORIAS.map((categoria) => ({ categoria }));
}

export function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  return params.then(({ categoria }) => {
    if (!isSeoCategoria(categoria)) return { title: "No encontrado" };
    const c = descripcionProductoPageContent(categoria);
    return {
      title: c.title,
      description: c.description,
      keywords: [
        `descripcion ${c.label}`,
        `descripcion producto ${c.label}`,
        "plantilla descripcion marketplace",
        "descripcion seo producto",
      ],
      openGraph: { title: c.title, url: `${siteUrl}/descripcion-producto/${categoria}` },
      alternates: { canonical: `${siteUrl}/descripcion-producto/${categoria}` },
      robots: { index: true, follow: true },
    };
  });
}

export default async function DescripcionProductoCategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  if (!isSeoCategoria(categoria)) notFound();
  const c = descripcionProductoPageContent(categoria);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Descripción producto", url: `${siteUrl}/descripcion-productos-ia` },
    { name: c.label, url: `${siteUrl}/descripcion-producto/${categoria}` },
  ]);

  const relatedLinks: { href: string; label: string }[] = [
    { href: `/titulo-seo/${categoria}`, label: `Título SEO para ${c.label}` },
    { href: "/descripcion-productos-ia", label: "Guía: descripción de productos con IA" },
  ];
  if (isVenderWallapopSlug(categoria)) {
    relatedLinks.push({
      href: `/vender-${categoria}-wallapop`,
      label: `Vender ${c.label} en Wallapop`,
    });
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <GrowthArticleShell
        breadcrumb={[
          { href: "/", label: "Inicio" },
          { href: "/descripcion-productos-ia", label: "Descripción producto" },
          { label: c.label },
        ]}
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">{c.h1}</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Una descripción fuerte para <strong className="text-foreground">{c.label}</strong> reduce preguntas,
          disputas y tiempo perdido. Esta plantilla está pensada para marketplaces y tiendas rápidas; adáptala a tu
          tono. Genera borradores con {APP_NAME}:{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            analizar listing gratis
          </Link>
          .
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Plantilla en bloques (cópiala y rellena)">
          <ul className="mt-4 list-disc space-y-3 pl-5 text-muted-foreground marker:text-primary">
            {c.template.map((line) => (
              <li key={line.head} className="leading-relaxed">
                <strong className="text-foreground">{line.head}:</strong> {line.body}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Si publicas en varios canales, duplica el bloque y ajusta límites: Wallapop suele premiar brevedad; Shopify
            permite más storytelling después de los datos duros.
          </p>
        </GrowthSection>

        <GrowthSection title="Tips SEO y conversión">
          <GrowthTipList items={c.bullets} />
        </GrowthSection>

        <GrowthSection title="Por qué la IA ayuda (si tú aportas los hechos)">
          <p>
            La IA acelera la estructura y variantes de tono; no sustituye comprobar medidas, legalidad o garantías. Cuanto
            más concreto sea tu input (números, defectos, accesorios), menos genérico será el output.
          </p>
        </GrowthSection>

        <GrowthToolPitch />

        <GrowthCtaCluster className="mt-10" />
        <GrowthRelatedLinks links={relatedLinks} />
      </GrowthArticleShell>
    </>
  );
}
