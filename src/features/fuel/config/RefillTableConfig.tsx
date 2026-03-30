import { Column } from "@/shared/components/core/Table";
import { FuelRefill } from "@/shared/types/entities/fuel.types";
import { formatDate } from "@/shared/utils/formatters";

export const FuelRefillTableColumns: Column<FuelRefill>[] = [
  {
    key: "id",
    label: "ID",
    render: (value) => value.id,
  },
  {
    key: "createdAt",
    label: "Fecha",
    render: (value) => formatDate(value.createdAt),
  },
  {
    key: "gallons",
    label: "Galones",
    render: (value) => value.gallons,
  },
  {
    key: "pricePerGallon",
    label: "Precio P/ Galón",
    render: (value) => value.pricePerGallon,
  },
  {
    key: "previousLevel",
    label: "Nivel previo",
    render: (value) => value.previousLevel,
  },
  {
    key: "newLevel",
    label: "Nuevo nivel",
    render: (value) => (value.newLevel === 1500 ? "Lleno" : value.newLevel),
  },
];
