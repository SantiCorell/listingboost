"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Building2, ChevronDown, User, Users } from "lucide-react";
import { AuthOauthDivider } from "@/components/auth/auth-oauth-divider";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { cn } from "@/lib/utils";

const accountOptions = [
  {
    value: "EMPRESA" as const,
    label: "Empresa",
    hint: "SL, equipo",
    icon: Building2,
  },
  {
    value: "AUTONOMO" as const,
    label: "Autónomo",
    hint: "Freelance",
    icon: User,
  },
  {
    value: "PARTICULAR" as const,
    label: "Particular",
    hint: "Personal",
    icon: Users,
  },
];

const schema = z
  .object({
    accountKind: z.enum(["EMPRESA", "AUTONOMO", "PARTICULAR"], {
      required_error: "Elige un tipo de cuenta",
    }),
    name: z.string().min(2, "Indica al menos 2 caracteres").max(80),
    email: z.string().email("Email no válido"),
    companyName: z.string().max(120).optional(),
    phone: z.string().max(40).optional(),
    password: z.string().min(8, "Mínimo 8 caracteres").max(128),
    confirmPassword: z.string().min(8),
    termsAccepted: z.boolean().refine((v) => v === true, {
      message: "Debes aceptar los términos y la política de privacidad",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type Form = z.infer<typeof schema>;

type Props = {
  googleAuthAvailable: boolean;
  variant?: "page" | "modal";
  onSwitchToLogin?: () => void;
  /** Tras registro OK en modal: cambiar a pestaña login. */
  onRegistered?: () => void;
};

export function RegisterForm({
  googleAuthAvailable,
  variant = "page",
  onSwitchToLogin,
  onRegistered,
}: Props) {
  const router = useRouter();
  const isModal = variant === "modal";
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountKind: undefined,
      name: "",
      email: "",
      companyName: "",
      phone: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: Form) {
    setErr(null);
    setLoading(true);
    const fd = new FormData();
    fd.set("accountKind", values.accountKind);
    fd.set("name", values.name.trim());
    fd.set("email", values.email.trim());
    fd.set("password", values.password);
    fd.set("confirmPassword", values.confirmPassword);
    fd.set("companyName", values.companyName?.trim() ?? "");
    fd.set("phone", values.phone?.trim() ?? "");
    fd.set("termsAccepted", values.termsAccepted ? "true" : "false");
    const res = await registerUser(null, fd);
    setLoading(false);
    if (!res.ok) {
      setErr(res.error ?? "Error al registrar");
      return;
    }
    if (isModal && onRegistered) {
      onRegistered();
      return;
    }
    router.push("/login?registered=1");
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
          "space-y-1 text-center sm:text-left",
          isModal ? "px-0 pb-2 pt-0" : "px-4 pb-3 pt-5 sm:px-6 sm:pb-4 sm:pt-6",
        )}
      >
        <CardTitle className={cn("font-semibold", isModal ? "text-base" : "text-lg sm:text-xl")}>
          Elige cómo entrar
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {googleAuthAvailable
            ? "La mayoría usa Google en un clic. O completa el formulario con email."
            : "Completa el formulario. En menos de un minuto tienes cuenta."}
        </p>
      </CardHeader>
      <CardContent
        className={cn(
          "space-y-4 sm:space-y-5",
          isModal ? "px-0 pb-4" : "space-y-5 px-4 pb-28 sm:space-y-6 sm:px-6 sm:pb-8",
        )}
      >
        {googleAuthAvailable ? (
          <div className="space-y-3">
            <GoogleSignInButton mode="signup" callbackUrl="/dashboard" />
            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              Cuenta Google personal o Workspace. Al continuar aceptas los{" "}
              <Link href="/terminos" className="underline-offset-2 hover:underline">
                términos
              </Link>{" "}
              y la{" "}
              <Link href="/privacidad" className="underline-offset-2 hover:underline">
                privacidad
              </Link>
              .
            </p>
            <AuthOauthDivider label="Separador entre Google y email" />
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90">
              o con email
            </p>
          </div>
        ) : null}

        <form id="register-form" className="space-y-4 sm:space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de cuenta</Label>
            <Controller
              control={form.control}
              name="accountKind"
              render={({ field }) => (
                <div
                  className="flex gap-2 sm:gap-3"
                  role="radiogroup"
                  aria-label="Tipo de cuenta"
                >
                  {accountOptions.map(({ value, label, hint, icon: Icon }) => {
                    const selected = field.value === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => field.onChange(value)}
                        className={cn(
                          "flex min-h-[4.25rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl border-2 px-1.5 py-2 text-center transition-all sm:min-h-[4.5rem] sm:px-2",
                          selected
                            ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/15"
                            : "border-border/80 bg-background hover:border-primary/30 hover:bg-muted/40",
                        )}
                      >
                        <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", selected ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-xs font-semibold leading-tight sm:text-sm">{label}</span>
                        <span className="text-[10px] leading-tight text-muted-foreground sm:text-[11px]">{hint}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {form.formState.errors.accountKind ? (
              <p className="text-sm text-destructive">{form.formState.errors.accountKind.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre y apellidos</Label>
              <Input
              id="name"
              autoComplete="name"
              className="h-12 min-h-[48px] text-base sm:h-11 sm:text-sm"
              {...form.register("name")}
            />
              {form.formState.errors.name ? (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              className="h-12 min-h-[48px] text-base sm:h-11 sm:text-sm"
              {...form.register("email")}
            />
              {form.formState.errors.email ? (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>
          </div>

          <details className="group rounded-xl border border-border/60 bg-muted/15 open:bg-muted/25">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
              <span>Empresa y teléfono (opcional)</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="space-y-3 border-t border-border/50 px-3 pb-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Empresa o nombre comercial</Label>
                <Input
                  id="companyName"
                  autoComplete="organization"
                  placeholder="Ej. Mi tienda SL"
                  className="h-12 min-h-[48px] text-base sm:h-11 sm:text-sm"
                  {...form.register("companyName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+34 …"
                  className="h-12 min-h-[48px] text-base sm:h-11 sm:text-sm"
                  {...form.register("phone")}
                />
              </div>
            </div>
          </details>

          <div className="grid gap-4 sm:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                className="h-12 min-h-[48px] text-base sm:h-11 sm:text-sm"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="h-12 min-h-[48px] text-base sm:h-11 sm:text-sm"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword ? (
                <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
            <Controller
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={(c) => field.onChange(c === true)}
                  className="mt-0.5"
                />
              )}
            />
            <label htmlFor="terms" className="cursor-pointer text-sm leading-snug">
              Acepto los{" "}
              <Link href="/terminos" className="font-medium text-primary underline-offset-4 hover:underline">
                términos de uso
              </Link>{" "}
              y la{" "}
              <Link href="/privacidad" className="font-medium text-primary underline-offset-4 hover:underline">
                política de privacidad
              </Link>
              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                Necesario para crear la cuenta (RGPD).
              </span>
            </label>
          </div>
          {form.formState.errors.termsAccepted ? (
            <p className="text-sm text-destructive">{form.formState.errors.termsAccepted.message}</p>
          ) : null}

          {err ? <p className="text-sm text-destructive">{err}</p> : null}

          <Button
            type="submit"
            className={cn("h-12 w-full text-base font-semibold", !isModal && "hidden sm:flex")}
            size="lg"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Crear cuenta"}
          </Button>

          {!isModal ? (
            <p className="hidden text-center text-sm text-muted-foreground sm:block">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Iniciar sesión
              </Link>
            </p>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                className="font-semibold text-primary underline-offset-4 hover:underline"
                onClick={() => onSwitchToLogin?.()}
              >
                Iniciar sesión
              </button>
            </p>
          )}
        </form>
      </CardContent>

      {!isModal ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:hidden"
          role="presentation"
        >
          <Button
            type="submit"
            form="register-form"
            className="h-12 w-full min-h-[48px] text-base font-semibold shadow-md"
            size="lg"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Crear cuenta"}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            <Link href="/login" className="font-medium text-primary hover:underline">
              ¿Ya tienes cuenta? Iniciar sesión
            </Link>
          </p>
        </div>
      ) : null}
    </Card>
  );
}
