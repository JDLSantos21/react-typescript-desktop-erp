import { useNavigate } from "react-router-dom";
import { SearchIcon } from "@/shared/components/icons";
import { Table } from "@/shared/components/core/Table";
import { TableFilters } from "@/shared/components/core/TableFilters";
import { Input } from "@/shared/components/core/Input";
import { Select } from "@/shared/components/core/Select";
import { Button } from "@/shared/components/core/Button";
import { Pagination } from "@/shared/components/core/Pagination";
import { Badge } from "@/shared/components/core/Badge";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useListParams } from "@/shared/hooks/useListParams";
import { useDebouncedSearchFilter } from "@/shared/hooks/useDebouncedSearchFilter";
import { APP_CONFIG } from "@/shared/constants/config";
import { formatDateTime } from "@/shared/utils/formatters";
import { useEquipmentAssignments } from "../hooks/useEquipments";
import { EquipmentAssignment } from "@/shared/types/entities/equipment.types";
import { EquipmentAssignmentFilters } from "../types/equipment.dto";
import { ErrorState } from "@/shared/components/ErrorState";

const assignmentStatusLabels = { ACTIVO: "Activa", DEVUELTO: "Devuelta", REMOVIDO: "Removida", MANTENIMIENTO: "Mantenimiento", DAÑADO: "Dañada" };

export default function EquipmentAssignmentsPage() {
  const navigate = useNavigate();
  useHeaderConfig({ title: "Asignaciones de equipos", description: "Seguimiento de entrega, custodia y cierre de equipos asignados" });
  const { filters, setFilter, resetFilters, hasActiveFilters, queryParams, setPage, setLimit } = useListParams({
    initialFilters: { search: "", status: undefined as EquipmentAssignmentFilters["status"], deliveryStatus: undefined as EquipmentAssignmentFilters["deliveryStatus"] },
    filterConfig: {
      status: { parse: (value) => value as EquipmentAssignmentFilters["status"], isEmpty: (value) => value === undefined },
      deliveryStatus: { parse: (value) => value as EquipmentAssignmentFilters["deliveryStatus"], isEmpty: (value) => value === undefined },
    },
    defaultLimit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    syncWithUrl: true,
  });
  const search = useDebouncedSearchFilter({ value: filters.search, onChange: (value) => setFilter("search", value), delay: 400 });
  const assignments = useEquipmentAssignments(queryParams);
  const pagination = assignments.data?.meta.pagination;
  const resetVisible = hasActiveFilters || search.inputValue.trim() !== "";

  return <div className="flex h-full min-h-0 flex-col overflow-hidden">
    <div className="flex min-h-0 flex-1 flex-col space-y-4 px-6 pt-6">
      <TableFilters className="items-end justify-between shrink-0"><div className="grid flex-1 gap-4 md:grid-cols-3"><Input placeholder="Buscar cliente, serial o modelo" value={search.inputValue} onChange={(event) => search.setInputValue(event.target.value)} endIcon={<SearchIcon className="text-text-muted" />} /><Select placeholder="Estado de asignación" value={filters.status ?? ""} onValueChange={(value) => setFilter("status", (value || undefined) as EquipmentAssignmentFilters["status"])} options={Object.entries(assignmentStatusLabels).map(([value, label]) => ({ value, label }))} /><Select placeholder="Estado de entrega" value={filters.deliveryStatus ?? ""} onValueChange={(value) => setFilter("deliveryStatus", (value || undefined) as EquipmentAssignmentFilters["deliveryStatus"])} options={[{ value: "PENDIENTE", label: "Pendiente de entrega" }, { value: "ENTREGADO", label: "Entregado" }]} /></div>{resetVisible ? <Button variant="outline" onClick={() => { search.clearInput(); resetFilters(); }}>Limpiar filtros</Button> : null}</TableFilters>
      <div className="min-h-0 flex-1">{assignments.isError ? <ErrorState title="No se pudieron cargar las asignaciones" error={assignments.error} onRetry={assignments.refetch} /> : <Table data={assignments.data?.data ?? []} columns={columns} keyExtractor={(assignment) => assignment.id} isLoading={assignments.isLoading} emptyMessage="No se encontraron asignaciones" onRowClick={(assignment) => navigate(`/equipment-assignments/${assignment.id}`)} />}</div>
    </div>
    {pagination ? <div className="w-full shrink-0 border-t border-border bg-white px-3 py-1"><Pagination currentPage={pagination.page} totalPages={pagination.totalPages} totalItems={pagination.total} limit={pagination.limit} onPageChange={setPage} onLimitChange={setLimit} showFirstLast /></div> : null}
  </div>;
}

const columns = [
  { key: "customer", label: "Cliente", className: "w-[28%]", render: (item: EquipmentAssignment) => <div><p className="truncate font-medium">{item.customer?.businessName ?? "—"}</p><p className="truncate text-xs text-text-secondary">{item.customerAddress?.branchName || item.customerAddress?.city || "Dirección principal"}</p></div> },
  { key: "equipment", label: "Equipo", className: "w-[24%]", render: (item: EquipmentAssignment) => <div><p className="truncate">{item.equipment?.serialNumber ?? item.equipmentId}</p><p className="truncate text-xs text-text-secondary">{item.equipment?.model.name}</p></div> },
  { key: "delivery", label: "Entrega", className: "w-[18%]", render: (item: EquipmentAssignment) => <Badge size="sm" variant={item.deliveryStatus === "PENDIENTE" ? "warning" : "success"}>{item.deliveryStatus === "PENDIENTE" ? "Pendiente" : "Entregado"}</Badge> },
  { key: "status", label: "Asignación", className: "w-[16%]", render: (item: EquipmentAssignment) => <Badge size="sm" variant={item.status === "ACTIVO" ? "info" : "secondary"}>{assignmentStatusLabels[item.status]}</Badge> },
  { key: "assignedAt", label: "Asignada", className: "w-[14%]", render: (item: EquipmentAssignment) => formatDateTime(item.assignedAt) },
];
