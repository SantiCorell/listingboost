"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AdminSessionStrip({
  initialExpires,
  idleMinutes,
}: {
  initialExpires: string | null | undefined;
  idleMinutes: number;
}) {
  const { data, status } = useSession();
  const expiresIso = data?.expires ?? initialExpires;
  const [remainingMs, setRemainingMs] = useState(0);

  const expiresAt = useMemo(() => {
    if (!expiresIso) return null;
    const t = new Date(expiresIso).getTime();
    return Number.isFinite(t) ? t : null;
  }, [expiresIso]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => setRemainingMs(expiresAt - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  if (status === "loading" && !expiresIso) {
    return (
      <div className="rounded-lg border border-amber-500/20 bg-background/60 px-3 py-2 text-xs text-muted-foreground backdrop-blur-sm">
        Cargando sesión…
      </div>
    );
  }

  const expired = remainingMs <= 0 && expiresAt !== null;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-amber-500/25 bg-background/80 px-3 py-2.5 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-200">
          <Clock className="h-4 w-4" />
        </span>
        <div className="min-w-0 text-xs leading-snug sm:text-sm">
          <p className="font-semibold text-foreground">Sesión segura</p>
          <p className="text-muted-foreground">
            Sin actividad durante <strong className="text-foreground">{idleMinutes} min</strong> la sesión
            caduca. Cada clic o recarga en la app <strong className="text-foreground">renueva</strong> el tiempo.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end md:flex-row md:items-center">
        <span
          className={`inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs font-semibold tabular-nums ${
            expired
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100"
          }`}
          title="Tiempo hasta la caducidad actual del token de sesión"
        >
          {expired ? "Caducada" : `Quedan ${formatRemaining(remainingMs)}`}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs"
          onClick={() => void signOut({ redirectTo: "/", redirect: true })}
        >
          <LogOut className="h-3.5 w-3.5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
