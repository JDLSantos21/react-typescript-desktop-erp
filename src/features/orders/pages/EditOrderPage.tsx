import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrder, useUpdateOrder } from "../hooks/useOrder";
import { useHeaderConfig } from "@/shared/hooks";
import { Button, OverlayLoader } from "@/shared/components";
import { OrderStepData } from "../hooks/useOrderSteps";
import Step2Products from "../components/steps/Step2Products";
import Step3DeliveryDetails from "../components/steps/Step3DeliveryDetails";
import { toast } from "sonner";
import { extractApiError } from "@/shared/utils";
import { AxiosError } from "axios";
import { PackageOpenIcon, TruckIcon } from "lucide-react";

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading: isLoadingOrder } = useGetOrder(id!);
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();

  const [orderData, setOrderData] = useState<OrderStepData>({ orderItems: [] });

  useEffect(() => {
    if (order?.data) {
      setOrderData({
        customerId: order.data.customer.id,
        customerAddressId: order.data.address.id,
        orderItems: order.data.products.map((p) => ({
          productId: p.id,
          productName: p.name,
          requestedQuantity: p.quantity,
          notes: "", // Ajustar según backend si trae notas por ítem
        })),
        scheduledDate: order.data.scheduledDate
          ? new Date(order.data.scheduledDate).toISOString().split("T")[0]
          : undefined,
        deliveryNotes: order.data.deliveryNotes || "",
        notes: order.data.notes || "",
      });
    }
  }, [order]);

  const updateOrderData = (data: Partial<OrderStepData>) =>
    setOrderData((prev) => ({ ...prev, ...data }));

  const handleSave = () => {
    if (!id) return;
    const payload = {
      order_items: orderData.orderItems.map((item) => ({
        product_id: item.productId,
        requested_quantity: item.requestedQuantity,
        notes: item.notes,
      })),
      scheduled_date: orderData.scheduledDate,
      delivery_notes: orderData.deliveryNotes,
      notes: orderData.notes,
    };

    updateOrder(
      { orderId: parseInt(id), data: payload },
      {
        onSuccess: () => {
          toast.success("Pedido actualizado");
          navigate(`/orders/${id}`);
        },
        onError: (err) =>
          toast.error(extractApiError(err as AxiosError).message),
      }
    );
  };

  useHeaderConfig({
    title: "Modificar Pedido",
    description: order?.data ? `#${order.data.trackingCode}` : "Cargando...",
    showBackButton: true,
    actions: (
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isUpdating}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          isLoading={isUpdating}
          className="bg-slate-900 text-white shadow-lg"
        >
          Guardar Cambios
        </Button>
      </div>
    ),
  });

  if (isLoadingOrder) return <OverlayLoader title="Cargando datos..." />;
  if (!order?.data) return <div>Pedido no encontrado</div>;

  return (
    <div className="h-full bg-slate-50/50 overflow-y-auto custom-scrollbar p-6">
      {isUpdating && <OverlayLoader title="Guardando..." />}

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Sección Productos */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <PackageOpenIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Contenido del Pedido</h3>
              <p className="text-xs text-slate-500">
                Agrega o elimina productos
              </p>
            </div>
          </div>
          <div className="p-6">
            <Step2Products
              orderData={orderData}
              updateOrderData={updateOrderData}
            />
          </div>
        </section>

        {/* Sección Logística */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <TruckIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Logística de Entrega</h3>
              <p className="text-xs text-slate-500">
                Fechas y notas especiales
              </p>
            </div>
          </div>
          <div className="p-6">
            <Step3DeliveryDetails
              orderData={orderData}
              updateOrderData={updateOrderData}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
