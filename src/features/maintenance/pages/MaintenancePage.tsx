import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PermissionGate } from "@/shared/authorization/PermissionGate";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Pagination } from "@/shared/components/core/Pagination";
import { Select } from "@/shared/components/core/Select";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useModal } from "@/shared/hooks/useModal";
import { usePagination } from "@/shared/hooks/usePagination";
import { queryClient } from "@/shared/lib/query-client";
import { useSocket } from "@/shared/contexts/SocketContext";
import { formatLongDate } from "@/shared/utils/formatters";
import { CreateMaintenanceModal } from "../components/CreateMaintenanceModal";
import {
  MaintenanceSummaryModal,
  type MaintenanceSummaryView,
} from "../components/MaintenanceSummaryModal";
import { MaintenanceDetailModal } from "../components/MaintenanceDetailModal";
import { useMaintenanceDashboard, useMaintenances } from "../hooks/useMaintenance";
import type { Maintenance, MaintenanceStatus } from "../types/maintenance";

const statusLabels: Record<MaintenanceStatus, string> = {
  PROGRAMADO: "Programado",
  EN_PROGRESO: "En progreso",
  PARCIAL: "Parcial",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
  VENCIDO: "Vencido",
};

export default function MaintenancePage() {
  const createModal = useModal();
  const summaryModal = useModal();
  const { socket } = useSocket();
  const { page, limit, setPage, setLimit } = usePagination({ defaultLimit: 10 });
  const [status, setStatus] = useState<MaintenanceStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [summaryView, setSummaryView] = useState<MaintenanceSummaryView | null>(null);
  const dashboard = useMaintenanceDashboard();
  const filters = useMemo(
    () => ({
      page,
      limit,
      status: status || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy: "scheduledDate" as const,
      sortOrder: "asc" as const,
    }),
    [dateFrom, dateTo, limit, page, status],
  );
  const list = useMaintenances(filters);
  const records = list.data?.data ?? [];
  const pagination = list.data?.meta.pagination;
  const total = pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;
  const scheduled = dashboard.data?.data.scheduled ?? [];
  const upcoming = dashboard.data?.data.upcoming ?? [];
  const summary = dashboard.data?.data.summary;

  useHeaderConfig({
    title: "Mantenimiento",
    actions: (
      <PermissionGate minimumLevel={PermissionLevel.SUPERVISION}>
        <Button
          variant="outline"
          icon={Plus}
          className="whitespace-nowrap"
          onClick={createModal.open}
        >
          Generar mantenimiento
        </Button>
      </PermissionGate>
    ),
  });

  useEffect(() => {
    if (!socket) return;
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      toast.info("Se actualizó un mantenimiento");
    };
    socket.on("maintenance:created", refresh);
    socket.on("maintenance:authorized", refresh);
    socket.on("maintenance:processed", refresh);
    socket.on("maintenance:status-changed", refresh);
    return () => {
      socket.off("maintenance:created", refresh);
      socket.off("maintenance:authorized", refresh);
      socket.off("maintenance:processed", refresh);
      socket.off("maintenance:status-changed", refresh);
    };
  }, [socket]);

  const clearFilters = () => {
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };
  const openSummary = (view: MaintenanceSummaryView) => {
    setSummaryView(view);
    summaryModal.open();
  };

  if (dashboard.isLoading) {
    return <SectionLoader className="h-full" placeholder="Cargando mantenimiento" />;
  }
  if (dashboard.isError) {
    return <ErrorState error={dashboard.error} onRetry={dashboard.refetch} title="No se pudo cargar el mantenimiento" />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gray-50/50">
      <div className="grid shrink-0 divide-y divide-gray-100 border-b border-gray-200 bg-white sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <Metric label="Activos" value={summary?.scheduled ?? 0} onClick={() => openSummary("ACTIVE")} />
        <Metric label="Vencidos" value={summary?.overdue ?? 0} tone="danger" onClick={() => openSummary("OVERDUE")} />
        <Metric label="Por generar" value={summary?.due ?? 0} tone="danger" onClick={() => openSummary("DUE")} />
        <Metric label="Próximos" value={summary?.upcoming ?? 0} tone="warning" onClick={() => openSummary("UPCOMING")} />
      </div>

      <section className="min-h-0 flex flex-1 flex-col overflow-hidden bg-white">
        <div className="grid shrink-0 gap-3 border-b border-gray-100 bg-gray-50/70 p-4 sm:grid-cols-2 lg:grid-cols-[12rem_1fr_1fr_auto]">
          <Select label="Estado" placeholder="Todos" value={status} onValueChange={(value) => { setStatus(value as MaintenanceStatus); setPage(1); }} options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))} size="sm" />
          <Input label="Desde" type="date" inputSize="sm" value={dateFrom} onChange={(event) => { setDateFrom(event.target.value); setPage(1); }} />
          <Input label="Hasta" type="date" inputSize="sm" value={dateTo} onChange={(event) => { setDateTo(event.target.value); setPage(1); }} />
          <Button variant="outline" className="self-end" onClick={clearFilters}>Limpiar</Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          {list.isLoading ? <SectionLoader placeholder="Cargando trabajos" /> : list.isError ? <ErrorState error={list.error} onRetry={list.refetch} title="No se pudo cargar la lista" /> : records.length === 0 ? <EmptyState title="No hay mantenimientos" description="Los trabajos generados y programados aparecerán aquí." /> : <MaintenanceTable records={records} onOpen={setSelectedId} />}
        </div>
        <div className="shrink-0 border-t border-gray-200 px-4 py-3">
          <Pagination currentPage={Math.min(page, totalPages)} totalPages={totalPages} totalItems={total} limit={limit} onPageChange={setPage} onLimitChange={setLimit} />
        </div>
      </section>

      <CreateMaintenanceModal isOpen={createModal.isOpen} onClose={createModal.close} />
      <MaintenanceSummaryModal isOpen={summaryModal.isOpen} onClose={summaryModal.close} view={summaryView} scheduled={scheduled} projections={upcoming} onOpenMaintenance={setSelectedId} />
      <MaintenanceDetailModal maintenanceId={selectedId} isOpen={Boolean(selectedId)} onClose={() => setSelectedId(null)} />
    </div>
  );
}

