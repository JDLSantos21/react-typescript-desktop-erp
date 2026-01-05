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
import { useEffect, useMemo } from "react";
import StatusHistoryModal from "../components/StatusHistoryModal";
import StatusModal from "../components/StatusModal";
import DriverAssignModal from "../components/DriverAssignModal";
import { handleOpenWhatsapp } from "@/lib/opener";
import { motion } from "motion/react";

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

  // Header dinámico
  const headerConfig = useMemo(() => {
    if (!order) return { title: "" };
    return {
      title: "",
      showBackButton: true,
      customContent: (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Pedido #{order.trackingCode}
              </h2>
              <Badge
                className={`rounded-md px-2.5 ${getStatusColor(order.status)}`}
              >
                {order.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <span>Creado: {formatDate(order.date)}</span>
              <span>•</span>
              <button
                onClick={() => copyToClipboard(order.trackingCode)}
                className="flex items-center gap-1 hover:text-slate-800 transition-colors"
              >
                <CopyIcon className="w-3 h-3" /> Copiar ID
              </button>
            </div>
          </div>
          {order.status !== "ENTREGADO" && order.status !== "CANCELADO" && (
            <Button
              onClick={() => statusModal.open()}
              className="bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200"
            >
              Actualizar Estado
            </Button>
          )}
        </div>
      ),
    };
  }, [order]);

  useHeaderConfig(headerConfig);

  if (isLoading) return <SectionLoader placeholder="Cargando detalles..." />;
  if (isError || !order)
    return (
      <ErrorState
        title="Error"
        message="No se pudo cargar el pedido"
        onRetry={refetch}
      />
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full bg-slate-50/50"
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Principal (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Información del Cliente y Entrega */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                Información de Entrega
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Cliente */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase">
                    <UserIcon className="w-4 h-4" /> Cliente
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">
                      {order.customer.businessName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {order.customer.representativeName}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => handleOpenWhatsapp(order)}
                      icon={WhatsAppIcon}
                      className="text-emerald-600 border-emerald-100 bg-emerald-50 hover:bg-emerald-100"
                    >
                      WhatsApp
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        navigate(`/customers/details/${order.customer.id}`)
                      }
                    >
                      Ver Perfil
                    </Button>
                  </div>
                </div>

                {/* Dirección */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase">
                    <LocationIcon className="w-4 h-4" /> Destino
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      {order.address.branchName}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {order.address.direction}, {order.address.city}
                    </p>
                  </div>
                  {order.address.coordinates && (
                    <Button
                      size="xs"
                      variant="outline"
                      icon={LocationIcon}
                      onClick={() => mapModal.open()}
                      className="mt-1"
                    >
                      Ver en Mapa
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Productos (Estilo Factura) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Productos Solicitados
                </h3>
                <span className="text-xs font-medium text-slate-500">
                  {order.products.length} ítems
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {order.products.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                        📦
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {product.size} • {product.unit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-xl font-bold text-slate-800">
                        x{product.quantity}
                      </span>
                      <span className="text-[10px] uppercase text-slate-400 font-bold">
                        Cantidad
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Notas */}
            {(order.notes || order.deliveryNotes) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.notes && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-xs font-bold text-amber-800 uppercase mb-1">
                      Nota de Pedido
                    </p>
                    <p className="text-sm text-amber-900/80">{order.notes}</p>
                  </div>
                )}
                {order.deliveryNotes && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-xs font-bold text-blue-800 uppercase mb-1">
                      Instrucciones de Entrega
                    </p>
                    <p className="text-sm text-blue-900/80">
                      {order.deliveryNotes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Columna Lateral (1/3) */}
          <div className="space-y-6">
            {/* Panel de Conductor */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Logística
              </h3>
              {order.assignedTo ? (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                    {order.assignedTo.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {order.assignedTo.name}
                    </p>
                    <p className="text-xs text-slate-500">Conductor Asignado</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg text-center text-sm text-slate-500 mb-4 border border-dashed border-slate-200">
                  Sin conductor asignado
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => driverAssignModal.open()}
              >
                {order.assignedTo ? "Cambiar Conductor" : "Asignar Conductor"}
              </Button>
            </div>

            {/* Fechas Clave */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Línea de Tiempo
              </h3>

              <div className="relative pl-4 border-l border-slate-100 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                  <p className="text-xs text-slate-400">Creación</p>
                  <p className="text-sm font-medium text-slate-700">
                    {formatDate(order.date)}
                  </p>
                </div>
                {order.scheduledDate && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                    <p className="text-xs text-slate-400">Programado para</p>
                    <p className="text-sm font-medium text-slate-700">
                      {formatDate(order.scheduledDate)}
                    </p>
                  </div>
                )}
                {order.deliveredDate && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <p className="text-xs text-slate-400">Entregado</p>
                    <p className="text-sm font-medium text-slate-700">
                      {formatDate(order.deliveredDate)}
                    </p>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-slate-500"
                onClick={() => statusHistoryModal.open()}
              >
                Ver historial completo
              </Button>
            </div>
          </div>
        </div>

        {/* Menú Flotante de Acciones */}
        <OrderAsideMenu
          onOpenStatusHistoryModal={() => statusHistoryModal.open()}
          onOpenDriverAssignModal={() => driverAssignModal.open()}
          onOpenEditModal={() => navigate(`/orders/${id}/edit`)}
          orderStatus={order.status}
        />

        {/* Modales */}
        <StatusHistoryModal
          orderId={order.id.toString()}
          isOpen={statusHistoryModal.isOpen}
          onClose={statusHistoryModal.close}
        />
        <StatusModal
          order={order}
          isOpen={statusModal.isOpen}
          onClose={statusModal.close}
        />
        <DriverAssignModal
          order={order}
          isOpen={driverAssignModal.isOpen}
          onClose={driverAssignModal.close}
        />

        {order.address.coordinates && (
          <MapModal
            isOpen={mapModal.isOpen}
            onClose={mapModal.close}
            title={`Ubicación - ${order.address.branchName}`}
            center={{
              lat: order.address.coordinates.latitude,
              lng: order.address.coordinates.longitude,
            }}
            markers={[
              {
                id: "customer-loc",
                position: {
                  lat: order.address.coordinates.latitude,
                  lng: order.address.coordinates.longitude,
                },
                icon: MapPinUserIcon,
                label: order.customer.businessName,
              },
            ]}
          />
        )}
      </div>
    </motion.div>
  );
}
