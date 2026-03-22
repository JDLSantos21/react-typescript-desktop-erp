import {
  AssignmentIcon,
  DeleteIcon,
  HistoryIcon,
  PrinterIcon,
} from "@/shared/components/icons";
import {
  AsideButton,
  AsideMenu,
} from "@/shared/components/navigation/AsideMenu";
import { EquipmentDetail } from "@/shared/types/entities/equipment.types";
import { usePrintEquipmentLabel } from "../hooks/usePrintEquipmentLabel";

interface EquipmentAsideMenuProps {
  equipment: EquipmentDetail;
  onAssign: () => void;
  onViewAssignmentHistory: () => void;
  onRemoveAssignment: () => void;
  onDelete: () => void;
}

export const EquipmentAsideMenu = ({
  equipment,
  onAssign,
  onViewAssignmentHistory,
  onRemoveAssignment,
  onDelete,
}: EquipmentAsideMenuProps) => {
  const { printLabel } = usePrintEquipmentLabel(equipment);

  const hasActiveAssignment = equipment.assignments.some(
    (assignment) => assignment.status === "ACTIVO",
  );

  return (
    <AsideMenu>
      <AsideButton
        label="Asignar"
        disabled={hasActiveAssignment}
        onClick={onAssign}
        icon={<AssignmentIcon className="w-4 h-4" />}
        tooltip={
          hasActiveAssignment
            ? "El equipo ya tiene una asignación activa"
            : undefined
        }
        tooltipVariant="error"
      />

      <AsideButton
        label="Historial de asignaciones"
        onClick={onViewAssignmentHistory}
        icon={<HistoryIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Quitar asignación"
        disabled={!hasActiveAssignment}
        onClick={onRemoveAssignment}
        icon={<AssignmentIcon className="w-4 h-4" />}
        tooltip={
          !hasActiveAssignment
            ? "El equipo no tiene una asignación activa"
            : undefined
        }
        tooltipVariant="error"
      />
      <AsideButton
        label="Imprimir etiqueta"
        onClick={printLabel}
        icon={<PrinterIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Eliminar"
        onClick={onDelete}
        icon={<DeleteIcon className="w-4 h-4" />}
        variant="danger"
      />
    </AsideMenu>
  );
};
