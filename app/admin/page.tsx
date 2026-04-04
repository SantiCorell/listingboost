import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { userIsAdmin } from "@/lib/auth/admin";
import { getAdminDashboardStats } from "@/lib/admin/stats";
import { planLabel } from "@/lib/plans";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Plan } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageSearch, SearchCheck, History, LayoutDashboard } from "lucide-react";

const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">{hint}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id || !userIsAdmin(session.user.role ?? "USER", session.user.email)) {
    redirect("/dashboard");
  }

  const s = await getAdminDashboardStats();

  const planOrder: Plan[] = ["FREE", "PRO", "PRO_PLUS", "ENTERPRISE"];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resumen operativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Usuarios = cuentas registradas. Tráfico = visitas a la web (incluye anónimos que aceptan cookies
          analíticas), distinto del registro.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Los ingresos son estimaciones internas, no el extracto de Stripe.
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-violet-500/5 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Herramientas (mismo producto que los usuarios)</CardTitle>
          <CardDescription>
            Como admin puedes usar boost de ficha, auditoría URL e historial con tu cuenta. Las métricas de
            arriba son globales.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/product">
              <PackageSearch className="h-4 w-4" />
              Boost ficha
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/audit">
              <SearchCheck className="h-4 w-4" />
              Scan URL
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/history">
              <History className="h-4 w-4" />
              Historial
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Usuarios registrados" value={s.usersTotal} hint="Cuentas con email en la base de datos." />
        <StatCard title="Nuevos registros (7 días)" value={s.usersNew7d} />
        <StatCard
          title="Visitas web (7 días)"
          value={s.visitsTotal7d}
          hint={`Incluye quien solo navega sin registrarse. Únicos ~${s.distinctVisitors7d} (ver nota abajo).`}
        />
        <StatCard
          title="Llamadas API (7 días)"
          value={s.apiLogs7d}
          hint={`Correctas: ${s.apiLogsOk7d}`}
        />
      </div>

      <Card className="border-blue-500/20 bg-blue-500/[0.06] shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cómo se mide el tráfico</CardTitle>
          <CardDescription>{s.trafficNote}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Visitas web (30 días)"
          value={s.visitsTotal30d}
          hint={`Visitantes únicos ~${s.distinctVisitors30d} en ese periodo.`}
        />
        <StatCard
          title="Visitas web (histórico)"
          value={s.visitsTotalAll}
          hint={`Visitantes únicos distintos (histórico): ~${s.distinctVisitorsEver}`}
        />
        <StatCard
          title="Vistas 7 días · con sesión"
          value={s.visitsAuthenticated7d}
          hint="Usuario logueado al cargar la página."
        />
        <StatCard
          title="Vistas 7 días · sin sesión"
          value={s.visitsAnonymous7d}
          hint="Anónimo o sin login en esa vista."
        />
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Rutas más vistas (7 días)</CardTitle>
          <CardDescription>Basado en el beacon de analítica propia (`SiteVisit`).</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ruta</TableHead>
                <TableHead className="text-right">Vistas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {s.topPaths7d.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground">
                    Sin visitas registradas en este periodo (¿cookies analíticas rechazadas o aún sin tráfico?).
                  </TableCell>
                </TableRow>
              ) : (
                s.topPaths7d.map((row) => (
                  <TableRow key={row.path}>
                    <TableCell className="max-w-[min(100vw,28rem)] truncate font-mono text-xs">{row.path}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.views}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Análisis de ficha (total)" value={s.productAnalysesTotal} />
        <StatCard title="Auditorías URL (total)" value={s.urlAuditsTotal} />
        <StatCard title="Suscripciones activas (registro)" value={s.subscriptionsActive} />
        <StatCard
          title="MRR estimado (Pro / Pro+)"
          value={eur.format(s.mrrEuros)}
          hint={s.mrrNote}
        />
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Ingresos potenciales (referencia)</CardTitle>
          <CardDescription>{s.potentialNote}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums text-muted-foreground">
            Si todos los usuarios Free pasaran a Pro:{" "}
            <span className="text-foreground">{eur.format(s.potentialMrrIfAllFreeConvert)}</span> / mes
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {s.freeUsers} usuarios en plan Free ahora mismo.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Usuarios por plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {planOrder.map((p) => (
              <li key={p} className="flex justify-between rounded-lg border border-border/60 px-3 py-2">
                <span>{planLabel(p)}</span>
                <span className="tabular-nums font-medium">{s.planCounts[p] ?? 0}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Llamadas API por usuario (7 días)</CardTitle>
          <CardDescription>Basado en la tabla ApiLog (p. ej. DeepSeek).</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Llamadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {s.apiByUserRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground">
                    Sin datos en este periodo.
                  </TableCell>
                </TableRow>
              ) : (
                s.apiByUserRows.map((row) => (
                  <TableRow key={row.userId}>
                    <TableCell className="max-w-[240px] truncate font-mono text-xs">{row.email}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.calls}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Últimos usuarios</CardTitle>
          <CardDescription>Hasta 40 registros más recientes.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Fichas</TableHead>
                <TableHead className="text-right">URLs</TableHead>
                <TableHead>Alta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {s.recentUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="max-w-[200px] truncate text-sm">{u.email ?? "—"}</TableCell>
                  <TableCell>{planLabel(u.plan)}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell className="text-right tabular-nums">{u._count.productAnalyses}</TableCell>
                  <TableCell className="text-right tabular-nums">{u._count.urlAudits}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {u.createdAt.toLocaleDateString("es-ES")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Registro API reciente (30 días)</CardTitle>
          <CardDescription>Últimas 60 entradas.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Operación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">ms</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {s.recentApiLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {log.createdAt.toLocaleString("es-ES")}
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-xs">{log.user?.email ?? "—"}</TableCell>
                  <TableCell className="text-xs">{log.provider}</TableCell>
                  <TableCell className="text-xs">{log.operation}</TableCell>
                  <TableCell className="text-xs">{log.ok ? "OK" : "Error"}</TableCell>
                  <TableCell className="text-right tabular-nums text-xs">{log.latencyMs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
