/** Lee la respuesta de POST /api/stripe/checkout (JSON con url o error). */
export async function parseCheckoutResponse(r: Response): Promise<
  { ok: true; url: string } | { ok: false; message: string }
> {
  const ct = r.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    try {
      const j = (await r.json()) as { url?: string; error?: string };
      if (r.ok && j.url) {
        return { ok: true, url: j.url };
      }
      return {
        ok: false,
        message: j.error?.trim() || "No se pudo completar la operación.",
      };
    } catch {
      return { ok: false, message: "Respuesta inválida del servidor." };
    }
  }
  const t = (await r.text()).trim();
  return { ok: false, message: t || `Error HTTP ${r.status}` };
}
