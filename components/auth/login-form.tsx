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

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type Form = z.infer<typeof schema>;

type Props = {
  googleAuthAvailable: boolean;
};

export function LoginForm({ googleAuthAvailable }: Props) {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
  const justRegistered = params.get("registered") === "1";
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    window.location.href = callbackUrl;
  }

  return (
    <Card className="mx-auto w-full overflow-visible rounded-2xl border-border/70 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur-sm">
      <CardHeader className="space-y-1 px-4 pb-3 pt-5 text-center sm:px-6 sm:pb-4 sm:pt-6 sm:text-left">
        <CardTitle className="text-lg font-semibold sm:text-xl">Entra a tu cuenta</CardTitle>
        <p className="text-sm text-muted-foreground">
          {googleAuthAvailable
            ? "Usa Google o tu email. En segundos estás dentro."
            : "Introduce el email y la contraseña de tu cuenta."}
        </p>
      </CardHeader>
      <CardContent className="space-y-5 px-4 pb-10 sm:px-6 sm:pb-8">
        {justRegistered ? (
          <p className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2.5 text-center text-sm text-primary">
            Cuenta creada. Entra con email o con Google.
          </p>
        ) : null}

        {googleAuthAvailable ? (
          <div className="space-y-3">
            <GoogleSignInButton mode="signin" callbackUrl={callbackUrl} />
            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              Sin contraseña extra: usas la misma que en Google.
            </p>
            <p className="text-center text-[10px] leading-snug text-muted-foreground/80">
              Error «redirect_uri_mismatch»: en Vercel define{" "}
              <code className="font-mono text-[9px]">AUTH_URL</code> como tu URL pública (sin / al final) y en Google
              Cloud autoriza <code className="font-mono text-[9px]">/api/auth/callback/google</code> para ese dominio
              (ver <code className="font-mono text-[9px]">.env.example</code>).
            </p>
            <AuthOauthDivider label="Separador entre Google y email" />
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90">
              o con email
            </p>
          </div>
        ) : null}

        <form id="login-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" className="h-11" {...form.register("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-11"
              {...form.register("password")}
            />
          </div>
          {err ? <p className="text-sm text-destructive">{err}</p> : null}
          <Button type="submit" className="h-12 w-full text-base font-semibold" size="lg" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Iniciar sesión"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Crear cuenta gratis
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
