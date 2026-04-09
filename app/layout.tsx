import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { APP_NAME, ENGINE_NAME } from "@/lib/constants";
import { getPublicSiteUrl } from "@/lib/site-url";
import AppShell from "./app-shell";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const siteUrl = getPublicSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${APP_NAME} — Herramienta SEO SaaS: posicionamiento en Google, auditoría web e IA`,
    template: `%s · ${APP_NAME}`,
  },
  description: `${APP_NAME}: software SEO online y suite SaaS con ${ENGINE_NAME}. Revisión de páginas, análisis SEO, posicionamiento en Google con IA, brechas frente a competidores y catálogo multicanal. Plan Free.`,
  applicationName: APP_NAME,
  authors: [{ name: APP_NAME, url: siteUrl }],
  creator: APP_NAME,
  publisher: APP_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  manifest: "/manifest.webmanifest",
  keywords: [
    "ListingBoost",
    "ListingBrain",
    "herramienta SEO",
    "mejor herramienta SEO",
    "herramienta SEO España",
    "SEO tool",
    "SaaS SEO",
    "software SEO online",
    "suite SEO ecommerce",
    "posicionamiento Google",
    "auditoría SEO página",
    "análisis SEO web",
    "palabras clave Google",
    "análisis competidores Google",
    "seguimiento posiciones SEO",
    "SEO on-page URL",
    "listing intelligence",
    "optimizar ficha marketplace",
    "IA SEO",
    "Shopify SEO producto",
    "eBay optimización anuncio",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: APP_NAME,
    title: `${APP_NAME} — Herramienta SEO SaaS, Google e IA`,
    description:
      "Revisa tu web, analiza el SEO y mejora el posicionamiento en Google con IA. Auditoría, competencia y catálogo en un flujo.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | SEO tool SaaS — Google, auditoría e IA`,
    description:
      "Suite SEO online: páginas, búsqueda, posiciones y textos con IA. Plan Free.",
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
