import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ProductLandingFaq } from "@/components/producto/product-landing-faq";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { ArrowRight, CheckCircle2, PackageSearch } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Boost de ficha multicanal",
  description: `Optimiza listings Wallapop, eBay, Shopify y ecommerce con ${ENGINE_NAME}: tono, estructura, hashtags y reglas por canal. ${APP_NAME} — títulos SEO, bullets, CTAs. Guía y FAQ.`,
  keywords: [
    "optimizar ficha Wallapop",
    "SEO título eBay",
    "descripción producto Shopify IA",
    "generador listing marketplace",
    "boost listing español",
  ],
  openGraph: {
    title: `Boost de ficha multicanal · ${APP_NAME}`,
    description: `Fichas que rankean y convierten por canal. Explicación detallada del módulo boost.`,
    url: `${siteUrl}/producto/boost-de-ficha`,
  },
  alternates: { canonical: `${siteUrl}/producto/boost-de-ficha` },
};

const faqs = [
  {
    q: "¿Qué es exactamente el boost de ficha?",
    a: "Es el proceso de tomar lo que sabes de tu producto (texto y, si quieres, imagen) y generar una ficha completa optimizada: título orientado a búsqueda y CTR, descripciones corta y larga, bullets escaneables, palabras clave principales y long tail, CTA y sugerencias de tono. El formato se adapta al canal que elijas: Wallapop, eBay, Shopify o una versión genérica para otras tiendas.",
  },
  {
    q: "¿En qué se diferencia de un chat genérico?",
    a: `${ENGINE_NAME} aplica reglas de negocio por plataforma: límites de estilo, lo que suele funcionar en cada marketplace, y estructura de metadatos cuando aplica (por ejemplo meta title y description en Shopify). No es solo “texto bonito”: está orientado a publicar y vender.`,
  },
  {
    q: "¿Puedo generar para varios canales a la vez?",
    a: "Sí. Puedes seleccionar un objetivo amplio o un canal concreto según el formulario. En modo multicanal obtienes variaciones coherentes entre sí pero ajustadas a las normas implícitas de cada uno.",
  },
  {
    q: "¿Los textos están listos para publicar?",
    a: "Están pensados para copiar y publicar tras una revisión humana rápida: verificar datos técnicos, precio, garantías y políticas que solo tú conoces. No inventamos especificaciones que no aparezcan en tu input.",
  },
  {
    q: "¿Incluye hashtags?",
    a: "Sí. El análisis puede incluir un bloque de hashtags con # para redes; también tienes la página dedicada “Hashtags para redes” con el enfoque explicado en detalle.",
  },
];

export default function BoostDeFichaPage() {
  const jsonLd = faqPageJsonLd(faqs);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Producto", url: `${siteUrl}/producto` },
    { name: "Boost de ficha", url: `${siteUrl}/producto/boost-de-ficha` },
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
          <span className="text-foreground">Boost de ficha</span>
        </nav>

        <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <PackageSearch className="h-7 w-7" />
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Boost de ficha multicanal con <span className="text-gradient-brand">{APP_NAME}</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          El módulo de <strong className="text-foreground">boost</strong> convierte tu input en listings
          listos para mercados reales: desde anuncios de segunda mano hasta páginas de producto en tienda online.
          El objetivo es claro: <strong className="text-foreground">más visibilidad en búsqueda</strong> y{" "}
          <strong className="text-foreground">mejor conversión</strong> en la ficha.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="gap-2">
            <Link href="/register">
              Probar boost gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/product">Ir al panel (si ya tienes cuenta)</Link>
          </Button>
        </div>

        <section className="mt-14 space-y-4">
          <h2 className="text-2xl font-bold">Qué obtienes en cada análisis</h2>
          <ul className="space-y-3 text-muted-foreground">
            {[
              "Título alineado a intención de búsqueda y límites del canal.",
              "Descripción corta y larga con estructura escaneable.",
              "Bullets con beneficios y pruebas cuando el contexto lo permite.",
              "Keywords principales y long tail sin keyword stuffing.",
              "CTA y tips de CTR / conversión accionables.",
              "Sugerencias de categoría y tono coherentes con tu mercado.",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 space-y-4">
          <h2 className="text-2xl font-bold">Canales contemplados</h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Wallapop y similares:</strong> títulos directos, beneficio claro,
            lenguaje móvil. <strong className="text-foreground">eBay:</strong> títulos con atributos sin símbolos
            raros, descripción ordenada. <strong className="text-foreground">Shopify / tienda:</strong> metadatos,
            slug, FAQs sugeridas y bloque JSON-LD orientativo. <strong className="text-foreground">Genérico:</strong>{" "}
            base sólida para WooCommerce u otras tiendas.
          </p>
        </section>

        <section className="mt-14 space-y-4">
          <h2 className="text-2xl font-bold">Cómo encaja {ENGINE_NAME}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {ENGINE_NAME} es el motor que orquesta plantillas de salida, restricciones por canal y el modelo de
            lenguaje. Eso permite que el resultado no sea genérico sino{" "}
            <strong className="text-foreground">usable en producción</strong>: menos edición manual, más
            velocidad para equipos que publican decenas o cientos de referencias.
          </p>
        </section>

        <section className="mt-16" id="faq">
          <h2 className="text-2xl font-bold">FAQ — Boost de ficha</h2>
          <div className="mt-6">
            <ProductLandingFaq items={faqs} />
          </div>
        </section>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          ¿Siguiente paso?{" "}
          <Link href="/producto/scan-seo-url" className="font-medium text-primary hover:underline">
            Scan SEO de URL
          </Link>{" "}
          o{" "}
          <Link href="/producto/hashtags-redes" className="font-medium text-primary hover:underline">
            Hashtags para redes
          </Link>
          .
        </p>
      </article>
    </>
  );
}
