import { Button } from "@/shared/components/core/Button";
import { LocationIcon, UserIcon, WhatsAppIcon } from "@/shared/components/icons";
import { formatPhoneNumber, formatDate } from "@/shared/utils/formatters";
import { handleOpenWhatsapp } from "@/lib/opener";
import { Order } from "@/shared/types/entities/order.types";
import { useNavigate } from "react-router-dom";

interface OrderDetailSectionsProps {
  order: Order;
  onOpenMap: () => void;
}

export function OrderDetailSections({ order, onOpenMap }: OrderDetailSectionsProps) {
  const navigate = useNavigate();

  return (
    <>
      <section className="space-y-2">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium">
          Cliente
        </h2>
        <div className="space-y-2">
          <div>
            <p className=" text-text-primary">
              {order.customer.businessName}
            </p>
            <p className="text-text-secondary">
              {order.customer.representativeName}
            </p>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            {order.phone?.hasWhatsapp && (
              <WhatsAppIcon className="text-green-500 w-4 h-4" />
            )}
            <p className="font-mono text-sm">
              {order.phone
                ? formatPhoneNumber(order.phone.phoneNumber)
                : "Sin teléfono disponible"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleOpenWhatsapp(order)}
            icon={WhatsAppIcon}
            variant="outline"
            size="sm"
            disabled={!order.phone}
          >
            Mensaje
          </Button>

          <Button
            onClick={() => navigate(`/customers/${order.customer.id}`)}
            icon={UserIcon}
            variant="outline"
            size="sm"
          >
            Ver Cliente
          </Button>
        </div>
      </section>

      {/* Dirección de Entrega */}
      <section className="border-t border-gray-100 pt-4">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
          Dirección de entrega
        </h2>
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="font-medium text-gray-900">
              {order.address?.branchName ?? "Sin dirección disponible"}
            </p>
            {order.address && (
              <>
                <p className="text-gray-600">{order.address.direction}</p>
                <p className="text-gray-600">{order.address.city}</p>
              </>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-2 w-2 rounded-full ${
                  order.address?.coords
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
              <p className="text-sm text-gray-500">
                {order.address?.coords?.latitude != null
                  ? "Ubicación exacta disponible"
                  : "Sin ubicación exacta"}
              </p>
            </div>
            <Button
              variant="outline"
              icon={LocationIcon}
              size="sm"
              disabled={order.address?.coords?.latitude == null}
              onClick={onOpenMap}
            >
              Ver en mapa
            </Button>
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="border-t border-gray-100 pt-4">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
          Productos
        </h2>
        <div className="space-y-2">
          {order.products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center py-2 border last:border-0 bg-gray-50/50 px-4 rounded-md shadow"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {[product.size, product.unit].filter(Boolean).join(" · ")}
                </p>
              </div>
              <p className="text-lg font-light text-gray-900 tabular-nums">
                ×{product.quantity}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Fechas y Seguimiento */}
      <section className="border-t border-gray-100 pt-4">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
          Seguimiento
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <p className="text-xs text-gray-400 mb-1.5">
              Fecha de pedido
            </p>
            <p className="text-gray-900">{formatDate(order.date)}</p>
          </div>
          {order.scheduledDate && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">
                Fecha programada
              </p>
              <p className="text-gray-900">
                {formatDate(order.scheduledDate)}
              </p>
            </div>
          )}
          {order.deliveredDate && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">
                Fecha de entrega
              </p>
              <p className="text-gray-900">
                {formatDate(order.deliveredDate)}
              </p>
            </div>
          )}
          {order.assignedTo && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Asignado a</p>
              <p className="text-gray-900">{order.assignedTo?.name}</p>
            </div>
          )}
        </div>
      </section>

      {/* Notas */}
      {(order.notes || order.deliveryNotes) && (
        <section className="border-t border-gray-100 pt-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
            Notas
          </h2>
          <div className="space-y-2">
            {order.notes && (
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Pedido</p>
                <p className="text-gray-700 leading-relaxed">
                  {order.notes}
                </p>
              </div>
            )}
            {order.deliveryNotes && (
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Entrega</p>
                <p className="text-gray-700 leading-relaxed">
                  {order.deliveryNotes}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
