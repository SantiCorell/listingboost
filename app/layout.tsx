import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${APP_NAME} — Optimiza fichas con IA | Wallapop, eBay, Shopify | SEO y hashtags`,
    template: `%s · ${APP_NAME}`,
  },
  description: `${APP_NAME}: software de listing intelligence con ${ENGINE_NAME}. Mejora títulos, descripciones y hashtags para Wallapop, eBay, Shopify y más; audita URLs con scoring accionable. Empieza gratis.`,
  applicationName: APP_NAME,
  authors: [{ name: APP_NAME, url: siteUrl }],
  creator: APP_NAME,
  publisher: APP_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  manifest: "/manifest.webmanifest",
  keywords: [
    "ListingBoost",
    "ListingBrain",
    "optimizar ficha Wallapop",
    "descripción producto IA",
    "SEO marketplace España",
    "hashtags Instagram ventas",
    "auditoría SEO URL",
    "boost ficha multicanal",
    "eBay listing optimización",
    "Shopify descripción producto",
    "SaaS listings",
    "listing intelligence",
    "CTR listing",
    "JSON-LD producto",
    "ficha marketplace IA",
    "TikTok hashtags producto",
    "copiar pegar marketplace",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: APP_NAME,
    title: `${APP_NAME} — Fichas que rankean con IA | marketplaces y SEO on-page`,
    description:
      "Genera y optimiza fichas con motor propietario: hashtags, estructura por canal y scan SEO de URLs. Prueba gratis; escala a Pro.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | IA para listings y SEO de URL`,
    description:
      "Boost multicanal + hashtags listos + auditoría URL. Pensado para vendedores y equipos de catálogo.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "180x180" }],
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
