import Link from "next/link";
import { APP_NAME, APP_TAGLINE, ENGINE_NAME } from "@/lib/constants";
import { getPublicContactEmail } from "@/lib/contact";
import { Separator } from "@/components/ui/separator";
import { Zap } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const contactEmail = getPublicContactEmail();

  return (
    <footer className="mt-auto border-t border-border/80 bg-gradient-to-b from-muted/40 via-muted/25 to-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Link href="/" className="inline-flex items-center gap-2.5 font-semibold tracking-tight">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary via-primary to-accent shadow-md shadow-primary/20">
                <Zap className="h-[20px] w-[20px] text-primary-foreground" strokeWidth={2.35} />
              </span>
              <span className="text-lg">
                <span className="text-foreground">Listing</span>
                <span className="text-gradient-brand">Boost</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{APP_TAGLINE}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/90">
              {ENGINE_NAME}
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Producto</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/producto" className="transition-colors hover:text-foreground">
                  Centro de producto
                </Link>
              </li>
              <li>
                <Link href="/producto/boost-de-ficha" className="transition-colors hover:text-foreground">
                  Boost de ficha
                </Link>
              </li>
              <li>
                <Link href="/producto/scan-seo-url" className="transition-colors hover:text-foreground">
                  Scan SEO de URL
                </Link>
              </li>
              <li>
                <Link href="/producto/hashtags-redes" className="transition-colors hover:text-foreground">
                  Hashtags redes
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="transition-colors hover:text-foreground">
                  Planes y precios
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="transition-colors hover:text-foreground">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="transition-colors hover:text-foreground">
                  FAQ general (home)
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/terminos" className="transition-colors hover:text-foreground">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="transition-colors hover:text-foreground">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="transition-colors hover:text-foreground">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Plataforma</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-foreground">
                  Panel
                </Link>
              </li>
              <li>
                <Link href="/dashboard/product" className="transition-colors hover:text-foreground">
                  Boost de ficha
                </Link>
              </li>
              <li>
                <Link href="/dashboard/audit" className="transition-colors hover:text-foreground">
                  Scan URL
                </Link>
              </li>
              <li>
                <Link href="/settings" className="transition-colors hover:text-foreground">
                  Ajustes de cuenta
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Contacto</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              ¿Equipo o alto volumen? Hablamos de Enterprise, API y condiciones a medida.
            </p>
            <a
              href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Consulta ${APP_NAME}`)}`}
              className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="transition-colors hover:text-foreground">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition-colors hover:text-foreground">
                  Crear cuenta gratis
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-border/60" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground sm:text-sm">
            © {year} {APP_NAME}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Hecho para vendedores y equipos de ecommerce</span>
            <Link href="/pricing" className="transition-colors hover:text-foreground">
              Ver planes
            </Link>
            <Link href="/#faq" className="transition-colors hover:text-foreground">
              FAQ
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
