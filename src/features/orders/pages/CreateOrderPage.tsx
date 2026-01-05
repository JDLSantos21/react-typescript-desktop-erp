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
import { motion } from "motion/react";

const STEPS = [
  { number: 1, title: "Cliente", description: "Selección" },
  { number: 2, title: "Productos", description: "Armado" },
  { number: 3, title: "Detalles", description: "Logística" },
  { number: 4, title: "Resumen", description: "Confirmación" },
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
  const confirmCancel = useModal();

  const handleCreateOrder = () => {
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
        onSuccess: (res) => {
          toast.success("¡Pedido creado con éxito!");
          navigate(`/orders/${res.data.id}`);
        },
        onError: (err) =>
          toast.error(extractApiError(err as AxiosError).message),
      }
    );
  };

  useHeaderConfig({
    title: "Nuevo Pedido",
    showBackButton: true,
    onBack: () => confirmCancel.open(),
  });

  return (
    <div className="h-full bg-slate-50/50 flex flex-col items-center py-8 overflow-y-auto custom-scrollbar">
      {isPending && (
        <OverlayLoader title="Procesando" description="Creando el pedido..." />
      )}

      <div className="w-full max-w-4xl space-y-6 px-4">
        {/* Stepper Visual */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <StepIndicator
            currentStep={currentStep}
            steps={STEPS}
            onStepClick={goToStep}
            canNavigateToStep={canAdvanceToStep}
          />
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={currentStep} // Animación al cambiar de paso
          className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col"
        >
          <div className="flex-1 p-6 md:p-8">
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

          {/* Footer de Navegación */}
          <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50/50 rounded-b-2xl">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isPending}
              icon={ArrowLeftIcon}
              className="bg-white"
            >
              Anterior
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                icon={ArrowRightIcon}
                iconPosition="right"
                className="bg-slate-900 text-white"
              >
                {currentStep === 3 ? "Revisar Resumen" : "Siguiente"}
              </Button>
            ) : (
              <Button
                onClick={handleCreateOrder}
                isLoading={isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
              >
                Confirmar Pedido
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      <ConfirmDialog
        title="¿Cancelar creación?"
        description="Se perderá el progreso actual del pedido."
        variant="danger"
        isOpen={confirmCancel.isOpen}
        onConfirm={() => navigate("/orders")}
        onCancel={confirmCancel.close}
      />
    </div>
  );
}
