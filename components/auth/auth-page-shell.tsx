import type { ReactNode } from "react";
import { BrandLogoLink } from "@/components/brand/brand-logo-link";

/** Contenedor común login/registro: scroll cómodo, aire inferior y fondo suave. */
export function AuthPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-[100dvh] w-full flex-1 bg-gradient-to-b from-primary/[0.06] via-background to-muted/30 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="mx-auto w-full max-w-[min(100%,26rem)] px-4 py-6 sm:max-w-md sm:px-5 sm:py-10 lg:max-w-lg">
        <header className="mb-5 text-center sm:mb-8">
          <div className="mb-6 flex justify-center sm:mb-8">
            <BrandLogoLink variant="auth" />
          </div>
          <h1 className="text-balance text-[1.65rem] font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {subtitle ? <div className="mt-2 text-pretty text-sm text-muted-foreground sm:text-base">{subtitle}</div> : null}
        </header>
        {children}
      </div>
    </div>
  );
}
