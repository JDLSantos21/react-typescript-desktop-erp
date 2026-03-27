import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useGetEquipments } from "../hooks/useEquipments";
import { FeatureErrorBoundary } from "@/shared/components/error-boundary/FeatureErrorBoundary";
import { Input } from "@/shared/components/core/Input";
import { Pagination } from "@/shared/components/core/Pagination";
import { Select } from "@/shared/components/core/Select";
import { Table } from "@/shared/components/core/Table";
import { TableFilters } from "@/shared/components/core/TableFilters";
import { equipmentColumns } from "../config/equipmentsTableConfig";
import { EquipmentStatus } from "../equipment.constant";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/shared/constants/config";
import { useListParams } from "@/shared/hooks/useListParams";
import { Button } from "@/shared/components/core/Button";
import { SearchIcon } from "@/shared/components/icons";
import { EquipmentFilters } from "../types/equipment.dto";
import { useDebouncedSearchFilter } from "@/shared/hooks/useDebouncedSearchFilter";

export default function EquipmentsPage() {
  useHeaderConfig({
    title: "Equipos",
    description: "Lista de equipos",
  });

  const navigate = useNavigate();

  const {
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters,
    queryParams,
    setPage,
    setLimit,
  } = useListParams({
    initialFilters: {
      search: "",
      status: undefined as EquipmentFilters["status"],
    },
    filterConfig: {
      status: {
        parse: (value) => value as EquipmentFilters["status"],
        isEmpty: (value) => value === undefined,
      },
    },
    defaultLimit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    syncWithUrl: true,
  });

  const searchFilter = useDebouncedSearchFilter({
    value: filters.search,
    onChange: (value) => setFilter("search", value),
    delay: 400,
  });

  const { data, isLoading } = useGetEquipments({
    ...queryParams,
  });

  const pagination = data?.meta.pagination;
  const showResetFilters = hasActiveFilters || searchFilter.inputValue.trim() !== "";

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <div className="flex flex-col flex-1 px-6 pt-6 pb-0 space-y-4 min-h-0">
        <FeatureErrorBoundary featureName="equipos">
          <TableFilters className="items-end justify-between shrink-0">
            <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Input
                placeholder="Buscar"
                value={searchFilter.inputValue}
                onChange={(e) => searchFilter.setInputValue(e.target.value)}
                endIcon={<SearchIcon className="text-text-muted" />}
              />
              <Select
                placeholder="Estado"
                value={filters.status ?? ""}
                options={Object.keys(EquipmentStatus).map((status) => ({
                  value: status,
                  label: EquipmentStatus[status as keyof typeof EquipmentStatus],
                }))}
                onValueChange={(value) =>
                  setFilter("status", (value || undefined) as EquipmentFilters["status"])
                }
              />
            </div>

            {showResetFilters ? (
              <Button
                variant="outline"
                onClick={() => {
                  searchFilter.clearInput();
                  resetFilters();
                }}
              >
                Limpiar filtros
              </Button>
            ) : null}
          </TableFilters>
          <div className="flex-1 min-h-0">
            <Table
              onRowClick={(equipment) => navigate(`/equipments/${equipment.id}`)}
              columns={equipmentColumns}
              data={data?.data || []}
              keyExtractor={(item) => item.id}
              isLoading={isLoading}
              emptyMessage="No se encontraron equipos"
            />
          </div>
        </FeatureErrorBoundary>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="shrink-0 w-full left-0 px-3 bg-white py-1 border-t border-border">
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
