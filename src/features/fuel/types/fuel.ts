import { PaginationParams } from "@/shared/types/api.types";

export interface GetFuelConsumptionsParams extends PaginationParams {
  vehicle_id?: string;
  driver_id?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  tank_refill_id?: number;
  search?: string;
}

export interface GetTankRefillsParams extends PaginationParams {
  start_date?: string;
  end_date?: string;
  user_id?: string;
  search?: string;
}
