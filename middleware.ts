import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { getAuthSecret } from "./lib/auth-secret";
import { authConfig, sessionOptions } from "./auth.config";

const { auth } = NextAuth({
  ...authConfig,
  providers: [],
  session: sessionOptions,
  secret: getAuthSecret(),
});

export default auth((req) => {
  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/settings") ||
    req.nextUrl.pathname.startsWith("/admin");
  if (isProtected && !req.auth?.user) {
    const u = new URL("/login", req.url);
    u.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(u);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/admin", "/admin/:path*"],
};
