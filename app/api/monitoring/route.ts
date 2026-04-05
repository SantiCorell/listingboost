import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userIsAdmin } from "@/lib/auth/admin";
import { hasGrowthAutomation, hasSeoMonitoring } from "@/lib/plan-features";
import { executeSeoMonitoringById } from "@/lib/seo/monitoring-execute";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true, email: true },
  });
  const admin = userIsAdmin(user?.role, user?.email);
  if (!user || (!admin && !hasSeoMonitoring(user.plan))) {
    return NextResponse.json({ items: [], locked: true });
  }

  const items = await prisma.seoMonitoring.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      snapshots: { orderBy: { createdAt: "desc" }, take: 40 },
    },
  });

  return NextResponse.json({ items, locked: false });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, role: true, email: true },
  });
  const admin = userIsAdmin(user?.role, user?.email);
  if (!user || (!admin && !hasSeoMonitoring(user.plan))) {
    return NextResponse.json(
      { error: "El seguimiento de posiciones requiere plan Pro o superior." },
      { status: 403 },
    );
  }

  let body: { url?: string; keyword?: string; cadence?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  try {
    new URL(body.url ?? "");
  } catch {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }

  if (!body.keyword?.trim()) {
    return NextResponse.json({ error: "Indica una keyword" }, { status: 400 });
  }

  let cadence = body.cadence === "daily" ? "daily" : "weekly";
  if (cadence === "daily" && !admin && !hasGrowthAutomation(user.plan)) {
    cadence = "weekly";
  }
  /** Primera ejecución pronto; el cron re-programa según cadence. */
  const nextRunAt = new Date(Date.now() + 120_000);

  const row = await prisma.seoMonitoring.create({
    data: {
      userId: session.user.id,
      url: body.url!.trim(),
      keyword: body.keyword.trim(),
      cadence,
      nextRunAt,
    },
  });

  /** Primera lectura SerpAPI en segundo plano (posición sin esperar al cron). */
  void executeSeoMonitoringById(row.id).catch(() => {});

  return NextResponse.json({ ok: true, item: row });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  await prisma.seoMonitoring.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
