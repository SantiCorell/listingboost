"use client";

import { Suspense, useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

type Tab = "login" | "register";

export function AuthModal({
  open,
  onOpenChange,
  googleAuthAvailable,
  initialTab = "login",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  googleAuthAvailable: boolean;
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [postRegisterHint, setPostRegisterHint] = useState(false);

  useEffect(() => {
    if (open) {
      setTab(initialTab);
    } else {
      setPostRegisterHint(false);
    }
  }, [open, initialTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92dvh,720px)] w-[calc(100%-1rem)] max-w-[420px] overflow-hidden rounded-2xl border-border/70 p-0 shadow-2xl sm:max-w-md">
        <div className="max-h-[min(92dvh,720px)] overflow-y-auto overscroll-contain px-1 pb-4 pt-2 sm:px-2 sm:pb-5 sm:pt-3">
          <DialogHeader className="space-y-2 px-4 pb-1 pt-0 text-center sm:px-5">
            <div className="mx-auto flex flex-col items-center gap-2">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary via-primary to-accent shadow-md shadow-primary/25 ring-1 ring-primary/15">
                <Zap
                  className="relative z-10 h-7 w-7 text-primary-foreground drop-shadow-[0_0_12px_rgba(250,245,255,0.5)]"
                  strokeWidth={2.65}
                  aria-hidden
                />
              </span>
              <p className="text-center text-lg font-bold tracking-tight">
                <span className="text-foreground">Listing</span>
                <span className="text-gradient-brand">Boost</span>
              </p>
            </div>
            <DialogTitle className="sr-only">Acceso a ListingBoost</DialogTitle>
            <p className="text-sm text-muted-foreground">Entra o crea cuenta gratis en un momento.</p>
          </DialogHeader>

          {postRegisterHint ? (
            <p className="mx-4 mb-2 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2.5 text-center text-sm font-medium text-primary sm:mx-5">
              Cuenta creada. Inicia sesión con tu email y contraseña (o Google si usaste ese método).
            </p>
          ) : null}

          <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="px-3 pb-1 sm:px-4">
            <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl bg-muted/80 p-1">
              <TabsTrigger value="login" className="rounded-lg text-sm font-semibold">
                Iniciar sesión
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg text-sm font-semibold">
                Registrarse
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-3 outline-none focus-visible:ring-0 sm:mt-4">
              <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-muted/60" aria-hidden />}>
                <LoginForm
                  googleAuthAvailable={googleAuthAvailable}
                  variant="modal"
                  callbackUrl="/dashboard"
                  onRequestClose={() => onOpenChange(false)}
                />
              </Suspense>
            </TabsContent>
            <TabsContent value="register" className="mt-3 outline-none focus-visible:ring-0 sm:mt-4">
              <RegisterForm
                googleAuthAvailable={googleAuthAvailable}
                variant="modal"
                onSwitchToLogin={() => setTab("login")}
                onRegistered={() => {
                  setPostRegisterHint(true);
                  setTab("login");
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
