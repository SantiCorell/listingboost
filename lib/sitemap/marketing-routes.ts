import type { MetadataRoute } from "next";
import {
  GROWTH_STATIC_ROUTES,
  SEO_CATEGORIAS,
  VENDER_WALLAPOP_PRODUCTOS,
} from "@/lib/seo/growth-registry";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export type MarketingSitemapSpec = {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
};

function pathKey(path: string): string {
  return path === "" ? "/" : path;
}

/**
 * Rutas públicas indexables para sitemap.xml.
 * No incluir: /dashboard/*, /admin/*, /api/*, páginas con robots index:false
 * (/pricing/credits, /forgot-password, /reset-password, etc.).
 */
function collectRawSpecs(): MarketingSitemapSpec[] {
  return [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.82, changeFrequency: "weekly" },
    ...GROWTH_STATIC_ROUTES.map((path) => ({
      path,
      priority: 0.88,
      changeFrequency: "weekly" as const,
    })),
    ...SEO_CATEGORIAS.flatMap((categoria) => [
      {
        path: `/titulo-seo/${categoria}`,
        priority: 0.76,
        changeFrequency: "monthly" as const,
      },
      {
        path: `/descripcion-producto/${categoria}`,
        priority: 0.76,
        changeFrequency: "monthly" as const,
      },
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
    { path: "/register", priority: 0.75, changeFrequency: "monthly" },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" },
    { path: "/sobre-listingboost", priority: 0.72, changeFrequency: "monthly" },
    { path: "/terminos", priority: 0.35, changeFrequency: "yearly" },
    { path: "/privacidad", priority: 0.35, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
  ];
}

/** Una entrada por path; si hay colisión, gana la mayor prioridad. */
export function getMarketingSitemapSpecs(): MarketingSitemapSpec[] {
  const map = new Map<string, MarketingSitemapSpec>();
  for (const spec of collectRawSpecs()) {
    const key = pathKey(spec.path);
    const prev = map.get(key);
    if (!prev || spec.priority > prev.priority) {
      map.set(key, spec);
    }
  }
  return [...map.values()].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return pathKey(a.path).localeCompare(pathKey(b.path), "es");
  });
}
