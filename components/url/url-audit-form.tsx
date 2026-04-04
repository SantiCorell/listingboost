"use client";

import { useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UrlPageType } from "@prisma/client";
import { runUrlAudit, type UrlAuditActionState } from "@/actions/url-audit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlAuditResults } from "@/components/url/url-audit-results";
import {
  totalCreditsForUrlAudit,
  modulesFromPreset,
  CREDIT_URL_AUDIT_BASE,
  CREDIT_URL_AUDIT_LLM,
  CREDIT_URL_AUDIT_SITEMAP,
  type UrlAuditPreset,
} from "@/lib/url-audit/credits-config";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, LineChart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  url: z.string().url(),
  country: z.string().min(2),
  keywordHint: z.string().optional(),
  pageType: z.nativeEnum(UrlPageType),
  preset: z.enum(["essential", "standard", "complete", "custom"]),
  includeFullLlm: z.boolean(),
  includeSitemap: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const PRESETS: {
  id: UrlAuditPreset;
  label: string;
  desc: string;
  credits: number;
}[] = [
  {
    id: "essential",
    label: "Esencial",
    desc: `Crawl + puntuación + issues (${CREDIT_URL_AUDIT_BASE} cr). Sin informe largo de IA.`,
    credits: totalCreditsForUrlAudit(modulesFromPreset("essential")),
  },
  {
    id: "standard",
    label: "Estándar",
    desc: `Esencial + informe IA completo (title, meta, FAQs, prioridades) (+${CREDIT_URL_AUDIT_LLM} cr).`,
    credits: totalCreditsForUrlAudit(modulesFromPreset("standard")),
  },
  {
    id: "complete",
    label: "Completo",
    desc: `Estándar + inventario de sitemaps del dominio (+${CREDIT_URL_AUDIT_SITEMAP} cr).`,
    credits: totalCreditsForUrlAudit(modulesFromPreset("complete")),
  },
];

