import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import {
  FuelConsumption,
  FuelSummary,
  FuelTank,
} from "@/shared/types/entities/fuel.types";
import { GetFuelConsumptionsParams } from "../types/fuel";
import { RegisterConsumptionFormData } from "../schemas/fuel.schema";

export const FuelService = {
  getTank: async (): Promise<ApiResponse<FuelTank>> => {
    const response = await apiClient.get<ApiResponse<FuelTank>>("fuel/tank");
    return response.data;
  },

  getConsumptions: async (
    params: GetFuelConsumptionsParams,
  ): Promise<PaginatedResponse<FuelConsumption>> => {
    const response = await apiClient.get<PaginatedResponse<FuelConsumption>>(
      "fuel/consumption",
      { params },
    );

    return response.data;
  },

  getFuelSummary: async (): Promise<ApiResponse<FuelSummary>> => {
    const response = await apiClient.get<ApiResponse<FuelSummary>>(
      "fuel/dashboard/summary",
    );
    return response.data;
  },

  registerConsumption: async (
    data: RegisterConsumptionFormData,
  ): Promise<ApiResponse<FuelConsumption>> => {
    const response = await apiClient.post<ApiResponse<FuelConsumption>>(
      "fuel/consumption",
      data,
    );
    return response.data;
  },
};
