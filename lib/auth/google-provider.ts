import Google from "next-auth/providers/google";

export function googleProvider() {
  const id = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;
  if (!id || !secret) {
    return null;
  }
  return Google({
    clientId: id,
    clientSecret: secret,
    allowDangerousEmailAccountLinking: false,
  });
}
