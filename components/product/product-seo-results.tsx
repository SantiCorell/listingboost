"use client";

import { useCallback } from "react";
import type { Plan } from "@prisma/client";
import type { ProductAnalysisOutput, PlatformContent } from "@/types/product-analysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Download } from "lucide-react";
import { FREE_COPY_WATERMARK } from "@/lib/constants";
import { HashtagStrip } from "@/components/product/hashtag-strip";

function CopyRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
  }, [value]);
  if (!value) return null;
  return (
    <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Button type="button" variant="ghost" size="sm" className="h-8" onClick={copy}>
          <Copy className="h-3.5 w-3.5" />
          Copiar
        </Button>
      </div>
      <p className="whitespace-pre-wrap text-sm">{value}</p>
    </div>
  );
}

function PlatformPanel({ data }: { data: PlatformContent }) {
  const shopify = data.shopifyExtras;

  return (
    <div className="space-y-4">
      <CopyRow label="Título SEO" value={data.title} />
      <CopyRow label="Descripción corta" value={data.shortDescription} />
      <CopyRow label="Descripción larga" value={data.longDescription} />
      <div className="rounded-lg border border-border/60 p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Bullets</p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          {data.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.primaryKeywords.map((k) => (
          <Badge key={k} variant="secondary">
            {k}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {data.longTailKeywords.map((k) => (
          <Badge key={k} variant="outline">
            {k}
          </Badge>
        ))}
      </div>
      <HashtagStrip hashtags={data.hashtags ?? []} />
      <CopyRow label="Alt imagen" value={data.altText} />
      <CopyRow label="CTA" value={data.callToAction} />
      {shopify ? (
        <>
          <Separator />
          <p className="text-sm font-semibold">Shopify / tienda</p>
          <CopyRow label="Meta title" value={shopify.metaTitle} />
          <CopyRow label="Meta description" value={shopify.metaDescription} />
          <CopyRow label="Slug" value={shopify.slug} />
          <div className="rounded-lg border border-border/60 p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">FAQs</p>
            <div className="space-y-3">
              {shopify.faqs.map((f, i) => (
                <div key={i}>
                  <p className="text-sm font-medium">{f.question}</p>
                  <p className="text-sm text-muted-foreground">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                JSON-LD sugerido
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(shopify.jsonLdProduct, null, 2),
                  )
                }
              >
                <Copy className="h-3.5 w-3.5" />
                Copiar JSON
              </Button>
            </div>
            <pre className="max-h-64 overflow-auto text-xs">
              {JSON.stringify(shopify.jsonLdProduct, null, 2)}
            </pre>
          </div>
        </>
      ) : null}
      <details className="rounded-lg border border-border/60 p-3 text-sm">
        <summary className="cursor-pointer font-medium">Atributos y extras</summary>
        <div className="mt-3 space-y-2 text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Categoría sugerida: </span>
            {data.suggestedCategory}
          </p>
          <p>
            <span className="font-medium text-foreground">Tono recomendado: </span>
            {data.recommendedTone}
          </p>
          <p className="font-medium text-foreground">Tips CTR / conversión</p>
          <ul className="list-inside list-disc">
            {data.ctrConversionTips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
          {data.priceSuggestion ? (
            <p>
              <span className="font-medium text-foreground">Precio (orientativo): </span>
              {data.priceSuggestion.suggestedRangeLabel} —{" "}
              {data.priceSuggestion.rationale}
            </p>
          ) : null}
          <p className="font-medium text-foreground">Tags</p>
          <div className="flex flex-wrap gap-1">
            {data.tags.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}

export function ProductSeoResults({
  output,
  userPlan,
}: {
  output: unknown;
  userPlan: Plan;
}) {
  const data = output as ProductAnalysisOutput;

  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `producto-seo-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const tabs: { id: string; label: string; content?: PlatformContent }[] = [];
  if (data.platforms.wallapop)
    tabs.push({ id: "wallapop", label: "Wallapop", content: data.platforms.wallapop });
  if (data.platforms.ebay)
    tabs.push({ id: "ebay", label: "eBay", content: data.platforms.ebay });
  if (data.platforms.shopify)
    tabs.push({ id: "shopify", label: "Shopify", content: data.platforms.shopify });
  if (data.platforms.genericEcommerce)
    tabs.push({
      id: "generic",
      label: "Ecommerce",
      content: data.platforms.genericEcommerce,
    });

  const defaultTab = tabs[0]?.id ?? "wallapop";

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Resultado del análisis</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.detectedProductType} · {data.targetAudience}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Categoría global sugerida: {data.suggestedCategoryGlobal}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={download}>
            <Download className="h-4 w-4" />
            Descargar JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {userPlan === "FREE" ? (
          <p className="mb-4 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
            {FREE_COPY_WATERMARK}
          </p>
        ) : null}
        <Tabs defaultValue={defaultTab}>
          <TabsList className="flex w-full flex-wrap justify-start gap-1">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) =>
            t.content ? (
              <TabsContent key={t.id} value={t.id}>
                <PlatformPanel data={t.content} />
              </TabsContent>
            ) : null,
          )}
        </Tabs>
        <p className="mt-6 text-xs text-muted-foreground">
          Este informe se ha guardado automáticamente en tu historial.
        </p>
      </CardContent>
    </Card>
  );
}
