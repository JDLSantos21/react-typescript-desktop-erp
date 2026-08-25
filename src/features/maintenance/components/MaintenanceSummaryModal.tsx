import { AlertTriangle, CalendarClock, Gauge } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { Modal } from "@/shared/components/core/Modal";
import { formatLongDate } from "@/shared/utils/formatters";
import type { Maintenance, MaintenanceProjection } from "../types/maintenance";

export type MaintenanceSummaryView = "ACTIVE" | "OVERDUE" | "DUE" | "UPCOMING";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  view: MaintenanceSummaryView | null;
  scheduled: Maintenance[];
  projections: MaintenanceProjection[];
  onOpenMaintenance: (id: string) => void;
}

const titles: Record<MaintenanceSummaryView, string> = {
  ACTIVE: "Trabajos activos",
  OVERDUE: "Trabajos vencidos",
  DUE: "Unidades que requieren mantenimiento",
  UPCOMING: "Próximos mantenimientos",
};

export function MaintenanceSummaryModal({
  isOpen,
  onClose,
  view,
  scheduled,
  projections,
  onOpenMaintenance,
}: Props) {
  if (!view) return null;
  const records =
    view === "ACTIVE"
      ? scheduled
      : view === "OVERDUE"
        ? scheduled.filter((item) => item.status === "VENCIDO")
        : [];
  const projectionRows =
    view === "DUE"
      ? projections.filter((item) => item.status === "DUE")
      : view === "UPCOMING"
        ? projections.filter((item) => item.status === "UPCOMING")
        : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titles[view]} size="xl">
      <Modal.Body>
        {records.length === 0 && projectionRows.length === 0 ? (
          <EmptyState
            title="No hay registros"
            description="No hay elementos para este indicador en este momento."
          />
        ) : (
          <div className="divide-y divide-border border-y border-border">
            {records.map((maintenance) => (
              <button
                key={maintenance.id}
                onClick={() => {
                  onOpenMaintenance(maintenance.id);
                  onClose();
                }}
                className="grid w-full gap-3 py-4 text-left text-sm transition-colors hover:bg-gray-50 sm:grid-cols-[1.2fr_1fr_auto] sm:items-center"
              >
                <div>
                  <p className="font-medium text-text-primary">
                    {maintenance.vehicle?.licensePlate ?? "Unidad"}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {maintenance.vehicle
                      ? maintenance.vehicle.brand + " " + maintenance.vehicle.model
                      : "Vehículo"}
                  </p>
                </div>
                <p className="text-text-secondary">
                  {maintenance.scheduledDate
                    ? formatLongDate(maintenance.scheduledDate)
                    : "Sin fecha"}
                </p>
                <span className={maintenance.status === "VENCIDO" ? "font-medium text-danger" : "font-medium text-primary"}>
                  {maintenance.status === "VENCIDO" ? "Vencido" : "Ver trabajo"}
                </span>
              </button>
            ))}
            {projectionRows.map((projection) => (
              <div
                key={projection.vehicle.id}
                className="grid gap-3 py-4 text-sm sm:grid-cols-[1.2fr_1fr_1fr] sm:items-center"
              >
                <div>
                  <p className="font-medium text-text-primary">
                    {projection.vehicle.licensePlate}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {projection.vehicle.brand + " " + projection.vehicle.model}
                  </p>
                </div>
                <p className="flex items-center gap-2 text-text-secondary">
                  <CalendarClock className="h-4 w-4" />
                  {projection.remainingDays == null
                    ? "Sin criterio de tiempo"
                    : projection.remainingDays <= 0
                      ? "Tiempo alcanzado"
                      : projection.remainingDays + " días restantes"}
                </p>
                <p className={projection.status === "DUE" ? "flex items-center gap-2 font-medium text-danger" : "flex items-center gap-2 text-text-secondary"}>
                  {projection.status === "DUE" ? <AlertTriangle className="h-4 w-4" /> : <Gauge className="h-4 w-4" />}
                  {projection.remainingKilometers == null
                    ? "Sin lectura de kilometraje"
                    : projection.remainingKilometers <= 0
                      ? "Kilometraje alcanzado"
                      : projection.remainingKilometers.toLocaleString("es-DO") + " km restantes"}
                </p>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
