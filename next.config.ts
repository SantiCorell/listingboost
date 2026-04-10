import type { NextConfig } from "next";

/** Si `next dev` va con Turbopack, no definir `webpack` evita el warning de Next. */
const isTurbopackDev = process.argv.some((a) => a === "--turbopack" || a === "--turbo");

const BLOG_CANONICAL_REWRITES = [
  "mejores-herramientas-seo-2026",
  "alternativas-a-semrush",
  "como-posicionar-web-google",
  "seo-para-ia",
  "como-aparecer-en-chatgpt",
  "seo-ecommerce",
  "herramientas-seo-ia",
  "auditoria-seo",
  "por-que-mi-web-no-posiciona",
  "aumentar-trafico-web",
] as const;

const nextConfig: NextConfig = {
  async rewrites() {
    return BLOG_CANONICAL_REWRITES.map((slug) => ({
      source: `/${slug}`,
      destination: `/blog/${slug}`,
    }));
  },
  async redirects() {
    return [
      {
        source: "/alternativa-semrush-ahrefs",
        destination: "/seo-operativo-ecommerce",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io", pathname: "/**" },
      { protocol: "https", hostname: "*.uploadthing.com", pathname: "/**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-accordion", "@radix-ui/react-dialog"],
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  ...(isTurbopackDev
    ? {}
    : {
        /**
         * Solo con `next dev` (webpack). En macOS la caché persistente a veces corrompe `.next`.
         * Con Turbopack este bloque no se aplica → sin warning.
         */
        webpack: (config: { cache?: boolean | object }, { dev }: { dev: boolean }) => {
          if (dev) {
            config.cache = false;
          }
          return config;
        },
      }),
};

export default nextConfig;
