"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, LineChart, FileText, GitCompare, PenLine, RefreshCw } from "lucide-react";
import { FEATURE_CREDITS } from "@/lib/feature-credits";
import { SerpMonitoringCard } from "@/components/seo/serp-monitoring-card";
import { ContentGeneratorResult } from "@/components/seo/content-generator-result";
import { BlogOptimizerResult } from "@/components/seo/blog-optimizer-result";
import { CompetitorCompareResult } from "@/components/seo/competitor-compare-result";
import type { CompetitorCompareOutput } from "@/types/competitor-compare";
import { isCompetitorCompareOutput } from "@/types/competitor-compare";
import type { ContentGeneratorOutput } from "@/types/content-generator";
import { isContentGeneratorOutput } from "@/types/content-generator";
import type { BlogOptimizerOutput } from "@/types/blog-optimizer";
import { isBlogOptimizerOutput } from "@/types/blog-optimizer";
import Link from "next/link";

const VALID_DEFAULT_TABS = ["content", "blog", "competitor", "monitor"] as const;
type EngineTab = (typeof VALID_DEFAULT_TABS)[number];

export function SeoEngineWorkbench({
  defaultTab = "content",
  monitoringLocked,
  competitorLocked,
  allowDailyMonitoring,
  competitorPdfExportFree,
}: {
  /** P.ej. `?tab=monitor` desde Historial. */
  defaultTab?: EngineTab;
  monitoringLocked: boolean;
  competitorLocked: boolean;
  /** Cadencia diaria solo Pro+ (Growth). */
  allowDailyMonitoring: boolean;
  /** Pro+ / Enterprise / admin: PDF comparativa sin coste. */
  competitorPdfExportFree: boolean;
}) {
  const initialTab = VALID_DEFAULT_TABS.includes(defaultTab) ? defaultTab : "content";
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [contentBundle, setContentBundle] = useState<{
    data: ContentGeneratorOutput;
    keyword: string;
    type: "blog" | "product";
  } | null>(null);
  const [blogBundle, setBlogBundle] = useState<{ data: BlogOptimizerOutput } | null>(null);
  const [competitorBundle, setCompetitorBundle] = useState<{
    data: CompetitorCompareOutput;
    urlA: string;
    urlB: string;
  } | null>(null);

  async function postContent(keyword: string, type: "blog" | "product", country?: string) {
    setErr(null);
    setContentBundle(null);
    setBlogBundle(null);
    setCompetitorBundle(null);
    setLoading("/api/seo/content");
    try {
      const r = await fetch("/api/seo/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, type, ...(country?.trim() ? { country: country.trim() } : {}) }),
      });
      const j = (await r.json()) as { error?: string; output?: unknown };
      if (!r.ok) {
        setErr(j.error ?? "Error");
        return;
      }
      if (j.output && isContentGeneratorOutput(j.output)) {
        setContentBundle({ data: j.output, keyword: keyword.trim(), type });
      } else {
        setErr("Respuesta inesperada del servidor.");
      }
    } catch {
      setErr("Red");
    } finally {
      setLoading(null);
    }
  }

  async function postBlog(rawText: string) {
    setErr(null);
    setContentBundle(null);
    setBlogBundle(null);
    setCompetitorBundle(null);
    setLoading("/api/seo/blog");
    try {
      const r = await fetch("/api/seo/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });
      const j = (await r.json()) as { error?: string; output?: unknown };
      if (!r.ok) {
        setErr(j.error ?? "Error");
        return;
      }
      if (j.output && isBlogOptimizerOutput(j.output)) {
        setBlogBundle({ data: j.output });
      } else {
        setErr("Respuesta inesperada del servidor.");
      }
    } catch {
      setErr("Red");
    } finally {
      setLoading(null);
    }
  }

  async function postCompetitor(urlA: string, urlB: string) {
    setErr(null);
    setContentBundle(null);
    setBlogBundle(null);
    setCompetitorBundle(null);
    setLoading("/api/seo/competitor");
    try {
      const r = await fetch("/api/seo/competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlA, urlB }),
      });
      const j = (await r.json()) as { error?: string; output?: unknown };
      if (!r.ok) {
        setErr(j.error ?? "Error");
        return;
      }
      if (j.output && isCompetitorCompareOutput(j.output)) {
        setCompetitorBundle({ data: j.output, urlA: urlA.trim(), urlB: urlB.trim() });
      } else {
        setErr("Respuesta inesperada del servidor.");
      }
    } catch {
      setErr("Red");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Tabs
      defaultValue={initialTab}
      className="w-full space-y-6"
      onValueChange={() => {
        setErr(null);
        setContentBundle(null);
        setBlogBundle(null);
        setCompetitorBundle(null);
      }}
    >
      <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xl border border-border/60 bg-muted/30 p-1 shadow-sm sm:grid-cols-4">
        <TabsTrigger value="content" className="gap-1 text-xs sm:text-sm">
          <FileText className="h-3.5 w-3.5" />
          Contenido
        </TabsTrigger>
        <TabsTrigger value="blog" className="gap-1 text-xs sm:text-sm">
          <PenLine className="h-3.5 w-3.5" />
          Blog
        </TabsTrigger>
        <TabsTrigger value="competitor" className="gap-1 text-xs sm:text-sm">
          <GitCompare className="h-3.5 w-3.5" />
          Competidor
        </TabsTrigger>
        <TabsTrigger value="monitor" className="gap-1 text-xs sm:text-sm">
          <LineChart className="h-3.5 w-3.5" />
          Monitor
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        <Card className="overflow-hidden border-border/80 shadow-md">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-violet-500/8 via-transparent to-purple-500/8">
            <CardTitle className="text-lg">Generador SEO</CardTitle>
            <CardDescription>
              Meta, H1, secciones y FAQs listos para publicar.{" "}
              <Badge variant="secondary">
                {FEATURE_CREDITS.SEO_CONTENT_BLOG === FEATURE_CREDITS.SEO_CONTENT_PRODUCT
                  ? `${FEATURE_CREDITS.SEO_CONTENT_BLOG} cr`
                  : `${FEATURE_CREDITS.SEO_CONTENT_BLOG}–${FEATURE_CREDITS.SEO_CONTENT_PRODUCT} cr`}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <ContentForm
              loading={loading === "/api/seo/content"}
              onSubmit={(keyword, type, country) => void postContent(keyword, type, country)}
            />
            {loading === "/api/seo/content" ? (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-violet-300/50 bg-violet-50/40 px-4 py-8 dark:bg-violet-950/20">
                <Loader2 className="h-6 w-6 shrink-0 animate-spin text-violet-600" />
                <div>
                  <p className="font-medium text-foreground">Generando contenido…</p>
                  <p className="text-sm text-muted-foreground">Suele tardar entre 20 s y 2 min.</p>
                </div>
              </div>
            ) : err ? (
              <p className="text-sm text-destructive">{err}</p>
            ) : contentBundle ? (
              <ContentGeneratorResult
                data={contentBundle.data}
                keyword={contentBundle.keyword}
                type={contentBundle.type}
              />
            ) : null}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="blog">
        <Card className="overflow-hidden border-border/80 shadow-md">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-emerald-500/8 via-transparent to-teal-500/8">
            <CardTitle className="text-lg">Blog optimizer</CardTitle>
            <CardDescription>
              Título, intro y artículo en Markdown + checklist de publicación.{" "}
              <Badge variant="secondary">{FEATURE_CREDITS.BLOG_OPTIMIZE} cr</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <BlogForm loading={loading === "/api/seo/blog"} onSubmit={(rawText) => void postBlog(rawText)} />
            {loading === "/api/seo/blog" ? (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-emerald-300/50 bg-emerald-50/40 px-4 py-8 dark:bg-emerald-950/20">
                <Loader2 className="h-6 w-6 shrink-0 animate-spin text-emerald-600" />
                <div>
                  <p className="font-medium text-foreground">Optimizando tu borrador…</p>
                  <p className="text-sm text-muted-foreground">Reescritura, FAQs sugeridas y enlazado interno.</p>
                </div>
              </div>
            ) : err ? (
              <p className="text-sm text-destructive">{err}</p>
            ) : blogBundle ? (
              <BlogOptimizerResult data={blogBundle.data} />
            ) : null}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="competitor">
        {competitorLocked ? (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-sm text-muted-foreground">
              La comparativa requiere plan de pago.{" "}
              <Link href="/pricing" className="font-medium text-primary underline">
                Ver precios
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden border-border/80 shadow-md">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-rose-500/8 via-transparent to-orange-500/8">
              <CardTitle className="text-lg">Vs competidor</CardTitle>
              <CardDescription className="space-y-1">
                <span className="block">
                  Dos URLs públicas. <Badge variant="secondary">{FEATURE_CREDITS.COMPETITOR_COMPARE} cr</Badge>
                </span>
                <span className="block text-xs text-muted-foreground">
                  Exportar informe PDF: Free/Pro{" "}
                  <Badge variant="outline" className="font-normal">
                    1 cr
                  </Badge>
                  · Pro+ / Enterprise{" "}
                  <Badge variant="outline" className="font-normal">
                    incluido
                  </Badge>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <CompetitorForm
                loading={loading === "/api/seo/competitor"}
                onSubmit={(urlA, urlB) => void postCompetitor(urlA, urlB)}
              />
              {loading === "/api/seo/competitor" ? (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-rose-300/50 bg-rose-50/40 px-4 py-8 dark:bg-rose-950/20">
                  <Loader2 className="h-6 w-6 shrink-0 animate-spin text-rose-600" />
                  <div>
                    <p className="font-medium text-foreground">Rastreando ambas URLs…</p>
                    <p className="text-sm text-muted-foreground">Análisis de contenido y recomendaciones con IA.</p>
                  </div>
                </div>
              ) : err ? (
                <p className="text-sm text-destructive">{err}</p>
              ) : competitorBundle ? (
                <CompetitorCompareResult
                  data={competitorBundle.data}
                  urlA={competitorBundle.urlA}
                  urlB={competitorBundle.urlB}
                  pdfExportFree={competitorPdfExportFree}
                />
              ) : null}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="monitor">
        {monitoringLocked ? (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-sm text-muted-foreground">
              El monitoring de posiciones requiere plan Pro o superior.{" "}
              <Link href="/pricing" className="font-medium text-primary underline">
                Subir de plan
              </Link>
            </CardContent>
          </Card>
        ) : (
          <MonitoringPanel allowDaily={allowDailyMonitoring} />
        )}
      </TabsContent>
    </Tabs>
  );
}

function ContentForm({
  onSubmit,
  loading,
}: {
  onSubmit: (keyword: string, type: "blog" | "product", country?: string) => void;
  loading: boolean;
}) {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState<"blog" | "product">("blog");
  const [country, setCountry] = useState("España");

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-muted/15 p-4">
      <div>
        <Label htmlFor="seo-keyword">Keyword principal</Label>
        <Input
          id="seo-keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="ej. zapatillas running mujer"
          className="mt-1.5"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="seo-country">Mercado / país (opcional)</Label>
          <select
            id="seo-country"
            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="España">España</option>
            <option value="México">México</option>
            <option value="Colombia">Colombia</option>
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
            <option value="USA / internacional">USA / internacional</option>
          </select>
        </div>
        <div>
          <span className="block text-sm font-medium">Formato</span>
          <div className="mt-1.5 flex gap-2">
            <Button
              type="button"
              variant={type === "blog" ? "default" : "outline"}
              size="sm"
              className={type === "blog" ? "bg-violet-600 hover:bg-violet-500" : ""}
              onClick={() => setType("blog")}
            >
              Blog
            </Button>
            <Button
              type="button"
              variant={type === "product" ? "default" : "outline"}
              size="sm"
              className={type === "product" ? "bg-violet-600 hover:bg-violet-500" : ""}
              onClick={() => setType("product")}
            >
              Producto
            </Button>
          </div>
        </div>
      </div>
      <Button
        type="button"
        className="bg-gradient-to-r from-violet-600 to-purple-600 shadow-sm hover:from-violet-500 hover:to-purple-500"
        disabled={loading || !keyword.trim()}
        onClick={() => onSubmit(keyword, type, country)}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generar contenido"}
      </Button>
    </div>
  );
}

function BlogForm({
  onSubmit,
  loading,
}: {
  onSubmit: (rawText: string) => void;
  loading: boolean;
}) {
  const [text, setText] = useState("");
  const n = text.length;
  const okLen = n >= 80;

  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/15 p-4">
      <div className="flex items-end justify-between gap-2">
        <Label htmlFor="blog-draft">Borrador del artículo</Label>
        <span className={`text-xs tabular-nums ${okLen ? "text-muted-foreground" : "text-amber-700 dark:text-amber-300"}`}>
          {n} / 80 mín.
        </span>
      </div>
      <Textarea
        id="blog-draft"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        placeholder="Pega el título, entradilla y cuerpo del post (mínimo ~80 caracteres)…"
        className="min-h-[200px] resize-y font-mono text-sm leading-relaxed"
      />
      <Button
        type="button"
        className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-sm hover:from-emerald-500 hover:to-teal-500"
        disabled={loading || !okLen}
        onClick={() => onSubmit(text)}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Optimizar borrador"}
      </Button>
    </div>
  );
}

