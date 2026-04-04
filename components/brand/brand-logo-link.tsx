"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const boxBase =
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary via-primary to-accent shadow-md shadow-primary/25 ring-1 ring-primary/15";

/** Marca ListingBoost: logo PNG + refuerzo visual del rayo (ListingBrain™). */
export function BrandLogoLink({
  variant = "header",
  className,
  priority = false,
  onNavigate,
}: {
  variant?: "header" | "footer" | "auth" | "sheet";
  className?: string;
  /** LCP en cabecera global */
  priority?: boolean;
  /** P. ej. cerrar menú móvil al pulsar la marca */
  onNavigate?: () => void;
}) {
  const dim =
    variant === "footer"
      ? 40
      : variant === "auth"
        ? 56
        : variant === "sheet"
          ? 36
          : 36;

  const inner = (
    <span
      className={cn(
        boxBase,
        variant === "footer" && "h-10 w-10 shadow-primary/20",
        variant === "auth" && "h-14 w-14 shadow-lg shadow-primary/30",
        variant !== "footer" && variant !== "auth" && "h-9 w-9",
      )}
    >
      <Image
        src="/logo.png"
        alt="ListingBoost"
        width={dim}
        height={dim}
        className="object-contain p-0.5"
        priority={priority}
        sizes={`${dim}px`}
      />
      <Zap
        className={cn(
          "pointer-events-none absolute text-primary-foreground drop-shadow-sm",
          variant === "auth" ? "right-1 bottom-1 h-4 w-4" : "right-0.5 bottom-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5",
        )}
        strokeWidth={2.4}
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
