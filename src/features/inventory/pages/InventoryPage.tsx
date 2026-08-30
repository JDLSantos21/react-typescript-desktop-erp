import type { ReactNode } from "react";
import { AlertTriangle, ArrowDownToLine, ArrowRight, ArrowUpFromLine, Boxes, PackageCheck, PackageX, RefreshCcw, ShieldCheck } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/shared/components/core/Badge";
import { Button } from "@/shared/components/core/Button";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { formatDateTime } from "@/shared/utils/formatters";
import type { InventoryMaterial, StockMove, StockMoveType } from "../types/inventory";
import { useInventoryDashboard } from "../hooks/useInventory";

const moveLabels: Record<StockMoveType, string> = { ENTRADA: "Entrada", SALIDA: "Salida", AJUSTE: "Ajuste" };
const activityLabel = (date: string) => new Intl.DateTimeFormat("es-DO", { weekday: "short" }).format(new Date(`${date}T12:00:00`));

export default function InventoryPage() {
  const navigate = useNavigate();
  const dashboard = useInventoryDashboard();
  useHeaderConfig({ title: "Inventario", description: "Disponibilidad, reposición y actividad de los materiales" });

  if (dashboard.isLoading) return <SectionLoader className="h-full" placeholder="Cargando inventario" />;
  if (dashboard.isError || !dashboard.data?.data) return <ErrorState title="No se pudo cargar el resumen de inventario" error={dashboard.error} onRetry={dashboard.refetch} />;

  const data = dashboard.data.data;
  const { summary } = data;

  return (
    <div className="h-full overflow-y-auto bg-slate-50/70 px-6 py-6 show-scrollbar">
      <div className="w-full space-y-6 pb-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={AlertTriangle} label="Requieren reposición" value={summary.requiresRestock} detail={`${summary.materialsBelowMinimum} bajo mínimo`} tone="amber" onClick={() => navigate("/inventory/materials")} />
          <MetricCard icon={PackageX} label="Sin existencias" value={summary.outOfStock} detail={summary.outOfStock ? "Atención prioritaria" : "Sin faltantes críticos"} tone="rose" onClick={() => navigate("/inventory/materials")} />
          <MetricCard icon={ShieldCheck} label="Stock saludable" value={summary.healthyMaterials} detail={`de ${summary.totalMaterials} materiales`} tone="emerald" onClick={() => navigate("/inventory/materials")} />
          <MetricCard icon={RefreshCcw} label="Operaciones en 7 días" value={summary.movementCount} detail={`${summary.movementsToday} registradas hoy`} tone="blue" onClick={() => navigate("/inventory/movements")} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,.75fr)]">
          <Panel title="Prioridad de reposición" description="Materiales agotados o en el mínimo configurado" action={<Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate("/inventory/materials")}>Ver materiales</Button>}>
            <div className="space-y-2">
              {data.stockAlerts.length ? data.stockAlerts.map((material) => <StockAlertRow key={material.id} material={material} onClick={() => navigate("/inventory/materials")} />) : <EmptyState icon={PackageCheck} title="Inventario abastecido" description="No hay materiales agotados ni por debajo del mínimo." />}
            </div>
          </Panel>

          <Panel title="Salud del inventario" description={`${summary.totalMaterials} materiales registrados`}>
            <div className="space-y-5">
              <div className="flex h-3 overflow-hidden rounded-full bg-slate-100" aria-label="Distribución del estado del inventario">
                <span className="bg-emerald-500" style={{ width: percentage(summary.healthyMaterials, summary.totalMaterials) }} />
                <span className="bg-amber-400" style={{ width: percentage(summary.materialsBelowMinimum, summary.totalMaterials) }} />
                <span className="bg-rose-500" style={{ width: percentage(summary.outOfStock, summary.totalMaterials) }} />
              </div>
              <div className="space-y-3">
                <HealthRow color="bg-emerald-500" label="Stock saludable" value={summary.healthyMaterials} />
                <HealthRow color="bg-amber-400" label="Bajo mínimo" value={summary.materialsBelowMinimum} />
                <HealthRow color="bg-rose-500" label="Sin existencias" value={summary.outOfStock} />
              </div>
              {summary.materialsWithoutMinimum > 0 ? <button type="button" onClick={() => navigate("/inventory/materials")} className="flex w-full items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100"><span><span className="block text-sm font-medium text-slate-800">{summary.materialsWithoutMinimum} sin mínimo definido</span><span className="mt-0.5 block text-xs text-slate-500">Configura un mínimo para detectar reposición a tiempo.</span></span><ArrowRight className="h-4 w-4 shrink-0 text-slate-400" /></button> : null}
            </div>
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,.65fr)]">
          <Panel title="Actividad de los últimos 7 días" description="Número de operaciones registradas por día">
            <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-500"><LegendDot color="bg-blue-600" label="Entradas" /><LegendDot color="bg-amber-500" label="Salidas" /><LegendDot color="bg-slate-400" label="Ajustes" /></div>
            <div className="h-72 min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={data.activity.map((item) => ({ ...item, label: activityLabel(item.date) }))} margin={{ top: 8, right: 8, left: -24, bottom: 0 }} barGap={4}>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 8px 30px rgb(15 23 42 / 0.10)" }} />
                  <Bar dataKey="entries" name="Entradas" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={26} />
                  <Bar dataKey="exits" name="Salidas" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={26} />
                  <Bar dataKey="adjustments" name="Ajustes" fill="#94a3b8" radius={[6, 6, 0, 0]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Últimos movimientos" description="Trazabilidad reciente de la operación" action={<Button variant="ghost" size="sm" onClick={() => navigate("/inventory/movements")}>Historial</Button>}>
            <div className="space-y-2">
              {data.recentMoves.length ? data.recentMoves.map((move) => <RecentMoveRow key={move.id} move={move} />) : <EmptyState icon={Boxes} title="Sin actividad reciente" description="Los movimientos aparecerán aquí." />}
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}

