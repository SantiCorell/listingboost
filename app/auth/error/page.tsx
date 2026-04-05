"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrandLogoLink } from "@/components/brand/brand-logo-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicContactEmail } from "@/lib/contact";

const MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "Ya existe una cuenta con este correo registrada con contraseña. Inicia sesión con email y contraseña, o contacta a soporte si necesitas vincular Google.",
  Configuration:
    "Algo falló al conectar con el servicio de inicio de sesión. Suele ser un fallo temporal.",
  AccessDenied: "Acceso denegado. No se completó la autorización con Google.",
  Callback: "Error en el retorno desde Google. Vuelve a intentarlo en unos minutos.",
  OAuthSignin: "No se pudo iniciar el flujo con Google. Prueba de nuevo en unos minutos.",
  OAuthCallback: "Google devolvió un error al validar la sesión. Prueba de nuevo.",
  Default: "No se pudo completar el inicio de sesión.",
};

const SUPPORT_EMAIL = getPublicContactEmail();

/** Solo en entorno local: diagnóstico para quien despliega (no exponer a clientes). */
function ConfigurationDevHints() {
  return (
    <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
      <li>
        Mira la terminal donde corre <code className="rounded bg-muted px-1 py-0.5 text-xs">npm run dev</code>: ahí
        suele aparecer el error real (p. ej. Prisma no conecta a PostgreSQL).
      </li>
      <li>
        Si en la terminal aparece{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">Can&apos;t reach database server</code> / P1001
        (Supabase): tu red suele no tener IPv6 para la URL directa{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">db.*.supabase.co:5432</code>. En Supabase →{" "}
        <strong>Connect</strong> → <strong>Session pooler</strong>, copia la URI completa y sustituye{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">DATABASE_URL</code>. Prueba{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">npm run db:check</code> hasta que diga OK.
      </li>
      <li>
        Con base alcanzable: <code className="rounded bg-muted px-1 py-0.5 text-xs">npm run db:push</code> si faltan
        tablas.
      </li>
      <li>
        La URL base de la app debe coincidir con la del navegador (mismo host y puerto:{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">localhost</code> no es lo mismo que{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">127.0.0.1</code>).
      </li>
      <li>
        En la consola del proveedor OAuth, la URI de redirección debe coincidir con la ruta de callback de esta
        aplicación en tu dominio público.
      </li>
    </ul>
  );
}

function AuthErrorContent() {
  const params = useSearchParams();
  const code = params.get("error") ?? "Default";
  const isDev = process.env.NODE_ENV === "development";
  const message = MESSAGES[code] ?? MESSAGES.Default;
  const showDevHints = code === "Configuration" && isDev;

  return (
    <Card className="mx-auto w-full max-w-md border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle>No pudimos iniciar sesión</CardTitle>
        <CardDescription>
          {code === "Configuration" && !isDev ? (
            <>
              {message} Si continúa, escríbenos a{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-primary underline-offset-4 hover:underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </>
          ) : (
            message
          )}
        </CardDescription>
        {showDevHints ? <ConfigurationDevHints /> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="flex-1">
          <Link href="/login">Volver al inicio de sesión</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link href="/register">Crear cuenta</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center px-4 py-16">
      <div className="mb-8 flex justify-center">
        <BrandLogoLink variant="header" className="flex-col items-center gap-2" />
      </div>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando…</p>}>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
