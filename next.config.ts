import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io", pathname: "/**" },
      { protocol: "https", hostname: "*.uploadthing.com", pathname: "/**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  /**
   * En macOS (iCloud, antivirus, carpetas sincronizadas) la caché persistente de webpack
   * en dev a veces falla al renombrar *.pack.gz → ENOENT y deja .next a medias (sin routes-manifest).
   * Desactivar caché en dev evita ese estado corrupto si usas `npm run dev:webpack`.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
