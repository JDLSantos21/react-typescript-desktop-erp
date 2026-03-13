import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { usePagination } from "@/shared/hooks/usePagination";
import { useTableFilters } from "@/shared/hooks/useTableFilters";
import { useGetEquipments } from "../hooks/useEquipments";
import { FeatureErrorBoundary } from "@/shared/components/error-boundary/FeatureErrorBoundary";
import { Input } from "@/shared/components/core/Input";
import { Pagination } from "@/shared/components/core/Pagination";
import { Select } from "@/shared/components/core/Select";
import { Table } from "@/shared/components/core/Table";
import { TableFilters } from "@/shared/components/core/TableFilters";
import { equipmentColumns } from "../config/equipmentsTableConfig";
import { EquipmentStatus } from "../equipment.constants";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/shared/constants/config";

export default function EquipmentsPage() {
  useHeaderConfig({
    title: "Equipos",
    description: "Lista de equipos",
  });

  const { setPage, setLimit, paginationParams } = usePagination({
    defaultLimit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    syncWithUrl: true,
  });

  const navigate = useNavigate();

  const { filters, updateFilter } = useTableFilters();

  const { data, isLoading } = useGetEquipments({
    ...paginationParams,
    ...filters,
  });

  const pagination = data?.meta.pagination;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6">
        <FeatureErrorBoundary featureName="equipos">
          <TableFilters className="grid grid-cols-3" showClearButton={true}>
            <Input
              placeholder="Buscar"
              value={filters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
            <Select
              placeholder="Estado"
              value={filters.status}
              options={Object.keys(EquipmentStatus).map((status) => ({
                value: status,
                label: EquipmentStatus[status as keyof typeof EquipmentStatus],
              }))}
              onValueChange={(value) => updateFilter("status", value)}
            />
          </TableFilters>
          <Table
            onRowClick={(equipment) => navigate(`/equipments/${equipment.id}`)}
            columns={equipmentColumns}
            data={data?.data || []}
            keyExtractor={(item) => item.id}
            isLoading={isLoading}
            emptyMessage="No se encontraron equipos"
          />
        </FeatureErrorBoundary>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="w-full left-0 px-3 bg-white py-1 border-t border-border">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            limit={pagination.limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            showFirstLast
          />
        </div>
      )}
    </div>
  );
}
