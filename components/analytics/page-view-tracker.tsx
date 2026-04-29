"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCookieConsent } from "@/components/legal/cookie-consent-context";

function visitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let v = localStorage.getItem("lb_vid");
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem("lb_vid", v);
    }
    return v;
  } catch {
    return `fallback-${Math.random().toString(36).slice(2, 12)}`;
  }
}

export function PageViewTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);
  const { ready, analyticsAllowed } = useCookieConsent();

  useEffect(() => {
    if (!ready || !analyticsAllowed) return;
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    const id = visitorId();
    if (!id) return;

    const payload = JSON.stringify({ path: pathname, visitorId: id });
    const send = () => {
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/page-view", blob);
        return;
      }
      void fetch("/api/analytics/page-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    };

    if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(send, { timeout: 1200 });
      return;
    }
    window.setTimeout(send, 0);
  }, [pathname, ready, analyticsAllowed]);

  useEffect(() => {
    function onConsent() {
      lastSent.current = null;
    }
    window.addEventListener("lb-consent-changed", onConsent);
    return () => window.removeEventListener("lb-consent-changed", onConsent);
  }, []);

  return null;
}
