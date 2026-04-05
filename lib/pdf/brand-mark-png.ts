/**
 * Rasteriza /icon.svg (marca con rayo) a PNG en data URL para jsPDF.addImage.
 * Evita usar /logo.png (bolsa) en informes exportados.
 */
export async function getBrandMarkPngDataUrl(sizePx = 64): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/icon.svg");
    if (!res.ok) return null;
    const svgText = await res.text();
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);

    return await new Promise<string | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = sizePx;
          canvas.height = sizePx;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            resolve(null);
            return;
          }
          ctx.clearRect(0, 0, sizePx, sizePx);
          ctx.drawImage(img, 0, 0, sizePx, sizePx);
          const dataUrl = canvas.toDataURL("image/png");
          URL.revokeObjectURL(objectUrl);
          resolve(dataUrl);
        } catch {
          URL.revokeObjectURL(objectUrl);
          resolve(null);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(null);
      };
      img.src = objectUrl;
    });
  } catch {
    return null;
  }
}
