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
import SectionHeader from "@/shared/components/SectionHeader";

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading: isLoadingOrder } = useGetOrder(id!);
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();

  const [orderData, setOrderData] = useState<OrderStepData>({
    orderItems: [],
  });

  useEffect(() => {
    if (order?.data) {
      setOrderData({
        customerId: order.data.customer.id,
        customerAddressId: order.data.address.id,
        orderItems: order.data.products.map((p) => ({
          productId: p.id,
          productName: p.name,
          requestedQuantity: p.quantity,
          notes: "", // The API response might not have notes for items if not requested, assuming empty for now or need to check Order entity
        })),
        scheduledDate: order.data.scheduledDate
          ? new Date(order.data.scheduledDate).toISOString().split("T")[0]
          : undefined,
        deliveryNotes: order.data.deliveryNotes || "",
        notes: order.data.notes || "",
      });
    }
  }, [order]);

  const updateOrderData = (data: Partial<OrderStepData>) => {
    setOrderData((prev) => ({ ...prev, ...data }));
  };

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
          toast.success("Pedido actualizado correctamente");
          navigate(`/orders/${id}`);
        },
        onError: (err) => {
          toast.error(extractApiError(err as AxiosError).message);
        },
      }
    );
  };

  useHeaderConfig({
    title: "Editar Pedido",
    showBackButton: true,
    description: order?.data
      ? `Pedido #${order.data.trackingCode}`
      : "Cargando...",
    actions: (
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isUpdating}
        >
          Cancelar
        </Button>
        <Button onClick={handleSave} isLoading={isUpdating}>
          Guardar Cambios
        </Button>
      </div>
    ),
  });

  if (isLoadingOrder) {
    return <OverlayLoader title="Cargando pedido..." />;
  }

  if (!order?.data) {
    return <div>No se encontró el pedido</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-24">
      {isUpdating && <OverlayLoader title="Guardando cambios..." />}

      <section>
        <SectionHeader
          title="Productos"
          description="Modifica los productos del pedido"
        />
        <div className="mt-2 p-4">
          <Step2Products
            orderData={orderData}
            updateOrderData={updateOrderData}
            className="h-[600px]"
          />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Detalles de Entrega y Notas"
          description="Actualiza la fecha programada y notas"
        />
        <div className="mt-2 p-4">
          <Step3DeliveryDetails
            orderData={orderData}
            updateOrderData={updateOrderData}
          />
        </div>
      </section>
    </div>
  );
}
