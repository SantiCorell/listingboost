"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPasswordWithToken } from "@/actions/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar contraseña"}
    </Button>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [state, action] = useFormState(resetPasswordWithToken, null as { ok: boolean; error?: string } | null);

  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => {
        router.replace("/login?reset=1");
      }, 800);
      return () => clearTimeout(t);
    }
  }, [state?.ok, router]);

  if (!token) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Falta el token del enlace. Solicita un correo nuevo.</p>
          <Button asChild className="mt-4 w-full" variant="outline">
            <Link href="/forgot-password">Solicitar enlace</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-2xl border-border/70 bg-card/95 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg">Nueva contraseña</CardTitle>
        <p className="text-sm text-muted-foreground">Elige una contraseña segura (mínimo 8 caracteres).</p>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="token" value={token} />
          <div className="space-y-2">
            <Label htmlFor="rp-new">Nueva contraseña</Label>
            <Input
              id="rp-new"
              name="password"
              type="password"
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rp-confirm">Repetir contraseña</Label>
            <Input
              id="rp-confirm"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
            />
          </div>
          {state?.ok ? (
            <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-900 dark:text-emerald-100">
              Contraseña actualizada. Redirigiendo al inicio de sesión…
            </p>
          ) : null}
          {state?.error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}
          <Submit />
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-primary hover:underline">
              Volver a iniciar sesión
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
