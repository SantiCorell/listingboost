import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";

export const metadata = {
  title: "Olvidé mi contraseña",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="Recuperar acceso"
      subtitle={
        <>
          ¿Ya la recuerdas?{" "}
          <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
