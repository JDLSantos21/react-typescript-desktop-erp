import { EquipmentStatus } from "@/shared/types/entities/equipment.types";

export interface EquipmentFilters {
  page: number;
  limit: number;
  modelId?: number;
  serialNumber?: string;
  status?: EquipmentStatus;
  customerId?: string;
  customerName?: string;
  search?: string;
}