function Metric({ label, value, tone = "neutral", onClick }: { label: string; value: number; tone?: "neutral" | "warning" | "danger"; onClick: () => void }) {
  const color = tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "text-text-primary";
  return <button onClick={onClick} className="group px-6 py-4 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"><p className="text-xs text-text-muted group-hover:text-text-secondary">{label}</p><p className={"mt-1 text-2xl font-semibold " + color}>{value}</p></button>;
}

function MaintenanceTable({ records, onOpen }: { records: Maintenance[]; onOpen: (id: string) => void }) {
  return <table className="w-full min-w-[58rem] text-left"><thead className="border-b border-gray-200 text-xs text-text-muted"><tr><th className="px-5 py-3 font-medium">Vehículo</th><th className="py-3 font-medium">Programado</th><th className="py-3 font-medium">Disparador</th><th className="py-3 font-medium">Estado</th><th className="px-5 py-3 text-right font-medium">Acción</th></tr></thead><tbody className="divide-y divide-gray-100">{records.map((maintenance) => <tr key={maintenance.id} className="text-sm"><td className="px-5 py-4"><p className="font-medium text-text-primary">{maintenance.vehicle?.licensePlate ?? "—"}</p><p className="mt-0.5 text-xs text-text-muted">{maintenance.vehicle ? maintenance.vehicle.brand + " " + maintenance.vehicle.model : "Unidad"}</p></td><td className="py-4 text-text-secondary">{maintenance.scheduledDate ? formatLongDate(maintenance.scheduledDate) : "—"}</td><td className="py-4 text-text-secondary">{maintenance.triggerReason === "TIME" ? "Tiempo" : maintenance.triggerReason === "MILEAGE" ? "Kilometraje" : maintenance.triggerReason === "TIME_AND_MILEAGE" ? "Tiempo y km" : "Manual"}</td><td className={"py-4 font-medium " + (maintenance.status === "VENCIDO" ? "text-danger" : "text-text-primary")}>{statusLabels[maintenance.status]}</td><td className="px-5 py-4 text-right"><Button size="sm" variant="outline" onClick={() => onOpen(maintenance.id)}>Ver detalle</Button></td></tr>)}</tbody></table>;
}
