import { prisma } from "@/lib/prisma";
import { fetchOrganicPosition } from "@/lib/serp/google-rank";

function addCadence(d: Date, cadence: string): Date {
  const n = new Date(d);
  if (cadence === "daily") n.setDate(n.getDate() + 1);
  else n.setDate(n.getDate() + 7);
  return n;
}

/**
 * Ejecuta una comprobación SERP (misma lógica que el cron) y actualiza BD.
 */
export async function executeSeoMonitoringById(monitoringId: string): Promise<
  | { ok: true; position: number | null; note?: string | null }
  | { ok: false; error: string; position?: null }
> {
  const now = new Date();
  const m = await prisma.seoMonitoring.findUnique({ where: { id: monitoringId } });
  if (!m) {
    return { ok: false, error: "Seguimiento no encontrado." };
  }
  if (!m.active) {
    return { ok: false, error: "Seguimiento en pausa." };
  }

  let host: string;
  try {
    host = new URL(m.url).hostname.replace(/^www\./, "");
  } catch {
    await prisma.seoMonitoring.update({
      where: { id: m.id },
      data: {
        lastNote: "URL inválida",
        lastRunAt: now,
        nextRunAt: addCadence(now, m.cadence),
      },
    });
    return { ok: false, error: "URL inválida", position: null };
  }

  const rank = await fetchOrganicPosition({
    keyword: m.keyword,
    targetHost: host,
  });

  await prisma.seoMonitoringSnapshot.create({
    data: {
      monitoringId: m.id,
      position: rank.position,
      serpTitle: rank.note ?? null,
      rawJson: {
        note: rank.note ?? null,
        position: rank.position,
        at: now.toISOString(),
      } as object,
    },
  });

  await prisma.seoMonitoring.update({
    where: { id: m.id },
    data: {
      lastPosition: rank.position,
      lastNote: rank.note ?? null,
      lastRunAt: now,
      nextRunAt: addCadence(now, m.cadence),
    },
  });

  return { ok: true, position: rank.position, note: rank.note };
}
