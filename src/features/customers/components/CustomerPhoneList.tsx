import { CustomerPhone } from "@/shared/types/entities/customer.types";
import { Badge } from "@/shared/components/core/Badge";
import { Phone, Smartphone } from "lucide-react";
import { formatPhoneNumber } from "@/shared/utils/formatters";

const phoneTypeLabels: Record<string, string> = {
  MOVIL: "Móvil",
  FIJO: "Fijo",
  TRABAJO: "Trabajo",
  OTROS: "Otros",
};

interface CustomerPhoneListProps {
  phones: CustomerPhone[];
  onSelect?: (phone: CustomerPhone) => void;
}

export default function CustomerPhoneList({
  phones,
  onSelect,
}: CustomerPhoneListProps) {
  if (phones.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-text-muted text-sm">No hay teléfonos registrados</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {phones.map((phone) => (
        <button
          type="button"
          key={phone.id}
          className="group min-w-0 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={() => onSelect?.(phone)}
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary"><Phone className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><span className="truncate text-sm font-semibold text-slate-900">{formatPhoneNumber(phone.phoneNumber)}</span>{phone.isPrimary ? <Badge variant="primary" size="sm">Principal</Badge> : null}</div>
              <p className="mt-2 truncate text-sm text-slate-700">{phoneTypeLabels[phone.type] || phone.type}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{phone.description || "Sin descripción"}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">{phone.hasWhatsapp ? <><Smartphone className="h-3.5 w-3.5 text-emerald-600" />WhatsApp disponible</> : "WhatsApp no disponible"}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
