import { PaginationParams } from "@/shared/types/api.types";

export interface GetVehicleParams extends PaginationParams {
  licensePlate?: string;
  chasis?: string;
  brand?: string;
  model?: string;
  year?: number;
  currentTag?: string;
  search?: string;
}

export interface VehicleInput {
  licensePlate: string;
  chasis: string;
  brand: string;
  model: string;
  year: number;
  currentTag: string;
}
