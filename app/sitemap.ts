import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";
import { BLOG_POSTS } from "@/lib/blog/registry";
import {
  GROWTH_STATIC_ROUTES,
  SEO_CATEGORIAS,
  VENDER_WALLAPOP_PRODUCTOS,
} from "@/lib/seo/growth-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicSiteUrl();
  const paths: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
  }[] = [
      { path: "", priority: 1, changeFrequency: "weekly" },
      { path: "/blog", priority: 0.82, changeFrequency: "weekly" },
      ...BLOG_POSTS.map((p) => ({
        path: `/blog/${p.slug}` as const,
        priority: 0.72,
        changeFrequency: "monthly" as const,
      })),
      ...GROWTH_STATIC_ROUTES.map((path) => ({
        path,
        priority: 0.88,
        changeFrequency: "weekly" as const,
      })),
      ...SEO_CATEGORIAS.flatMap((categoria) => [
        { path: `/titulo-seo/${categoria}`, priority: 0.76, changeFrequency: "monthly" as const },
        { path: `/descripcion-producto/${categoria}`, priority: 0.76, changeFrequency: "monthly" as const },
      ]),
      ...VENDER_WALLAPOP_PRODUCTOS.map((producto) => ({
        path: `/vender-${producto}-wallapop`,
        priority: 0.78,
        changeFrequency: "monthly" as const,
      })),
      { path: "/producto", priority: 0.95, changeFrequency: "weekly" },
      { path: "/producto/boost-de-ficha", priority: 0.9, changeFrequency: "weekly" },
      { path: "/producto/scan-seo-url", priority: 0.9, changeFrequency: "weekly" },
      { path: "/producto/seo-engine", priority: 0.9, changeFrequency: "weekly" },
      { path: "/producto/hashtags-redes", priority: 0.9, changeFrequency: "weekly" },
      { path: "/producto/inmobiliarias", priority: 0.88, changeFrequency: "weekly" },
      { path: "/pricing", priority: 0.85, changeFrequency: "monthly" },
      { path: "/contacto", priority: 0.7, changeFrequency: "monthly" },
      { path: "/login", priority: 0.5, changeFrequency: "monthly" },
      { path: "/register", priority: 0.75, changeFrequency: "monthly" },
      { path: "/terminos", priority: 0.35, changeFrequency: "yearly" },
      { path: "/privacidad", priority: 0.35, changeFrequency: "yearly" },
      { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
    ];

  return paths.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
