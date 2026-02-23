import { Textarea } from "@/shared/components/core/Textarea";
import { DatePicker } from "@/shared/components/core/DatePicker";
import { OrderStepData } from "../../hooks/useOrderSteps";
import { format } from "date-fns";

interface Step3DeliveryDetailsProps {
  orderData: OrderStepData;
  updateOrderData: (data: Partial<OrderStepData>) => void;
}

export default function Step3DeliveryDetails({
  orderData,
  updateOrderData,
}: Step3DeliveryDetailsProps) {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="bg-white space-y-4">
        <DatePicker
          className="max-w-56"
          label="Fecha Programada"
          value={
            orderData.scheduledDate
              ? new Date(orderData.scheduledDate + "T00:00:00")
              : undefined
          }
          onChange={(date) =>
            updateOrderData({
              scheduledDate: date ? format(date, "yyyy-MM-dd") : undefined,
            })
          }
          helperText="Fecha estimada de preparación o entrega"
        />

        <Textarea
          label="Notas de Entrega"
          value={orderData.deliveryNotes || ""}
          onChange={(e) => updateOrderData({ deliveryNotes: e.target.value })}
          placeholder="Instrucciones especiales para la entrega (ej: llamar al llegar, entregar en puerta trasera, etc.)"
          rows={3}
        />

        <Textarea
          label="Notas Generales del Pedido"
          value={orderData.notes || ""}
          onChange={(e) => updateOrderData({ notes: e.target.value })}
          placeholder="Notas internas del pedido (ej: cliente VIP, revisar inventario, etc.)"
          rows={3}
        />
      </div>
    </div>
  );
}
