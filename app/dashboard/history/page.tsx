import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { historyTake } from "@/lib/usage";
import { canOpenSavedStudy } from "@/lib/history-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditsUpsellBanner } from "@/components/pricing/credits-upsell-banner";
import { ChevronRight, Lock } from "lucide-react";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });
  const take = historyTake(user.plan, session.user.role, session.user.email);

  const [products, audits] = await Promise.all([
    prisma.productAnalysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: take ?? 500,
    }),
    prisma.urlAudit.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: take ?? 500,
    }),
  ]);

  const canOpen = canOpenSavedStudy(user.plan, session.user.role, session.user.email);

  return (
    <div className="space-y-8">
      <CreditsUpsellBanner />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Historial</h1>
          <p className="text-sm text-muted-foreground">
            {user.plan === "FREE"
              ? `Últimos ${take} elementos en Free. Los estudios guardados se abren con Pro.`
              : "Historial completo. Pulsa una fila para abrir el estudio."}
          </p>
        </div>
        {user.plan === "FREE" ? (
          <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
            Pasar a Pro
          </Link>
        ) : null}
      </div>

      {!canOpen ? (
        <p className="rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          <Lock className="mb-1 inline h-4 w-4 text-primary" aria-hidden /> Con plan Free ves el listado, pero
          no puedes abrir el detalle del análisis. Sube a Pro para recuperar títulos, copys y auditorías
          completas.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Productos (boost de ficha)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin registros.</p>
          ) : (
            products.map((p) =>
              canOpen ? (
                <Link
                  key={p.id}
                  href={`/dashboard/history/product/${p.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <span className="text-muted-foreground">{formatDate(p.createdAt)}</span>
                  <Badge variant="secondary">{p.platformTarget}</Badge>
                  <span className="min-w-0 flex-1 text-xs text-muted-foreground">
                    {(p.descriptionInput ?? "Sin descripción").slice(0, 100)}
                    {(p.descriptionInput?.length ?? 0) > 100 ? "…" : ""}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ) : (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-3 text-sm"
                >
                  <span className="text-muted-foreground">{formatDate(p.createdAt)}</span>
                  <Badge variant="secondary">{p.platformTarget}</Badge>
                  <span className="min-w-0 flex-1 text-xs text-muted-foreground">
                    {(p.descriptionInput ?? "").slice(0, 80)}
                    {(p.descriptionInput?.length ?? 0) > 80 ? "…" : ""}
                  </span>
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <Lock className="h-3 w-3" />
                    Pro
                  </Badge>
                </div>
              ),
            )
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">URLs (auditoría SEO)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {audits.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin registros.</p>
          ) : (
            audits.map((u) =>
              canOpen ? (
                <Link
                  key={u.id}
                  href={`/dashboard/history/audit/${u.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 px-3 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <span className="min-w-0 flex-1 break-all text-foreground">{u.url}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(u.createdAt)} · {u.pageType}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ) : (
                <div
                  key={u.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-3 text-sm"
                >
                  <span className="min-w-0 flex-1 break-all text-muted-foreground">{u.url}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(u.createdAt)} · {u.pageType}
                  </span>
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <Lock className="h-3 w-3" />
                    Pro
                  </Badge>
                </div>
              ),
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
