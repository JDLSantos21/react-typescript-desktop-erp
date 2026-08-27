import { CustomerAddress } from "@/shared/types/entities/customer.types";
import { Badge } from "@/shared/components/core/Badge";
import { MapPin, Navigation } from "lucide-react";

interface CustomerAddressListProps {
  addresses: CustomerAddress[];
  onSelect: (address: CustomerAddress) => void;
}

export default function CustomerAddressList({
  addresses,
  onSelect,
}: CustomerAddressListProps) {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-text-muted text-sm">
          No hay direcciones registradas
        </p>
      </div>
    );
  }

  return (
      <div className="grid gap-3">
      {addresses.map((address) => (
        <button
          type="button"
          key={address.id}
          className="group min-w-0 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={() => onSelect(address)}
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary"><MapPin className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-slate-900">{address.branchName || "Principal"}</span>
                {address.isPrimary ? <Badge variant="primary" size="sm">Principal</Badge> : null}
              </div>
              <p className="mt-2 truncate text-sm text-slate-700">{address.direction}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{address.city}</p>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><Navigation className="h-3.5 w-3.5" />{address.coords ? "Ubicación exacta registrada" : "Sin ubicación exacta"}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
