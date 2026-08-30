import type { PaginationParams } from "@/shared/types/api.types";

export type StockMoveType = "ENTRADA" | "SALIDA" | "AJUSTE";

export interface InventoryCategory {
  id: number;
  name: string;
}

export interface InventoryUnit {
  id: number;
  name: string;
}

export interface InventoryMaterial {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  unitId: number;
  stock: number;
  minimumStock: number;
  createdAt: string;
  updatedAt: string;
  category: InventoryCategory;
  unit: InventoryUnit;
  stockMoves?: StockMove[];
}

export interface StockMove {
  id: number;
  materialId: number;
  type: StockMoveType;
  quantity: number;
  description: string | null;
  date: string;
  previousStock: number;
  newStock: number;
  createdAt: string;
  material: Pick<InventoryMaterial, "id" | "name" | "unit">;
  user: { id: string; name: string; lastName?: string | null };
}

export interface MaterialQuery extends PaginationParams {
  search?: string;
  categoryId?: number;
  unitId?: number;
}

export interface StockMoveQuery extends PaginationParams {
  search?: string;
  materialId?: number;
  type?: StockMoveType;
}

export interface MaterialInput {
  name: string;
  description?: string | null;
  categoryId: number;
  unitId: number;
  stock: number;
  minimumStock: number;
}

export interface StockMoveInput {
  materialId: number;
  type: StockMoveType;
  quantity: number;
  description?: string | null;
  date?: string | null;
}

export interface InventoryDashboard {
  summary: {
    totalMaterials: number;
    materialsBelowMinimum: number;
    outOfStock: number;
    availableMaterials: number;
    healthyMaterials: number;
    requiresRestock: number;
    materialsWithoutMinimum: number;
    movementCount: number;
    movementsToday: number;
  };
  activity: Array<{
    date: string;
    entries: number;
    exits: number;
    adjustments: number;
  }>;
  recentMoves: StockMove[];
  stockAlerts: InventoryMaterial[];
}
