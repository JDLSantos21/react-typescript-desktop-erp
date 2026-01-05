import { handleOpenWhatsapp } from "@/lib/opener";
import {
  Badge,
  Button,
  CopyIcon,
  LocationIcon,
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
import { motion } from "motion/react";
import { toast } from "sonner";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(order.trackingCode);
    toast.success("Código copiado");
  };

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      layoutId={`order-${order.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => navigate(`/orders/${order.id}`)}
    >
      {/* Cabecera */}
      <div className="p-5 pb-3 border-b border-slate-50">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-bold text-slate-800 line-clamp-1 text-lg">
            {order.customer.businessName}
          </h3>
          <Badge
            size="xs"
            className={`shrink-0 rounded-lg ${getStatusColor(order.status)}`}
          >
            {order.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 group/code hover:text-slate-900 transition-colors">
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
              #{order.trackingCode}
            </span>
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover/code:opacity-100 transition-opacity"
            >
              <CopyIcon className="w-3 h-3" />
            </button>
          </div>
          <span>{formatDate(order.date, "D MMM, h:mm A")}</span>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-5 pt-4 space-y-3 flex-1">
        {/* Dirección */}
        <div className="flex gap-3">
          <div className="mt-0.5 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600">
            <LocationIcon className="w-4 h-4" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-slate-700">
              {order.address.branchName || "Sucursal Principal"}
            </p>
            <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">
              {order.address.direction} • {order.address.city}
            </p>
          </div>
        </div>

        {/* Contacto */}
        {order.phone && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
              <PhoneIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 text-sm">
              <p className="text-slate-600 font-medium">
                {formatPhoneNumber(order.phone.phoneNumber)}
              </p>
            </div>
            {order.phone.hasWhatsapp && (
              <Button
                icon={WhatsAppIcon}
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenWhatsapp(order);
                }}
              />
            )}
          </div>
        )}

        {/* Notas (Condicional) */}
        {order.notes && (
          <div className="mt-2 bg-yellow-50/50 border border-yellow-100 p-2.5 rounded-xl text-xs text-yellow-800 flex gap-2">
            <span className="font-bold">Nota:</span>
            <span className="line-clamp-2">{order.notes}</span>
          </div>
        )}
      </div>

      {/* Footer / Acción */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
        <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          Ver detalles →
        </span>
      </div>
    </motion.li>
  );
}
