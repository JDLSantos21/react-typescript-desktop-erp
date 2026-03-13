import { EquipmentStatus } from "@/shared/types/entities/equipment.types";

export interface EquipmentFilters {
  page: number;
  limit: number;
  model_id?: number;
  serial_number?: string;
  status?: EquipmentStatus;
  customer_id?: string;
  customer_name?: string;
  search?: string;
}
