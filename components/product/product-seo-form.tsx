"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProductPlatformTarget } from "@prisma/client";
import { runProductSeoAnalysis, type ProductSeoActionState } from "@/actions/product-seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductSeoResults } from "@/components/product/product-seo-results";
import { UploadDropzone } from "@/lib/uploadthing-components";
import { FREE_COPY_WATERMARK } from "@/lib/constants";
import { isPaidPlan } from "@/lib/plans";
import { BOOST_JOBS_STORAGE_KEY } from "@/components/jobs/job-notifications-provider";
import type { Plan } from "@prisma/client";
import Link from "next/link";
import {
  Loader2,
  Sparkles,
  Zap,
  Layers,
  Target,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const schema = z.object({
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  platformTarget: z.nativeEnum(ProductPlatformTarget),
  language: z.string().min(2),
  country: z.string().min(2),
  categoryHint: z.string().optional(),
  tone: z.enum(["profesional", "vendedor", "premium", "cercano"]),
});

type FormValues = z.infer<typeof schema>;

export function ProductSeoForm({
  userPlan,
}: {
  userPlan: Plan;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ProductSeoActionState>({ status: "idle" });
  const [serverError, setServerError] = useState<string | null>(null);
  const [runInBackground, setRunInBackground] = useState(false);
  const [queuedBanner, setQueuedBanner] = useState<string | null>(null);
  const paid = isPaidPlan(userPlan);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      imageUrl: "",
      platformTarget: ProductPlatformTarget.ALL,
      language: "es",
      country: "España",
      categoryHint: "",
      tone: "profesional",
    },
  });

  const platformWatch = form.watch("platformTarget");

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setQueuedBanner(null);

    if (runInBackground && paid) {
      try {
        const res = await fetch("/api/jobs/product-boost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: values.description,
            imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : null,
            platformTarget: values.platformTarget,
            language: values.language,
            country: values.country,
            categoryHint: values.categoryHint?.trim() || undefined,
            tone: values.tone,
          }),
        });
        const j = (await res.json()) as { error?: string; jobId?: string; title?: string };
        if (!res.ok) {
          setServerError(j.error ?? "No se pudo encolar la tarea.");
          return;
        }
        if (j.jobId) {
          let list: { id: string; title: string }[] = [];
          try {
            const raw = localStorage.getItem(BOOST_JOBS_STORAGE_KEY);
            if (raw) list = JSON.parse(raw) as typeof list;
          } catch {
            list = [];
          }
          list.push({ id: j.jobId, title: j.title ?? "Boost de ficha" });
          localStorage.setItem(BOOST_JOBS_STORAGE_KEY, JSON.stringify(list));
        }
        setResult({ status: "idle" });
        setQueuedBanner(
          `«${j.title ?? "Boost"}» se está generando en segundo plano. Puedes cambiar de página; te avisamos al terminar.`,
        );
      } catch {
        setServerError("Error de red al encolar el boost.");
      }
      return;
    }

    startTransition(async () => {
      const res = await runProductSeoAnalysis({
        description: values.description,
        imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : null,
        platformTarget: values.platformTarget,
        language: values.language,
        country: values.country,
        categoryHint: values.categoryHint?.trim() || undefined,
        tone: values.tone,
      });
      setResult(res);
      if (res.status === "error") setServerError(res.message);
    });
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-violet-600/10 via-background to-amber-500/10 p-6 shadow-sm sm:p-8">
        <div className="relative z-[1] flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              ListingBrain™ multicanal
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Ficha que vende en cada marketplace
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Sube imagen y/o pega tu copy. El motor adapta tono, keywords y estructura a Wallapop, eBay,
              Shopify o una versión genérica lista para pegar.
            </p>
          </div>
          <div className="grid shrink-0 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/70 p-3 text-xs backdrop-blur">
              <Layers className="mt-0.5 h-4 w-4 text-violet-600" />
              <div>
                <p className="font-medium text-foreground">Todas las plataformas</p>
                <p className="text-muted-foreground">
                  Informe amplio multicanal: buen panorama general, menos hiper-específico que un solo canal.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/70 p-3 text-xs backdrop-blur">
              <Target className="mt-0.5 h-4 w-4 text-amber-600" />
              <div>
                <p className="font-medium text-foreground">Una plataforma</p>
                <p className="text-muted-foreground">
                  Reglas y matices al máximo para ese canal (título, bullets, CTA, límites típicos).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {queuedBanner ? (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <p className="text-muted-foreground">{queuedBanner}</p>
        </div>
      ) : null}

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-amber-500" />
            Nuevo boost de ficha
          </CardTitle>
          <CardDescription>
            Cuanta más contexto (público, uso, diferenciales), mejor salida. La categoría opcional ayuda al
            modelo a acertar tono y keywords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="rounded-xl border border-dashed border-primary/25 bg-muted/30 p-4">
              <Label className="text-base">Imagen del producto</Label>
              <p className="mb-3 text-xs text-muted-foreground">
                Opcional pero potente: el modelo lee la imagen para inferir categoría, atributos y alt text.
              </p>
              <UploadDropzone
                endpoint="productImage"
                onClientUploadComplete={(files) => {
                  const url = files[0]?.url;
                  if (url) form.setValue("imageUrl", url, { shouldValidate: true });
                }}
                onUploadError={(e) => setServerError(e.message)}
              />
              {form.watch("imageUrl") ? (
                <p className="mt-2 text-xs text-muted-foreground break-all">{form.watch("imageUrl")}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción / notas</Label>
              <Textarea
                id="description"
                className="min-h-[140px] resize-y"
                placeholder="Título actual, specs, público, precio orientativo, qué lo hace distinto, objeciones que quieres cubrir…"
                {...form.register("description")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Plataforma objetivo</Label>
                <Select
                  value={form.watch("platformTarget")}
                  onValueChange={(v) =>
                    form.setValue("platformTarget", v as ProductPlatformTarget)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Elige" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProductPlatformTarget.ALL}>Todas (multicanal)</SelectItem>
                    <SelectItem value={ProductPlatformTarget.WALLAPOP}>Wallapop</SelectItem>
                    <SelectItem value={ProductPlatformTarget.EBAY}>eBay</SelectItem>
                    <SelectItem value={ProductPlatformTarget.SHOPIFY}>Shopify</SelectItem>
                    <SelectItem value={ProductPlatformTarget.GENERIC}>Ecommerce genérico</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {platformWatch === ProductPlatformTarget.ALL
                    ? "Salida para varios canales a la vez (visión general)."
                    : "Salida focalizada en un solo canal, con reglas más estrictas."}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Tono</Label>
                <Select
                  value={form.watch("tone")}
                  onValueChange={(v) =>
                    form.setValue("tone", v as FormValues["tone"])
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profesional">Profesional</SelectItem>
                    <SelectItem value="vendedor">Vendedor</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="cercano">Cercano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma (ISO)</Label>
                <Input id="language" {...form.register("language")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">País objetivo</Label>
                <Input id="country" {...form.register("country")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryHint">Categoría / contexto (opcional)</Label>
              <Input
                id="categoryHint"
                placeholder="Ej. moto clásica, skincare cruelty-free, piezas Apple…"
                {...form.register("categoryHint")}
              />
            </div>

            <Accordion type="single" collapsible className="rounded-xl border border-border/60 px-4">
              <AccordionItem value="tips" className="border-none">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  Consejos rápidos para mejores resultados
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm text-muted-foreground">
                  <ul className="list-inside list-disc space-y-1">
                    <li>Incluye dimensiones, estado, envíos y lo que un comprador preguntaría en el chat.</li>
                    <li>Si eliges un solo marketplace, menciona restricciones (ej. sin enlaces externos).</li>
                    <li>En segundo plano (Pro) el consumo de cupo se cuenta al terminar la tarea.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {paid ? (
              <div className="flex flex-col gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="bg-job"
                    checked={runInBackground}
                    onCheckedChange={(c) => setRunInBackground(c === true)}
                  />
                  <div>
                    <Label htmlFor="bg-job" className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-violet-600" />
                      Ejecutar en segundo plano
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Encola el boost y navega tranquilo. Cuando termine verás una notificación con enlace al
                      resultado. Solo planes de pago.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Plan Free:</span> el boost se ejecuta en esta
                pantalla (esperas hasta que termine).{" "}
                <span className="text-foreground">Pro o superior:</span> tareas en segundo plano +
                notificaciones.
                <span className="mt-2 block">{FREE_COPY_WATERMARK}</span>
              </p>
            )}

            {serverError ? (
              <p className="text-sm text-destructive">{serverError}</p>
            ) : null}

            <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
              {pending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Generando…
                </>
              ) : runInBackground && paid ? (
                <>
                  <Zap className="h-4 w-4" />
                  Encolar boost
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analizar con IA
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result.status === "success" ? (
        <div className="space-y-4">
          <ProductSeoResults output={result.output} userPlan={userPlan} />
          {paid ? (
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href={`/dashboard/history/product/${result.analysisId}`}>Ver en historial</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
