import {
  Button,
  FeatureErrorBoundary,
  Input,
  Pagination,
  Table,
  TableFilters,
  Select,
  ErrorState,
  EmptyState,
  SearchIcon,
} from "@/shared/components";
import { useNavigate } from "react-router-dom";
import { useTableFilters, useDebounce, useHeaderConfig } from "@/shared/hooks";
import { useGetCustomers } from "../hooks/useCustomer";
import { customerTableColumns } from "../config/customerTableConfig";

export function CustomerPage() {
  const navigate = useNavigate();

  const {
    filters,
    updateFilter,
    clearFilters,
    setPage,
    setLimit,
    queryParams,
  } = useTableFilters({
    limit: 5,
  });

  const debouncedSearch = useDebounce(filters.search || "", 500);

  const {
    data: customers,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetCustomers({
    ...queryParams,
    search: debouncedSearch,
  });

  // Configurar header dinámico
  useHeaderConfig({
    title: "Clientes",
    description: "Busca, añade y gestiona tus clientes.",
    actions: (
      <div className="flex gap-2">
        <Button variant="outline">Exportar</Button>
        <Button onClick={() => navigate("/customers/new")}>
          Crear cliente
        </Button>
      </div>
    ),
  });

  const pagination = customers?.meta.pagination;

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== undefined && value !== null
  );

  const handleRowClick = (customer: { id: string }) => {
    navigate(`/customers/details/${customer.id}`);
  };

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
      <div className="space-y-4 p-3 border rounded-sm h-[calc(100%-80px)] overflow-hidden">
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
            <div className="w-[300px]">
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
            showDetails={process.env.NODE_ENV === "development"}
            onRetry={() => refetch()}
          />
        ) : (
          <FeatureErrorBoundary featureName="tabla de clientes">
            <Table
              columns={customerTableColumns}
              data={customers?.data || []}
              keyExtractor={(customer) => customer.id}
              isLoading={isLoading}
              emptyMessage="No se encontraron clientes"
              onRowClick={handleRowClick}
              minRows={pagination?.limit}
            />
          </FeatureErrorBoundary>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="w-full left-0 px-3 bg-white py-1 mb-2">
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