export function UrlAuditForm() {
  const searchParams = useSearchParams();
  const sector = searchParams.get("sector");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<UrlAuditActionState>({ status: "idle" });
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultKeyword =
    sector === "inmobiliaria"
      ? "piso venta [zona] idealista fotocasa"
      : "";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "https://",
      country: "España",
      keywordHint: defaultKeyword,
      pageType: UrlPageType.PRODUCT,
      preset: "standard",
      includeFullLlm: true,
      includeSitemap: false,
    },
  });

  const preset = form.watch("preset");
  const includeFullLlm = form.watch("includeFullLlm");
  const includeSitemap = form.watch("includeSitemap");

  const creditsPreview = useMemo(() => {
    if (preset === "custom") {
      return totalCreditsForUrlAudit({ includeFullLlm, includeSitemap });
    }
    return totalCreditsForUrlAudit(modulesFromPreset(preset));
  }, [preset, includeFullLlm, includeSitemap]);

  function onSubmit(values: FormValues) {
    setServerError(null);
    startTransition(async () => {
      const res = await runUrlAudit({
        url: values.url,
        country: values.country,
        keywordHint: values.keywordHint?.trim() || undefined,
        pageType: values.pageType,
        preset: values.preset,
        includeFullLlm: values.preset === "custom" ? values.includeFullLlm : undefined,
        includeSitemap: values.preset === "custom" ? values.includeSitemap : undefined,
      });
      setResult(res);
      if (res.status === "error") setServerError(res.message);
    });
  }

  return (
    <div className="space-y-8">
      {sector === "inmobiliaria" ? (
        <Card className="border-violet-500/25 bg-violet-500/[0.06]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-violet-600" />
              Sector inmobiliario
            </CardTitle>
            <CardDescription>
              Ideal para fichas de Idealista, Fotocasa o tu web propia: usa tipo de página{" "}
              <strong>Producto</strong> o <strong>Otro</strong> y ajusta la keyword al barrio o tipo de inmueble.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Scan SEO de URL
            <Badge variant="secondary" className="font-mono text-xs font-semibold">
              desde {CREDIT_URL_AUDIT_BASE} créditos
            </Badge>
          </CardTitle>
          <CardDescription>
            Elige el alcance: <strong>Esencial</strong> solo técnico; <strong>Estándar</strong> añade informe con IA;{" "}
            <strong>Completo</strong> suma inventario de sitemaps. El PDF del informe cuesta{" "}
            <strong>1 crédito</strong> aparte (tras el análisis).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Preset</Label>
              <div className="grid gap-3 sm:grid-cols-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      form.setValue("preset", p.id);
                      if (p.id !== "custom") {
                        const m = modulesFromPreset(p.id);
                        form.setValue("includeFullLlm", m.includeFullLlm);
                        form.setValue("includeSitemap", m.includeSitemap);
                      }
                    }}
                    className={cn(
                      "rounded-xl border p-4 text-left text-sm transition-colors",
                      preset === p.id
                        ? "border-primary bg-primary/[0.08] shadow-sm"
                        : "border-border/80 bg-card hover:border-primary/30",
                    )}
                  >
                    <div className="font-semibold">{p.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground leading-snug">{p.desc}</div>
                    <Badge className="mt-2 font-mono text-[10px]" variant="outline">
                      {p.credits} cr
                    </Badge>
                  </button>
                ))}
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={preset === "custom"}
                  onCheckedChange={(c) => {
                    if (c) {
                      form.setValue("preset", "custom");
                    } else {
                      form.setValue("preset", "standard");
                      const m = modulesFromPreset("standard");
                      form.setValue("includeFullLlm", m.includeFullLlm);
                      form.setValue("includeSitemap", m.includeSitemap);
                    }
                  }}
                />
                Personalizar módulos
              </label>
              {preset === "custom" ? (
                <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border/80 p-4 sm:flex-row sm:items-center">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={includeFullLlm}
                      onCheckedChange={(c) => form.setValue("includeFullLlm", Boolean(c))}
                    />
                    Informe IA completo (+{CREDIT_URL_AUDIT_LLM} cr)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={includeSitemap}
                      onCheckedChange={(c) => form.setValue("includeSitemap", Boolean(c))}
                    />
                    Inventario sitemaps (+{CREDIT_URL_AUDIT_SITEMAP} cr)
                  </label>
                  <span className="ml-auto font-mono text-sm font-semibold tabular-nums text-primary">
                    Total: {creditsPreview} cr
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Total de esta ejecución:{" "}
                  <strong className="text-foreground">{creditsPreview} créditos</strong>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" placeholder="https://…" {...form.register("url")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">País objetivo</Label>
                <Input id="country" {...form.register("country")} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de página</Label>
                <Select
                  value={form.watch("pageType")}
                  onValueChange={(v) => form.setValue("pageType", v as UrlPageType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UrlPageType.HOME}>Home</SelectItem>
                    <SelectItem value={UrlPageType.PRODUCT}>Producto / ficha</SelectItem>
                    <SelectItem value={UrlPageType.COLLECTION}>Colección</SelectItem>
                    <SelectItem value={UrlPageType.BLOG}>Artículo blog</SelectItem>
                    <SelectItem value={UrlPageType.CATEGORY}>Categoría</SelectItem>
                    <SelectItem value={UrlPageType.OTHER}>Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywordHint">Keyword principal (opcional)</Label>
              <Input
                id="keywordHint"
                placeholder="Ej. ático obra nueva Málaga"
                {...form.register("keywordHint")}
              />
            </div>
            {serverError ? (
              <p className="text-sm text-destructive">{serverError}</p>
            ) : null}
            <Button type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analizando…
                </>
              ) : (
                `Ejecutar · ${creditsPreview} crédito${creditsPreview === 1 ? "" : "s"}`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      {result.status === "success" ? (
        <UrlAuditResults output={result.output} auditId={result.auditId} />
      ) : null}
    </div>
  );
}
