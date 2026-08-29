import { Column } from "@/shared/components/core/Table";
import { Vehicle } from "@/shared/types/entities/vehicle.type";
import { formatDateTime } from "@/shared/utils/formatters";

export const vehicleColumns: Column<Vehicle>[] = [
  { key: "currentTag", label: "Ficha", className: "w-[18%]" },
  { key: "licensePlate", label: "Placa", className: "w-[15%]" },
  {
    key: "vehicle",
    label: "Vehículo",
    className: "w-[25%]",
    render: (vehicle) => `${vehicle.brand} ${vehicle.model}`,
  },
  { key: "year", label: "Año", className: "w-[12%]" },
  {
    key: "updatedAt",
    label: "Actualizado",
    className: "w-[30%]",
    render: (vehicle) => formatDateTime(vehicle.updatedAt),
  },
];
