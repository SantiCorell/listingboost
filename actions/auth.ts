"use server";

import { hash } from "bcryptjs";
import type { AccountKind } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const accountKindEnum = z.enum(["EMPRESA", "AUTONOMO", "PARTICULAR"]);

const registerSchema = z
  .object({
    name: z.string().min(2).max(80).trim(),
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
    companyName: z
      .string()
      .max(120)
      .optional()
      .transform((s) => {
        const t = s?.trim();
        return t ? t : undefined;
      }),
    phone: z
      .string()
      .max(40)
      .optional()
      .transform((s) => {
        const t = s?.trim();
        return t ? t : undefined;
      }),
    accountKind: accountKindEnum,
    termsAccepted: z.boolean(),
  })
  .refine((d) => d.termsAccepted === true, {
    message: "Debes aceptar los términos y la política de privacidad",
    path: ["termsAccepted"],
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export async function registerUser(
  _: unknown,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const termsRaw = formData.get("termsAccepted");
  const termsAccepted = termsRaw === "true" || termsRaw === "on";

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    companyName: formData.get("companyName") || undefined,
    phone: formData.get("phone") || undefined,
    accountKind: formData.get("accountKind"),
    termsAccepted,
  });
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      first.confirmPassword?.[0] ??
      first.termsAccepted?.[0] ??
      first.accountKind?.[0] ??
      first.email?.[0] ??
      "Datos inválidos";
    return { ok: false, error: msg };
  }

  const { name, email, password, companyName, phone, accountKind } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return { ok: false, error: "Ya existe una cuenta con ese email" };
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      companyName: companyName ?? null,
      phone: phone ?? null,
      accountKind: accountKind as AccountKind,
      profileType: null,
      termsAcceptedAt: new Date(),
    },
  });

  return { ok: true };
}
