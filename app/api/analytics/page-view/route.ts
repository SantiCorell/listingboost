import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_PATH = 512;
const MAX_VISITOR = 80;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false }, { status: 400 });
  }
  const pathRaw = (body as { path?: unknown }).path;
  const visitorRaw = (body as { visitorId?: unknown }).visitorId;
  const path =
    typeof pathRaw === "string" ? pathRaw.slice(0, MAX_PATH).trim() || "/" : "/";
  const visitorKey =
    typeof visitorRaw === "string" && visitorRaw.length > 0
      ? visitorRaw.slice(0, MAX_VISITOR)
      : `anon-${Math.random().toString(36).slice(2, 12)}`;

  if (path.startsWith("/admin") || path.startsWith("/api")) {
    return Response.json({ ok: true, skipped: true });
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  try {
    await prisma.siteVisit.create({
      data: {
        path,
        visitorKey,
        userId,
      },
    });
  } catch {
    // Evita 500 en bucle si DATABASE_URL no alcanza Supabase (P1001) u otro fallo transitorio.
    return Response.json({ ok: false, skipped: true }, { status: 200 });
  }

  return Response.json({ ok: true });
}
