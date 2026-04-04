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
 * Sin `await auth()` aquí: la sesión la resuelve el cliente (`useSession` → /api/auth/session).
 * Así el HTML de la página (LCP en home) no espera a Prisma/Auth en el servidor — mejora Lighthouse.
 * Rutas protegidas siguen validando con `auth()` en sus propias páginas o middleware.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const googleAuthAvailable = isGoogleAuthConfigured();

  return (
    <>
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      <AppProviders session={null}>
        <NavigationStyleReset />
        <RouteStyleGuard />
        <div className="flex min-h-screen flex-col">
          <SiteHeader googleAuthAvailable={googleAuthAvailable} />
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          <SiteFooter />
        </div>
      </AppProviders>
    </>
  );
}
