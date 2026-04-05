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
};

export function estimateWordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingMinutes(wordCount: number): number {
  return Math.max(5, Math.round(wordCount / 200));
}
