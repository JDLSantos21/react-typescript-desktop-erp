import { Column } from "@/shared/components/core/Table";
import { Equipment } from "@/shared/types/entities/equipment.types";
import { Badge } from "@/shared/components/core/Badge";
import { formatDate } from "@/shared/utils/formatters";
import { getStatusColor } from "@/shared/utils/status.utils";

const renderStatus = (equipment: Equipment) => (
  <Badge size="sm" className={getStatusColor(equipment.status)}>
    {equipment.status}
  </Badge>
);

export const equipmentColumns: Column<Equipment>[] = [
  {
    key: "serialNumber",
    label: "Número de serie",
  },
  {
    key: "model",
    label: "Modelo",
    render: (e) => e.model.name,
  },
  {
    key: "status",
    label: "Estado",
    render: renderStatus,
  },
  {
    key: "currentSite",
    label: "Ubicación actual",
    render: (equipment) => {
      const assignment = equipment.assignments?.find((item) => item.status === "ACTIVO" && !item.unassignedAt);
      if (assignment?.deliveryStatus === "ENTREGADO") return assignment.customer?.businessName ?? "Cliente";
      if (assignment) return "Pendiente de entrega";
      return equipment.currentSite?.name ?? "Sin ubicación";
    },
  },
  {
    key: "createdAt",
    label: "Ultima actualización",
    render: (e) => formatDate(e.updatedAt),
  },
];
