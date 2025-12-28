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
  HistoryIcon,
  LocationIcon,
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
  const { data, isLoading, isError } = useGetOrder(id!);
  const { setHeaderConfig, resetHeader } = useHeaderConfig();
  const navigate = useNavigate();

  const statusModal = useModal();
  const statusHistoryModal = useModal();
  const driverAssignModal = useModal();

  console.log(data?.data.address.coordinates);

  useEffect(() => {
    if (data?.data) {
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
                <p>Pedido el {formatDate(data.data.date)}</p>
                <div className="border-l border-gray-200 h-3 mx-2" />
                <p className="font-mono text-xs">{data.data.trackingCode}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  icon={CopyIcon}
                  onClick={async () => {
                    try {
                      await copyToClipboard(data.data.trackingCode);
                      toast.info("Código de seguimiento copiado.");
                    } catch (error) {
                      toast.error(
                        "No se pudo copiar el código de seguimiento."
                      );
                    }
                  }}
                />
                <Badge
                  className={`${getStatusColor(data.data.status)}`}
                  size="sm"
                >
                  {data.data.status}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 self-end">
              {data.data.status !== "ENTREGADO" &&
                data.data.status !== "CANCELADO" && (
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
  }, [data, id, setHeaderConfig, resetHeader]);

  return (
    <div>
      {isLoading ? (
        <SectionLoader placeholder="Cargando detalles del pedido" />
      ) : data && !isError ? (
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
                    {data?.data.customer.businessName}
                  </p>
                  <p className="text-text-secondary">
                    {data?.data.customer.representativeName}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  {data?.data.phone.hasWhatsapp && (
                    <WhatsAppIcon className="text-green-500 w-4 h-4" />
                  )}
                  <p className="font-mono text-sm">
                    {formatPhoneNumber(data?.data.phone.phoneNumber)}
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
                    navigate(`/customers/details/${data.data.customer.id}`)
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
                    {data?.data.address.branchName}
                  </p>
                  <p className="text-gray-600">
                    {data?.data.address.direction}
                  </p>
                  <p className="text-gray-600">{data?.data.address.city}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-2 w-2 rounded-full ${
                        data?.data.address.coordinates
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <p className="text-sm text-gray-500">
                      {data?.data.address.coordinates
                        ? "Ubicación exacta disponible"
                        : "Sin ubicación exacta"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    icon={LocationIcon}
                    size="sm"
                    disabled={!data?.data.address.coordinates}
                    onClick={() => {
                      if (data?.data.address.coordinates) {
                        const { latitude, longitude } =
                          data.data.address.coordinates;
                        window.open(
                          `https://www.google.com/maps?q=${latitude},${longitude}`,
                          "_blank"
                        );
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
                {data?.data.products.map((product) => (
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
                  <p className="text-gray-900">{formatDate(data?.data.date)}</p>
                </div>
                {data?.data.scheduledDate && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">
                      Fecha programada
                    </p>
                    <p className="text-gray-900">
                      {formatDate(data?.data.scheduledDate)}
                    </p>
                  </div>
                )}
                {data?.data.deliveredDate && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">
                      Fecha de entrega
                    </p>
                    <p className="text-gray-900">
                      {formatDate(data?.data.deliveredDate)}
                    </p>
                  </div>
                )}
                {data?.data.assignedTo && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Asignado a</p>
                    <p className="text-gray-900">
                      {data?.data.assignedTo?.name}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Notas */}
            {(data?.data.notes || data?.data.deliveryNotes) && (
              <section className="border-t border-gray-100 pt-4">
                <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
                  Notas
                </h2>
                <div className="space-y-2">
                  {data?.data.notes && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">Pedido</p>
                      <p className="text-gray-700 leading-relaxed">
                        {data?.data.notes}
                      </p>
                    </div>
                  )}
                  {data?.data.deliveryNotes && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">Entrega</p>
                      <p className="text-gray-700 leading-relaxed">
                        {data?.data.deliveryNotes}
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
            orderStatus={data.data.status}
          />
          <StatusHistoryModal
            orderId={data.data.id.toString()}
            isOpen={statusHistoryModal.isOpen}
            onClose={() => statusHistoryModal.close()}
          />

          <StatusModal
            order={data.data}
            isOpen={statusModal.isOpen}
            onClose={() => statusModal.close()}
          />

          <DriverAssignModal
            order={data.data}
            isOpen={driverAssignModal.isOpen}
            onClose={() => driverAssignModal.close()}
          />
        </div>
      ) : (
        isError && <p>Error al cargar el pedido.</p>
      )}
    </div>
  );
}
