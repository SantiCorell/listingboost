import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { isCommerceEnabled } from "@/lib/commerce";
import { planLabel } from "@/lib/plans";
import { ManageBillingButton } from "@/components/settings/manage-billing-button";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });

  const stripeCustomer = await prisma.subscription.findFirst({
    where: { userId: session.user.id, stripeCustomerId: { not: null } },
    select: { stripeCustomerId: true },
  });

  const commerceEnabled = isCommerceEnabled();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ajustes de cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Datos básicos y estado de suscripción.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Nombre: </span>
            {user.name ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Email: </span>
            {user.email}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-muted-foreground">Plan: </span>
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
              <Link href="/pricing/credits" className="text-primary hover:underline">
                Comprar créditos (Stripe)
              </Link>
            ) : (
              <span className="text-muted-foreground">Pagos y créditos: próximamente</span>
            )}
          </p>
          <div className="mt-4 border-t border-border/60 pt-4">
            <ManageBillingButton
              enabled={commerceEnabled && Boolean(stripeCustomer?.stripeCustomerId)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
