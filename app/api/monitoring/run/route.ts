import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { hasSeoMonitoring } from "@/lib/plan-features";
import { executeSeoMonitoringById } from "@/lib/seo/monitoring-execute";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Comprueba ya una fila de monitoring (misma lógica que el cron).
 * POST { "id": "seomonitoring_id" }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = (await req.json()) as { id?: string };
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const id = body.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true, email: true },
  });
  const admin = userIsAdmin(user?.role, user?.email);
  if (!user || (!admin && !hasSeoMonitoring(user.plan))) {
    return NextResponse.json({ error: "El seguimiento requiere plan Pro o superior." }, { status: 403 });
  }

  const row = await prisma.seoMonitoring.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!row) {
    return NextResponse.json({ error: "Seguimiento no encontrado." }, { status: 404 });
  }

  const result = await executeSeoMonitoringById(id);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, position: result.position ?? null },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    position: result.position,
    note: result.note ?? null,
  });
}
