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
import {
  LB_COOKIE_CONSENT_KEY,
  type StoredCookieConsent,
  readAnalyticsChoiceFromStorage,
} from "@/lib/legal/cookie-consent-storage";

type CookieConsentContextValue = {
  /** Hydration + lectura de localStorage completada */
  ready: boolean;
  /** null = usuario aún no ha elegido (mostrar banner) */
  analyticsChoice: boolean | null;
  analyticsAllowed: boolean;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  preferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  /** Persiste elección y cierra el panel. */
  savePreferences: (allowAnalytics: boolean) => void;
  /** Borra la decisión: vuelve el banner y revoca analíticas. */
  resetConsent: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState<boolean | null>(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setAnalyticsChoice(readAnalyticsChoiceFromStorage());
    setReady(true);
  }, []);

  const persist = useCallback((allowAnalytics: boolean) => {
    const payload: StoredCookieConsent = {
      v: 1,
      analytics: allowAnalytics,
      at: new Date().toISOString(),
    };
    localStorage.setItem(LB_COOKIE_CONSENT_KEY, JSON.stringify(payload));
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

  const acceptAll = useCallback(() => persist(true), [persist]);
  const acceptNecessaryOnly = useCallback(() => persist(false), [persist]);

  const openPreferences = useCallback(() => setPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setPreferencesOpen(false), []);

  const savePreferences = useCallback(
    (allowAnalytics: boolean) => {
      persist(allowAnalytics);
      setPreferencesOpen(false);
    },
    [persist],
  );

  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(LB_COOKIE_CONSENT_KEY);
      localStorage.removeItem("lb_vid");
    } catch {
      /* ignore */
    }
    setAnalyticsChoice(null);
    setPreferencesOpen(false);
    window.dispatchEvent(new CustomEvent("lb-consent-changed"));
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      ready,
      analyticsChoice,
      analyticsAllowed: analyticsChoice === true,
      acceptAll,
      acceptNecessaryOnly,
      preferencesOpen,
      openPreferences,
      closePreferences,
      savePreferences,
      resetConsent,
    }),
    [
      ready,
      analyticsChoice,
      acceptAll,
      acceptNecessaryOnly,
      preferencesOpen,
      openPreferences,
      closePreferences,
      savePreferences,
      resetConsent,
    ],
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
