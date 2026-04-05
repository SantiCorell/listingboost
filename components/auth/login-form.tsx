"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { AuthOauthDivider } from "@/components/auth/auth-oauth-divider";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type Form = z.infer<typeof schema>;

type Props = {
  googleAuthAvailable: boolean;
  /** `modal`: dentro del popup de acceso; `page`: rutas /login. */
  variant?: "page" | "modal";
  /** Si no viene de la query (p. ej. modal), fija el destino tras login. */
  callbackUrl?: string;
  onRequestClose?: () => void;
};

export function LoginForm({
  googleAuthAvailable,
  variant = "page",
  callbackUrl: callbackUrlProp,
  onRequestClose,
}: Props) {
  const params = useSearchParams();
  const callbackUrl = callbackUrlProp ?? params.get("callbackUrl") ?? "/dashboard";
  const justRegistered = params.get("registered") === "1";
  const passwordResetOk = params.get("reset") === "1";
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isModal = variant === "modal";

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: Form) {
    setErr(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setErr("Email o contraseña incorrectos");
      return;
    }
    onRequestClose?.();
    window.location.href = callbackUrl;
  }

  return (
    <Card
      className={cn(
        "mx-auto w-full overflow-visible",
        isModal
          ? "rounded-xl border-0 bg-transparent shadow-none"
          : "rounded-2xl border-border/70 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur-sm",
      )}
    >
      <CardHeader
        className={cn(
          "space-y-1 px-0 pb-2 text-center sm:text-left",
          !isModal && "px-4 pb-3 pt-5 sm:px-6 sm:pb-4 sm:pt-6",
        )}
      >
        <CardTitle className={cn("font-semibold", isModal ? "text-base" : "text-lg sm:text-xl")}>
          Entra a tu cuenta
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {googleAuthAvailable
            ? "Google en un clic o email y contraseña."
            : "Email y contraseña de tu cuenta."}
        </p>
      </CardHeader>
      <CardContent className={cn("space-y-4 px-0", !isModal && "space-y-5 px-4 pb-10 sm:px-6 sm:pb-8")}>
        {justRegistered && !isModal ? (
          <p className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-center text-sm text-primary">
            Cuenta creada. Entra con email o con Google.
          </p>
        ) : null}
        {passwordResetOk && !isModal ? (
          <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-center text-sm text-emerald-900 dark:text-emerald-50">
            Contraseña actualizada. Entra con tu email y la nueva contraseña.
          </p>
        ) : null}

        {googleAuthAvailable ? (
          <div className="space-y-2">
            <GoogleSignInButton mode="signin" callbackUrl={callbackUrl} />
            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              Misma cuenta que en Google.
            </p>
            {!isModal ? (
              <details className="rounded-lg border border-border/50 bg-muted/20 px-2 py-1.5 text-left">
                <summary className="cursor-pointer text-[10px] font-medium text-muted-foreground">
                  ¿Error «redirect_uri_mismatch» con Google?
                </summary>
                <p className="mt-2 text-[10px] leading-snug text-muted-foreground">
                  En Vercel define <code className="font-mono">AUTH_URL</code> como tu URL pública (sin / final). En
                  Google Cloud autoriza <code className="font-mono">/api/auth/callback/google</code> para ese dominio. Ver{" "}
                  <code className="font-mono">.env.example</code>.
                </p>
              </details>
            ) : null}
            <AuthOauthDivider label="Separador entre Google y email" />
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90">
              o con email
            </p>
          </div>
        ) : null}

        <form id="login-form" className="space-y-3 sm:space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              className="h-12 min-h-[48px] text-base sm:h-11 sm:text-sm"
              {...form.register("email")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className="h-12 min-h-[48px] text-base sm:h-11 sm:text-sm"
              {...form.register("password")}
            />
          </div>
          {err ? <p className="text-sm text-destructive">{err}</p> : null}
          <Button type="submit" className="h-12 w-full text-base font-semibold" size="lg" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Iniciar sesión"}
          </Button>
          {!isModal ? (
            <p className="text-center text-sm">
              <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          ) : null}
          {!isModal ? (
            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Crear cuenta gratis
              </Link>
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