function percentage(value: number, total: number) { return total ? `${(value / total) * 100}%` : "0%"; }

function MetricCard({ icon: Icon, label, value, detail, tone, onClick }: { icon: typeof AlertTriangle; label: string; value: number; detail: string; tone: "amber" | "blue" | "rose" | "emerald"; onClick: () => void }) {
  const tones = { amber: "bg-amber-50 text-amber-700 group-hover:bg-amber-100", blue: "bg-blue-50 text-blue-700 group-hover:bg-blue-100", rose: "bg-rose-50 text-rose-700 group-hover:bg-rose-100", emerald: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100" };
  return <button type="button" onClick={onClick} className="group flex min-h-32 items-start gap-4 rounded-2xl bg-white p-5 text-left shadow-sm shadow-slate-200/50 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><span className={`rounded-xl p-2.5 transition-colors ${tones[tone]}`}><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block text-sm text-slate-500">{label}</span><span className="mt-1 block text-3xl font-semibold tracking-tight text-slate-950">{value}</span><span className="mt-1 block truncate text-xs text-slate-500">{detail}</span></span></button>;
}

function Panel({ title, description, action, children }: { title: string; description: string; action?: ReactNode; children: ReactNode }) {
  return <article className="min-w-0 rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold text-slate-950">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div>{action}</div><div className="mt-5">{children}</div></article>;
}

function StockAlertRow({ material, onClick }: { material: InventoryMaterial; onClick: () => void }) {
  const exhausted = material.stock === 0;
  const missing = Math.max(0, material.minimumStock - material.stock);
  return <button type="button" onClick={onClick} className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors ${exhausted ? "bg-rose-50 hover:bg-rose-100/80" : "bg-amber-50 hover:bg-amber-100/80"}`}><span className={`rounded-lg bg-white p-2 ${exhausted ? "text-rose-600" : "text-amber-600"}`}>{exhausted ? <PackageX className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-950">{material.name}</span><span className="mt-0.5 block truncate text-xs text-slate-600">{material.unit.name} · existencia {material.stock} · mínimo {material.minimumStock}</span></span><Badge variant={exhausted ? "danger" : "warning"}>{missing > 0 ? `Faltan ${missing}` : "Agotado"}</Badge></button>;
}

function HealthRow({ color, label, value }: { color: string; label: string; value: number }) { return <div className="flex items-center gap-3 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${color}`} /><span className="flex-1 text-slate-600">{label}</span><span className="font-semibold text-slate-900">{value}</span></div>; }
function LegendDot({ color, label }: { color: string; label: string }) { return <span className="flex items-center gap-2"><i className={`h-2 w-2 rounded-full ${color}`} />{label}</span>; }

function RecentMoveRow({ move }: { move: StockMove }) {
  const inbound = move.quantity >= 0;
  return <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"><span className={`rounded-lg bg-white p-2 ${inbound ? "text-emerald-600" : "text-amber-600"}`}>{inbound ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowUpFromLine className="h-4 w-4" />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900">{move.material.name}</span><span className="mt-0.5 block text-xs text-slate-500">{moveLabels[move.type]} · {formatDateTime(move.date)}</span></span><span className={`text-sm font-semibold ${inbound ? "text-emerald-700" : "text-amber-700"}`}>{move.quantity > 0 ? "+" : ""}{move.quantity}</span></div>;
}

function EmptyState({ icon: Icon, title, description }: { icon: typeof Boxes; title: string; description: string }) { return <div className="flex min-h-40 flex-col items-center justify-center rounded-xl bg-slate-50 px-6 text-center"><Icon className="h-6 w-6 text-slate-400" /><p className="mt-3 text-sm font-medium text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{description}</p></div>; }
