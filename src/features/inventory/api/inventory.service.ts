import { apiClient } from "@/shared/api/client";
import type { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import type {
  InventoryCategory,
  InventoryDashboard,
  InventoryMaterial,
  InventoryUnit,
  MaterialInput,
  MaterialQuery,
  StockMove,
  StockMoveInput,
  StockMoveQuery,
} from "../types/inventory";

export const InventoryService = {
  async getDashboard(): Promise<ApiResponse<InventoryDashboard>> {
    const response = await apiClient.get<ApiResponse<InventoryDashboard>>(
      "inventory/dashboard",
    );
    return response.data;
  },

  async getMaterials(
    params: MaterialQuery,
  ): Promise<PaginatedResponse<InventoryMaterial>> {
    const response = await apiClient.get<PaginatedResponse<InventoryMaterial>>(
      "inventory/material",
      { params },
    );
    return response.data;
  },

  async getMaterial(id: number): Promise<ApiResponse<InventoryMaterial>> {
    const response = await apiClient.get<ApiResponse<InventoryMaterial>>(
      `inventory/material/${id}?moves=true`,
    );
    return response.data;
  },

  async createMaterial(
    input: MaterialInput,
  ): Promise<ApiResponse<InventoryMaterial>> {
    const response = await apiClient.post<ApiResponse<InventoryMaterial>>(
      "inventory/material",
      input,
    );
    return response.data;
  },

  async updateMaterial(
    id: number,
    input: Partial<MaterialInput>,
  ): Promise<ApiResponse<InventoryMaterial>> {
    const response = await apiClient.put<ApiResponse<InventoryMaterial>>(
      `inventory/material/${id}`,
      input,
    );
    return response.data;
  },

  async deleteMaterial(id: number): Promise<void> {
    await apiClient.delete(`inventory/material/${id}`);
  },

  async getMoves(
    params: StockMoveQuery,
  ): Promise<PaginatedResponse<StockMove>> {
    const response = await apiClient.get<PaginatedResponse<StockMove>>(
      "inventory/movement",
      { params },
    );
    return response.data;
  },

  async createMove(input: StockMoveInput): Promise<ApiResponse<StockMove>> {
    const response = await apiClient.post<ApiResponse<StockMove>>(
      "inventory/movement",
      input,
    );
    return response.data;
  },

  async getCategories(): Promise<ApiResponse<InventoryCategory[]>> {
    const response = await apiClient.get<ApiResponse<InventoryCategory[]>>(
      "inventory/material/category",
    );
    return response.data;
  },

  async createCategory(name: string): Promise<ApiResponse<InventoryCategory>> {
    const response = await apiClient.post<ApiResponse<InventoryCategory>>(
      "inventory/material/category",
      { name },
    );
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`inventory/material/category/${id}`);
  },

  async getUnits(): Promise<ApiResponse<InventoryUnit[]>> {
    const response = await apiClient.get<ApiResponse<InventoryUnit[]>>(
      "inventory/material/unit",
    );
    return response.data;
  },

  async createUnit(name: string): Promise<ApiResponse<InventoryUnit>> {
    const response = await apiClient.post<ApiResponse<InventoryUnit>>(
      "inventory/material/unit",
      { name },
    );
    return response.data;
  },

  async deleteUnit(id: number): Promise<void> {
    await apiClient.delete(`inventory/material/unit/${id}`);
  },
};
