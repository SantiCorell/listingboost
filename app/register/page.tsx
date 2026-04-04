import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { isGoogleAuthConfigured } from "@/lib/auth/google-available";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const googleAuthAvailable = isGoogleAuthConfigured();
  return (
    <AuthPageShell
      title="Registrarse"
      subtitle={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
            Iniciar sesión
          </Link>
        </>
      }
    >
      <RegisterForm googleAuthAvailable={googleAuthAvailable} />
    </AuthPageShell>
  );
}
