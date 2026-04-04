"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Tras cada navegación SPA, limpia estilos que Radix (Sheet/Dialog/Menu) puede dejar
 * en body/html y que a veces interactúan mal con el router de Next.
 */
export function NavigationStyleReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    body.style.removeProperty("overflow");
    body.style.removeProperty("padding-right");
    body.style.removeProperty("pointer-events");
    html.style.removeProperty("overflow");
    body.removeAttribute("data-scroll-locked");
  }, [pathname]);

  return null;
}
