import Link from "next/link";
import type { Metadata } from "next";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { Button } from "@/components/ui/button";
import { ProductLandingFaq } from "@/components/producto/product-landing-faq";
import { faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo-jsonld";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "SEO Engine — contenido, competencia y monitorización",
  description: `${APP_NAME}: motor SEO Growth con generación de contenido, optimización de blogs, comparativa frente a competidores y monitor de posiciones en Google. Planes Pro, Pro+ y Enterprise (cupo ilimitado).`,
  keywords: [
    "SEO Engine ListingBoost",
    "comparar web competidor SEO",
    "monitor posiciones Google",
    "generador contenido SEO ecommerce",
    "optimizar artículo blog SEO",
  ],
  openGraph: {
    title: `SEO Engine · ${APP_NAME}`,
    description: `Herramientas de crecimiento SEO en un solo espacio: contenido, blog, competencia y monitor.`,
    url: `${siteUrl}/producto/seo-engine`,
  },
  alternates: { canonical: `${siteUrl}/producto/seo-engine` },
};

const faqs = [
  {
    q: "¿Qué es el SEO Engine?",
    a: `Es el espacio de ${APP_NAME} donde concentras tareas de crecimiento SEO más allá del boost de ficha y del scan de URL: generar u optimizar textos largos, trabajar entradas de blog, comparar tu página con la de un competidor y, en planes superiores, monitorizar posiciones en Google. Todo consume el mismo sistema de créditos y respeta los límites de tu plan.`,
  },
  {
    q: "¿Qué incluye cada pestaña?",
    a: "Suele haber pestañas para contenido (generación u optimización orientada a keyword), blog (mejora de artículos), comparativa con competidor (dos URLs del mismo nicho) y monitor de SERP donde tu plan lo permita. La interfaz puede evolucionar; lo importante es que agrupa el flujo de trabajo SEO avanzado en un solo sitio.",
  },
  {
    q: "¿Necesito plan de pago para todo?",
    a: "Parte del motor está disponible según tu plan: algunas funciones solo en Pro o Pro+ (por ejemplo comparativa avanzada o monitorización diaria). Consulta la página de precios y, dentro de la app, los candados te indican qué requiere subir de plan.",
  },
  {
    q: "¿Cómo se relaciona con el scan SEO de URL?",
    a: "El scan audita una URL concreta con puntuación y quick wins. El SEO Engine añade generación de contenido, trabajo editorial en blog y visión competitiva o de ranking según el módulo. Muchos equipos usan scan para fichas puntuales y SEO Engine para estrategia y contenidos.",
  },
  {
    q: "¿Qué cuesta el informe SERP frente a competidores?",
    a: `Desde la pestaña de monitoring, el informe premium (quién está por encima en Google para tu consulta, por qué pueden rankear mejor y plan por fases) consume ${FEATURE_CREDITS.SERP_COMPETITOR_INSIGHT} créditos por ejecución en planes Pro y Pro+. En Enterprise el cupo es ilimitado: no descuenta. Las comprobaciones periódicas de posición siguen el cron de tu plan.`,
  },
  {
    q: "¿Puedo volver a ver un informe o guardarlo en PDF?",
    a: "Sí. Cada informe se guarda automáticamente en Historial → Informes SERP vs competidores. Desde ahí (o desde el propio cuadro de diálogo al generarlo) puedes abrirlo cuando quieras. La exportación a PDF multipágina cuesta 1 crédito adicional, igual que en auditorías URL.",
  },
];

export default function SeoEngineProductPage() {
  const jsonLd = faqPageJsonLd(faqs);
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: "Producto", url: `${siteUrl}/producto` },
    { name: "SEO Engine", url: `${siteUrl}/producto/seo-engine` },
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
          <span className="text-foreground">SEO Engine</span>
        </nav>

        <div className="mt-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <Sparkles className="h-7 w-7" />
        </div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          SEO Engine: crecimiento SEO con <span className="text-gradient-brand">{APP_NAME}</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Un único espacio para <strong className="text-foreground">contenido</strong>,{" "}
          <strong className="text-foreground">blog</strong>,{" "}
          <strong className="text-foreground">comparativa frente al competidor</strong> y, según plan,{" "}
          <strong className="text-foreground">monitorización de posiciones</strong>. Pensado para equipos que ya
          publican en serio y quieren ir más allá de la ficha suelta, usando {ENGINE_NAME} como capa de análisis y
          redacción.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className="gap-2">
            <Link href="/register">
              Crear cuenta y probar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">Ver planes</Link>
          </Button>
        </div>

        <ul className="mt-10 space-y-3 text-sm text-muted-foreground">
          {[
            "Flujo por pestañas: menos saltos entre herramientas sueltas.",
            "Comparativa de dos URLs del mismo nicho: qué trabaja el competidor y qué reforzar en la tuya.",
            "Exportación de informes en PDF en planes que lo incluyan.",
            "Monitor de SERP conectado a tu estrategia cuando el plan lo permite.",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <section className="mt-12 rounded-2xl border border-border/70 bg-muted/30 p-6">
          <h2 className="text-lg font-semibold">Acceso al panel</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Una vez registrado, el SEO Engine vive en{" "}
            <Link href="/dashboard/seo-engine" className="font-medium text-primary underline-offset-4 hover:underline">
              /dashboard/seo-engine
            </Link>
            . Si no has iniciado sesión, te pediremos login y te devolveremos a la pestaña que toque.
          </p>
        </section>

        <section className="mt-14" id="faq">
          <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
          <div className="mt-6">
            <ProductLandingFaq items={faqs} />
          </div>
        </section>
      </article>
    </>
  );
}
