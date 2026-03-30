import { useCallback, useMemo } from "react";
import { Table } from "@/shared/components/core/Table";
import { useGetFuelConsumptions } from "../hooks/useFuel";
import { FuelConsumptionTableColumns } from "../config/FuelTableConfig";
import { Pagination } from "@/shared/components/core/Pagination";
import { TableFilters } from "@/shared/components/core/TableFilters";
import { Input } from "@/shared/components/core/Input";
import { Button } from "@/shared/components/core/Button";
import { useListParams } from "@/shared/hooks/useListParams";
import { FilterXIcon, SearchIcon } from "@/shared/components/icons";
import { APP_CONFIG } from "@/shared/constants/config";
import {
  SearchSelect,
  SearchSelectOption,
} from "@/shared/components/core/SearchSelect";
import DateRangeSelector from "@/shared/components/core/DateRangeSelector";
import { useDebouncedSearchFilter } from "@/shared/hooks/useDebouncedSearchFilter";
import { useGetVehicles } from "@/features/vehicles/hooks/useVehicles";
import { useGetEmployees } from "@/features/employees/hooks/useEmployee";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { Tooltip } from "@/shared/components/core/Tooltip";

export default function FuelHistoryPage() {
  useHeaderConfig({
    title: "Historial de combustible",
    description: "Consulta el historial de consumo de combustible",
  });

  const {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    hasActiveFilters,
    queryParams,
    setPage,
    setLimit,
  } = useListParams({
    initialFilters: {
      search: "",
      vehicle_id: "",
      driver_id: "",
      start_date: undefined as string | undefined,
      end_date: undefined as string | undefined,
    },
    defaultLimit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    syncWithUrl: true,
  });

  const searchFilter = useDebouncedSearchFilter({
    value: filters.search,
    onChange: (value) => setFilter("search", value),
    delay: 400,
  });

  const { data: vehicles, isLoading: isLoadingVehicles } = useGetVehicles({
    limit: 100,
  });

  const { data: drivers, isLoading: isLoadingDrivers } = useGetEmployees({
    position: "CHOFER",
    limit: 100,
  });

  const vehicleOptions = useMemo<SearchSelectOption[]>(() => {
    return (
      vehicles?.data?.map((vehicle) => ({
        value: vehicle.id,
        label: vehicle.currentTag,
      })) || []
    );
  }, [vehicles]);

  const driverOptions = useMemo<SearchSelectOption[]>(() => {
    return (
      drivers?.data?.map((driver) => ({
        value: driver.id,
        label: `${driver.name} ${driver.lastName}`,
      })) || []
    );
  }, [drivers]);

  const { data: history, isLoading } = useGetFuelConsumptions(queryParams);

  const pagination = history?.meta.pagination;
  const canResetFilters =
    hasActiveFilters || searchFilter.inputValue.trim() !== "";

  const handleResetFilters = useCallback(() => {
    searchFilter.clearInput();
    resetFilters();
  }, [resetFilters, searchFilter]);

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <div className="flex flex-col flex-1 px-6 pt-6 min-h-0">
        <TableFilters className="flex flex-col shrink-0">
          <div className="flex gap-4">
            <Input
              placeholder="Buscar.."
              value={searchFilter.inputValue}
              onChange={(e) => searchFilter.setInputValue(e.target.value)}
              endIcon={<SearchIcon className="text-text-muted" />}
            />

            <DateRangeSelector
              className="w-75"
              value={{
                start_date: filters.start_date,
                end_date: filters.end_date,
              }}
              onChange={(range) =>
                setFilters({
                  start_date: range.start_date,
                  end_date: range.end_date,
                })
              }
            />
          </div>
          <div className="flex gap-4">
            <SearchSelect
              placeholder="Filtrar por vehículo"
              value={filters.vehicle_id}
              onValueChange={(value) => setFilter("vehicle_id", value)}
              options={vehicleOptions}
              disabled={isLoadingVehicles}
              emptyMessage="No se encontraron vehículos"
              allowClear
            />

            <SearchSelect
              placeholder="Filtrar por conductor"
              value={filters.driver_id}
              onValueChange={(value) => setFilter("driver_id", value)}
              options={driverOptions}
              disabled={isLoadingDrivers}
              emptyMessage="No se encontraron conductores"
              allowClear
            />

            <Tooltip content="Limpiar filtros">
              <Button
                onClick={handleResetFilters}
                variant={canResetFilters ? "danger" : "outline"}
                disabled={!canResetFilters}
              >
                <FilterXIcon />
              </Button>
            </Tooltip>
          </div>
        </TableFilters>

        <div className="flex-1 min-h-0">
          <Table
            columns={FuelConsumptionTableColumns}
            data={history?.data || []}
            keyExtractor={(item) => item.id.toString()}
            isLoading={isLoading}
          />
        </div>
      </div>

      {pagination && pagination.totalPages > 1 ? (
        <div className="shrink-0 w-full left-0 px-3 bg-white py-1 border-t border-border">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            limit={pagination.limit}
            totalItems={pagination.total}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </div>
      ) : null}
    </div>
  );
}
