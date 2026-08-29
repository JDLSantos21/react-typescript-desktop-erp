import { CalendarDays, Fuel, Gauge, Wrench } from "lucide-react";
import { ReactNode } from "react";
import { Badge } from "@/shared/components/core/Badge";
import {
  Vehicle,
  VehicleOperationalSummary,
} from "@/shared/types/entities/vehicle.type";
import { formatDateTime, formatLongDate } from "@/shared/utils/formatters";
import { getStatusColor } from "@/shared/utils/status.utils";

interface VehicleDetailSectionsProps {
  vehicle: Vehicle;
  summary: VehicleOperationalSummary | null;
  isSummaryLoading: boolean;
  hasSummaryError: boolean;
}

const maintenanceStatus = {
  OK: { label: "Al día", variant: "success" as const },
  UPCOMING: { label: "Próximo", variant: "warning" as const },
  DUE: { label: "Requiere atención", variant: "danger" as const },
  SCHEDULED: { label: "Trabajo activo", variant: "info" as const },
};

export function VehicleDetailSections({
  vehicle,
  summary,
  isSummaryLoading,
  hasSummaryError,
}: VehicleDetailSectionsProps) {
  const distanceSinceMaintenance = getDistanceSinceMaintenance(summary);

  return (
    <div className="space-y-8 pb-8">
      <section>
        <SectionTitle icon={Gauge}>Identificación de la unidad</SectionTitle>
        <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
          <Detail label="Ficha" value={vehicle.currentTag} mono />
          <Detail label="Placa" value={vehicle.licensePlate} mono />
          <Detail label="Chasis" value={vehicle.chasis} mono />
          <Detail label="Marca" value={vehicle.brand} />
          <Detail label="Modelo" value={vehicle.model} />
          <Detail label="Año" value={String(vehicle.year)} />
        </dl>
      </section>

      <section>
        <SectionTitle icon={Fuel}>Lectura y combustible</SectionTitle>
        {isSummaryLoading ? (
          <SummarySkeleton />
        ) : hasSummaryError ? (
          <Unavailable message="No se pudieron cargar los datos operativos de combustible." />
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <Metric
              label="Kilometraje actual"
              value={formatKilometers(summary?.latestFuelConsumption?.mileage)}
              detail={summary?.latestFuelConsumption ? `Lectura tomada ${formatDateTime(summary.latestFuelConsumption.consumedAt)}` : "Se actualizará con el primer consumo registrado"}
            />
            <Metric
              label="Combustible del último registro"
              value={summary?.latestFuelConsumption ? `${summary.latestFuelConsumption.gallons.toFixed(2)} gal` : "Sin consumos registrados"}
              detail={summary?.latestFuelConsumption ? "Cantidad entregada a esta unidad" : "Aún no hay datos de combustible"}
            />
            <Metric
              label="Recorrido desde el último mantenimiento"
              value={distanceSinceMaintenance.value}
              detail={distanceSinceMaintenance.detail}
            />
          </div>
        )}
      </section>

      <section>
        <SectionTitle icon={Wrench}>Mantenimiento</SectionTitle>
        {isSummaryLoading ? (
          <SummarySkeleton />
        ) : hasSummaryError ? (
          <Unavailable message="No se pudo cargar el estado de mantenimiento." />
        ) : !summary?.maintenance.projection ? (
          <Unavailable message="No hay un plan de mantenimiento configurado para esta unidad." />
        ) : (
          <MaintenanceOverview summary={summary} />
        )}
      </section>

      <section>
        <SectionTitle icon={CalendarDays}>Trazabilidad del registro</SectionTitle>
        <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Detail label="Registrado" value={formatDateTime(vehicle.createdAt)} />
          <Detail label="Última actualización" value={formatDateTime(vehicle.updatedAt)} />
        </dl>
      </section>
    </div>
  );
}

