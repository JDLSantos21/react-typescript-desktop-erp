import { GasMeterIcon } from "@/shared/components/icons";
import {
  AsideButton,
  AsideMenu,
} from "@/shared/components/navigation/AsideMenu";
import { FuelRefill } from "@/shared/types/entities/fuel.types";

interface FuelRefillAsideMenuProps {
  refill: FuelRefill;
  onOpenConsumptions: () => void;
}

export const FuelRefillAsideMenu = ({
  refill: _refill,
  onOpenConsumptions,
}: FuelRefillAsideMenuProps) => {
  return (
    <AsideMenu>
      <AsideButton
        label="Consumos asociados"
        onClick={onOpenConsumptions}
        icon={<GasMeterIcon className="w-4 h-4" />}
      />
    </AsideMenu>
  );
};
