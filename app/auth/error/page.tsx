"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "Ya existe una cuenta con este correo registrada con contraseña. Inicia sesión con email y contraseña, o contacta a soporte si necesitas vincular Google.",
  Configuration:
    "Auth.js muestra «Configuration» cuando algo falla en el servidor (no solo cuando faltan variables). Lo más habitual aquí es la base de datos o la URL de la app.",
  AccessDenied: "Acceso denegado. No se completó la autorización con Google.",
  Callback: "Error en el retorno desde Google. Vuelve a intentarlo en unos minutos.",
  OAuthSignin: "No se pudo iniciar el flujo con Google. Comprueba la configuración del cliente OAuth.",
  OAuthCallback: "Google devolvió un error al validar la sesión. Prueba de nuevo.",
  Default: "No se pudo completar el inicio de sesión.",
};

function ConfigurationHints() {
  return (
    <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted-foreground">
      <li>
        Mira la terminal donde corre <code className="rounded bg-muted px-1 py-0.5 text-xs">npm run dev</code>: ahí
        suele aparecer el error real (p. ej. Prisma no conecta a PostgreSQL).
      </li>
      <li>
        Si en la terminal aparece{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">Can&apos;t reach database server</code> / P1001
        (Supabase): tu red
        suele no tener IPv6 para la URL directa{" "}
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
        <code className="rounded bg-muted px-1 py-0.5 text-xs">AUTH_URL</code> debe coincidir con la URL del navegador
        (mismo host y puerto que uses: <code className="rounded bg-muted px-1 py-0.5 text-xs">localhost</code> no es lo
        mismo que <code className="rounded bg-muted px-1 py-0.5 text-xs">127.0.0.1</code> ni tu IP en LAN).
      </li>
      <li>
        En Google Cloud, la URI de redirección autorizada debe ser exactamente{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">{"{AUTH_URL}/api/auth/callback/google"}</code>.
      </li>
      <li>
        Si falta Google: <code className="rounded bg-muted px-1 py-0.5 text-xs">AUTH_GOOGLE_ID</code> y{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">AUTH_GOOGLE_SECRET</code> en{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code>, y un{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">AUTH_SECRET</code> estable en producción.
      </li>
    </ul>
  );
}

function AuthErrorContent() {
  const params = useSearchParams();
  const code = params.get("error") ?? "Default";
  const message = MESSAGES[code] ?? MESSAGES.Default;

  return (
    <Card className="mx-auto w-full max-w-md border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle>No pudimos iniciar sesión</CardTitle>
        <CardDescription>{message}</CardDescription>
        {code === "Configuration" ? <ConfigurationHints /> : null}
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
      <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando…</p>}>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
