import type { ReactNode } from "react";

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
    <div className="relative w-full flex-1 bg-gradient-to-b from-primary/[0.06] via-background to-muted/30">
      <div className="mx-auto w-full max-w-[min(100%,28rem)] px-4 py-8 sm:max-w-md sm:py-10 lg:max-w-lg">
        <header className="mb-6 text-center sm:mb-8">
          <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          {subtitle ? <div className="mt-2 text-sm text-muted-foreground">{subtitle}</div> : null}
        </header>
        {children}
      </div>
    </div>
  );
}
