import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import {
  FuelConsumption,
  FuelDashboard,
  FuelRefill,
  FuelSummary,
  FuelTank,
  TankReset,
} from "@/shared/types/entities/fuel.types";
import { GetFuelConsumptionsParams, GetTankRefillsParams } from "../types/fuel";
import {
  RegisterConsumptionFormData,
  RegisterRefillFormData,
} from "../schemas/fuel.schema";

export const FuelService = {
  getTank: async (): Promise<ApiResponse<FuelTank>> => {
    const response = await apiClient.get<ApiResponse<FuelTank>>("fuel/tank");
    return response.data;
  },

  getConsumptions: async (
    params?: GetFuelConsumptionsParams,
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

  getRefills: async (
    params?: GetTankRefillsParams,
  ): Promise<PaginatedResponse<FuelRefill>> => {
    const response = await apiClient.get<PaginatedResponse<FuelRefill>>(
      "fuel/tank-refill",
      { params },
    );

    return response.data;
  },

  getRefillById: async (id: string): Promise<ApiResponse<FuelRefill>> => {
    const response = await apiClient.get<ApiResponse<FuelRefill>>(
      `fuel/tank-refill/${id}`,
    );
    return response.data;
  },

  registerRefill: async (
    data: RegisterRefillFormData,
  ): Promise<ApiResponse<FuelRefill>> => {
    const response = await apiClient.post<ApiResponse<FuelRefill>>(
      "fuel/tank-refill",
      data,
    );

    return response.data;
  },

  resetTank: async ({
    password,
  }: {
    password: string;
  }): Promise<ApiResponse<TankReset>> => {
    const response = await apiClient.post<ApiResponse<TankReset>>(
      "fuel/tank/reset",
      { password },
    );
    return response.data;
  },

  getFuelMetrics: async (): Promise<ApiResponse<FuelDashboard>> => {
    const response = await apiClient.get<ApiResponse<FuelDashboard>>(
      "fuel/dashboard?alert_threshold=1",
    );
    return response.data;
  },
};
