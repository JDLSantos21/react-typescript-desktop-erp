import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { ClipboardList, PackageCheck, Truck } from "lucide-react";
import { Badge } from "@/shared/components/core/Badge";
import { Button } from "@/shared/components/core/Button";
import { useGetOrders } from "@/features/orders/hooks/useOrder";
import { useGetEquipmentsByCustomerId } from "@/features/equipments/hooks/useEquipments";
import { formatDate } from "@/shared/utils/formatters";
import { getStatusColor } from "@/shared/utils/status.utils";

interface CustomerActivitySectionProps {
  customerId: string;
  onViewEquipmentHistory: () => void;
}

export default function CustomerActivitySection({
  customerId,
  onViewEquipmentHistory,
}: CustomerActivitySectionProps) {
  const navigate = useNavigate();
  const { data: orders, isLoading: isLoadingOrders, isError: hasOrdersError } =
    useGetOrders({ customerId, page: 1, limit: 4 });
  const {
    data: equipments,
    isLoading: isLoadingEquipments,
    isError: hasEquipmentsError,
  } = useGetEquipmentsByCustomerId(customerId);

  const recentOrders = orders?.data ?? [];
  const assignedEquipments = equipments?.data ?? [];

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle icon={ClipboardList}>Actividad reciente</SectionTitle>
        <Button
          variant="link"
          size="sm"
          onClick={() => navigate(`/customers/${customerId}/orders-history`)}
        >
          Ver historial de pedidos
        </Button>
      </div>

      <div className="mt-4 grid gap-7 xl:grid-cols-2">
        <ActivityGroup
          title="Últimos pedidos"
          icon={Truck}
          isLoading={isLoadingOrders}
          hasError={hasOrdersError}
          emptyMessage="Este cliente aún no tiene pedidos registrados."
        >
          {recentOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => navigate(`/orders/${order.id}`)}
              className="group flex w-full items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900 group-hover:text-primary">
                  {order.trackingCode}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatDate(order.date)}
                  {order.products.length > 0
                    ? ` · ${order.products.length} ${order.products.length === 1 ? "producto" : "productos"}`
                    : ""}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)} size="sm">
                {order.status}
              </Badge>
            </button>
          ))}
        </ActivityGroup>

        <ActivityGroup
          title="Equipos asignados"
          icon={PackageCheck}
          action={
            assignedEquipments.length > 0 ? (
              <Button variant="link" size="sm" onClick={onViewEquipmentHistory}>
                Ver todos
              </Button>
            ) : undefined
          }
          isLoading={isLoadingEquipments}
          hasError={hasEquipmentsError}
          emptyMessage="No hay equipos asignados actualmente."
        >
          {assignedEquipments.slice(0, 4).map((equipment) => {
            const assignment = equipment.assignments[0];

            return (
              <div
                key={equipment.id}
                className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {equipment.model.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    S/N {equipment.serialNumber}
                    {assignment?.assignedAt
                      ? ` · Asignado ${formatDate(assignment.assignedAt)}`
                      : ""}
                  </p>
                </div>
                <Badge className={getStatusColor(equipment.status)} size="sm">
                  {equipment.status}
                </Badge>
              </div>
            );
          })}
        </ActivityGroup>
      </div>
    </section>
  );
}

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof ClipboardList;
  children: string;
}) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
      <Icon className="h-4 w-4 text-slate-500" />
      {children}
    </h2>
  );
}

function ActivityGroup({
  title,
  icon: Icon,
  action,
  isLoading,
  hasError,
  emptyMessage,
  children,
}: {
  title: string;
  icon: typeof ClipboardList;
  action?: ReactNode;
  isLoading: boolean;
  hasError: boolean;
  emptyMessage: string;
  children: ReactNode;
}) {
  const hasItems = Array.isArray(children) && children.length > 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Icon className="h-4 w-4 text-slate-400" />
          {title}
        </h3>
        {action}
      </div>
      {isLoading ? (
        <div className="space-y-2" aria-label={`Cargando ${title.toLowerCase()}`}>
          <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ) : hasError ? (
        <p className="rounded-lg bg-slate-50 px-4 py-4 text-sm text-slate-500">
          No se pudo cargar esta información.
        </p>
      ) : hasItems ? (
        <div className="space-y-2">{children}</div>
      ) : (
        <p className="rounded-lg bg-slate-50 px-4 py-4 text-sm text-slate-500">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}
