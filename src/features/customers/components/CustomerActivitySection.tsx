import { Badge, EmptyState } from "@/shared/components";
import { formatDate } from "@/shared/utils";
import { useGetEquipmentsByCustomerId } from "@/features/equipments/hooks/useEquipments";
import { useParams } from "react-router-dom";

// const statusLabels = {
//   OPERATIVO: { label: "Operativo", variant: "success" as const },
//   EN_MANTENIMIENTO: { label: "Mantenimiento", variant: "warning" as const },
//   FUERA_DE_SERVICIO: { label: "Fuera de servicio", variant: "danger" as const },
// };

// const orderStatusLabels = {
//   PENDIENTE: { label: "Pendiente", variant: "warning" as const },
//   PROCESANDO: { label: "Procesando", variant: "info" as const },
//   COMPLETADO: { label: "Completado", variant: "success" as const },
//   CANCELADO: { label: "Cancelado", variant: "danger" as const },
// };

interface CustomerActivitySectionProps {
  onViewEquipmentHistory: () => void;
  onViewOrderHistory: () => void;
}

export default function CustomerActivitySection({
  onViewEquipmentHistory,
  onViewOrderHistory,
}: CustomerActivitySectionProps) {
  const { customerId } = useParams();

  const { data: equipments, isLoading: isLoadingEquipments } =
    useGetEquipmentsByCustomerId(customerId ?? "");

  if (isLoadingEquipments) {
    return (
      <div className="bg-background border border-border-light rounded-lg shadow-sm overflow-hidden">
        <div className="bg-background-secondary px-6 py-4 border-b border-border-light">
          <h3 className="text-lg font-semibold text-text-primary">
            Información de Actividad
          </h3>
        </div>
        <div className="p-6 animate-pulse space-y-4">
          <div className="h-20 bg-background-secondary rounded"></div>
          <div className="h-20 bg-background-secondary rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border-light rounded-lg shadow-sm overflow-hidden">
      <div className="bg-background-secondary px-6 py-4 border-b border-border-light">
        <h3 className="text-lg font-semibold text-text-primary">
          Información de Actividad
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {/* Equipos Asignados Actualmente */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              Equipos Asignados
              {equipments?.data && equipments.data.length > 0 && (
                <Badge variant="info" size="sm">
                  {equipments.data.length}
                </Badge>
              )}
            </h4>
            <button
              onClick={onViewEquipmentHistory}
              className="text-xs text-primary hover:text-primary-dark font-medium hover:underline"
            >
              Ver historial completo
            </button>
          </div>

          {isLoadingEquipments ? (
            <div className="space-y-2">
              <div className="h-12 bg-background-secondary rounded animate-pulse"></div>
              <div className="h-12 bg-background-secondary rounded animate-pulse"></div>
            </div>
          ) : !equipments?.data || equipments.data.length === 0 ? (
            <div className="text-center bg-background-secondary rounded-lg">
              <EmptyState description="No hay equipos asignados" />
            </div>
          ) : (
            <div className="space-y-2">
              {equipments?.data?.slice(0, 3).map((equipment) => (
                <div
                  key={equipment.id}
                  className="bg-background-secondary border border-border-light rounded-lg p-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {equipment.model.name}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        S/N: {equipment.serialNumber}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Asignado:{" "}
                        {formatDate(equipment?.assignments[0]?.assignedAt)}
                      </p>
                    </div>
                    <Badge size="sm">{equipment.status}</Badge>
                  </div>
                </div>
              ))}
              {equipments?.data?.length > 3 && (
                <button
                  onClick={onViewEquipmentHistory}
                  className="w-full py-2 text-xs text-primary hover:text-primary-dark font-medium"
                >
                  Ver {equipments.data.length - 3} más...
                </button>
              )}
            </div>
          )}
        </div>

        {/* Último Pedido */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              Último Pedido
            </h4>
            <button
              onClick={onViewOrderHistory}
              className="text-xs text-primary hover:text-primary-dark font-medium hover:underline"
            >
              Ver todos los pedidos
            </button>
          </div>

          {false ? (
            <div className="text-center bg-background-secondary rounded-lg">
              <EmptyState description="Este cliente aun no tiene pedidos registrados" />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Pedido #12
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {formatDate(new Date().toISOString())}
                  </p>
                </div>
                <Badge variant={"success"} size="sm">
                  {"Completado"}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-primary/20">
                <div>
                  <p className="text-xs text-text-muted">Total</p>
                  <p className="text-lg font-bold text-primary">{2500}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-muted">Items</p>
                  <p className="text-lg font-semibold text-text-primary">{3}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
