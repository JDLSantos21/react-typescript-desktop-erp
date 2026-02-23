import { Column } from "@/shared/components/core/Table";
import { Equipment } from "../types/equipment";
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
    key: "createdAt",
    label: "Ultima actualización",
    render: (e) => formatDate(e.updatedAt),
  },
];
