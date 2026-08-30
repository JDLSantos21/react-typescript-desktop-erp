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

interface EquipmentAsideMenuProps {
  equipment: EquipmentDetail;
  onAssign: () => void;
  onViewAssignmentHistory: () => void;
  onRemoveAssignment: () => void;
  onViewAssignment: () => void;
  onMove: () => void;
  onPrint: () => void;
  onDelete: () => void;
}

export const EquipmentAsideMenu = ({
  equipment,
  onAssign,
  onViewAssignmentHistory,
  onRemoveAssignment,
  onViewAssignment,
  onMove,
  onPrint,
  onDelete,
}: EquipmentAsideMenuProps) => {
  const hasActiveAssignment = equipment.assignments.some(
    (assignment) => assignment.status === "ACTIVO" && !assignment.unassignedAt,
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
        label="Ver asignación activa"
        disabled={!hasActiveAssignment}
        onClick={onViewAssignment}
        icon={<AssignmentIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Historial de asignaciones"
        onClick={onViewAssignmentHistory}
        icon={<HistoryIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Mover a otra ubicación"
        disabled={equipment.assignments.some((item) => item.status === "ACTIVO" && item.deliveryStatus === "ENTREGADO")}
        onClick={onMove}
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
        onClick={onPrint}
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
