import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ProductLandingFaq } from "@/components/producto/product-landing-faq";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { ArrowRight, CheckCircle2, LineChart } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Scan SEO de URL",
  description: `Auditoría SEO de URL con ${ENGINE_NAME} y ${APP_NAME}: metadatos, headings, imágenes, enlaces internos, schema y quick wins priorizados para fichas y categorías ecommerce.`,
  keywords: [
    "auditoría SEO URL",
    "analizar página producto SEO",
    "score SEO ecommerce",
    "crawler SEO tienda online",
    "mejorar ficha producto HTML",
  ],
  openGraph: {
    title: `Scan SEO de URL · ${APP_NAME}`,
    description: `Informe accionable sobre tu URL pública. Ideal para fichas, categorías y contenidos.`,
    url: `${siteUrl}/producto/scan-seo-url`,
  },
  alternates: { canonical: `${siteUrl}/producto/scan-seo-url` },
};

const faqs = [
  {
    q: "¿Qué hace el scan SEO de URL?",
    a: "Recupera el HTML público de la página que indiques, extrae señales on-page (título, meta description, jerarquía de encabezados, textos alternativos de imágenes, enlaces internos, datos estructurados detectados) y combina eso con un informe priorizado: qué mejorar primero y por qué, en lenguaje claro.",
  },
  {
    q: "¿Es lo mismo que un crawler enterprise?",
    a: "No sustituye a herramientas masivas de crawl completo del sitio: está pensado para análisis focalizado de URLs concretas (producto, colección, artículo) con salida lista para ejecutar o compartir con tu equipo. Es rápido de lanzar y bajo fricción.",
  },
  {
    q: "¿Puedo auditar cualquier web?",
    a: "Técnicamente analizamos HTML público como haría un buscador. Debes usarlo solo sobre páginas que te pertenezcan o para las que tengas permiso del propietario (cliente, jefe de producto, etc.).",
  },
  {
    q: "¿Qué tipo de páginas dan mejor resultado?",
    a: "Fichas de producto, landings de categoría, posts de blog con intención comercial y páginas de servicio. Cuanto más definida sea la URL y el país/idioma objetivo, más afinado será el informe.",
  },
  {
    q: "¿Cómo se relaciona con el boost de ficha?",
    a: "El boost genera texto optimizado a partir de tu input. El scan evalúa una URL ya publicada y te dice qué ajustar en la página real. Muchos equipos alternan ambos: generan con boost, publican y luego validan con scan.",
  },
];

export default function ScanSeoUrlPage() {
  const jsonLd = faqPageJsonLd(faqs);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Producto", url: `${siteUrl}/producto` },
    { name: "Scan SEO de URL", url: `${siteUrl}/producto/scan-seo-url` },
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
          <span className="text-foreground">Scan SEO de URL</span>
        </nav>

        <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <LineChart className="h-7 w-7" />
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Scan SEO de URL: audita páginas públicas con <span className="text-gradient-brand">{APP_NAME}</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Este módulo responde a una pregunta muy concreta:{" "}
          <strong className="text-foreground">¿esta URL está bien optimizada para buscadores y para el usuario?</strong>{" "}
          Obtienes un resumen técnico legible, puntuaciones por bloques y una lista de mejoras ordenadas por
          impacto, generada con apoyo de {ENGINE_NAME}.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="gap-2">
            <Link href="/register">
              Escanear mi primera URL
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/audit">Abrir en el panel</Link>
          </Button>
        </div>

        <section className="mt-14 space-y-4">
          <h2 className="text-2xl font-bold">Qué analizamos (visión general)</h2>
          <ul className="space-y-3 text-muted-foreground">
            {[
              "Metatítulo y meta descripción: presencia, longitud y alineación con la intención.",
              "Estructura H1–H3: jerarquía y legibilidad.",
              "Imágenes relevantes y uso de atributo alt.",
              "Enlaces internos y señales de contexto.",
              "Datos estructurados detectables (p. ej. producto, breadcrumbs).",
              "Score global y desglose para priorizar quick wins.",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 space-y-4">
          <h2 className="text-2xl font-bold">Para equipos de producto y marketing</h2>
          <p className="text-muted-foreground leading-relaxed">
            El informe está pensado para que un responsable de ecommerce o contenidos pueda{" "}
            <strong className="text-foreground">abrir la URL, pegar el enlace y recibir un checklist</strong>. Sirve
            como capa previa a cambios en CMS, pruebas A/B en títulos o rediseños de plantilla de ficha.
          </p>
        </section>

        <section className="mt-14 space-y-4">
          <h2 className="text-2xl font-bold">SEO y para IA que resume tu sitio</h2>
          <p className="text-muted-foreground leading-relaxed">
            Páginas como esta explican en texto plano qué hace el módulo, con preguntas y respuestas marcadas en
            schema FAQ. Eso ayuda a buscadores y a sistemas de respuesta a{" "}
            <strong className="text-foreground">citar y entender</strong> el alcance del producto sin confundirlo
            con herramientas genéricas.
          </p>
        </section>

        <section className="mt-16" id="faq">
          <h2 className="text-2xl font-bold">FAQ — Scan SEO de URL</h2>
          <div className="mt-6">
            <ProductLandingFaq items={faqs} />
          </div>
        </section>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Vuelve al{" "}
          <Link href="/producto" className="font-medium text-primary hover:underline">
            centro de producto
          </Link>{" "}
          o explora{" "}
          <Link href="/producto/hashtags-redes" className="font-medium text-primary hover:underline">
            hashtags para redes
          </Link>
          .
        </p>
      </article>
    </>
  );
}
