import Link from "next/link";
import { APP_NAME, APP_TAGLINE, ENGINE_NAME } from "@/lib/constants";
import { BrandLogoLink } from "@/components/brand/brand-logo-link";
import { CookieSettingsLink } from "@/components/legal/cookie-settings-link";
import { getPublicContactEmail } from "@/lib/contact";
import { Separator } from "@/components/ui/separator";

function detailsSummaryClass() {
  return "flex w-full cursor-pointer list-none items-center justify-between gap-2 py-4 text-left text-sm font-semibold text-foreground outline-none [&::-webkit-details-marker]:hidden";
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const contactEmail = getPublicContactEmail();

  const productLinks = (
    <ul className="space-y-3 pb-2 text-sm text-muted-foreground">
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
        <Link href="/producto/seo-engine" className="transition-colors hover:text-foreground">
          SEO Engine (guía)
        </Link>
      </li>
      <li>
        <Link href="/seo-wallapop" className="transition-colors hover:text-foreground">
          Guías SEO marketplaces (Wallapop, eBay…)
        </Link>
      </li>
      <li>
        <Link href="/producto/hashtags-redes" className="transition-colors hover:text-foreground">
          Hashtags redes
        </Link>
      </li>
      <li>
        <Link href="/producto/inmobiliarias" className="transition-colors hover:text-foreground">
          Inmobiliarias
        </Link>
      </li>
      <li>
        <Link href="/pricing" className="transition-colors hover:text-foreground">
          Planes y precios
        </Link>
      </li>
      <li>
        <Link href="/blog" className="transition-colors hover:text-foreground">
          Blog SEO
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
  );

  const legalLinks = (
    <ul className="space-y-3 pb-2 text-sm text-muted-foreground">
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
          Política de cookies
        </Link>
      </li>
      <li>
        <CookieSettingsLink className="block w-full text-left transition-colors hover:text-foreground" />
      </li>
    </ul>
  );

  const platformLinks = (
    <ul className="space-y-3 pb-2 text-sm text-muted-foreground">
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
        <Link href="/dashboard/seo-engine" className="transition-colors hover:text-foreground">
          SEO Engine
        </Link>
      </li>
      <li>
        <Link href="/settings" className="transition-colors hover:text-foreground">
          Ajustes de cuenta
        </Link>
      </li>
    </ul>
  );

  return (
    <footer className="mt-auto border-t border-border/80 bg-gradient-to-b from-muted/40 via-muted/25 to-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <BrandLogoLink variant="footer" className="inline-flex" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{APP_TAGLINE}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/90">
              {ENGINE_NAME}
            </p>
          </div>

          <div className="col-span-full divide-y divide-border/70 rounded-xl border border-border/60 bg-muted/20 lg:hidden">
            <details className="group/ft px-4">
              <summary className={detailsSummaryClass()}>
                Producto
                <span className="text-muted-foreground transition-transform duration-200 group-open/ft:rotate-180">▼</span>
              </summary>
              <div>
                <p className="pb-2 text-[11px] text-muted-foreground">Guías públicas por módulo</p>
                {productLinks}
              </div>
            </details>
            <details className="group/ft2 px-4">
              <summary className={detailsSummaryClass()}>
                Legal
                <span className="text-muted-foreground transition-transform duration-200 group-open/ft2:rotate-180">▼</span>
              </summary>
              {legalLinks}
            </details>
            <details className="group/ft3 px-4">
              <summary className={detailsSummaryClass()}>
                Plataforma
                <span className="text-muted-foreground transition-transform duration-200 group-open/ft3:rotate-180">▼</span>
              </summary>
              <div>
                <p className="pb-2 text-[11px] text-muted-foreground">Accesos al panel (requiere cuenta)</p>
                {platformLinks}
              </div>
            </details>
            <details className="group/ft4 px-4">
              <summary className={detailsSummaryClass()}>
                Contacto
                <span className="text-muted-foreground transition-transform duration-200 group-open/ft4:rotate-180">▼</span>
              </summary>
              <div className="pb-4 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  ¿Equipo o alto volumen? Hablamos de Enterprise, API y condiciones a medida.
                </p>
                <a
                  href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Consulta ${APP_NAME}`)}`}
                  className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline"
                >
                  {contactEmail}
                </a>
                <ul className="mt-4 space-y-3">
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
            </details>
          </div>

          <div className="hidden lg:col-span-2 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Producto</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Guías públicas por módulo</p>
            <div className="mt-4">{productLinks}</div>
          </div>

          <div className="hidden lg:col-span-2 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal</p>
            <div className="mt-4">{legalLinks}</div>
          </div>

          <div className="hidden lg:col-span-2 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Plataforma</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Accesos al panel (requiere cuenta)</p>
            <div className="mt-4">{platformLinks}</div>
          </div>

          <div className="hidden lg:col-span-3 lg:block">
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
            <CookieSettingsLink className="text-muted-foreground transition-colors hover:text-foreground" />
          </div>
        </div>
      </div>
    </footer>
  );
}
