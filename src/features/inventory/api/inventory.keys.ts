import type { MaterialQuery, StockMoveQuery } from "../types/inventory";

export const InventoryKeys = {
  all: ["inventory"] as const,
  dashboard: () => [...InventoryKeys.all, "dashboard"] as const,
  materials: (params: MaterialQuery) =>
    [...InventoryKeys.all, "materials", params] as const,
  material: (id: number) => [...InventoryKeys.all, "material", id] as const,
  moves: (params: StockMoveQuery) =>
    [...InventoryKeys.all, "moves", params] as const,
  categories: () => [...InventoryKeys.all, "categories"] as const,
  units: () => [...InventoryKeys.all, "units"] as const,
};
