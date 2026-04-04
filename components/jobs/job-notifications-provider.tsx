"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BOOST_JOBS_STORAGE_KEY = "lb_pending_boost_jobs";

type PendingJob = { id: string; title: string };

type ToastItem =
  | { key: string; kind: "ok"; title: string; href: string }
  | { key: string; kind: "err"; title: string; message: string };

export function JobNotificationsProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const done = useRef(new Set<string>());

  const dismiss = useCallback((key: string) => {
    setToasts((t) => t.filter((x) => x.key !== key));
  }, []);

  useEffect(() => {
    const tick = async () => {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(BOOST_JOBS_STORAGE_KEY);
      } catch {
        return;
      }
      if (!raw) return;
      let list: PendingJob[];
      try {
        list = JSON.parse(raw) as PendingJob[];
      } catch {
        return;
      }
      if (!Array.isArray(list) || list.length === 0) return;

      const still: PendingJob[] = [];
      for (const item of list) {
        try {
          const r = await fetch(`/api/jobs/${item.id}`);
          if (!r.ok) {
            still.push(item);
            continue;
          }
          const j = (await r.json()) as {
            status: string;
            resultId?: string | null;
            error?: string | null;
          };

          if (j.status === "pending") {
            still.push(item);
            continue;
          }

          if (done.current.has(item.id)) continue;
          done.current.add(item.id);

          if (j.status === "completed" && j.resultId) {
            setToasts((prev) => [
              ...prev,
              {
                key: `${item.id}-ok`,
                kind: "ok",
                title: item.title,
                href: `/dashboard/history/product/${j.resultId}`,
              },
            ]);
            continue;
          }

          if (j.status === "failed") {
            setToasts((prev) => [
              ...prev,
              {
                key: `${item.id}-err`,
                kind: "err",
                title: item.title,
                message: j.error ?? "Error desconocido",
              },
            ]);
          }
        } catch {
          still.push(item);
        }
      }

      try {
        if (still.length === 0) {
          localStorage.removeItem(BOOST_JOBS_STORAGE_KEY);
        } else {
          localStorage.setItem(BOOST_JOBS_STORAGE_KEY, JSON.stringify(still));
        }
      } catch {
        /* ignore */
      }
    };

    const id = window.setInterval(() => void tick(), 2800);
    void tick();
    return () => window.clearInterval(id);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[200] flex max-w-sm flex-col gap-2 p-0 sm:max-w-md">
      {toasts.map((t) => (
        <div
          key={t.key}
          className="pointer-events-auto flex gap-3 rounded-xl border border-border/80 bg-background/95 p-4 shadow-lg backdrop-blur-sm"
        >
          {t.kind === "ok" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-sm font-semibold leading-tight">
              {t.kind === "ok" ? "Tarea finalizada" : "Tarea fallida"}
            </p>
            <p className="line-clamp-2 text-xs text-muted-foreground">{t.title}</p>
            {t.kind === "ok" ? (
              <Button asChild size="sm" className="h-8 w-full sm:w-auto">
                <Link href={t.href}>Ver boost</Link>
              </Button>
            ) : (
              <p className="text-xs text-destructive">{t.message}</p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => dismiss(t.key)}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
