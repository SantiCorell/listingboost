"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

type Props = { fallbackMailTo: string };

export function ContactForm({ fallbackMailTo }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          message: message.trim(),
          website: honeypot,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };

      if (res.status === 503 && data.error) {
        setError(
          "El envío automático no está activo. Usa el enlace de correo abajo o escríbenos directamente.",
        );
        return;
      }
      if (!res.ok) {
        setError(data.error || "No se pudo enviar. Inténtalo de nuevo.");
        return;
      }
      setDone(true);
      setMessage("");
    } catch {
      setError("Error de red. Comprueba la conexión e inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-primary/25 bg-primary/[0.06] p-4 text-sm">
        <p className="font-medium text-foreground">Mensaje enviado</p>
        <p className="mt-1 text-muted-foreground">
          Te responderemos a <span className="font-medium text-foreground">{email || "tu correo"}</span> lo antes
          posible.
        </p>
        <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setDone(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-5">
      {/* Honeypot: no rellenar (bots suelen autocompletar) */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <Label htmlFor="contact-website">Website</Label>
        <Input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nombre</Label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="Tu nombre o empresa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="para responderte"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-msg">Mensaje</Label>
        <Textarea
          id="contact-msg"
          name="message"
          required
          rows={6}
          placeholder="Cuéntanos qué necesitas: plan, integración, dudas del producto…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[140px] resize-y text-base sm:text-sm"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" size="lg" className="w-full gap-2 sm:w-auto" disabled={busy || !message.trim()}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Enviar mensaje
      </Button>
      <p className="text-xs text-muted-foreground">
        También puedes escribirnos a{" "}
        <a href={`mailto:${fallbackMailTo}`} className="font-medium text-primary underline-offset-4 hover:underline">
          {fallbackMailTo}
        </a>
        .
      </p>
    </form>
  );
}
