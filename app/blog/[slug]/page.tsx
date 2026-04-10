import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site-url";
import { ArticleBody } from "@/components/blog/article-body";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog/registry";
import { blogArticleJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo-jsonld";
import { estimateReadingMinutes, estimateWordCount } from "@/lib/blog/types";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Artículo no encontrado" };
  }
  const base = getPublicSiteUrl();
  const url = `${base}${post.canonicalPath ?? `/blog/${slug}`}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const base = getPublicSiteUrl();
  const url = `${base}${post.canonicalPath ?? `/blog/${slug}`}`;
  const words = estimateWordCount(post.contentHtml);
  const mins = estimateReadingMinutes(words);

  const articleLd = blogArticleJsonLd({
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    authorName: APP_NAME,
    keywords: post.keywords,
  });

  const crumbs = breadcrumbJsonLd([
    { name: "Inicio", url: `${base}/` },
    { name: "Blog", url: `${base}/blog` },
    { name: post.title, url },
  ]);

  const faqLd =
    post.faqItems && post.faqItems.length > 0
      ? faqPageJsonLd(post.faqItems.map((f) => ({ q: f.question, a: f.answer })))
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      {faqLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      ) : null}

      <article className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-2xl" />

        <nav className="relative text-sm">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>
        </nav>

        <header className="relative mt-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            Blog {APP_NAME}
          </p>
          <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.5rem] md:leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{post.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.publishedAt}>
              Publicado{" "}
              {new Date(post.publishedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.updatedAt ? (
              <span className="hidden sm:inline">
                · Actualizado{" "}
                {new Date(post.updatedAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="h-4 w-4" />
              ~{mins} min · ~{words.toLocaleString("es-ES")} palabras
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {post.keywords.map((k) => (
              <Badge key={k} variant="secondary">
                {k}
              </Badge>
            ))}
          </div>
        </header>

        <div className="relative mt-12 border-t border-border/70 pt-10">
          <ArticleBody html={post.contentHtml} />
        </div>

        {post.faqItems && post.faqItems.length > 0 ? (
          <section
            className="relative mt-12 border-t border-border/70 pt-10"
            aria-labelledby={`faq-${slug}`}
          >
            <h2 id={`faq-${slug}`} className="text-2xl font-bold tracking-tight text-foreground">
              Preguntas frecuentes
            </h2>
            <div className="mt-6 space-y-3">
              {post.faqItems.map((f) => (
                <details
                  key={f.question}
                  className="rounded-lg border border-border/60 bg-muted/15 px-3 py-2 [&_p]:mt-2 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground"
                >
                  <summary className="cursor-pointer select-none text-sm font-semibold text-foreground">
                    {f.question}
                  </summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <footer className="relative mt-14 rounded-2xl border border-border/80 bg-muted/30 p-6 sm:p-8">
          <p className="text-sm font-semibold text-foreground">¿Te ha sido útil?</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Pásalo a tu equipo y prueba {APP_NAME}: auditoría SEO, huecos en Google y contenido con IA listo para
            publicar.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register?callbackUrl=/dashboard/audit">Analizar mi web gratis</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pricing">Ver planes</Link>
            </Button>
          </div>
        </footer>
      </article>
    </>
  );
}
