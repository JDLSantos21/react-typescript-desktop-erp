import {
  AssignmentIcon,
  DeleteIcon,
  HistoryIcon,
} from "@/shared/components/icons";
import {
  AsideButton,
  AsideMenu,
} from "@/shared/components/navigation/AsideMenu";

interface EquipmentAsideMenuProps {
  onAssign: () => void;
  onViewAssignmentHistory: () => void;
  onRemoveAssignment: () => void;
}

export const EquipmentAsideMenu = ({
  onAssign,
  onViewAssignmentHistory,
  onRemoveAssignment,
}: EquipmentAsideMenuProps) => {
  return (
    <AsideMenu>
      <AsideButton
        label="Asignar"
        onClick={onAssign}
        icon={<AssignmentIcon className="w-4 h-4" />}
      />

      <AsideButton
        label="Historial de asignaciones"
        onClick={onViewAssignmentHistory}
        icon={<HistoryIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Quitar asignación"
        onClick={onRemoveAssignment}
        icon={<AssignmentIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Eliminar"
        onClick={() => {}}
        icon={<DeleteIcon className="w-4 h-4" />}
        variant="danger"
      />
    </AsideMenu>
  );
};
