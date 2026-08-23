import { PaginationParams } from "@/shared/types/api.types";

export interface GetFuelConsumptionsParams extends PaginationParams {
  vehicleId?: string;
  driverId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  tankRefillId?: number;
  search?: string;
}

export interface GetTankRefillsParams extends PaginationParams {
  startDate?: string;
  endDate?: string;
  userId?: string;
  search?: string;
}
