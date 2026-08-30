import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, Boxes, ClipboardCheck, PackageCheck, ShieldCheck, Warehouse, Wrench } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/shared/components/core/Badge";
import { Button } from "@/shared/components/core/Button";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { formatDateTime } from "@/shared/utils/formatters";
import type { EquipmentInactivityAlert } from "@/shared/types/entities/equipment.types";
import { useEquipmentDashboard } from "../hooks/useEquipments";

export default function EquipmentDashboardPage() {
  const navigate = useNavigate();
  const dashboard = useEquipmentDashboard();
  useHeaderConfig({ title: "Equipos", description: "Disponibilidad, entregas y seguimiento comercial de los equipos" });

  if (dashboard.isLoading) return <SectionLoader className="h-full" placeholder="Cargando resumen de equipos" />;
  if (dashboard.isError || !dashboard.data?.data) return <ErrorState title="No se pudo cargar el resumen de equipos" error={dashboard.error} onRetry={dashboard.refetch} />;

  const data = dashboard.data.data;
  const technicalAttention = data.summary.maintenance + data.summary.damaged + data.summary.pendingReports;
  const availabilityRate = data.summary.total ? Math.round((data.summary.available / data.summary.total) * 100) : 0;

  return (
    <div className="h-full overflow-y-auto bg-slate-50/70 px-6 py-6 show-scrollbar">
      <div className="w-full space-y-6 pb-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={AlertTriangle} label="Alertas de consumo" value={data.summary.inactivityAlerts} detail={data.summary.upcomingInactivity ? `${data.summary.upcomingInactivity} próximas` : "Sin alertas próximas"} tone="amber" onClick={() => navigate("/equipments/alerts?state=ALERTA")} />
          <MetricCard icon={PackageCheck} label="Pendientes de entrega" value={data.summary.pendingDelivery} detail={`${data.summary.delivered} equipos entregados`} tone="blue" onClick={() => navigate("/equipments/assignments?deliveryStatus=PENDIENTE")} />
          <MetricCard icon={Wrench} label="Atención operativa" value={technicalAttention} detail={`${data.summary.pendingReports} reportes abiertos`} tone="rose" onClick={() => navigate("/equipments/inventory")} />
          <MetricCard icon={Warehouse} label="Disponibilidad" value={data.summary.available} detail={`${availabilityRate}% de ${data.summary.total} equipos`} tone="emerald" onClick={() => navigate("/equipments/inventory?status=DISPONIBLE")} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,.75fr)]">
          <Panel title="Seguimiento de consumo" description={`${data.summary.monitoredAssignments} asignaciones activas monitoreadas`} action={<Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate("/equipments/alerts")}>Ver todas</Button>}>
            <div className="space-y-2">
              {data.inactivityAlerts.length ? data.inactivityAlerts.map((alert) => <AlertRow key={alert.assignmentId} alert={alert} onClick={() => navigate(`/equipment-assignments/${alert.assignmentId}`)} />) : <EmptyState icon={ShieldCheck} title="Seguimiento al día" description="No hay clientes fuera del plazo configurado." />}
            </div>
          </Panel>

          <Panel title="Custodia actual" description="Distribución de los equipos por ubicación">
            {data.siteDistribution.length ? (
              <div className="h-72 pt-2">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={data.siteDistribution} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                    <XAxis type="number" hide allowDecimals={false} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={100} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip cursor={{ fill: "#f8fafc" }} formatter={(value) => [value, "Equipos"]} contentStyle={{ border: 0, borderRadius: 12, boxShadow: "0 8px 30px rgb(15 23 42 / 0.10)" }} />
                    <Bar dataKey="count" fill="#2563eb" radius={[0, 7, 7, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <EmptyState icon={Warehouse} title="Sin ubicaciones" description="Registra la custodia actual de los equipos." />}
          </Panel>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <Panel title="Entregas por completar" description="Asignaciones ordenadas por antigüedad" action={<Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate("/equipments/assignments?deliveryStatus=PENDIENTE")}>Asignaciones</Button>}>
            <div className="space-y-2">
              {data.priorityAssignments.length ? data.priorityAssignments.map((assignment) => (
                <button key={assignment.id} type="button" className="flex w-full items-center gap-4 rounded-xl bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-blue-50" onClick={() => navigate(`/equipment-assignments/${assignment.id}`)}>
                  <span className="rounded-lg bg-white p-2 text-blue-600"><PackageCheck className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-950">{assignment.customer?.businessName}</span><span className="mt-0.5 block truncate text-xs text-slate-500">{assignment.equipment?.serialNumber} · {assignment.customerAddress?.branchName || assignment.customerAddress?.city || "Dirección principal"}</span></span>
                  <span className="shrink-0 text-xs text-slate-500">{formatDateTime(assignment.assignedAt)}</span>
                </button>
              )) : <EmptyState icon={PackageCheck} title="No hay entregas pendientes" description="Todas las asignaciones activas fueron entregadas." />}
            </div>
          </Panel>

          <Panel title="Actividad reciente" description="Últimos cambios de custodia y ubicación" action={<Button variant="ghost" size="sm" onClick={() => navigate("/equipments/inventory")}>Inventario</Button>}>
            <div className="space-y-2">
              {data.recentEvents.length ? data.recentEvents.slice(0, 6).map((event) => (
                <button key={event.id} type="button" className="flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50" onClick={() => navigate(`/equipments/${event.equipment.id}`)}>
                  <span className="rounded-lg bg-slate-100 p-2 text-slate-500"><ClipboardCheck className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900">{event.equipment.serialNumber} · {event.equipment.model.name}</span><span className="block truncate text-xs text-slate-500">{event.description || event.site?.name || "Ubicación actualizada"}</span></span>
                  <span className="shrink-0 text-xs text-slate-400">{formatDateTime(event.recordedAt)}</span>
                </button>
              )) : <EmptyState icon={Boxes} title="Sin actividad reciente" description="Los movimientos aparecerán aquí." />}
            </div>
          </Panel>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone, onClick }: { icon: typeof AlertTriangle; label: string; value: number; detail: string; tone: "amber" | "blue" | "rose" | "emerald"; onClick: () => void }) {
  const tones = { amber: "bg-amber-50 text-amber-700 group-hover:bg-amber-100", blue: "bg-blue-50 text-blue-700 group-hover:bg-blue-100", rose: "bg-rose-50 text-rose-700 group-hover:bg-rose-100", emerald: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100" };
  return <button type="button" onClick={onClick} className="group flex min-h-32 items-start gap-4 rounded-2xl bg-white p-5 text-left shadow-sm shadow-slate-200/50 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><span className={`rounded-xl p-2.5 transition-colors ${tones[tone]}`}><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block text-sm text-slate-500">{label}</span><span className="mt-1 block text-3xl font-semibold tracking-tight text-slate-950">{value}</span><span className="mt-1 block truncate text-xs text-slate-500">{detail}</span></span></button>;
}

function Panel({ title, description, action, children }: { title: string; description: string; action?: ReactNode; children: ReactNode }) {
  return <article className="min-w-0 rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold text-slate-950">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div>{action}</div><div className="mt-5">{children}</div></article>;
}

function AlertRow({ alert, onClick }: { alert: EquipmentInactivityAlert; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors ${alert.state === "ALERTA" ? "bg-amber-50 hover:bg-amber-100/80" : "bg-blue-50/70 hover:bg-blue-50"}`}><span className={`rounded-lg bg-white p-2 ${alert.state === "ALERTA" ? "text-amber-600" : "text-blue-600"}`}><AlertTriangle className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-950">{alert.customer.businessName}</span><span className="mt-0.5 block truncate text-xs text-slate-600">{alert.equipment.modelName} · {alert.products.map((product) => product.name).join(", ")}</span></span><Badge variant={alert.state === "ALERTA" ? "warning" : "info"}>{alert.state === "ALERTA" ? `${alert.daysOverdue} días vencido` : `Faltan ${alert.daysRemaining} días`}</Badge></button>;
}

function EmptyState({ icon: Icon, title, description }: { icon: typeof Boxes; title: string; description: string }) {
  return <div className="flex min-h-40 flex-col items-center justify-center rounded-xl bg-slate-50 px-6 text-center"><Icon className="h-6 w-6 text-slate-400" /><p className="mt-3 text-sm font-medium text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{description}</p></div>;
}
