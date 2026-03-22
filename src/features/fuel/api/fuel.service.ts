import { apiClient } from "@/shared/api/client";
import { ApiResponse } from "@/shared/types/api.types";
import { FuelTank } from "@/shared/types/entities/fuel.types";

export const FuelService = {
  getTank: async (): Promise<ApiResponse<FuelTank>> => {
    const response =
      await apiClient.get<ApiResponse<FuelTank>>("fuel/tank");
    return response.data;
  },
};
