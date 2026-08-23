import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrder, useUpdateOrder } from "../hooks/useOrder";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { Button } from "@/shared/components/core/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { OverlayLoader } from "@/shared/components/OverlayLoader";
import { useOrderSteps } from "../hooks/useOrderSteps";
import Step2Products from "../components/steps/Step2Products";
import Step3DeliveryDetails from "../components/steps/Step3DeliveryDetails";
import { extractApiError } from "@/shared/utils/error-handler";

import { toast } from "sonner";
import StepIndicator from "../components/StepIndicator";
import StepIndicatorNavigation from "../components/StepIndicatorNavigation";
import Step4Summary from "../components/steps/Step4Summary";

export default function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading: isLoadingOrder } = useGetOrder(id!);
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();

  const INITIAL_STEP = 2;

  const {
    currentStep,
    orderData,
    updateOrderData,
    nextStep,
    prevStep,
    goToStep,
    canAdvanceToStep,
    isStepValid,
  } = useOrderSteps(order?.data.customer.id, INITIAL_STEP);

  useEffect(() => {
    if (order?.data) {
      updateOrderData({
        customerId: order.data.customer.id,
        customerAddressId: order.data.address?.id,
        orderItems: order.data.products.map((p) => ({
          productId: p.id,
          productName: p.name,
          requestedQuantity: p.quantity,
          notes: "", // The API response might not have notes for items if not requested, assuming empty for now or need to check Order entity
        })),
        scheduledDate: order.data.scheduledDate ?? undefined,
        deliveryNotes: order.data.deliveryNotes || "",
        notes: order.data.notes || "",
      });
    }
  }, [order]);

  const handleSave = () => {
    if (!id) return;

    const payload = {
      orderItems: orderData.orderItems.map((item) => ({
        productId: item.productId,
        requestedQuantity: item.requestedQuantity,
        notes: item.notes,
      })),
      scheduledDate: orderData.scheduledDate,
      deliveryNotes: orderData.deliveryNotes,
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
          toast.error(extractApiError(err).message);
        },
      },
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
    return (
      <EmptyState
        title="No se encontró el pedido"
        description="El pedido que intentas editar no existe o ha sido eliminado."
      />
    );
  }

  return (
    <div className="mx-auto h-full relative">
      {isUpdating && <OverlayLoader title="Guardando cambios..." />}

      <StepIndicator
        currentStep={currentStep}
        steps={[
          { number: 2, title: "Productos", description: "Modificar productos" },
          {
            number: 3,
            title: "Detalles",
            description: "Información de entrega",
          },
          { number: 4, title: "Resumen", description: "Confirmar cambios" },
        ]}
        onStepClick={(step) => goToStep(step)}
        canNavigateToStep={(step) => canAdvanceToStep(step)}
      />

      <div className="bg-white pt-6 px-6">
        {currentStep === 2 && (
          <Step2Products
            orderData={orderData}
            updateOrderData={updateOrderData}
            className="h-[600px]"
          />
        )}

        {currentStep === 3 && (
          <Step3DeliveryDetails
            orderData={orderData}
            updateOrderData={updateOrderData}
          />
        )}

        {currentStep === 4 && <Step4Summary orderData={orderData} />}
      </div>

      <StepIndicatorNavigation
        currentStep={currentStep}
        prevStep={prevStep}
        nextStep={nextStep}
        canGoNext={isStepValid(currentStep)}
      />
    </div>
  );
}
