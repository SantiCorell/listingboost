"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "lb_cookie_consent_v1";

type StoredConsent = { v: 1; analytics: boolean; at: string };

function readStored(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as StoredConsent;
    return j.analytics === true;
  } catch {
    return null;
  }
}

type CookieConsentContextValue = {
  /** Hydration + lectura de localStorage completada */
  ready: boolean;
  /** null = usuario aún no ha elegido (mostrar banner) */
  analyticsChoice: boolean | null;
  analyticsAllowed: boolean;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState<boolean | null>(null);

  useEffect(() => {
    setAnalyticsChoice(readStored());
    setReady(true);
  }, []);

  const persist = useCallback((allowAnalytics: boolean) => {
    const payload: StoredConsent = {
      v: 1,
      analytics: allowAnalytics,
      at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    if (!allowAnalytics) {
      try {
        localStorage.removeItem("lb_vid");
      } catch {
        /* ignore */
      }
    }
    setAnalyticsChoice(allowAnalytics);
    window.dispatchEvent(new CustomEvent("lb-consent-changed"));
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      ready,
      analyticsChoice,
      analyticsAllowed: analyticsChoice === true,
      acceptAll: () => persist(true),
      acceptNecessaryOnly: () => persist(false),
    }),
    [ready, analyticsChoice, persist],
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent debe usarse dentro de CookieConsentProvider");
  }
  return ctx;
}
