import { apiClient } from "@/shared/api/client";
import { ApiResponse } from "@/shared/types/api.types";
import { EquipmentDetail } from "@/shared/types/entities/equipment.types";

export const EquipmentService = {
  getAllByCustomerId: async (
    customerId: string
  ): Promise<ApiResponse<EquipmentDetail[]>> => {
    const response = await apiClient.get<ApiResponse<EquipmentDetail[]>>(
      `equipment/customer/${customerId}`
    );
    return response.data;
  },
};
