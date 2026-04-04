import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { isGoogleAuthConfigured } from "@/lib/auth/google-available";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const googleAuthAvailable = isGoogleAuthConfigured();
  return (
    <AuthPageShell
      title="Iniciar sesión"
      subtitle={
        <>
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
            Crear cuenta gratis
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Cargando…</div>}>
        <LoginForm googleAuthAvailable={googleAuthAvailable} />
      </Suspense>
    </AuthPageShell>
  );
}
