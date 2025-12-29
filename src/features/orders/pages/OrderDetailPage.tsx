import { useNavigate, useParams } from "react-router-dom";
import { useGetOrder } from "../hooks/useOrder";
import {
  copyToClipboard,
  formatDate,
  formatPhoneNumber,
  getStatusColor,
} from "@/shared/utils";
import {
  Badge,
  Button,
  CopyIcon,
  ErrorState,
  HistoryIcon,
  LocationIcon,
  MapModal,
  MapPinUserIcon,
  UserIcon,
  WhatsAppIcon,
} from "@/shared/components";
import { toast } from "sonner";
import SectionLoader from "@/shared/components/SectionLoader";
import OrderAsideMenu from "../components/OrderAsideMenu";
import { useHeaderConfig, useModal } from "@/shared/hooks";
import { useEffect } from "react";
import StatusHistoryModal from "../components/StatusHistoryModal";
import StatusModal from "../components/StatusModal";
import DriverAssignModal from "../components/DriverAssignModal";
import { handleOpenWhatsapp } from "@/lib/opener";

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
                        "No se pudo copiar el código de seguimiento."
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
                <Button
                  icon={HistoryIcon}
                  variant="ghost"
                  size="sm"
                  onClick={() => statusModal.open()}
                >
                  Cambiar estado
                </Button>
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
          <div className="flex-1 px-8 py-4 space-y-2 max-w-4xl max-h-[calc(100vh-96px)] overflow-y-auto show-scrollbar">
            {/* Información del Cliente */}
            <section className="space-y-2">
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                Cliente
              </h2>
              <div className="space-y-2">
                <div>
                  <p className=" text-text-primary">
                    {order.customer.businessName}
                  </p>
                  <p className="text-text-secondary">
                    {order.customer.representativeName}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  {order.phone.hasWhatsapp && (
                    <WhatsAppIcon className="text-green-500 w-4 h-4" />
                  )}
                  <p className="font-mono text-sm">
                    {formatPhoneNumber(order.phone.phoneNumber)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleOpenWhatsapp(data.data)}
                  icon={WhatsAppIcon}
                  variant="outline"
                  size="sm"
                >
                  Mensaje
                </Button>

                <Button
                  onClick={() =>
                    navigate(`/customers/details/${order.customer.id}`)
                  }
                  icon={UserIcon}
                  variant="outline"
                  size="sm"
                >
                  Ver Cliente
                </Button>
              </div>
            </section>

            {/* Dirección de Entrega */}
            <section className="border-t border-gray-100 pt-4">
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
                Dirección de entrega
              </h2>
              <div className="flex justify-between">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">
                    {order.address.branchName}
                  </p>
                  <p className="text-gray-600">{order.address.direction}</p>
                  <p className="text-gray-600">{order.address.city}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-2 w-2 rounded-full ${
                        order.address.coordinates
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <p className="text-sm text-gray-500">
                      {order.address.coordinates?.latitude
                        ? "Ubicación exacta disponible"
                        : "Sin ubicación exacta"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    icon={LocationIcon}
                    size="sm"
                    disabled={!order.address.coordinates?.latitude}
                    onClick={() => {
                      if (order.address.coordinates?.latitude) {
                        mapModal.open();
                      }
                    }}
                  >
                    Ver en mapa
                  </Button>
                </div>
              </div>
            </section>

            {/* Productos */}
            <section className="border-t border-gray-100 pt-4">
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
                Productos
              </h2>
              <div className="space-y-2">
                {order.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center py-2 border last:border-0 bg-gray-50/50 px-4 rounded-md shadow"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {product.size} · {product.unit}
                      </p>
                    </div>
                    <p className="text-lg font-light text-gray-900 tabular-nums">
                      ×{product.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Fechas y Seguimiento */}
            <section className="border-t border-gray-100 pt-4">
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
                Seguimiento
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">
                    Fecha de pedido
                  </p>
                  <p className="text-gray-900">{formatDate(order.date)}</p>
                </div>
                {order.scheduledDate && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">
                      Fecha programada
                    </p>
                    <p className="text-gray-900">
                      {formatDate(order.scheduledDate)}
                    </p>
                  </div>
                )}
                {order.deliveredDate && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">
                      Fecha de entrega
                    </p>
                    <p className="text-gray-900">
                      {formatDate(order.deliveredDate)}
                    </p>
                  </div>
                )}
                {order.assignedTo && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Asignado a</p>
                    <p className="text-gray-900">{order.assignedTo?.name}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Notas */}
            {(order.notes || order.deliveryNotes) && (
              <section className="border-t border-gray-100 pt-4">
                <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
                  Notas
                </h2>
                <div className="space-y-2">
                  {order.notes && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">Pedido</p>
                      <p className="text-gray-700 leading-relaxed">
                        {order.notes}
                      </p>
                    </div>
                  )}
                  {order.deliveryNotes && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">Entrega</p>
                      <p className="text-gray-700 leading-relaxed">
                        {order.deliveryNotes}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}
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
          {order.address.coordinates && (
            <MapModal
              isOpen={mapModal.isOpen}
              onClose={() => mapModal.close()}
              title={`Ubicación - ${order.address.branchName}`}
              center={{
                lat: order.address.coordinates.latitude,
                lng: order.address.coordinates.longitude,
              }}
              markers={[
                {
                  id: "customer-location",
                  position: {
                    lat: order.address.coordinates.latitude,
                    lng: order.address.coordinates.longitude,
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
