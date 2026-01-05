import { EquipmentDetail } from "@/features/equipments/types/equipment.types";
import { Column } from "@/shared/components/core/Table";
import { Badge } from "@/shared/components";

const renderEquipmentStatus = (equipment: EquipmentDetail) => {
  const statusConfig = {
    DISPONIBLE: { variant: "success" as const, label: "Disponible" },
    ASIGNADO: { variant: "primary" as const, label: "Asignado" },
    MANTENIMIENTO: { variant: "warning" as const, label: "Mantenimiento" },
    DAÑADO: { variant: "danger" as const, label: "Dañado" },
    INHABILITADO: { variant: "secondary" as const, label: "Inhabilitado" },
  };

  const config = statusConfig[equipment.status] || statusConfig.DISPONIBLE;

  return (
    <Badge size="sm" variant={config.variant}>
      {config.label}
    </Badge>
  );
};

const renderEquipmentModel = (equipment: EquipmentDetail) => (
  <div>
    <div className="font-medium">{equipment.model.name}</div>
    <div className="text-sm text-gray-500">{equipment.model.type}</div>
    {equipment.model.brand && (
      <div className="text-xs text-gray-400">{equipment.model.brand}</div>
    )}
  </div>
);

const renderCurrentAssignment = (equipment: EquipmentDetail) => {
  const activeAssignment = equipment.assignments?.find(
    (assignment) => assignment.status === "ACTIVO"
  );

  if (!activeAssignment) {
    return <span className="text-gray-500">Sin asignación</span>;
  }

  return (
    <div className="text-sm">
      <div className="font-medium">Activo</div>
      <div className="text-gray-500">
        {new Date(activeAssignment.assignedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export const equipmentTableColumns: Column<EquipmentDetail>[] = [
  {
    key: "serialNumber",
    className: "w-1/4",
    label: "Número de Serie",
  },
  {
    key: "model",
    className: "w-1/3",
    label: "Modelo",
    render: renderEquipmentModel,
  },
  {
    key: "status",
    label: "Estado",
    render: renderEquipmentStatus,
  },
  {
    key: "assignments",
    label: "Asignación",
    render: renderCurrentAssignment,
  },
];
