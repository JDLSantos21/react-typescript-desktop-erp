import { handleOpenWhatsapp } from "@/lib/opener";
import {
  Badge,
  Button,
  CopyIcon,
  LocationIcon,
  MessagesIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/shared/components";
import { Order } from "@/shared/types/entities/order.types";
import {
  copyToClipboard,
  formatDate,
  formatPhoneNumber,
  getStatusColor,
} from "@/shared/utils";
import { useNavigate } from "react-router-dom";

interface OrderCardProps {
  order: Order;
}
export default function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-border">
      <section className="flex justify-between items-center">
        <h3 className="font-semibold">{order.customer.businessName}</h3>
        <Badge size="xs" className={`${getStatusColor(order.status)}`}>
          {order.status}
        </Badge>
      </section>
      <section className="flex justify-between text-xs pt-1">
        <div className="flex items-center">
          <span>{order.trackingCode}</span>
          <button
            className="ml-2 cursor-pointer hover:text-blue-600"
            onClick={() => copyToClipboard(order.trackingCode)}
          >
            <CopyIcon className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <span>{formatDate(order.date, "DD MMM [de] YYYY hh:mm A")}</span>
        </div>
      </section>
      <section>
        <div className="mt-2 bg-blue-50 p-2 rounded">
          <p className="flex items-center gap-1 text-xs text-primary">
            <LocationIcon className="w-4 h-4" /> <span>Dirección</span>
          </p>
          {order.address.branchName && (
            <p className="mt-2 ml-5 text-xs text-gray-800 font-medium">
              Sucursal: {order.address.branchName}
            </p>
          )}
          {order.address && (
            <p className="ml-5 text-xs text-gray-800 truncate">
              {order.address.direction} - {order.address.city}
            </p>
          )}
        </div>
        <div className="mt-2 bg-blue-50 p-2 rounded flex justify-between items-center">
          <div>
            <p className="flex items-center gap-1 text-xs text-primary">
              <PhoneIcon className="w-4 h-4" /> <span>Contácto</span>
            </p>
            {order.phone && (
              <span className="mt-2 ml-5 text-xs text-gray-800 flex items-center gap-1">
                {formatPhoneNumber(order.phone.phoneNumber)}
              </span>
            )}
          </div>
          <div>
            {order.phone.hasWhatsapp && (
              <Button
                icon={WhatsAppIcon}
                iconClassName="text-green-500"
                size="sm"
                variant="ghost"
                onClick={() => handleOpenWhatsapp(order)}
              />
            )}
          </div>
        </div>
        <div className="mt-2 bg-blue-50 p-2 rounded flex gap-2 items-center">
          <p className="flex items-center gap-1 text-xs text-primary">
            <MessagesIcon /> <span>Notas</span>
          </p>
          <span className="mt-2 ml-5 text-xs text-gray-800 flex items-center gap-1">
            {order.notes || "Sin notas"}
          </span>
        </div>
      </section>
      <div className="border-b border-gray-200 my-3" />
      <section className="flex justify-between items-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          Detalles
        </Button>
      </section>
    </div>
  );
}
