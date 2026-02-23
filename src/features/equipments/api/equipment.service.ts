import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import { EquipmentDetail } from "@/shared/types/entities/equipment.types";
import { EquipmentFilters } from "../types/equipment.dto";
import { Equipment } from "../types/equipment";

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
};
