"use server";

import { hash, compare } from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPublicSiteUrl } from "@/lib/site-url";
import { createPasswordResetSecret, hashPasswordResetToken } from "@/lib/auth/password-reset-token";
import { sendPasswordResetEmail } from "@/lib/email/send-password-reset-email";

const RESET_TTL_MS = 60 * 60 * 1000; // 1 h

const emailSchema = z.string().email().trim().toLowerCase();
const passwordSchema = z.string().min(8).max(128);

/** Siempre responde igual para no filtrar si el email existe. */
export async function requestPasswordReset(
  _prev: { ok: boolean; message: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  const raw = formData.get("email");
  const parsed = emailSchema.safeParse(typeof raw === "string" ? raw : "");
  const publicMsg =
    "Si hay una cuenta con ese email y contraseña, te hemos enviado un enlace. Revisa la carpeta de spam.";

  if (!parsed.success) {
    return { ok: true, message: publicMsg };
  }

  const email = parsed.data;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });

  if (!user?.passwordHash) {
    return { ok: true, message: publicMsg };
  }

  const { plainToken, tokenHash } = createPasswordResetSecret();
  const expiresAt = new Date(Date.now() + RESET_TTL_MS);

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  const base = getPublicSiteUrl();
  const resetUrl = `${base}/reset-password?token=${encodeURIComponent(plainToken)}`;
  const sent = await sendPasswordResetEmail({ to: email, resetUrl });

  if (!sent.ok) {
    await prisma.passwordResetToken.delete({ where: { tokenHash } }).catch(() => {});
    return {
      ok: false,
      message:
        "No pudimos enviar el email ahora mismo. Inténtalo más tarde o escribe a soporte si el problema continúa.",
    };
  }

  return { ok: true, message: publicMsg };
}

const resetSchema = z.object({
  token: z.string().min(16).max(256),
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((d) => d.password === d.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export async function resetPasswordWithToken(
  _prev: { ok: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      error: err.confirmPassword?.[0] ?? err.password?.[0] ?? err.token?.[0] ?? "Datos inválidos",
    };
  }

  const { token, password } = parsed.data;
  const tokenHash = hashPasswordResetToken(token);

  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: { select: { id: true } } },
  });

  if (!row || row.expiresAt < new Date()) {
    return {
      ok: false,
      error: "El enlace ha caducado o no es válido. Solicita uno nuevo desde «Olvidé mi contraseña».",
    };
  }

  const passwordHash = await hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({ where: { userId: row.userId } }),
  ]);

  return { ok: true };
}

const changeSchema = z
  .object({
    currentPassword: z.string().min(1).max(128),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Las contraseñas nuevas no coinciden",
    path: ["confirmPassword"],
  });

export async function changePassword(
  _prev: { ok: boolean; error?: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Debes iniciar sesión." };
  }

  const parsed = changeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      error: err.confirmPassword?.[0] ?? err.newPassword?.[0] ?? "Datos inválidos",
    };
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });
  if (!user?.passwordHash) {
    return {
      ok: false,
      error: "Tu cuenta usa solo Google u otro proveedor; no hay contraseña que cambiar aquí.",
    };
  }

  const match = await compare(currentPassword, user.passwordHash);
  if (!match) {
    return { ok: false, error: "La contraseña actual no es correcta." };
  }

  const passwordHash = await hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return { ok: true };
}
