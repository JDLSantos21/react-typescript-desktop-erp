import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import { EquipmentDetail } from "@/shared/types/entities/equipment.types";
import { EquipmentFilters } from "../types/equipment.dto";
import {
  CreateEquipmentOutput,
} from "../types/equipment";
import { Equipment, EquipmentModel } from "@/shared/types/entities/equipment.types";

export const EquipmentService = {
  getAll: async (
    params?: EquipmentFilters,
  ): Promise<PaginatedResponse<Equipment>> => {
    const response = await apiClient.get<PaginatedResponse<Equipment>>(
      `equipment`,
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<EquipmentDetail>> => {
    const response = await apiClient.get<ApiResponse<EquipmentDetail>>(
      `equipment/${id}`,
    );
    return response.data;
  },

  getAllByCustomerId: async (
    customerId: string,
  ): Promise<ApiResponse<EquipmentDetail[]>> => {
    const response = await apiClient.get<ApiResponse<EquipmentDetail[]>>(
      `equipment/customer/${customerId}`,
    );
    return response.data;
  },

  getAllModels: async (): Promise<ApiResponse<EquipmentModel[]>> => {
    const response =
      await apiClient.get<ApiResponse<EquipmentModel[]>>(`equipment/models`);
    return response.data;
  },

  createModel: async (
    model: Omit<EquipmentModel, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<EquipmentModel>> => {
    const response = await apiClient.post<ApiResponse<EquipmentModel>>(
      `equipment/models`,
      model,
    );
    return response.data;
  },

  createEquipment: async (equipment: {
    model_id: number;
  }): Promise<ApiResponse<CreateEquipmentOutput>> => {
    console.log(equipment);
    const response = await apiClient.post<ApiResponse<CreateEquipmentOutput>>(
      `equipment`,
      equipment,
    );
    return response.data;
  },
};
