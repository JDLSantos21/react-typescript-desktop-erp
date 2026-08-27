import { useNavigate, useParams } from "react-router-dom";
import { useGetOrder } from "../hooks/useOrder";
import { copyToClipboard } from "@/shared/utils/clipboard";
import { formatDate } from "@/shared/utils/formatters";
import { getStatusColor } from "@/shared/utils/status.utils";
import { Badge } from "@/shared/components/core/Badge";
import { Button } from "@/shared/components/core/Button";
import { CopyIcon } from "@/shared/components/icons";
import { ErrorState } from "@/shared/components/ErrorState";
import { HistoryIcon } from "@/shared/components/icons";
import { MapModal } from "@/shared/components/core/MapModal";
import { MapPinUserIcon } from "@/shared/components/icons";
import { toast } from "sonner";
import SectionLoader from "@/shared/components/SectionLoader";
import OrderAsideMenu from "../components/OrderAsideMenu";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useModal } from "@/shared/hooks/useModal";
import { useEffect } from "react";
import StatusHistoryModal from "../components/StatusHistoryModal";
import StatusModal from "../components/StatusModal";
import DriverAssignModal from "../components/DriverAssignModal";
import { OrderDetailSections } from "../components/details/OrderDetailSections";
import { PermissionGate } from "@/shared/authorization/PermissionGate";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { OrderEmailHistory } from "@/features/email/components/OrderEmailHistory";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch, error } = useGetOrder(id!);
  const { setHeaderConfig, resetHeader } = useHeaderConfig();
  const navigate = useNavigate();

  const statusModal = useModal();
  const statusHistoryModal = useModal();
  const driverAssignModal = useModal();
  const mapModal = useModal();

  const order = data?.data;

  useEffect(() => {
    if (order) {
      setHeaderConfig({
        title: "",
        showBackButton: true,
        customContent: (
          <div className="flex items-center px-3 py-1 w-full gap-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                Detalles del pedido
              </h2>
              <div className="flex gap-2 items-center text-sm text-text-secondary">
                <p>Pedido el {formatDate(order.date)}</p>
                <div className="border-l border-gray-200 h-3 mx-2" />
                <p className="font-mono text-xs">{order.trackingCode}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  icon={CopyIcon}
                  onClick={async () => {
                    try {
                      await copyToClipboard(order.trackingCode);
                      toast.info("Código de seguimiento copiado.");
                    } catch (error) {
                      toast.error(
                        "No se pudo copiar el código de seguimiento.",
                      );
                    }
                  }}
                />
                <Badge className={`${getStatusColor(order.status)}`} size="sm">
                  {order.status}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 self-end">
              {order.status !== "ENTREGADO" && order.status !== "CANCELADO" && (
                <PermissionGate minimumLevel={PermissionLevel.ADVANCED_OPERATIONS}>
                <Button
                  icon={HistoryIcon}
                  variant="ghost"
                  size="sm"
                  onClick={() => statusModal.open()}
                >
                  Cambiar estado
                </Button>
                </PermissionGate>
              )}
            </div>
          </div>
        ),
      });
    }

    return () => resetHeader();
  }, [order, id, setHeaderConfig, resetHeader]);

  return (
    <div>
      {isLoading ? (
        <SectionLoader placeholder="Cargando detalles del pedido" />
      ) : order && !isError ? (
        <div className="flex h-full">
          <div className="flex-1 max-w-5xl overflow-y-auto px-8 py-7 show-scrollbar">
            <OrderDetailSections
              order={order}
              onOpenMap={() => {
                if (order.address?.coords?.latitude != null) {
                  mapModal.open();
                }
              }}
            />
            <OrderEmailHistory orderId={order.id} />
          </div>
          <OrderAsideMenu
            onOpenStatusHistoryModal={() => statusHistoryModal.open()}
            onOpenDriverAssignModal={() => driverAssignModal.open()}
            onOpenEditModal={() => navigate(`/orders/${id}/edit`)}
            orderStatus={order.status}
          />
          <StatusHistoryModal
            orderId={order.id.toString()}
            isOpen={statusHistoryModal.isOpen}
            onClose={() => statusHistoryModal.close()}
          />

          <StatusModal
            order={order}
            isOpen={statusModal.isOpen}
            onClose={() => statusModal.close()}
          />

          <DriverAssignModal
            order={order}
            isOpen={driverAssignModal.isOpen}
            onClose={() => driverAssignModal.close()}
          />
          {order.address?.coords && (
            <MapModal
              isOpen={mapModal.isOpen}
              onClose={() => mapModal.close()}
              title={`Ubicación - ${order.address.branchName}`}
              center={{
                lat: order.address.coords.latitude,
                lng: order.address.coords.longitude,
              }}
              markers={[
                {
                  id: "customer-location",
                  position: {
                    lat: order.address.coords.latitude,
                    lng: order.address.coords.longitude,
                  },
                  icon: MapPinUserIcon,
                  iconColor: "#3b82f6",
                  label: order.customer.businessName,
                  popup: (
                    <div className="p-1">
                      <span className="font-semibold text-sm">
                        {order.address.branchName}
                      </span>
                      <span className="text-xs text-gray-600 mt-1 block">
                        {order.address.direction}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.address.city}
                      </span>
                    </div>
                  ),
                },
              ]}
              zoom={16}
              showOpenInGoogleMaps
            />
          )}
        </div>
      ) : (
        <ErrorState
          title="Ocurrio un problema al cargar el pedido"
          message="Intenta nuevamente o vuelve a la lista de pedidos."
          variant="error"
          onRetry={() => refetch()}
          retryLabel="Reintentar"
          error={error}
        />
      )}
    </div>
  );
}
