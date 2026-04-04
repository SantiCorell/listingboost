import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ProductLandingFaq } from "@/components/producto/product-landing-faq";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { ArrowRight, CheckCircle2, Hash } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Hashtags para Instagram, TikTok y Shorts",
  description: `Hashtags con # listos para Instagram, TikTok y Shorts con ${ENGINE_NAME}: tono, nicho y reglas de bloque para vendedores y marcas. ${APP_NAME} — FAQ y buenas prácticas.`,
  keywords: [
    "hashtags Instagram producto",
    "hashtags TikTok ventas",
    "hashtags ecommerce español",
    "copiar hashtags listing",
    "SEO redes sociales producto",
  ],
  openGraph: {
    title: `Hashtags para redes · ${APP_NAME}`,
    description: `Bloques de hashtags optimizados para publicar con tu listing.`,
    url: `${siteUrl}/producto/hashtags-redes`,
  },
  alternates: { canonical: `${siteUrl}/producto/hashtags-redes` },
};

const faqs = [
  {
    q: "¿Por qué hashtags en un producto de listings?",
    a: "Muchos vendedores republican el mismo producto en redes para empujar tráfico al anuncio o a la tienda. Los hashtags correctos ayudan a que el contenido sea descubrible en Instagram, TikTok o YouTube Shorts sin pensar etiquetas a mano cada vez.",
  },
  {
    q: "¿Cómo se generan los hashtags?",
    a: `${APP_NAME} pide al modelo una lista de etiquetas con #, sin espacios dentro de cada tag, mezclando nicho, producto e intención de compra, en el idioma de tu mercado. Además normalizamos y, si hiciera falta, complementamos desde keywords del análisis para que el bloque sea usable.`,
  },
  {
    q: "¿Puedo copiarlos de un solo clic?",
    a: "Sí. En el resultado verás acciones para copiar toda la línea (ideal para pie de foto), un tag por línea o hashtags individuales al pulsar.",
  },
  {
    q: "¿Debo usar siempre el máximo de hashtags?",
    a: "No. Cada red tiene dinámicas distintas; te entregamos un set sólido para que elijas los que encajan con tu estrategia. La calidad y relevancia superan el volumen bruto.",
  },
  {
    q: "¿Los hashtags sustituyen al SEO de la ficha?",
    a: `No. Son complementarios: el SEO on-page y de marketplace sigue siendo la base; las redes amplifican alcance y pruebas de creatividad. Por eso ${APP_NAME} une boost de ficha, scan de URL y hashtags en el mismo flujo.`,
  },
];

export default function HashtagsRedesPage() {
  const jsonLd = faqPageJsonLd(faqs);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Producto", url: `${siteUrl}/producto` },
    { name: "Hashtags para redes", url: `${siteUrl}/producto/hashtags-redes` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <nav className="text-sm text-muted-foreground">
          <Link href="/producto" className="hover:text-foreground">
            Producto
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Hashtags para redes</span>
        </nav>

        <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Hash className="h-7 w-7" />
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Hashtags para redes sociales con <span className="text-gradient-brand">{APP_NAME}</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Publicar un listing no termina en el marketplace: muchas ventas arrancan en{" "}
          <strong className="text-foreground">Instagram, TikTok o Shorts</strong>. Este módulo entrega bloques de
          hashtags con # listos para pegar, coherentes con tu producto y mercado, integrados en el mismo análisis
          que genera la ficha con {ENGINE_NAME}.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="gap-2">
            <Link href="/register">
              Generar mi primer bloque
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/product">Ir al boost en el panel</Link>
          </Button>
        </div>

        <section className="mt-14 space-y-4">
          <h2 className="text-2xl font-bold">Buenas prácticas que aplicamos</h2>
          <ul className="space-y-3 text-muted-foreground">
            {[
              "Etiquetas relevantes al producto, no genéricas vacías.",
              "Mezcla de alcance: nicho + intención + variaciones útiles.",
              "Formato consistente: siempre # y sin espacios rotos.",
              "Alineación con idioma y país que configures en el formulario.",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 space-y-4">
          <h2 className="text-2xl font-bold">Visibilidad en buscadores y en asistentes</h2>
          <p className="text-muted-foreground leading-relaxed">
            Documentamos el módulo en esta URL con secciones claras y FAQ en JSON-LD para que quede explícito{" "}
            <strong className="text-foreground">qué problema resuelve</strong>, cómo se usa y cómo se diferencia de
            copiar hashtags aleatorios. Eso mejora la comprensión temática de la web para SEO y para sistemas que
            resumen páginas.
          </p>
        </section>

        <section className="mt-16" id="faq">
          <h2 className="text-2xl font-bold">FAQ — Hashtags</h2>
          <div className="mt-6">
            <ProductLandingFaq items={faqs} />
          </div>
        </section>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          <Link href="/producto/boost-de-ficha" className="font-medium text-primary hover:underline">
            Boost de ficha
          </Link>
          {" · "}
          <Link href="/producto/scan-seo-url" className="font-medium text-primary hover:underline">
            Scan SEO de URL
          </Link>
          {" · "}
          <Link href="/producto" className="font-medium text-primary hover:underline">
            Todo el producto
          </Link>
        </p>
      </article>
    </>
  );
}
