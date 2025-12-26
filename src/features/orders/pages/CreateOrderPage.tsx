import { Button, OverlayLoader } from "@/shared/components";
import { useHeaderConfig, useModal } from "@/shared/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { extractApiError } from "@/shared/utils";
import { AxiosError } from "axios";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { useCreateOrder } from "../hooks/useOrder";
import { useOrderSteps } from "../hooks/useOrderSteps";
import StepIndicator from "../components/StepIndicator";
import Step1CustomerInfo from "../components/steps/Step1CustomerInfo";
import Step2Products from "../components/steps/Step2Products";
import Step3DeliveryDetails from "../components/steps/Step3DeliveryDetails";
import Step4Summary from "../components/steps/Step4Summary";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";

const STEPS = [
  { number: 1, title: "Cliente", description: "Seleccionar cliente" },
  { number: 2, title: "Productos", description: "Agregar productos" },
  { number: 3, title: "Detalles", description: "Información de entrega" },
  { number: 4, title: "Resumen", description: "Confirmar pedido" },
];

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const { customerId } = useParams();

  const { mutate: createOrder, isPending } = useCreateOrder();

  const {
    currentStep,
    orderData,
    updateOrderData,
    nextStep,
    prevStep,
    goToStep,
    canAdvanceToStep,
    isStepValid,
  } = useOrderSteps(customerId);

  const confirmCancelCreateOrderModal = useModal();

  const handleCreateOrder = () => {
    // Transform orderData to CreateOrderDto
    const orderPayload = {
      customer_id: orderData.customerId!,
      address_id: orderData.customerAddressId!,
      order_items: orderData.orderItems.map((item) => ({
        product_id: item.productId,
        requested_quantity: item.requestedQuantity,
        notes: item.notes,
      })),
      scheduled_date: orderData.scheduledDate,
      delivery_notes: orderData.deliveryNotes,
      notes: orderData.notes,
    };

    createOrder(
      { orderData: orderPayload },
      {
        onSuccess: (response) => {
          toast.success("Pedido creado con éxito", { position: "top-center" });
          navigate(`/orders/${response.data.id}`);
        },
        onError: (err) => {
          toast.error(extractApiError(err as AxiosError).message, {
            position: "top-center",
          });
        },
      }
    );
  };

  const canGoNext = isStepValid(currentStep);

  useHeaderConfig({
    title: "Crear nuevo pedido",
    description: `Paso ${currentStep} de ${STEPS.length}: ${
      STEPS[currentStep - 1].title
    }`,
    actions: (
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            if (currentStep !== 1) {
              confirmCancelCreateOrderModal.open();
              return;
            }
            navigate("/orders");
          }}
          disabled={isPending}
        >
          Cancelar
        </Button>
        {currentStep === STEPS.length && (
          <Button onClick={handleCreateOrder} isLoading={isPending}>
            Crear Pedido
          </Button>
        )}
      </div>
    ),
  });

  return (
    <div className="mx-auto h-full relative">
      {isPending && (
        <OverlayLoader
          title="Creando pedido"
          description="Guardando información del pedido..."
        />
      )}
      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        steps={STEPS}
        onStepClick={goToStep}
        canNavigateToStep={canAdvanceToStep}
      />

      {currentStep === 4 && (
        <div className="flex justify-between mt-6 ml-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isPending}
            icon={ArrowLeftIcon}
          >
            Anterior
          </Button>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white pt-6 px-6">
        {currentStep === 1 && (
          <Step1CustomerInfo
            orderData={orderData}
            updateOrderData={updateOrderData}
            initialCustomerId={customerId}
          />
        )}

        {currentStep === 2 && (
          <Step2Products
            orderData={orderData}
            updateOrderData={updateOrderData}
          />
        )}

        {currentStep === 3 && (
          <Step3DeliveryDetails
            orderData={orderData}
            updateOrderData={updateOrderData}
          />
        )}

        {currentStep === 4 && (
          <Step4Summary
            orderData={orderData}
            onCreateOrder={handleCreateOrder}
            isCreating={isPending}
          />
        )}
      </div>

      <div className="absolute bottom-0 w-full">
        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between  px-6 py-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              icon={ArrowLeftIcon}
              iconPosition="left"
            >
              Anterior
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canGoNext}
              icon={ArrowRightIcon}
              iconPosition="right"
            >
              {currentStep === 3 ? "Ver Resumen" : "Siguiente"}
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        title="Cancelar creación de pedido"
        description="¿Estás seguro? Se perderán los datos ingresados."
        variant="danger"
        isOpen={confirmCancelCreateOrderModal.isOpen}
        onConfirm={() => navigate("/orders")}
        onCancel={() => confirmCancelCreateOrderModal.close()}
      />
    </div>
  );
}
