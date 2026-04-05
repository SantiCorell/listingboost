/** En SEO, posición menor = mejor. diff = anterior − actual → positivo = has mejorado. */

export type SnapshotPoint = {
  position: number | null;
  createdAt: string;
};

export function computeRankDelta(
  current: number | null,
  previous: number | null,
): { label: string; improved: boolean | null; places: number } | null {
  if (current == null || previous == null) return null;
  const diff = previous - current;
  const places = Math.abs(diff);
  if (diff === 0) return { label: "Sin cambio", improved: null, places: 0 };
  if (diff > 0) {
    return {
      label: `↑ ${places} puesto${places === 1 ? "" : "s"}`,
      improved: true,
      places,
    };
  }
  return {
    label: `↓ ${places} puesto${places === 1 ? "" : "s"}`,
    improved: false,
    places,
  };
}

/** Snapshots en orden cronológico (antigua → reciente) para gráfico. */
export function snapshotsChronological(
  snapshots: SnapshotPoint[],
): SnapshotPoint[] {
  return [...snapshots].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

export function relativeTimeShort(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const sec = Math.round((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "hace un momento";
  const min = Math.round(sec / 60);
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const days = Math.round(h / 24);
  return `hace ${days} d`;
}
