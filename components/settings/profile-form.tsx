"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useSession } from "next-auth/react";
import type { AccountKind, AccountProfile, Plan } from "@prisma/client";
import { updateProfile, type UpdateProfileState } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { planLabel } from "@/lib/plans";
import { isCommerceEnabled } from "@/lib/commerce";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ManageBillingButton } from "@/components/settings/manage-billing-button";

const accountKindLabels: Record<AccountKind, string> = {
  EMPRESA: "Empresa",
  AUTONOMO: "Autónomo",
  PARTICULAR: "Particular",
};

const profileTypeLabels: Record<AccountProfile, string> = {
  MARKETPLACE_SELLER: "Vendedor marketplace",
  ECOMMERCE_BRAND: "Marca / ecommerce",
  AGENCY_FREELANCER: "Agencia / freelance",
  OTHER: "Otro",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-[140px]">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar cambios"}
    </Button>
  );
}

type Props = {
  user: {
    name: string | null;
    email: string | null;
    companyName: string | null;
    phone: string | null;
    accountKind: AccountKind | null;
    profileType: AccountProfile | null;
    plan: Plan;
  };
  hasStripeCustomer: boolean;
};

export function ProfileForm({ user, hasStripeCustomer }: Props) {
  const { update: refreshSession } = useSession();
  const commerceEnabled = isCommerceEnabled();
  const [state, formAction] = useFormState(updateProfile, undefined as UpdateProfileState | undefined);

  useEffect(() => {
    if (state?.ok) {
      void refreshSession();
    }
  }, [state, refreshSession]);

  const [accountKind, setAccountKind] = useState<string>(user.accountKind ?? "");
  const [profileType, setProfileType] = useState<string>(user.profileType ?? "");

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Nombre</Label>
          <Input
            id="profile-name"
            name="name"
            required
            minLength={2}
            maxLength={80}
            defaultValue={user.name ?? ""}
            autoComplete="name"
            placeholder="Tu nombre o cómo quieres que te llamemos"
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <p className="rounded-lg border border-border/80 bg-muted/40 px-3 py-2 text-sm text-foreground">
            {user.email ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            El email no se puede cambiar aquí. Si entras con Google, usa siempre ese botón. Si usas contraseña y la
            olvidaste:{" "}
            <Link href="/forgot-password" className="font-medium text-primary hover:underline">
              recuperar contraseña
            </Link>
            .
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-company">Empresa o marca (opcional)</Label>
          <Input
            id="profile-company"
            name="companyName"
            maxLength={120}
            defaultValue={user.companyName ?? ""}
            autoComplete="organization"
            placeholder="Ej. Mi tienda SL"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-phone">Teléfono (opcional)</Label>
          <Input
            id="profile-phone"
            name="phone"
            type="tel"
            maxLength={40}
            defaultValue={user.phone ?? ""}
            autoComplete="tel"
            placeholder="Contacto para soporte o facturación"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-account-kind">Tipo de cuenta</Label>
            <input type="hidden" name="accountKind" value={accountKind} />
            <Select value={accountKind || "none"} onValueChange={(v) => setAccountKind(v === "none" ? "" : v)}>
              <SelectTrigger id="profile-account-kind" className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin especificar</SelectItem>
                {(Object.keys(accountKindLabels) as AccountKind[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {accountKindLabels[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-type">Perfil de uso</Label>
            <input type="hidden" name="profileType" value={profileType} />
            <Select value={profileType || "none"} onValueChange={(v) => setProfileType(v === "none" ? "" : v)}>
              <SelectTrigger id="profile-type" className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin especificar</SelectItem>
                {(Object.keys(profileTypeLabels) as AccountProfile[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {profileTypeLabels[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {state?.ok === false ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
        {state?.ok === true ? (
          <p className="text-sm text-emerald-600 dark:text-emerald-400" role="status">
            Cambios guardados.
          </p>
        ) : null}

        <SubmitButton />
      </form>

      <div className="border-t border-border/60 pt-6">
        <h2 className="text-base font-semibold">Plan y pagos</h2>
        <p className="mt-1 text-sm text-muted-foreground">Suscripción y recarga de créditos.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Plan actual:</span>
          <Badge>{planLabel(user.plan)}</Badge>
          {user.plan !== "ENTERPRISE" && commerceEnabled ? (
            <>
              <Link href="/pricing" className="text-primary hover:underline">
                Cambiar plan
              </Link>
              <span className="text-muted-foreground">·</span>
            </>
          ) : null}
          {commerceEnabled ? (
            user.plan === "ENTERPRISE" ? (
              <span className="text-muted-foreground">Cupo ilimitado — no hace falta comprar créditos.</span>
            ) : (
              <Link href="/pricing/credits" className="text-primary hover:underline">
                Comprar créditos (Stripe)
              </Link>
            )
          ) : (
            <span className="text-muted-foreground">Pagos y créditos: próximamente</span>
          )}
        </div>
        <div className="mt-4">
          <ManageBillingButton enabled={commerceEnabled && hasStripeCustomer} />
        </div>
      </div>
    </div>
  );
}
