import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SeoCTA } from "@/components/SeoCTA";
import { GrowthBreadcrumb } from "@/components/seo/growth-landing-layout";
import { SeoKeywordInternalMesh } from "@/components/seo/SeoKeywordInternalMesh";
import { APP_NAME } from "@/lib/constants";
import {
  getKeywordLanding,
  KEYWORD_LANDING_SLUGS,
  type KeywordLandingDefinition,
} from "@/lib/seo/keyword-landings";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo-jsonld";
import { getPublicSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";
export const dynamicParams = false;

const siteUrl = getPublicSiteUrl();

export function generateStaticParams() {
  return KEYWORD_LANDING_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const landing = getKeywordLanding(slug);
  if (!landing) return {};
  const url = `${siteUrl}/${slug}`;
  return {
    title: landing.metaTitle,
    description: landing.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: landing.metaTitle,
      description: landing.metaDescription,
      url,
      locale: "es_ES",
      siteName: APP_NAME,
      type: "article",
    },
  };
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-primary">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function renderBody(landing: KeywordLandingDefinition) {
  return (
    <>
      <p className="text-lg leading-relaxed text-muted-foreground">{landing.intro}</p>

      <Section title={landing.whatIsTitle} id="que-es">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Definición operativa</h3>
        <p>{landing.whatIsBody[0]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Cómo se traduce en decisiones</h3>
        <p>{landing.whatIsBody[1]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Señales que miramos sí o sí</h3>
        <BulletList items={landing.whatIsBullets} />
      </Section>

      <Section title={landing.includesTitle} id="que-incluye">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Entregables mínimos</h3>
        <BulletList items={landing.includesBullets} />
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Siguiente paso recomendado</h3>
        <p>{landing.includesClosing}</p>
      </Section>

      <Section title={landing.importanceTitle} id="por-que-importa">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Impacto en tráfico y margen</h3>
        <p>{landing.importanceBody[0]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Riesgo de posponer la auditoría web</h3>
        <p>{landing.importanceBody[1]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Beneficios directos del análisis SEO</h3>
        <BulletList items={landing.importanceBullets} />
      </Section>

      <Section title={landing.listingBoostTitle} id="por-que-listingboost">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Ejecución, no solo informe</h3>
        <p>{landing.listingBoostBody[0]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Revisar SEO web a escala</h3>
        <p>{landing.listingBoostBody[1]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Ventajas concretas con {APP_NAME}</h3>
        <BulletList items={landing.listingBoostBullets} />
      </Section>

      <Section title="Playbook de implementación (auditoría web + análisis SEO)" id="playbook">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Semana 1: auditoría web y baseline</h3>
        <p>{landing.executionPlaybook[0]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Semana 2–4: publicación y medición</h3>
        <p>{landing.executionPlaybook[1]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Variaciones y sinónimos útiles</h3>
        <p>{landing.executionPlaybook[2]}</p>
      </Section>

      <div className="mt-12">
        <SeoCTA />
      </div>

      <SeoKeywordInternalMesh lead={landing.internalMeshLead} />

      <section className="mt-12 scroll-mt-24" aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">
          Preguntas frecuentes
        </h2>
        <dl className="mt-6 space-y-8">
          {landing.faq.map((item) => (
            <div key={item.question}>
              <dt className="text-base font-semibold text-foreground">{item.question}</dt>
              <dd className="mt-2 text-base leading-relaxed text-muted-foreground">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 rounded-2xl border border-border/70 bg-muted/20 p-6" aria-labelledby="more-slugs">
        <h2 id="more-slugs" className="text-lg font-semibold text-foreground">
          Más guías SEO de {APP_NAME}
        </h2>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {KEYWORD_LANDING_SLUGS.filter((s) => s !== landing.slug).map((s) => (
            <li key={s}>
              <Link href={`/${s}`} className="font-medium text-primary underline-offset-4 hover:underline">
                {s.replace(/-/g, " ")}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default async function KeywordLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const landing = getKeywordLanding(slug);
  if (!landing) notFound();

  const url = `${siteUrl}/${slug}`;
  const faqLd = faqPageJsonLd(landing.faq.map((f) => ({ q: f.question, a: f.answer })));
  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: siteUrl },
    { name: landing.h1, url },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <article className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />
        <GrowthBreadcrumb
          items={[
            { href: "/", label: "Inicio" },
            { label: landing.h1 },
          ]}
        />
        <header className="mt-8 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-[2.35rem]">{landing.h1}</h1>
        </header>
        <div className="mt-6 space-y-6">{renderBody(landing)}</div>
      </article>
    </>
  );
}
