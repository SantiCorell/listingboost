export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string;
  updatedAt?: string;
  author: string;
  /** HTML semántico (contenido editorial fijo). */
  contentHtml: string;
  /**
   * URL canónica pública sin prefijo /blog (ej. /mejores-herramientas-seo-2026).
   * Sitemap y metadata usan esta ruta; rewrite sirve el artículo desde /blog/[slug].
   */
  canonicalPath?: string;
  /** FAQs visibles + JSON-LD FAQPage */
  faqItems?: BlogFaqItem[];
};

export function estimateWordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingMinutes(wordCount: number): number {
  return Math.max(5, Math.round(wordCount / 200));
}
