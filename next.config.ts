import type { NextConfig } from "next";

/** Si `next dev` va con Turbopack, no definir `webpack` evita el warning de Next. */
const isTurbopackDev = process.argv.some((a) => a === "--turbopack" || a === "--turbo");

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
