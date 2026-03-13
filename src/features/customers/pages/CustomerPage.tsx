import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Select } from "@/shared/components/core/Select";
import { Table } from "@/shared/components/core/Table";
import { TableFilters } from "@/shared/components/core/TableFilters";
import { Pagination } from "@/shared/components/core/Pagination";

import { useNavigate } from "react-router-dom";
import { useTableFilters } from "@/shared/hooks/useTableFilters";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { usePagination } from "@/shared/hooks/usePagination";
import { useGetCustomers } from "../hooks/useCustomer";
import { customerTableColumns } from "../config/customerTableConfig";
import { useCallback, useMemo } from "react";
import { SearchIcon } from "@/shared/components/icons";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { FeatureErrorBoundary } from "@/shared/components/error-boundary/FeatureErrorBoundary";
import { APP_CONFIG } from "@/shared/constants/config";

export default function CustomerPage() {
  const navigate = useNavigate();

  const { setPage, setLimit, paginationParams } = usePagination({
    defaultLimit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    syncWithUrl: true,
  });

  const { filters, updateFilter, clearFilters } = useTableFilters({
    initialFilters: {},
  });

  const debouncedSearch = useDebounce(filters.search || "", 500);

  const {
    data: customers,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetCustomers({
    ...filters,
    ...paginationParams,
    search: debouncedSearch,
  });

  const headerActions = useMemo(() => {
    return (
      <div className="flex gap-2">
        <Button variant="outline">Exportar</Button>
        <Button onClick={() => navigate("/customers/new")}>
          Crear cliente
        </Button>
      </div>
    );
  }, [navigate]);

  useHeaderConfig({
    title: "Clientes",
    description: "Busca, añade y gestiona tus clientes.",
    actions: headerActions,
  });

  const pagination = customers?.meta.pagination;

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== undefined && value !== null,
  );

  const handleRowClick = useCallback(
    (customer: { id: string }) => {
      navigate(`/customers/${customer.id}`);
    },
    [navigate],
  );

  const emptyData = useMemo(() => [], []);
  const tableData = customers?.data || emptyData;

  const keyExtractor = useCallback((customer: any) => customer.id, []);

  const emptyMessage = hasActiveFilters
    ? {
        title: "No se encontraron clientes",
        description: "No hay clientes que coincidan con tu búsqueda",
      }
    : {
        title: "No hay clientes registrados",
        description: "Agrega tu primer cliente para comenzar",
      };

  const isEmpty =
    !isLoading && (!customers?.data || customers.data.length === 0);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-4 h-[calc(100%-70px)] overflow-hidden p-6">
        <div className="flex justify-between">
          <div>
            <h2 className="font-semibold">Todos los clientes</h2>
            <p className="text-xs text-text-secondary">
              {pagination?.total ?? 0} clientes registrados
            </p>
          </div>
          <TableFilters
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          >
            <div className="w-75">
              <Input
                placeholder="Nombre, teléfono, correo..."
                value={filters.search || ""}
                onChange={(e) => updateFilter("search", e.target.value)}
                endIcon={<SearchIcon className="text-text-muted" />}
              />
            </div>

            <div className="w-full md:w-48">
              <Select
                placeholder="Estado"
                options={[
                  { value: "active", label: "Activo" },
                  { value: "inactive", label: "Inactivo" },
                ]}
                value={filters.active || ""}
                onValueChange={(value) => updateFilter("active", value)}
              />
            </div>
          </TableFilters>
        </div>

        {isEmpty ? (
          <EmptyState
            title={emptyMessage.title}
            description={emptyMessage.description}
            action={
              !hasActiveFilters
                ? {
                    label: "Agregar cliente",
                    onClick: () => navigate("/customers/new"),
                  }
                : undefined
            }
          />
        ) : isError ? (
          <ErrorState
            variant="error"
            error={error}
            showDetails={import.meta.env.DEV}
            onRetry={() => refetch()}
          />
        ) : (
          <FeatureErrorBoundary featureName="tabla de clientes">
            <Table
              columns={customerTableColumns}
              data={tableData}
              keyExtractor={keyExtractor}
              isLoading={isLoading}
              emptyMessage="No se encontraron clientes"
              onRowClick={handleRowClick}
              minRows={pagination?.limit}
            />
          </FeatureErrorBoundary>
        )}
      </div>

      {pagination && pagination.totalPages > 1 ? (
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
      ) : null}
    </div>
  );
}
