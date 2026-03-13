import { CustomerPhone } from "@/shared/types/entities/customer.types";
import { Badge } from "@/shared/components/core/Badge";
import { WhatsAppIcon } from "@/shared/components/icons";
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
          role="button"
          tabIndex={0}
          className="bg-background-secondary border border-border-light rounded-lg p-4 hover:border-primary/30 focus-visible:ring-2 focus-visible:outline-none focus:outline-none transition-colors select-none cursor-pointer"
          onClick={() => onSelect?.(phone)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect?.(phone);
            }
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 flex-col">
              <div className="flex gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-text-primary">
                    {formatPhoneNumber(phone.phoneNumber)}
                  </span>
                  {phone.isPrimary && (
                    <Badge variant="primary" size="sm">
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
