import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  const paths: {
    path: string;
    priority: number;
    changeFrequency: "weekly" | "monthly" | "yearly";
  }[] = [
      { path: "", priority: 1, changeFrequency: "weekly" },
      { path: "/producto", priority: 0.95, changeFrequency: "weekly" },
      { path: "/producto/boost-de-ficha", priority: 0.9, changeFrequency: "weekly" },
      { path: "/producto/scan-seo-url", priority: 0.9, changeFrequency: "weekly" },
      { path: "/producto/hashtags-redes", priority: 0.9, changeFrequency: "weekly" },
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
