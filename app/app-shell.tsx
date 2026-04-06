import { auth } from "@/auth";
import { isGoogleAuthConfigured } from "@/lib/auth/google-available";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppProviders } from "@/components/providers/app-providers";
import { NavigationStyleReset } from "@/components/providers/navigation-style-reset";
import { RouteStyleGuard } from "@/components/providers/route-style-guard";

/**
 * Hay que pasar la sesión del servidor a `SessionProvider`: si `session={null}`, el header
 * muestra “Iniciar sesión” hasta un refetch que puede fallar o retrasarse (regresión).
 * La sesión JWT vive en cookie; `maxAge` / inactividad se configuran en `auth.config` (p. ej. 15 min).
 */
export default async function AppShell({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    const digest =
      typeof e === "object" && e !== null && "digest" in e ? String((e as { digest?: string }).digest) : "";
    if (digest === "DYNAMIC_SERVER_USAGE") throw e;
    console.error("[AppShell] auth() falló; se renderiza sin sesión.", e);
  }

  const googleAuthAvailable = isGoogleAuthConfigured();

  return (
    <>
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      <AppProviders session={session}>
        <NavigationStyleReset />
        <RouteStyleGuard />
        <div className="flex min-h-screen flex-col">
          <a
            href="#contenido-principal"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Saltar al contenido
          </a>
          <SiteHeader googleAuthAvailable={googleAuthAvailable} />
          <main id="contenido-principal" className="flex min-h-0 flex-1 flex-col" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </div>
      </AppProviders>
    </>
  );
}
