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
import { tituloSeoPageContent } from "@/lib/seo/programmatic-growth-content";
import { getPublicSiteUrl } from "@/lib/site-url";
import { breadcrumbJsonLd } from "@/lib/seo-jsonld";

const siteUrl = getPublicSiteUrl();

export function generateStaticParams() {
  return SEO_CATEGORIAS.map((categoria) => ({ categoria }));
}

export function generateMetadata({ params }: { params: Promise<{ categoria: string }> }): Promise<Metadata> {
  return params.then(({ categoria }) => {
    if (!isSeoCategoria(categoria)) return { title: "No encontrado" };
    const c = tituloSeoPageContent(categoria);
    return {
      title: c.title,
      description: c.description,
      keywords: [
        `titulo seo ${c.label}`,
        `titulo ${c.label} wallapop`,
        `titulo producto ${c.label}`,
        "generador titulos marketplace",
      ],
      openGraph: { title: c.title, url: `${siteUrl}/titulo-seo/${categoria}` },
      alternates: { canonical: `${siteUrl}/titulo-seo/${categoria}` },
      robots: { index: true, follow: true },
    };
  });
}

export default async function TituloSeoCategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  if (!isSeoCategoria(categoria)) notFound();
  const c = tituloSeoPageContent(categoria);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Título SEO", url: `${siteUrl}/generador-titulos-productos` },
    { name: c.label, url: `${siteUrl}/titulo-seo/${categoria}` },
  ]);

  const relatedLinks: { href: string; label: string }[] = [
    { href: `/descripcion-producto/${categoria}`, label: `Descripción de producto para ${c.label}` },
    { href: "/generador-titulos-productos", label: "Guía general: generador de títulos SEO" },
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
          { href: "/generador-titulos-productos", label: "Títulos SEO" },
          { label: c.label },
        ]}
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">{c.h1}</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Los buscadores internos de marketplaces premian títulos que emparejan intención: marca, modelo, medida y
          condición en pocas palabras. Aquí tienes ejemplos para <strong className="text-foreground">{c.label}</strong> y
          una lista de errores que frenan el clic.{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Analizar listing gratis
          </Link>{" "}
          con {APP_NAME}.
        </p>
        <GrowthCtaCluster />

        <GrowthSection title="Por qué el título importa más que la descripción (al principio)">
          <p>
            El título es lo único que muchos usuarios ven en el scroll infinito. Si no comunica diferencial, ni entran.
            La descripción cierra la venta, pero sin clic no hay conversación.
          </p>
        </GrowthSection>

        <GrowthSection title={`Ejemplos de título SEO para ${c.label}`}>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-muted-foreground marker:text-primary">
            {c.examples.map((ex) => (
              <li key={ex} className="leading-relaxed">
                <span className="font-medium text-foreground">{ex}</span>
              </li>
            ))}
          </ul>
        </GrowthSection>

        <GrowthSection title="Tips rápidos">
          <GrowthTipList items={c.tips} />
        </GrowthSection>

        <GrowthSection title="Errores típicos en esta categoría">
          <GrowthTipList
            items={[
              "Título demasiado corto o genérico (‘en venta’, ‘oportunidad’).",
              "Datos que solo aparecen en chat: súbelos al anuncio para filtrar curiosos.",
              "Contradicción entre título y fotos (color, talla, modelo).",
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
