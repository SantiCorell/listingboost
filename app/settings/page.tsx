import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/settings/profile-form";
import { ChangePasswordForm } from "@/components/settings/change-password-form";

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
      passwordHash: true,
    },
  });

  const hasPassword = Boolean(user.passwordHash);

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
          <ProfileForm
            user={{
              name: user.name,
              email: user.email,
              companyName: user.companyName,
              phone: user.phone,
              accountKind: user.accountKind,
              profileType: user.profileType,
              plan: user.plan,
            }}
            hasStripeCustomer={Boolean(stripeCustomer?.stripeCustomerId)}
          />
        </CardContent>
      </Card>

      {hasPassword ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contraseña</CardTitle>
            <CardDescription>Cambia la contraseña que usas con tu email (no aplica a «Iniciar sesión con Google»).</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Contraseña</CardTitle>
            <CardDescription>
              Entras con Google (u otro proveedor) sin contraseña en ListingBoost. Si necesitas también acceso con
              email y contraseña, contacta con soporte.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
