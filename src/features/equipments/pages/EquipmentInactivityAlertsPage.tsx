import { AlertTriangle, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/shared/components/core/Badge";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Pagination } from "@/shared/components/core/Pagination";
import { Select } from "@/shared/components/core/Select";
import { Table } from "@/shared/components/core/Table";
import { TableFilters } from "@/shared/components/core/TableFilters";
import { ErrorState } from "@/shared/components/ErrorState";
import { APP_CONFIG } from "@/shared/constants/config";
import { useDebouncedSearchFilter } from "@/shared/hooks/useDebouncedSearchFilter";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useListParams } from "@/shared/hooks/useListParams";
import { formatDateTime } from "@/shared/utils/formatters";
import type { EquipmentInactivityAlert } from "@/shared/types/entities/equipment.types";
import { useEquipmentInactivityAlerts } from "../hooks/useEquipments";
import type { EquipmentInactivityAlertFilters } from "../types/equipment.dto";

export default function EquipmentInactivityAlertsPage() {
  const navigate = useNavigate();
  useHeaderConfig({
    title: "Alertas de consumo",
    description: "Clientes con equipos que necesitan seguimiento por falta de pedidos relacionados",
  });
  const { filters, setFilter, resetFilters, hasActiveFilters, queryParams, setPage, setLimit } = useListParams({
    initialFilters: { search: "", state: undefined as EquipmentInactivityAlertFilters["state"] },
    filterConfig: {
      state: { parse: (value) => value as EquipmentInactivityAlertFilters["state"], isEmpty: (value) => !value },
    },
    defaultLimit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    syncWithUrl: true,
  });
  const search = useDebouncedSearchFilter({ value: filters.search, onChange: (value) => setFilter("search", value), delay: 350 });
  const alerts = useEquipmentInactivityAlerts(queryParams);
  const pagination = alerts.data?.meta.pagination;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-slate-50/70">
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 pt-6">
        <TableFilters className="shrink-0 items-end justify-between rounded-xl bg-white p-3">
          <div className="grid flex-1 gap-3 md:grid-cols-[minmax(18rem,1fr)_14rem]">
            <Input
              placeholder="Buscar cliente, equipo o modelo"
              value={search.inputValue}
              onChange={(event) => search.setInputValue(event.target.value)}
              endIcon={<Search className="h-4 w-4 text-slate-400" />}
            />
            <Select
              placeholder="Todas las alertas"
              value={filters.state ?? ""}
              onValueChange={(value) => setFilter("state", (value || undefined) as EquipmentInactivityAlertFilters["state"])}
              options={[
                { value: "ALERTA", label: "Requieren atención" },
                { value: "PROXIMO", label: "Próximas" },
              ]}
            />
          </div>
          {hasActiveFilters || search.inputValue ? (
            <Button variant="outline" onClick={() => { search.clearInput(); resetFilters(); }}>Limpiar filtros</Button>
          ) : null}
        </TableFilters>

        {alerts.isError ? (
          <ErrorState title="No se pudieron cargar las alertas" error={alerts.error} onRetry={alerts.refetch} />
        ) : (
          <div className="min-h-0 flex-1 overflow-hidden rounded-xl bg-white">
            <Table
              data={alerts.data?.data ?? []}
              columns={columns}
              keyExtractor={(alert) => alert.assignmentId}
              isLoading={alerts.isLoading}
              emptyMessage="No hay alertas de consumo con estos filtros"
              onRowClick={(alert) => navigate(`/equipment-assignments/${alert.assignmentId}`)}
            />
          </div>
        )}
      </div>
      {pagination ? (
        <div className="shrink-0 bg-white px-3 py-1">
          <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalItems={pagination.total} limit={pagination.limit} onPageChange={setPage} onLimitChange={setLimit} showFirstLast />
        </div>
      ) : null}
    </div>
  );
}

const columns = [
  {
    key: "customer",
    label: "Cliente",
    className: "w-[25%]",
    render: (alert: EquipmentInactivityAlert) => (
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-950">{alert.customer.businessName}</p>
        <p className="truncate text-xs text-slate-500">{alert.address.branchName || alert.address.direction || "Dirección principal"}</p>
      </div>
    ),
  },
  {
    key: "equipment",
    label: "Equipo",
    className: "w-[18%]",
    render: (alert: EquipmentInactivityAlert) => <div><p>{alert.equipment.serialNumber}</p><p className="text-xs text-slate-500">{alert.equipment.modelName}</p></div>,
  },
  {
    key: "products",
    label: "Productos monitoreados",
    className: "w-[24%]",
    render: (alert: EquipmentInactivityAlert) => <p className="line-clamp-2 text-sm text-slate-600">{alert.products.map((product) => product.name).join(", ")}</p>,
  },
  {
    key: "activity",
    label: "Último pedido válido",
    className: "w-[17%]",
    render: (alert: EquipmentInactivityAlert) => <div><p>{alert.lastOrderAt ? formatDateTime(alert.lastOrderAt) : "Sin pedidos"}</p><p className="text-xs text-slate-500">Plazo: {alert.effectiveDays} días</p></div>,
  },
  {
    key: "state",
    label: "Seguimiento",
    className: "w-[16%]",
    render: (alert: EquipmentInactivityAlert) => (
      <div className="flex items-center justify-between gap-2">
        <Badge variant={alert.state === "ALERTA" ? "warning" : "info"}>
          {alert.state === "ALERTA" ? `${alert.daysOverdue} d vencido` : `Faltan ${alert.daysRemaining} d`}
        </Badge>
        {alert.state === "ALERTA" ? <AlertTriangle className="h-4 w-4 text-amber-600" /> : <ArrowRight className="h-4 w-4 text-slate-400" />}
      </div>
    ),
  },
];
