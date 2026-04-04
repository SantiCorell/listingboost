import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/settings/profile-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      companyName: true,
      phone: true,
      accountKind: true,
      profileType: true,
      plan: true,
    },
  });

  const stripeCustomer = await prisma.subscription.findFirst({
    where: { userId: session.user.id, stripeCustomerId: { not: null } },
    select: { stripeCustomerId: true },
  });

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ajustes de cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edita tu perfil y revisa tu plan. El email de acceso no se puede cambiar aquí.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
          <CardDescription>
            Nombre, contacto y tipo de cuenta. Los cambios se aplican al instante en tu sesión.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} hasStripeCustomer={Boolean(stripeCustomer?.stripeCustomerId)} />
        </CardContent>
      </Card>
    </div>
  );
}
