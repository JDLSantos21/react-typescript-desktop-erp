import { Alert } from "@/shared/components";
import { OrderStepData } from "../../hooks/useOrderSteps";
import { useCustomerById } from "@/features/customers/hooks/useCustomer";
import {
  CheckCircleIcon,
  PackageIcon,
  UserIcon,
  MapPinIcon,
  CalendarClockIcon,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Step4SummaryProps {
  orderData: OrderStepData;
  onCreateOrder: () => void;
  isCreating: boolean;
}

export default function Step4Summary({ orderData }: Step4SummaryProps) {
  const { data: customerData } = useCustomerById(orderData.customerId || "");
  const customer = customerData?.data;
  const address = customer?.addresses.find(
    (a) => a.id === orderData.customerAddressId
  );
  const totalQty = orderData.orderItems.reduce(
    (sum, p) => sum + p.requestedQuantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Alert
        variant="success"
        className="bg-emerald-50 border-emerald-100 text-emerald-800 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5" />
          <div>
            <p className="font-bold">Todo listo para procesar</p>
            <p className="text-xs opacity-80">
              Revisa la información antes de crear el pedido.
            </p>
          </div>
        </div>
      </Alert>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header del Resumen */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">
            Resumen de Pedido
          </h3>
          <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full font-bold">
            Borrador
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cliente */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <UserIcon className="w-3 h-3" /> Cliente
            </h4>
            <div>
              <p className="font-bold text-slate-900">
                {customer?.businessName}
              </p>
              <p className="text-sm text-slate-500">
                {customer?.representativeName}
              </p>
            </div>
          </div>

          {/* Entrega */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MapPinIcon className="w-3 h-3" /> Entrega
            </h4>
            <div>
              <p className="font-medium text-slate-900">{address?.city}</p>
              <p className="text-sm text-slate-500">{address?.direction}</p>
              {orderData.scheduledDate && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded">
                  <CalendarClockIcon className="w-3 h-3" />
                  {format(
                    new Date(orderData.scheduledDate + "T00:00:00"),
                    "dd MMM yyyy",
                    { locale: es }
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="border-t border-slate-100">
          <div className="px-6 py-3 bg-slate-50/50 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <PackageIcon className="w-3 h-3" /> Detalle de Productos
          </div>
          <div className="divide-y divide-slate-50">
            {orderData.orderItems.map((item, i) => (
              <div
                key={i}
                className="px-6 py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-slate-800 text-sm">
                    {item.productName}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-amber-600 italic mt-0.5">
                      {item.notes}
                    </p>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  x{item.requestedQuantity}
                </span>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <span className="font-bold text-slate-700">Total Unidades</span>
            <span className="text-lg font-bold text-slate-900">{totalQty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
