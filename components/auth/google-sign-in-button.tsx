"use client";

import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={cn("h-[22px] w-[22px]", className)} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export type GoogleAuthMode = "signin" | "signup";

type Props = {
  callbackUrl: string;
  label?: string;
  mode?: GoogleAuthMode;
  className?: string;
};

const defaultLabels: Record<GoogleAuthMode, string> = {
  signin: "Iniciar sesión con Google",
  signup: "Registrarse con Google",
};

export function GoogleSignInButton({ callbackUrl, label, mode = "signin", className }: Props) {
  const [pending, setPending] = useState(false);
  const text = label ?? defaultLabels[mode];

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        setPending(true);
        void signIn("google", { callbackUrl });
      }}
      className={cn(
        "group relative flex h-[52px] w-full select-none items-center rounded-2xl border border-black/[0.07] bg-gradient-to-b from-white to-zinc-50/95 px-2 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] transition-[transform,box-shadow,border-color] duration-200",
        "hover:border-black/[0.11] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60",
        "dark:border-white/[0.08] dark:from-zinc-900 dark:to-zinc-950 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:hover:border-white/[0.12] dark:hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      <span className="flex w-11 shrink-0 justify-center" aria-hidden>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-transform duration-200 group-hover:scale-[1.02] dark:bg-zinc-900 dark:ring-white/[0.08]">
          {pending ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <GoogleGlyph />
          )}
        </span>
      </span>
      <span className="min-w-0 flex-1 pr-10 text-center text-[15px] font-semibold leading-snug tracking-tight text-zinc-800 dark:text-zinc-100">
        {text}
      </span>
    </button>
  );
}
