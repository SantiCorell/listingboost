/** Formato legible para volumen mensual estimado (entero). */
export function formatMonthlyVolumeEs(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (n === 0) return "<10";
  if (n < 100) return `<${n}`;
  if (n < 1000) return n.toLocaleString("es-ES");
  if (n < 1_000_000) {
    const k = n / 1000;
    const rounded = k >= 10 ? Math.round(k) : Math.round(k * 10) / 10;
    return `${rounded.toLocaleString("es-ES", { maximumFractionDigits: 1 })}k`;
  }
  const m = n / 1_000_000;
  const rounded = m >= 10 ? Math.round(m) : Math.round(m * 10) / 10;
  return `${rounded.toLocaleString("es-ES", { maximumFractionDigits: 1 })}M`;
}
