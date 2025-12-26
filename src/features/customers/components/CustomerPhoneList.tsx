import { CustomerPhone } from "@/shared/types/entities/customer.types";
import { Badge, WhatsAppIcon } from "@/shared/components";
import { formatPhoneNumber } from "@/shared/utils";

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

  const isMoreThanTwo = phones.length > 2;
  return (
    <div
      className={`grid 3xl:grid-cols-2 ${
        isMoreThanTwo ? "3xl:grid-cols-3" : ""
      } gap-3`}
    >
      {phones.map((phone) => (
        <div
          key={phone.id}
          className="bg-background-secondary border border-border-light rounded-lg p-4 hover:border-primary/30 transition-colors select-none cursor-pointer"
          onClick={() => onSelect?.(phone)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-col gap-1 mb-1">
                <div className="flex">
                  {phone.isPrimary && (
                    <Badge variant="primary" size="sm" className="">
                      Principal
                    </Badge>
                  )}
                  {phone.hasWhatsapp && (
                    <Badge variant="success" size="sm" className="gap-1">
                      <WhatsAppIcon />
                      WhatsApp
                    </Badge>
                  )}
                </div>
                <span className="text-sm font-semibold text-text-primary font-mono">
                  {formatPhoneNumber(phone.phoneNumber)}
                </span>
              </div>
              <p className="text-xs text-text-muted">
                {phoneTypeLabels[phone.type] || phone.type}
                {phone.description && ` • ${phone.description}`}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
