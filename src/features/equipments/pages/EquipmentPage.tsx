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
import { motion } from "motion/react";
import {
  useTableFilters,
  useDebounce,
  useHeaderConfig,
  usePagination,
} from "@/shared/hooks";
import { useFindAllEquipments } from "../hooks/useEquipments";
import { equipmentTableColumns } from "../config/equipmentTableConfig";

export default function EquipmentPage() {
  const navigate = useNavigate();

  const { setPage, setLimit, paginationParams } = usePagination({
    defaultLimit: 12,
    syncWithUrl: true,
  });

  const { filters, updateFilter, clearFilters } = useTableFilters({
    initialFilters: {},
  });

  const debouncedSearch = useDebounce(filters.search || "", 500);

  const {
    data: equipments,
    isLoading,
    error,
    isError,
    refetch,
  } = useFindAllEquipments({
    ...filters,
    ...paginationParams,
    search: debouncedSearch,
  });

  useHeaderConfig({
    title: "Gestión de Equipos",
    description: "Administra el inventario y estado de tus activos.",
    actions: (
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="rounded-xl border-slate-200 text-slate-600"
        >
          Exportar
        </Button>
        <Button
          onClick={() => navigate("/equipments/new")}
          className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200"
        >
          + Nuevo Equipo
        </Button>
      </div>
    ),
  });

  const pagination = equipments?.meta.pagination;

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== undefined && value !== null
  );

  const handleRowClick = (equipment: { id: string }) => {
    navigate(`/equipments/details/${equipment.id}`);
  };

  const isEmpty =
    !isLoading && (!equipments?.data || equipments.data.length === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full bg-slate-50/50"
    >
      <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col">
        {/* Barra de Filtros Flotante */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Inventario Total
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {pagination?.total ?? 0} activos registrados
            </p>
          </div>

          <TableFilters
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            className="flex-1 justify-end"
          >
            <div className="w-[300px]">
              <Input
                placeholder="Buscar por serie, modelo..."
                value={filters.search || ""}
                onChange={(e) => updateFilter("search", e.target.value)}
                endIcon={<SearchIcon className="text-slate-400 w-4 h-4" />}
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
              />
            </div>

            <div className="w-full md:w-48">
              <Select
                placeholder="Estado"
                options={[
                  { value: "DISPONIBLE", label: "Disponible" },
                  { value: "ASIGNADO", label: "Asignado" },
                  { value: "MANTENIMIENTO", label: "Mantenimiento" },
                  { value: "DAÑADO", label: "Dañado" },
                  { value: "INHABILITADO", label: "Inhabilitado" },
                ]}
                value={filters.status || ""}
                onValueChange={(value) => updateFilter("status", value)}
                className="rounded-xl"
              />
            </div>
          </TableFilters>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          {isEmpty ? (
            <EmptyState
              title={hasActiveFilters ? "Sin resultados" : "Inventario vacío"}
              description={
                hasActiveFilters
                  ? "Intenta ajustar los filtros de búsqueda."
                  : "Comienza registrando tu primer equipo."
              }
              action={
                !hasActiveFilters
                  ? {
                      label: "Crear equipo",
                      onClick: () => navigate("/equipments/new"),
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
            <FeatureErrorBoundary featureName="tabla de equipos">
              <Table
                columns={equipmentTableColumns}
                data={equipments?.data || []}
                keyExtractor={(equipment) => equipment.id}
                isLoading={isLoading}
                emptyMessage="No se encontraron equipos"
                onRowClick={handleRowClick}
                minRows={pagination?.limit}
                className="border-none" // Asumiendo que Table acepta className para quitar bordes externos
                headerClassName="bg-slate-50 text-slate-600 font-medium text-xs uppercase tracking-wider"
                rowClassName="hover:bg-slate-50/80 transition-colors cursor-pointer border-b border-slate-50"
              />
            </FeatureErrorBoundary>
          )}
        </div>
      </div>

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 bg-white border-t border-slate-100">
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
    </motion.div>
  );
}
