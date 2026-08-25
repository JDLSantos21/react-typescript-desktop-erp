import { Column } from "@/shared/components/core/Table";
import { Vehicle } from "@/shared/types/entities/vehicle.type";
import { formatDateTime } from "@/shared/utils/formatters";

export const vehicleColumns: Column<Vehicle>[] = [
  { key: "licensePlate", label: "Placa", className: "w-[16%]" },
  {
    key: "vehicle",
    label: "Vehículo",
    className: "w-[27%]",
    render: (vehicle) => `${vehicle.brand} ${vehicle.model}`,
  },
  { key: "year", label: "Año", className: "w-[12%]" },
  { key: "currentTag", label: "Tag actual", className: "w-[20%]" },
  {
    key: "updatedAt",
    label: "Actualizado",
    className: "w-[25%]",
    render: (vehicle) => formatDateTime(vehicle.updatedAt),
  },
];
