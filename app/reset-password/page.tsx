import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";

export const metadata = {
  title: "Nueva contraseña",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === "string" ? sp.token : "";

  return (
    <AuthPageShell
      title="Restablecer contraseña"
      subtitle={
        <>
          El enlace caduca en 1 hora. ¿Problemas?{" "}
          <Link href="/forgot-password" className="font-semibold text-primary underline-offset-4 hover:underline">
            Pedir otro correo
          </Link>
        </>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthPageShell>
  );
}
