import { createHash, randomBytes } from "node:crypto";

/** Genera token opaco (hex 64 chars) y su hash SHA-256 para guardar en BD. */
export function createPasswordResetSecret(): { plainToken: string; tokenHash: string } {
  const plainToken = randomBytes(32).toString("hex");
  return { plainToken, tokenHash: hashPasswordResetToken(plainToken) };
}

export function hashPasswordResetToken(plainToken: string): string {
  return createHash("sha256").update(plainToken, "utf8").digest("hex");
}
