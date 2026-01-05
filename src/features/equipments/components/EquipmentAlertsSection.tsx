import {
  Button,
  Select,
  Input,
  Badge,
  ErrorState,
  EmptyState,
  SearchIcon,
  FeatureErrorBoundary,
  PhoneIcon,
} from "@/shared/components";
import { useGetEquipmentAlerts } from "../hooks/useEquipments";
import { useTableFilters, useDebounce, usePagination } from "@/shared/hooks";
import { formatDate } from "@/shared/utils";
import { motion } from "motion/react";

export default function EquipmentAlertsSection() {
  const { paginationParams } = usePagination({
    defaultLimit: 10,
    syncWithUrl: true,
  });
  const { filters, updateFilter, clearFilters } = useTableFilters({
    initialFilters: { daysWithoutOrder: 18 },
  });
  const debouncedSearch = useDebounce(filters.search || "", 500);

  const {
    data: alertsData,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetEquipmentAlerts({
    ...filters,
    ...paginationParams,
    search: debouncedSearch,
  });

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== undefined && v !== null && v !== 18
  );
  const isEmpty =
    !isLoading && (!alertsData?.data || alertsData.data.length === 0);

  const getSeverityStyles = (days: number) => {
    if (days >= 30) return "border-l-4 border-l-rose-500 bg-rose-50/30";
    if (days >= 21) return "border-l-4 border-l-amber-500 bg-amber-50/30";
    return "border-l-4 border-l-slate-300 bg-white";
  };

  return (
    <div className="space-y-8">
      {/* Header y Filtros */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Monitor de Inactividad
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Detecta equipos asignados sin movimiento comercial reciente.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
          <Input
            placeholder="Buscar cliente..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="border-none bg-transparent focus:ring-0 w-48 text-sm"
            endIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
          />
          <div className="h-6 w-px bg-slate-200 mx-1" />
          <Input
            type="number"
            placeholder="Días límite"
            value={filters.daysWithoutOrder?.toString() || ""}
            onChange={(e) =>
              updateFilter(
                "daysWithoutOrder",
                parseInt(e.target.value) || undefined
              )
            }
            className="w-24 border-none bg-transparent text-sm"
          />
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Grid de Alertas */}
      {isEmpty ? (
        <EmptyState
          title="Todo en orden"
          description="No hay alertas que coincidan con los criterios actuales."
        />
      ) : isError ? (
        <ErrorState variant="error" error={error} onRetry={() => refetch()} />
      ) : (
        <FeatureErrorBoundary featureName="alertas">
          <motion.div layout className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {alertsData?.data.map((client, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={client.id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Cabecera del Cliente */}
                <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">
                      {client.businessName}
                    </h4>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-300" />{" "}
                        {client.representativeName}
                      </span>
                      {client.primaryPhone && (
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="w-3 h-3" />{" "}
                          {client.primaryPhone}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="warning" className="rounded-lg">
                    {client.equipmentAlerts.length} Equipos
                  </Badge>
                </div>

                {/* Lista de Equipos en Alerta */}
                <div className="p-4 space-y-3">
                  {client.equipmentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-xl border border-slate-100 ${getSeverityStyles(
                        alert.daysWithoutOrder
                      )}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {alert.equipmentType === "NEVERA" ? "❄️" : "📦"}
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">
                              {alert.serialNumber}
                            </p>
                            <p className="text-xs text-slate-500">
                              {alert.modelName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-xl font-bold text-slate-700">
                            {alert.daysWithoutOrder}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-medium">
                            Días inactivo
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-100/50">
                        {alert.expectedProducts.map((p, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600 font-medium"
                          >
                            Falta: {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </FeatureErrorBoundary>
      )}
    </div>
  );
}
