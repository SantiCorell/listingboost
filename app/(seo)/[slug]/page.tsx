import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SeoCTA, SEO_LANDING_CTA_SENTENCE } from "@/components/SeoCTA";
import { GrowthBreadcrumb } from "@/components/seo/growth-landing-layout";
import { SeoKeywordInternalMesh } from "@/components/seo/SeoKeywordInternalMesh";
import { Button } from "@/components/ui/button";
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

function AeoBlock({ landing }: { landing: KeywordLandingDefinition }) {
  const block = landing.aeoQuickAnswer;
  if (!block) return null;
  return (
    <section className="mt-8 scroll-mt-24 rounded-2xl border border-border/70 bg-muted/20 p-6 sm:p-8" aria-labelledby="aeo-quick-title">
      <h2 id="aeo-quick-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">
        {block.title}
      </h2>
      <div className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground">
        {block.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

function HowToFreeBlock({ landing }: { landing: KeywordLandingDefinition }) {
  const b = landing.howToCheckSeoFree;
  if (!b) return null;
  return (
    <section className="mt-12 scroll-mt-24" aria-labelledby="howto-free-title">
      <h2 id="howto-free-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">
        {b.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{b.intro}</p>
      <ol className="mt-6 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-primary">
        {b.steps.map((step, i) => (
          <li key={i} className="text-base leading-relaxed text-muted-foreground">
            {step}
          </li>
        ))}
      </ol>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">{b.outro}</p>
    </section>
  );
}

function ToolOnlineBlock({ landing }: { landing: KeywordLandingDefinition }) {
  const b = landing.toolOnlineExplainer;
  if (!b) return null;
  return (
    <section className="mt-12 scroll-mt-24" aria-labelledby="tool-online-title">
      <h2 id="tool-online-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">
        {b.title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
        {b.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

function AiCitationBlock({ landing }: { landing: KeywordLandingDefinition }) {
  const sents = landing.aiCitationSentences;
  if (!sents?.length) return null;
  return (
    <section className="mt-12 scroll-mt-24 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8" aria-labelledby="ai-cite-title">
      <h2 id="ai-cite-title" className="text-xl font-bold tracking-tight text-foreground sm:text-[1.35rem]">
        Resumen neutral (útil para citar)
      </h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed text-muted-foreground marker:text-primary">
        {sents.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </section>
  );
}

function DeepDiveSection({ landing }: { landing: KeywordLandingDefinition }) {
  const d = landing.deepDive;
  if (!d) return null;
  return (
    <section className="mt-12 scroll-mt-24" aria-labelledby="deep-dive-title">
      <h2 id="deep-dive-title" className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.65rem]">
        {d.title}
      </h2>
      <div className="mt-6 space-y-8 text-base leading-relaxed text-muted-foreground">
        {d.subsections.map((sub, i) => (
          <div key={`${sub.h3}-${i}`}>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">{sub.h3}</h3>
            <p className="mt-3">{sub.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderBody(landing: KeywordLandingDefinition) {
  const pack = Boolean(landing.conversionPack);
  return (
    <>
      {pack && <AeoBlock landing={landing} />}

      <p className="text-lg leading-relaxed text-muted-foreground">{landing.intro}</p>

      {pack && (
        <div className="mt-8">
          <SeoCTA />
        </div>
      )}

      {pack && <HowToFreeBlock landing={landing} />}
      {pack && <ToolOnlineBlock landing={landing} />}
      {pack && <AiCitationBlock landing={landing} />}

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

      {pack && (
        <div className="mt-12">
          <SeoCTA />
        </div>
      )}

      <Section title={landing.listingBoostTitle} id="por-que-listingboost">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Ejecución, no solo informe</h3>
        <p>{landing.listingBoostBody[0]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Revisar SEO web a escala</h3>
        <p>{landing.listingBoostBody[1]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Ventajas concretas con {APP_NAME}</h3>
        <BulletList items={landing.listingBoostBullets} />
      </Section>

      {pack && <DeepDiveSection landing={landing} />}

      <Section title="Playbook de implementación (auditoría web + análisis SEO)" id="playbook">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">Semana 1: auditoría web y baseline</h3>
        <p>{landing.executionPlaybook[0]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Semana 2–4: publicación y medición</h3>
        <p>{landing.executionPlaybook[1]}</p>
        <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">Variaciones y sinónimos útiles</h3>
        <p>{landing.executionPlaybook[2]}</p>
      </Section>

      {!pack && (
        <div className="mt-12">
          <SeoCTA />
        </div>
      )}

      <SeoKeywordInternalMesh lead={landing.internalMeshLead} links={landing.internalMeshItems} />

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

      {pack && (
        <div className="mt-12">
          <SeoCTA />
        </div>
      )}

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
          {landing.conversionPack && (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                size="lg"
                className="h-12 w-full gap-2 bg-gradient-to-r from-violet-600 to-purple-600 shadow-md sm:w-auto sm:min-w-[280px]"
                asChild
              >
                <Link href="/producto/scan-seo-url" aria-label={SEO_LANDING_CTA_SENTENCE}>
                  {SEO_LANDING_CTA_SENTENCE}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 w-full sm:w-auto" asChild>
                <Link href="/register">Crear cuenta gratis</Link>
              </Button>
            </div>
          )}
        </header>
        <div className="mt-6 space-y-6">{renderBody(landing)}</div>
      </article>
    </>
  );
}
