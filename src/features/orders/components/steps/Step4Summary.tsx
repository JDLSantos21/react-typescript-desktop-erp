import { Alert } from "@/shared/components/core/Alert";
import { OrderStepData } from "../../hooks/useOrderSteps";
import { useCustomerById } from "@/features/customers/hooks/useCustomer";
import {
  CheckCircleIcon,
  PackageIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";

interface Step4SummaryProps {
  orderData: OrderStepData;
}

export default function Step4Summary({ orderData }: Step4SummaryProps) {
  const { data: customerData } = useCustomerById(orderData.customerId || "");

  const customer = customerData?.data;
  const selectedAddress = customer?.addresses.find(
    (a) => a.id === orderData.customerAddressId,
  );

  const totalProducts = orderData.orderItems.reduce(
    (sum, p) => sum + p.requestedQuantity,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Customer Info Summary */}
      <div className="bg-white border border-border rounded-lg p-4">
        <div className="flex  gap-1 mb-4">
          <UserIcon className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-text-primary">Cliente</h4>
        </div>

        <div className="space-y-2 text-sm font-medium">
          <div>
            <p className="text-gray-500">Cliente</p>
            <p>{customer?.businessName}</p>
            <p>{customer?.representativeName}</p>
          </div>

          <div className="pt-2 text-gray-900 font-medium">
            <p className="text-gray-500">Dirección de Entrega</p>
            <p>{selectedAddress?.direction}</p>
            <p>{selectedAddress?.city}</p>
          </div>
        </div>
      </div>

      {/* Products Summary */}
      <div className="bg-white border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <PackageIcon className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-text-primary">
            Productos ({orderData.orderItems.length})
          </h4>
        </div>

        <div className="space-y-1">
          {orderData.orderItems.map((product, index) => (
            <div
              key={`product-${product.productId}-${product.requestedQuantity}`}
              className={`flex items-start justify-between py-2 ${
                orderData.orderItems.length > index + 1 ? "border-b" : ""
              } border-gray-100 last:border-0`}
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {product.productName || `Producto ID: ${product.productId}`}
                </p>
                {product.notes && (
                  <p className="text-xs text-gray-500 mt-1">{product.notes}</p>
                )}
              </div>
              <div className="text-right ml-4">
                <p className="font-medium text-gray-900">
                  {product.requestedQuantity} und.
                </p>
              </div>
            </div>
          ))}

          <div className="pt-3 border-t-2 border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-gray-700 font-medium">Total Productos:</p>
              <p className="text-gray-900 font-semibold">
                {totalProducts} unidades
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Details Summary */}
      <div className="bg-white border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TruckIcon className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-gray-900">Detalles de Entrega</h4>
        </div>

        <div className="space-y-2 text-sm">
          {orderData.scheduledDate ? (
            <div>
              <p className="text-gray-500">Fecha Programada</p>
              <p className="font-medium text-gray-900">
                {new Date(orderData.scheduledDate).toLocaleDateString("es-DO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Sin fecha programada especificada
            </p>
          )}

          {orderData.deliveryNotes && (
            <div className="pt-2">
              <p className="text-gray-500">Notas de Entrega</p>
              <p className="text-gray-700 mt-1">{orderData.deliveryNotes}</p>
            </div>
          )}

          {orderData.notes && (
            <div className="pt-2">
              <p className="text-gray-500">Notas Generales</p>
              <p className="text-gray-700 mt-1">{orderData.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Success Alert */}
      <Alert variant="success">
        <div className="flex items-start gap-2">
          <CheckCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">¡Todo listo!</p>
            <p className="text-sm mt-1">
              Haz clic en "Crear Pedido" para guardar toda la información y
              generar el pedido.
            </p>
          </div>
        </div>
      </Alert>
    </div>
  );
}
