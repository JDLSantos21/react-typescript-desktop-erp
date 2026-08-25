import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Pagination } from "@/shared/components/core/Pagination";
import { Table } from "@/shared/components/core/Table";
import { TableFilters } from "@/shared/components/core/TableFilters";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { FeatureErrorBoundary } from "@/shared/components/error-boundary/FeatureErrorBoundary";
import { SearchIcon } from "@/shared/components/icons";
import { APP_CONFIG } from "@/shared/constants/config";
import { useDebouncedSearchFilter } from "@/shared/hooks/useDebouncedSearchFilter";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useListParams } from "@/shared/hooks/useListParams";
import { Vehicle } from "@/shared/types/entities/vehicle.type";
import { vehicleColumns } from "../config/vehiclesTableConfig";
import { useGetVehicles } from "../hooks/useVehicles";

export default function VehiclesPage() {
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
    initialFilters: { search: "" },
    defaultLimit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    syncWithUrl: true,
  });

  const searchFilter = useDebouncedSearchFilter({
    value: filters.search,
    onChange: (value) => setFilter("search", value),
    delay: 400,
  });

  const { data, isLoading, isError, error, refetch } = useGetVehicles(queryParams);
  const pagination = data?.meta.pagination;
  const hasVisibleFilters =
    hasActiveFilters || searchFilter.inputValue.trim().length > 0;

  useHeaderConfig({
    title: "Vehículos",
    description: "Administra la flota y sus identificadores operativos.",
  });

  const handleRowClick = useCallback(
    (vehicle: Vehicle) => navigate(`/vehicles/${vehicle.id}`),
    [navigate],
  );

  const emptyData = useMemo(() => [], []);
  const vehicles = data?.data ?? emptyData;
  const isEmpty = !isLoading && vehicles.length === 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col space-y-4 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-semibold text-text-primary">Flota registrada</h2>
            <p className="text-xs text-text-secondary">
              {pagination?.total ?? 0} vehículos en el registro operativo
            </p>
          </div>
          <TableFilters className="items-end justify-end">
            <div className="w-72">
              <Input
                placeholder="Placa, tag, marca o chasis…"
                value={searchFilter.inputValue}
                onChange={(event) => searchFilter.setInputValue(event.target.value)}
                endIcon={<SearchIcon className="text-text-muted" />}
              />
            </div>
            {hasVisibleFilters ? (
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
        </div>

        {isError ? (
          <ErrorState error={error} onRetry={refetch} title="No se pudo cargar la flota" />
        ) : isEmpty ? (
          <EmptyState
            title={hasVisibleFilters ? "No hay coincidencias" : "Aún no hay vehículos registrados"}
            description={
              hasVisibleFilters
                ? "Ajusta los filtros o limpia la búsqueda para ver los vehículos disponibles."
                : "Registra las unidades de flota desde Configuración para comenzar a gestionarlas."
            }
          />
        ) : (
          <FeatureErrorBoundary featureName="tabla de vehículos">
            <div className="min-h-0 flex-1">
              <Table
                columns={vehicleColumns}
                data={vehicles}
                keyExtractor={(vehicle) => vehicle.id}
                onRowClick={handleRowClick}
                isLoading={isLoading}
                minRows={pagination?.limit}
                emptyMessage="No se encontraron vehículos"
              />
            </div>
          </FeatureErrorBoundary>
        )}
      </div>

      {pagination && pagination.totalPages > 1 ? (
        <div className="w-full shrink-0 border-t border-border bg-white px-3 py-1">
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
      ) : null}

    </div>
  );
}
