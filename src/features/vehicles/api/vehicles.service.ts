import { PaginatedResponse } from "@/shared/types/api.types";
import { GetVehicleParams } from "../types/vehicles";
import { Vehicle } from "@/shared/types/entities/vehicle.type";
import { apiClient } from "@/shared/api/client";

export class VehicleService {
  static async getVehicles(params: GetVehicleParams) {
    const response = await apiClient.get<PaginatedResponse<Vehicle>>(
      "/vehicles",
      { params },
    );
    return response.data;
  }
}
