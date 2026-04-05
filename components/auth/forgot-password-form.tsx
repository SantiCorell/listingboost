"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/password";
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
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar enlace"}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useFormState(requestPasswordReset, null as { ok: boolean; message: string } | null);

  return (
    <Card className="mx-auto w-full max-w-md rounded-2xl border-border/70 bg-card/95 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg">Olvidé mi contraseña</CardTitle>
        <p className="text-sm text-muted-foreground">
          Te enviaremos un enlace para crear una nueva contraseña (solo cuentas registradas con email y contraseña).
        </p>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fp-email">Email</Label>
            <Input
              id="fp-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@email.com"
            />
          </div>
          {state?.message ? (
            <p
              role="status"
              className={
                state.ok
                  ? "rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-sm text-foreground"
                  : "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              }
            >
              {state.message}
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
