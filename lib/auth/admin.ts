import type { UserRole } from "@prisma/client";

export function parseAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function emailIsInAdminAllowlist(email: string | null | undefined): boolean {
  if (!email) return false;
  return parseAdminEmails().includes(email.toLowerCase());
}

export function isAdminRole(role: UserRole | undefined | null): boolean {
  return role === "ADMIN";
}

export function userIsAdmin(role: UserRole | undefined | null, email: string | null | undefined): boolean {
  return isAdminRole(role) || emailIsInAdminAllowlist(email);
}
