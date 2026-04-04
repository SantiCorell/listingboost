import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { APP_NAME, APP_TAGLINE, ENGINE_NAME } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site-url";
import AppShell from "./app-shell";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = getPublicSiteUrl();

const ogImage = {
  url: "/logo.png",
  width: 512,
  height: 512,
  alt: `${APP_NAME} — listing intelligence, motor ListingBrain™`,
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${APP_NAME} · Listings + URL inteligencia · Wallapop, eBay, Shopify`,
    template: `%s · ${APP_NAME}`,
  },
  description: `${APP_TAGLINE} ${APP_NAME} unifica boost de ficha multicanal y scan SEO de URL con ${ENGINE_NAME}. Empieza gratis.`,
  applicationName: APP_NAME,
  authors: [{ name: APP_NAME, url: siteUrl }],
  creator: APP_NAME,
  publisher: APP_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  manifest: "/manifest.webmanifest",
  keywords: [
    "ListingBoost",
    "ListingBrain",
    "SaaS listings",
    "optimizador marketplace",
    "SEO Wallapop",
    "SEO eBay",
    "Shopify producto",
    "auditoría URL",
    "listing intelligence",
    "CTR listing",
    "JSON-LD producto",
    "hashtags Instagram",
    "ficha marketplace IA",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: APP_NAME,
    title: `${APP_NAME} — infra de listings para equipos que escalan catálogo`,
    description:
      "Pipeline propietario: boost de ficha + scan URL en segundos. Diseñado para vendedores, agencias y marcas D2C.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ship faster, rank smarter`,
    description:
      "Stack moderno para generar fichas y auditar URLs sin fricción. Free tier real; escala a Pro cuando el volumen lo pida.",
    images: [ogImage.url],
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png", sizes: "any" }],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf5ff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1033" },
  ],
};

/** Layout raíz síncrono: evita condiciones de carrera con CSS global en transiciones. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen bg-background font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Si Tailwind falla, este nodo deja de ser display:none → el guard recarga la página */}
        <div id="__lb_css_probe" className="hidden" aria-hidden />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
