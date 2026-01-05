import { Textarea, DatePicker } from "@/shared/components";
import { OrderStepData } from "../../hooks/useOrderSteps";
import { format } from "date-fns";
import { CalendarIcon, FileTextIcon } from "lucide-react";

interface Step3DeliveryDetailsProps {
  orderData: OrderStepData;
  updateOrderData: (data: Partial<OrderStepData>) => void;
}

export default function Step3DeliveryDetails({
  orderData,
  updateOrderData,
}: Step3DeliveryDetailsProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-slate-900">Detalles Finales</h2>
        <p className="text-slate-500 text-sm">
          Agrega información logística relevante.
        </p>
      </div>

      <div className="space-y-6">
        {/* Fecha */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            Cuándo se necesita
          </div>
          <DatePicker
            label=""
            className="w-full"
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
          />
          <p className="text-xs text-slate-400">
            Si se deja vacío, se asume entrega inmediata o lo antes posible.
          </p>
        </div>

        {/* Notas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm mb-3">
              <FileTextIcon className="w-4 h-4 text-amber-500" />
              Instrucciones de Entrega
            </div>
            <Textarea
              placeholder="Ej: Entregar en la puerta trasera, llamar antes de llegar..."
              value={orderData.deliveryNotes || ""}
              onChange={(e) =>
                updateOrderData({ deliveryNotes: e.target.value })
              }
              rows={3}
              className="bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm mb-3">
              <FileTextIcon className="w-4 h-4 text-slate-400" />
              Notas Internas (Opcional)
            </div>
            <Textarea
              placeholder="Notas para el equipo administrativo..."
              value={orderData.notes || ""}
              onChange={(e) => updateOrderData({ notes: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
