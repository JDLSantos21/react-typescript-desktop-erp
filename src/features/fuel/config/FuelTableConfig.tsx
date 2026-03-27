import { Column } from "@/shared/components/core/Table";
import { FuelConsumption } from "@/shared/types/entities/fuel.types";
import { formatDate } from "@/shared/utils/formatters";

export const FuelConsumptionTableColumns: Column<FuelConsumption>[] = [
  {
    key: "vehicle",
    label: "Vehículo",
    render: (value) => value.vehicle.currentTag,
  },
  {
    key: "driver",
    label: "Conductor",
    render: (value) =>
      value.driver ? `${value.driver.name} ${value.driver.lastName}` : "N/A",
  },
  {
    key: "gallons",
    label: "Galones",
    render: (value) => value.gallons,
  },
  {
    key: "mileage",
    label: "Kilometraje",
    render: (value) => (value.mileage ? value.mileage : "N/A"),
  },
  {
    key: "createdAt",
    label: "Fecha",
    render: (value) => formatDate(value.createdAt),
  },
];
