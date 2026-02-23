import { CustomerAddress } from "@/shared/types/entities/customer.types";
import { Badge } from "@/shared/components/core/Badge";
import { MapPinPlusIcon } from "@/shared/components/icons";

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
    <div className={`grid 3xl:grid-cols-2  gap-3`}>
      {addresses.map((address) => (
        <div
          key={address.id}
          className="bg-background-secondary border border-border-light rounded-lg p-4 hover:border-primary/30 transition-colors select-none cursor-pointer"
          onClick={() => onSelect(address)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {address.branchName && (
                  <span className="text-sm font-semibold text-text-primary">
                    {address.branchName}
                  </span>
                )}
                {address.isPrimary && (
                  <Badge variant="primary" size="sm">
                    Principal
                  </Badge>
                )}
              </div>
              <p className="text-sm text-text-secondary mb-0.5">
                {address.direction}
              </p>
              <p className="text-xs text-text-muted flex items-center gap-1">
                <MapPinPlusIcon className="w-3 h-3 text-text-muted" />
                {address.city}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
