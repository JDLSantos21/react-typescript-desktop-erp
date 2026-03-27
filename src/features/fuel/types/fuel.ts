import { PaginationParams } from "@/shared/types/api.types";

export interface GetFuelConsumptionsParams extends PaginationParams {
  vehicle_id?: string;
  driver_id?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}