function CompetitorForm({
  onSubmit,
  loading,
}: {
  onSubmit: (a: string, b: string) => void;
  loading: boolean;
}) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  return (
    <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="comp-a">Tu URL</Label>
          <Input
            id="comp-a"
            className="mt-1.5"
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="https://tu-dominio.es/…"
          />
        </div>
        <div>
          <Label htmlFor="comp-b">Competidor</Label>
          <Input
            id="comp-b"
            className="mt-1.5"
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="https://competidor.com/…"
          />
        </div>
      </div>
      <Button
        type="button"
        className="mt-4 bg-gradient-to-r from-rose-600 to-orange-500 shadow-sm hover:from-rose-500 hover:to-orange-400"
        disabled={loading || !a.trim() || !b.trim()}
        onClick={() => onSubmit(a, b)}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Comparar sitios"}
      </Button>
    </div>
  );
}

type MonitoringRow = {
  id: string;
  url: string;
  keyword: string;
  lastPosition: number | null;
  lastNote: string | null;
  lastRunAt: string | null;
  cadence: string;
  snapshots: Array<{ position: number | null; createdAt: string }>;
};

function MonitoringPanel({ allowDaily }: { allowDaily: boolean }) {
  const [items, setItems] = useState<MonitoringRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [cadence, setCadence] = useState("weekly");
  const [monitorErr, setMonitorErr] = useState<string | null>(null);
  const [runningId, setRunningId] = useState<string | null>(null);

  function mapMonitoringItems(
    raw: Array<{
      id: string;
      url: string;
      keyword: string;
      cadence: string;
      lastPosition: number | null;
      lastNote?: string | null;
      lastRunAt?: Date | string | null;
      snapshots?: Array<{ position: number | null; createdAt: Date | string }>;
    }>,
  ): MonitoringRow[] {
    return raw.map((x) => ({
      id: x.id,
      url: x.url,
      keyword: x.keyword,
      cadence: x.cadence,
      lastPosition: x.lastPosition,
      lastNote: x.lastNote ?? null,
      lastRunAt: x.lastRunAt
        ? typeof x.lastRunAt === "string"
          ? x.lastRunAt
          : x.lastRunAt.toISOString()
        : null,
      snapshots: (x.snapshots ?? []).map((s) => ({
        position: s.position,
        createdAt: typeof s.createdAt === "string" ? s.createdAt : s.createdAt.toISOString(),
      })),
    }));
  }

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/monitoring");
      const j = (await r.json()) as {
        items?: Parameters<typeof mapMonitoringItems>[0];
        locked?: boolean;
      };
      if (j.items && Array.isArray(j.items)) {
        setItems(mapMonitoringItems(j.items));
      }
    } finally {
      setLoading(false);
    }
  }

  /** Refresco sin bloquear la lista (tras crear seguimiento esperamos a SerpAPI). */
  async function silentLoad() {
    try {
      const r = await fetch("/api/monitoring");
      const j = (await r.json()) as { items?: Parameters<typeof mapMonitoringItems>[0] };
      if (j.items && Array.isArray(j.items)) {
        setItems(mapMonitoringItems(j.items));
      }
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load estable al montar
  }, []);

  return (
    <Card className="overflow-hidden border-border/80 shadow-md">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-sky-500/8 via-transparent to-indigo-500/8">
        <CardTitle className="text-lg">Seguimiento SERP</CardTitle>
        <CardDescription>
          Posición orgánica actual, <strong className="text-foreground">cambio vs la lectura anterior</strong> (↑ mejora,
          ↓ baja) y <strong className="text-foreground">gráfico de evolución</strong> con cada comprobación. Google
          España; la primera lectura suele tardar unos segundos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <Label htmlFor="monitor-url">Página a vigilar</Label>
            <Input
              id="monitor-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://tu-tienda.es/producto…"
            />
            <p className="mt-1 text-xs text-muted-foreground">La URL exacta que quieres posicionar.</p>
          </div>
          <div>
            <Label htmlFor="monitor-keyword">Consulta en Google</Label>
            <Input
              id="monitor-keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="ej. zapatillas running mujer"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Es la búsqueda que haría tu cliente: las palabras que escribe en Google y para las que quieres ver si tu
              URL sale (y en qué puesto).
            </p>
          </div>
          <div>
            <Label htmlFor="monitor-cadence">Cadencia</Label>
            <select
              id="monitor-cadence"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={allowDaily ? cadence : "weekly"}
              onChange={(e) => setCadence(e.target.value)}
            >
              <option value="weekly">Semanal</option>
              {allowDaily ? <option value="daily">Diario (Pro+)</option> : null}
            </select>
          </div>
        </div>
        <Button
          type="button"
          className="bg-gradient-to-r from-sky-600 to-indigo-600 shadow-sm hover:from-sky-500 hover:to-indigo-500"
          onClick={async () => {
            setMonitorErr(null);
            try {
              const r = await fetch("/api/monitoring", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, keyword, cadence }),
              });
              const j = (await r.json()) as { error?: string };
              if (!r.ok) {
                setMonitorErr(j.error ?? "No se pudo guardar");
                return;
              }
              setUrl("");
              setKeyword("");
              await load();
              void (async () => {
                for (let i = 0; i < 14; i++) {
                  await new Promise((resolve) => setTimeout(resolve, i === 0 ? 800 : 2600));
                  await silentLoad();
                }
              })();
            } catch {
              setMonitorErr("Error de red");
            }
          }}
        >
          Añadir seguimiento
        </Button>
        {monitorErr ? <p className="text-sm text-destructive">{monitorErr}</p> : null}

        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay seguimientos. Añade URL + consulta arriba.</p>
        ) : (
          <ul className="space-y-4 text-sm">
            {items.map((m) => (
              <SerpMonitoringCard
                key={m.id}
                url={m.url}
                keyword={m.keyword}
                cadence={m.cadence}
                lastPosition={m.lastPosition}
                lastNote={m.lastNote}
                lastRunAt={m.lastRunAt}
                snapshots={m.snapshots}
                running={runningId === m.id}
                onRefresh={async () => {
                  setRunningId(m.id);
                  try {
                    const r = await fetch("/api/monitoring/run", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ id: m.id }),
                    });
                    const j = (await r.json()) as { error?: string };
                    if (!r.ok) {
                      setMonitorErr(j.error ?? "Error al comprobar");
                      return;
                    }
                    setMonitorErr(null);
                    await load();
                  } catch {
                    setMonitorErr("Error de red");
                  } finally {
                    setRunningId(null);
                  }
                }}
                onRemove={async () => {
                  await fetch(`/api/monitoring?id=${m.id}`, { method: "DELETE" });
                  await load();
                }}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
