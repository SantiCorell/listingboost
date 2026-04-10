import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog/registry";
import { getPublicSiteUrl } from "@/lib/site-url";
import { getMarketingSitemapSpecs } from "@/lib/sitemap/marketing-routes";

/** Sitemap regenerado con la frecuencia indicada (blog y landings estáticas en código). */
export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicSiteUrl();

  const marketing: MetadataRoute.Sitemap = getMarketingSitemapSpecs().map(
    ({ path, priority, changeFrequency }) => ({
      url: `${base}${path}`,
      changeFrequency,
      priority,
    }),
  );

  const blogPosts: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${base}${p.canonicalPath ?? `/blog/${p.slug}`}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: p.canonicalPath ? 0.78 : 0.72,
  }));

  const merged = [...marketing, ...blogPosts];

  const seen = new Set<string>();
  const deduped: MetadataRoute.Sitemap = [];
  for (const entry of merged) {
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    deduped.push(entry);
  }

  return deduped.sort((a, b) => a.url.localeCompare(b.url, "es"));
}
