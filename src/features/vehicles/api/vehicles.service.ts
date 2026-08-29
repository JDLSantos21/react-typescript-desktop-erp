import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import { GetVehicleParams, VehicleInput } from "../types/vehicles";
import { Vehicle, VehicleOperationalSummary } from "@/shared/types/entities/vehicle.type";
import { apiClient } from "@/shared/api/client";

export class VehicleService {
  static async getVehicles(params: GetVehicleParams) {
    const response = await apiClient.get<PaginatedResponse<Vehicle>>(
      "/vehicles",
      { params },
    );
    return response.data;
  }

  static async getVehicle(id: string) {
    const response = await apiClient.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return response.data;
  }

  static async getOperationalSummary(id: string) {
    const response = await apiClient.get<ApiResponse<VehicleOperationalSummary>>(
      `/vehicles/${id}/operational-summary`,
    );
    return response.data;
  }

  static async createVehicle(data: VehicleInput) {
    const response = await apiClient.post<ApiResponse<Vehicle>>("/vehicles", data);
    return response.data;
  }

  static async updateVehicle(id: string, data: VehicleInput) {
    const response = await apiClient.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data);
    return response.data;
  }

  static async deleteVehicle(id: string) {
    await apiClient.delete(`/vehicles/${id}`);
  }
}
