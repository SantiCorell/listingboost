"use client";

import { useState, useTransition } from "react";
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
import { CREDIT_COST_URL_AUDIT } from "@/lib/usage";
import { Badge } from "@/components/ui/badge";
import { Loader2, LineChart } from "lucide-react";

const schema = z.object({
  url: z.string().url(),
  country: z.string().min(2),
  keywordHint: z.string().optional(),
  pageType: z.nativeEnum(UrlPageType),
});

type FormValues = z.infer<typeof schema>;

export function UrlAuditForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<UrlAuditActionState>({ status: "idle" });
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "https://",
      country: "España",
      keywordHint: "",
      pageType: UrlPageType.PRODUCT,
    },
  });

  function onSubmit(values: FormValues) {
    setServerError(null);
    startTransition(async () => {
      const res = await runUrlAudit({
        url: values.url,
        country: values.country,
        keywordHint: values.keywordHint?.trim() || undefined,
        pageType: values.pageType,
      });
      setResult(res);
      if (res.status === "error") setServerError(res.message);
    });
  }

  return (
    <div className="space-y-8">
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            Scan SEO de URL
            <Badge variant="secondary" className="font-mono text-xs font-semibold">
              {CREDIT_COST_URL_AUDIT} créditos / ejecución
            </Badge>
          </CardTitle>
          <CardDescription>
            HTML público → heurísticas + score + priorización. Cada análisis completo descuenta{" "}
            {CREDIT_COST_URL_AUDIT} créditos de tu cupo o extras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" placeholder="https://tutienda.com/products/..." {...form.register("url")} />
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
                    <SelectItem value={UrlPageType.PRODUCT}>Producto</SelectItem>
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
                placeholder="Ej. zapatillas running mujer"
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
                "Ejecutar auditoría"
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
