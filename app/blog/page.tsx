import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site-url";
import { BlogCard } from "@/components/blog/blog-card";
import { BLOG_POSTS, BLOG_POSTS_PER_PAGE, getBlogPostsPage } from "@/lib/blog/registry";
import { Button } from "@/components/ui/button";

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  title: "Blog — SEO, marketplaces y ecommerce",
  description: `Artículos largos sobre SEO de fichas, Wallapop, eBay, Shopify y estrategia de catálogo. ${APP_NAME} y ${ENGINE_NAME}: guías prácticas para posicionar y vender más.`,
  keywords: [
    "blog SEO ecommerce",
    "SEO fichas producto",
    "ListingBoost blog",
    "marketplaces España SEO",
  ],
  openGraph: {
    title: `Blog · ${APP_NAME}`,
    description: `Guías y artículos sobre SEO de listings, redes y auditoría de URLs.`,
    url: `${siteUrl}/blog`,
  },
  alternates: { canonical: `${siteUrl}/blog` },
  robots: { index: true, follow: true },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const raw = parseInt(sp.page ?? "1", 10);
  const requested = Number.isFinite(raw) && raw > 0 ? raw : 1;
  const { posts, totalPages, page } = getBlogPostsPage(requested);

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-gradient-to-b from-primary/12 via-transparent to-transparent blur-2xl" />

      <header className="relative max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <BookOpen className="h-3.5 w-3.5" />
          Blog
        </p>
        <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Estrategia SEO para listings que convierten
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Contenido largo y accionable: marketplaces, tienda propia, redes y cómo{" "}
          <span className="font-medium text-foreground">{APP_NAME}</span> con{" "}
          <span className="font-medium text-foreground">{ENGINE_NAME}</span> encaja en tu día a día. Sin humo: criterio
          de negocio, palabras clave con intención y procesos que escalan.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {BLOG_POSTS.length} artículos · {BLOG_POSTS_PER_PAGE} por página · actualizado en 2026
        </p>
      </header>

      <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          className="relative mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-10 sm:flex-row"
          aria-label="Paginación del blog"
        >
          <div className="text-sm text-muted-foreground">
            Página <span className="font-semibold text-foreground">{page}</span> de{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {prev ? (
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link href={page === 2 ? "/blog" : `/blog?page=${prev}`} rel="prev">
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1" disabled>
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
            )}
            <ul className="flex flex-wrap items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <Link
                    href={n === 1 ? "/blog" : `/blog?page=${n}`}
                    className={
                      n === page
                        ? "flex h-9 min-w-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground"
                        : "flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    }
                    aria-current={n === page ? "page" : undefined}
                  >
                    {n}
                  </Link>
                </li>
              ))}
            </ul>
            {next ? (
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link href={`/blog?page=${next}`} rel="next">
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="gap-1" disabled>
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </nav>
      ) : null}

      <div className="relative mt-12 rounded-2xl border border-border/80 bg-gradient-to-br from-card/95 via-card/90 to-primary/5 p-6 sm:p-8">
        <p className="text-sm font-semibold text-foreground">¿Listo para aplicar esto en tus fichas?</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Prueba {APP_NAME}: boost multicanal, scan SEO de URL y hashtags listos, con {ENGINE_NAME} manteniendo tono y
          reglas por canal.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/register">Crear cuenta gratis</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/producto">Ver producto</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
