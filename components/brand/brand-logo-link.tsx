"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const boxBase =
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary via-primary to-accent shadow-md shadow-primary/25 ring-1 ring-primary/15";

/** Marca: solo el rayo en el cuadrado (sin imagen PNG). */
export function BrandLogoLink({
  variant = "header",
  className,
  onNavigate,
}: {
  variant?: "header" | "footer" | "auth" | "sheet";
  className?: string;
  onNavigate?: () => void;
}) {
  const zapClass =
    variant === "footer"
      ? "relative z-10 h-5 w-5 text-primary-foreground"
      : variant === "auth"
        ? "relative z-10 h-8 w-8 text-primary-foreground"
        : "relative z-10 h-[18px] w-[18px] text-primary-foreground";

  const inner = (
    <span
      className={cn(
        boxBase,
        variant === "footer" && "h-10 w-10 shadow-primary/20",
        variant === "auth" && "h-14 w-14 shadow-lg shadow-primary/30",
        variant !== "footer" && variant !== "auth" && "h-9 w-9",
      )}
    >
      <Zap
        className={`${zapClass} drop-shadow-[0_0_10px_rgba(250,245,255,0.55)]`}
        strokeWidth={2.65}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_32%_18%,white_0%,transparent_50%)] opacity-35"
        aria-hidden
      />
    </span>
  );

  if (variant === "auth") {
    return (
      <Link
        href="/"
        onClick={() => onNavigate?.()}
        className={cn("group flex flex-col items-center gap-3 transition-opacity hover:opacity-95", className)}
      >
        {inner}
        <span className="text-center">
          <span className="block text-xl font-bold tracking-tight">
            <span className="text-foreground">Listing</span>
            <span className="text-gradient-brand">Boost</span>
          </span>
          <span className="mt-1 block font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            listing intelligence
          </span>
        </span>
        <span className="sr-only">{APP_NAME}, ir al inicio</span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      onClick={() => onNavigate?.()}
      className={cn(
        "group flex min-w-0 shrink items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-95",
        variant === "footer" && "gap-2.5",
        className,
      )}
    >
      {inner}
      {variant === "footer" ? (
        <span className="text-lg">
          <span className="text-foreground">Listing</span>
          <span className="text-gradient-brand">Boost</span>
        </span>
      ) : variant === "sheet" ? (
        <span className="min-w-0 text-left">
          <span className="block truncate text-[15px] tracking-[-0.02em]">
            <span className="text-foreground">Listing</span>
            <span className="text-gradient-brand">Boost</span>
          </span>
          <span className="mt-0.5 block font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            listing intelligence
          </span>
        </span>
      ) : (
        <>
          <span className="hidden min-w-0 sm:flex sm:flex-col sm:leading-none">
            <span className="truncate text-[15px] tracking-[-0.02em]">
              <span className="text-foreground">Listing</span>
              <span className="text-gradient-brand">Boost</span>
            </span>
            <span className="mt-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              listing intelligence
            </span>
          </span>
          <span className="truncate font-semibold tracking-tight sm:hidden">{APP_NAME}</span>
        </>
      )}
      <span className="sr-only">{APP_NAME}, ir al inicio</span>
    </Link>
  );
}
