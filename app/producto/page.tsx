import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME, ENGINE_PITCH } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductLandingFaq } from "@/components/producto/product-landing-faq";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { ArrowRight, Hash, LineChart, PackageSearch, Zap } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Producto — motor propietario para listings",
  description: `${APP_NAME}: motor ${ENGINE_NAME} con tono, hashtags, estructura y reglas por canal. Boost multicanal, auditoría SEO de URL y hashtags Instagram/TikTok. Empieza gratis.`,
  keywords: [
    "ListingBoost producto",
    "motor propietario listings",
    "optimizar ficha Wallapop SEO",
    "auditoría URL ecommerce España",
    "hashtags Instagram producto venta",
    "generador listing eBay Shopify",
  ],
  openGraph: {
    title: `Producto · ${APP_NAME}`,
    description: `Tres pilares: boost multicanal, scan URL y hashtags. Infra pensada para escalar catálogo.`,
    url: `${siteUrl}/producto`,
  },
  alternates: { canonical: `${siteUrl}/producto` },
};

const faqs = [
  {
    q: `¿Qué incluye el producto ${APP_NAME}?`,
    a: `Incluye tres bloques: generación y optimización de fichas para distintos marketplaces y tiendas (boost multicanal), análisis técnico de páginas públicas con puntuación y prioridades (scan SEO de URL), y generación de hashtags listos para copiar en redes sociales. Todo apoyado en ${ENGINE_NAME}, nuestro motor propietario.`,
  },
  {
    q: "¿Puedo usar solo una de las funciones?",
    a: "Sí. Muchos usuarios empiezan solo con boost de ficha o solo con scan de URL. El plan Free te permite probar el flujo completo con límites mensuales; cuando el volumen crece, puedes subir de plan para más análisis y mejor precio por crédito extra.",
  },
  {
    q: "¿Para quién está pensado ListingBoost?",
    a: "Para vendedores en Wallapop, eBay y similares, tiendas Shopify y WooCommerce, agencias que gestionan catálogos de clientes y marcas D2C que publican en varios canales a la vez. Si vives del throughput de listings, encaja contigo.",
  },
  {
    q: "¿Necesito conocimientos de SEO?",
    a: "No es obligatorio. El producto traduce buenas prácticas de SEO y conversión en salidas accionables: títulos, bullets, metadatos sugeridos, hashtags y un informe de URL ordenado por impacto. Si ya eres experto, ganas velocidad; si no, ganas criterio.",
  },
];

const cards = [
  {
    href: "/producto/boost-de-ficha",
    icon: PackageSearch,
    title: "Boost de ficha multicanal",
    desc: "De imagen o texto a título, descripción, bullets, keywords y CTA calibrados por canal. Ideal para marketplaces y ecommerce.",
  },
  {
    href: "/producto/scan-seo-url",
    icon: LineChart,
    title: "Scan SEO de URL",
    desc: "Pega la URL pública de una ficha, categoría o blog: metadatos, headings, imágenes, enlaces internos y quick wins priorizados.",
  },
  {
    href: "/producto/hashtags-redes",
    icon: Hash,
    title: "Hashtags para redes",
    desc: "Bloques de hashtags con # listos para Instagram, TikTok y Shorts, alineados con tu producto e idioma de mercado.",
  },
];

export default function ProductoHubPage() {
  const jsonLd = faqPageJsonLd(faqs);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Producto", url: `${siteUrl}/producto` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      <article className="mx-auto min-w-0 max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Centro de producto</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Todo lo que hace <span className="text-gradient-brand">{APP_NAME}</span> — en un vistazo
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Plataforma de <strong className="text-foreground">listing intelligence</strong> para que cada publicación
          rankee y convierta sin frenar el catálogo. {ENGINE_PITCH}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="gap-2 shadow-md">
            <Link href="/register">
              Crear cuenta gratis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">Comparar planes</Link>
          </Button>
        </div>

        <section className="mt-14 space-y-4" aria-labelledby="modulos">
          <h2 id="modulos" className="text-2xl font-bold tracking-tight">
            Tres módulos, un mismo flujo de trabajo
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Cada página siguiente profundiza en un módulo: qué problema resuelve, qué entregables obtienes, para
            qué canales está calibrado y preguntas frecuentes con respuestas directas — pensado tanto para
            humanos como para motores de búsqueda y asistentes que resumen la web.
          </p>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-1">
          {cards.map(({ href, icon: Icon, title, desc }) => (
            <Link key={href} href={href} className="group block">
              <Card className="card-tech-hover h-full border-border/80 transition-colors group-hover:border-primary/30">
                <CardContent className="flex gap-4 p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    <p className="mt-3 text-sm font-medium text-primary">Leer guía completa →</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <section className="mt-16 rounded-2xl border border-border/70 bg-muted/30 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Zap className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Por qué separar “producto” en páginas claras</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Documentar cada módulo en su propia URL mejora la claridad para buscadores y para IA que citan
                fuentes: cada página tiene un propósito único (boost, URL o hashtags), títulos específicos y FAQs
                alineadas. Así reducimos ambigüedad y ayudamos a que te encuentren quienes buscan exactamente esa
                solución.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16" id="faq">
          <h2 className="text-2xl font-bold">Preguntas frecuentes sobre el producto</h2>
          <div className="mt-6">
            <ProductLandingFaq items={faqs} />
          </div>
        </section>
      </article>
    </>
  );
}
