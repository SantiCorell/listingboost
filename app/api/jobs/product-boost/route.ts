import { NextResponse } from "next/server";
import { after } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isPaidPlan } from "@/lib/plans";
import { assertCanAnalyze } from "@/lib/usage";
import {
  executeProductSeoForUser,
  productSeoInputSchema,
} from "@/lib/product-seo-executor";

function jobTitleFromPayload(d: { description?: string | null }) {
  const t = d.description?.trim().slice(0, 72);
  return t && t.length > 0 ? t : "Boost de ficha";
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { plan: true },
  });

  if (!isPaidPlan(user.plan)) {
    return NextResponse.json(
      {
        error:
          "Las tareas en segundo plano están disponibles en planes Pro o superiores.",
      },
      { status: 403 },
    );
  }

  try {
    await assertCanAnalyze(session.user.id);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Límite alcanzado" },
      { status: 402 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = productSeoInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Campos inválidos" }, { status: 400 });
  }

  const data = parsed.data;
  const title = jobTitleFromPayload({ description: data.description ?? null });

  const job = await prisma.backgroundJob.create({
    data: {
      userId: session.user.id,
      kind: "product_boost",
      status: "pending",
      title,
      payloadJson: data as object,
    },
  });

  const userId = session.user.id;
  const jobId = job.id;

  after(async () => {
    try {
      const result = await executeProductSeoForUser(userId, data);
      if (result.ok) {
        await prisma.backgroundJob.update({
          where: { id: jobId },
          data: {
            status: "completed",
            resultId: result.analysisId,
            error: null,
          },
        });
      } else {
        await prisma.backgroundJob.update({
          where: { id: jobId },
          data: { status: "failed", error: result.message },
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error interno";
      await prisma.backgroundJob.update({
        where: { id: jobId },
        data: { status: "failed", error: msg },
      });
    }
  });

  return NextResponse.json({ jobId: job.id, title: job.title });
}
