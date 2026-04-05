"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import { changePassword } from "@/actions/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actualizar contraseña"}
    </Button>
  );
}

export function ChangePasswordForm() {
  const { update: refreshSession } = useSession();
  const [state, action] = useFormState(changePassword, null as { ok: boolean; error?: string } | null);

  useEffect(() => {
    if (state?.ok) {
      void refreshSession();
    }
  }, [state?.ok, refreshSession]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cp-current">Contraseña actual</Label>
        <Input
          id="cp-current"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cp-new">Nueva contraseña</Label>
        <Input
          id="cp-new"
          name="newPassword"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="cp-confirm">Repetir nueva contraseña</Label>
        <Input
          id="cp-confirm"
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
          Contraseña actualizada correctamente.
        </p>
      ) : null}
      {state?.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Submit />
    </form>
  );
}