function MaintenanceOverview({ summary }: { summary: VehicleOperationalSummary }) {
  const projection = summary.maintenance.projection!;
  const status = maintenanceStatus[projection.status];
  const trigger = projection.triggeredBy.length
    ? projection.triggeredBy.map(triggerLabel).join(" y ")
    : "Sin criterio alcanzado";

  return (
    <div className="mt-4 grid gap-7 xl:grid-cols-2">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-slate-700">Próxima revisión</h3>
          <Badge variant={status.variant} size="sm">{status.label}</Badge>
        </div>
        <dl className="mt-4 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Detail label="Próxima fecha" value={projection.nextDueDate ? formatLongDate(projection.nextDueDate) : "No aplica"} />
          <Detail label="Faltan" value={remainingLabel(projection.remainingDays, "día")} />
          <Detail label="Próximo kilometraje" value={formatKilometers(projection.nextDueMileage)} />
          <Detail label="Faltan" value={remainingLabel(projection.remainingKilometers, "km")} />
          <Detail label="Criterios activos" value={scheduleLabel(projection.schedule.intervalMonths, projection.schedule.intervalKilometers)} />
          <Detail label="Estado de disparo" value={trigger} />
        </dl>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-700">Último y próximo trabajo</h3>
        <div className="mt-4 space-y-2">
          <ActivityRow
            label="Último mantenimiento completado"
            value={summary.maintenance.lastCompleted?.performedDate ? formatLongDate(summary.maintenance.lastCompleted.performedDate) : "Sin mantenimientos completados"}
            detail={summary.maintenance.lastCompleted?.currentMileage != null ? `${formatKilometers(summary.maintenance.lastCompleted.currentMileage)} · ${triggerReasonLabel(summary.maintenance.lastCompleted.triggerReason)}` : undefined}
          />
          <ActivityRow
            label="Trabajo de mantenimiento"
            value={projection.activeMaintenance ? maintenanceStatusLabel(projection.activeMaintenance.status) : "Sin trabajo abierto"}
            detail={projection.activeMaintenance ? `${projection.activeMaintenance.scheduledDate ? formatLongDate(projection.activeMaintenance.scheduledDate) : "Sin fecha programada"} · ${triggerReasonLabel(projection.activeMaintenance.triggerReason)}` : undefined}
            badge={projection.activeMaintenance ? <Badge className={getStatusColor(projection.activeMaintenance.status)} size="sm">{projection.activeMaintenance.status}</Badge> : undefined}
          />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Gauge; children: string }) {
  return <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Icon className="h-4 w-4 text-slate-500" />{children}</h2>;
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className={`mt-1.5 break-words text-sm text-slate-800 ${mono ? "font-mono" : ""}`}>{value}</dd></div>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-lg bg-slate-50 px-4 py-3"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>{detail ? <p className="mt-1 text-xs text-slate-500">{detail}</p> : null}</div>;
}

function ActivityRow({ label, value, detail, badge }: { label: string; value: string; detail?: string; badge?: ReactNode }) {
  return <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3"><div className="min-w-0"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-slate-900">{value}</p>{detail ? <p className="mt-1 text-xs text-slate-500">{detail}</p> : null}</div>{badge}</div>;
}

function SummarySkeleton() {
  return <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"><div className="h-20 animate-pulse rounded-lg bg-slate-100" /><div className="h-20 animate-pulse rounded-lg bg-slate-100" /><div className="h-20 animate-pulse rounded-lg bg-slate-100" /></div>;
}

function Unavailable({ message }: { message: string }) {
  return <p className="mt-4 rounded-lg bg-slate-50 px-4 py-4 text-sm text-slate-500">{message}</p>;
}

function formatKilometers(value: number | null | undefined) { return value == null ? "Sin lectura registrada" : `${value.toLocaleString("es-DO")} km`; }
function getDistanceSinceMaintenance(summary: VehicleOperationalSummary | null) {
  const currentMileage = summary?.latestFuelConsumption?.mileage;
  const lastMaintenance = summary?.maintenance.lastCompleted;

  if (!lastMaintenance) {
    return {
      value: "Sin mantenimiento base",
      detail: "Se calculará después del primer mantenimiento completado",
    };
  }
  if (lastMaintenance.currentMileage == null) {
    return {
      value: "Sin kilometraje base",
      detail: "El último mantenimiento no registró una lectura",
    };
  }
  if (currentMileage == null) {
    return {
      value: "Sin lectura actual",
      detail: lastMaintenance.performedDate
        ? `Último mantenimiento: ${formatLongDate(lastMaintenance.performedDate)}`
        : "El mantenimiento base no tiene fecha registrada",
    };
  }

  const distance = currentMileage - lastMaintenance.currentMileage;
  if (distance < 0) {
    return {
      value: "Revisar kilometraje",
      detail: "La lectura actual es menor que la del último mantenimiento",
    };
  }

  return {
    value: `${distance.toLocaleString("es-DO")} km`,
    detail: `${lastMaintenance.performedDate ? formatLongDate(lastMaintenance.performedDate) : "Último mantenimiento"} · Base ${formatKilometers(lastMaintenance.currentMileage)}`,
  };
}
function remainingLabel(value: number | null, unit: "día" | "km") { if (value == null) return "No disponible"; if (unit === "km") return `${Math.abs(value).toLocaleString("es-DO")} km ${value < 0 ? "excedidos" : "restantes"}`; return `${Math.abs(value)} ${Math.abs(value) === 1 ? "día" : "días"} ${value < 0 ? "vencidos" : "restantes"}`; }
function scheduleLabel(months: number | null, kilometers: number | null) { return [months != null ? `${months} ${months === 1 ? "mes" : "meses"}` : null, kilometers != null ? `${kilometers.toLocaleString("es-DO")} km` : null].filter(Boolean).join(" · ") || "Sin criterios activos"; }
function triggerLabel(trigger: "TIME" | "MILEAGE") { return trigger === "TIME" ? "Tiempo" : "Kilometraje"; }
function triggerReasonLabel(reason: string) { return { MANUAL: "Manual", TIME: "Por tiempo", MILEAGE: "Por kilometraje", TIME_AND_MILEAGE: "Por tiempo y kilometraje" }[reason] ?? reason; }
function maintenanceStatusLabel(status: string) { return { PROGRAMADO: "Programado", EN_PROGRESO: "En progreso", PARCIAL: "Avance guardado", VENCIDO: "Vencido" }[status] ?? status; }
