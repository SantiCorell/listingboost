"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

export function ContactMailtoForm({ toEmail }: { toEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setBusy(true);
    const subject = encodeURIComponent(`Contacto ListingBoost${name ? ` — ${name}` : ""}`);
    const body = encodeURIComponent(
      [
        name ? `Nombre: ${name}` : null,
        email ? `Email de respuesta: ${email}` : null,
        "",
        message.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    );
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
    setTimeout(() => setBusy(false), 800);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
      <Button type="submit" size="lg" className="w-full gap-2 sm:w-auto" disabled={busy || !message.trim()}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Abrir email y enviar
      </Button>
      <p className="text-xs text-muted-foreground">
        Se abrirá tu cliente de correo con el mensaje listo. Si no tienes uno configurado, escríbenos directamente a{" "}
        <a href={`mailto:${toEmail}`} className="font-medium text-primary underline-offset-4 hover:underline">
          {toEmail}
        </a>
        .
      </p>
    </form>
  );
}
