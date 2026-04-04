"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";


/**
 * Si tras una navegación Tailwind deja de aplicarse (p. ej. `hidden` no oculta),
 * el probe deja de ser display:none o :root pierde --background → recarga completa.
 */
export function RouteStyleGuard() {
  const pathname = usePathname();
  const firstPathRef = useRef(true);

  useEffect(() => {
    if (firstPathRef.current) {
      firstPathRef.current = false;
      return;
    }

    const run = () => {
      const probe = document.getElementById("__lb_css_probe");
      if (probe) {
        const display = getComputedStyle(probe).display;
        if (display !== "none") {
          window.location.reload();
          return;
        }
      }

      const bg = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
      if (!bg) {
        window.location.reload();
      }
    };

    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(run);
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
