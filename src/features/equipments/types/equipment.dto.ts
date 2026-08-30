import { EquipmentAssignmentStatus, EquipmentDeliveryStatus, EquipmentInactivityAlertState, EquipmentStatus } from "@/shared/types/entities/equipment.types";

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

export interface EquipmentInactivityAlertFilters {
  page: number;
  limit: number;
  state?: EquipmentInactivityAlertState;
  search?: string;
  customerId?: string;
  assignmentId?: number;
}

export interface EquipmentAssignmentFilters {
  page: number;
  limit: number;
  status?: EquipmentAssignmentStatus;
  deliveryStatus?: EquipmentDeliveryStatus;
  search?: string;
}
