import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeSeoMonitoringById } from "@/lib/seo/monitoring-execute";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Vercel Cron: protege con CRON_SECRET (Authorization: Bearer …).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!secret || token !== secret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();
  const activeSince = new Date(now.getTime() - 36 * 60 * 60 * 1000);
  const due = await prisma.seoMonitoring.findMany({
    where: {
      active: true,
      OR: [{ nextRunAt: null }, { nextRunAt: { lte: now } }],
      AND: [
        {
          OR: [
            { cadence: { not: "daily" } },
            {
              user: {
                siteVisits: {
                  some: {
                    createdAt: { gte: activeSince },
                    userId: { not: null },
                  },
                },
              },
            },
          ],
        },
      ],
    },
    take: 40,
  });

  let processed = 0;
  const errors: string[] = [];

  for (const m of due) {
    try {
      const result = await executeSeoMonitoringById(m.id);
      if (!result.ok) {
        errors.push(`${m.id}: ${result.error}`);
      }
      processed++;
    } catch (e) {
      errors.push(`${m.id}: ${e instanceof Error ? e.message : "error"}`);
      processed++;
    }
  }

  return NextResponse.json({ ok: true, processed, checked: due.length, errors: errors.length ? errors : undefined });
}
