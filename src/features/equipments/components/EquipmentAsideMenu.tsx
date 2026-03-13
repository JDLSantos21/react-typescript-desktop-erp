import { DeleteIcon } from "@/shared/components/icons";
import {
  AsideButton,
  AsideMenu,
} from "@/shared/components/navigation/AsideMenu";

export const EquipmentAsideMenu = () => {
  return (
    <AsideMenu>
      <AsideButton
        label="Eliminar"
        onClick={() => {}}
        icon={<DeleteIcon className="w-4 h-4" />}
        variant="danger"
      />
    </AsideMenu>
  );
};
