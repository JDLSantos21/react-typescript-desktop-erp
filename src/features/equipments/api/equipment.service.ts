import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import {
  EquipmentDetail,
  EquipmentModel,
} from "@/shared/types/entities/equipment.types";

export type UpdateModelParams = {
  modelId: number;
  data: Partial<Omit<EquipmentModel, "id" | "createdAt" | "updatedAt">>;
};

export interface AssignEquipmentParams {
  equipment_id: string;
  customer_id: string;
  customer_address_id: number;
  notes?: string;
}

export interface UnassignEquipmentParams {
  assignment_id: number;
  reason: string;
}

export interface EquipmentFilters {
  page?: number;
  limit?: number;
  status?: string;
  model_id?: number;
  serial_number?: string;
  customer_id?: string;
  customer_name?: string;
  search?: string;
}

export interface EquipmentAlertFilters {
  page?: number;
  limit?: number;
  daysWithoutOrder?: number;
  equipmentType?: 'NEVERA' | 'ANAQUEL';
  equipmentStatus?: string;
  customerName?: string;
  search?: string;
  includeInactiveEquipment?: boolean;
}

export interface CustomerEquipmentAlert {
  id: string;
  businessName: string;
  representativeName: string;
  rnc?: string;
  email?: string;
  primaryPhone?: string;
  primaryAddress?: string;
  equipmentAlerts: EquipmentAlert[];
  lastOrderDate?: string;
  daysSinceLastOrder?: number;
  totalOrders: number;
}

export interface EquipmentAlert {
  id: number;
  serialNumber: string;
  equipmentType: 'NEVERA' | 'ANAQUEL';
  modelName: string;
  assignedAt: string;
  deliveredAt?: string;
  status: string;
  daysWithoutOrder: number;
  expectedProducts: string[];
  lastOrderWithExpectedProducts?: string;
}

export const EquipmentService = {
  createModel: async (
    model: Omit<EquipmentModel, "id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<EquipmentModel>> => {
    const response = await apiClient.post<ApiResponse<EquipmentModel>>(
      "equipment/models",
      model
    );
    return response.data;
  },

  updateModel: async ({
    modelId,
    data,
  }: UpdateModelParams): Promise<ApiResponse<EquipmentModel>> => {
    const response = await apiClient.patch<ApiResponse<EquipmentModel>>(
      `equipment/models/${modelId}`,
      data
    );
    return response.data;
  },

  getAllModels: async (): Promise<PaginatedResponse<EquipmentModel>> => {
    const response = await apiClient.get<PaginatedResponse<EquipmentModel>>(
      "equipment/models"
    );
    return response.data;
  },

  findModelById: async (
    modelId: number
  ): Promise<ApiResponse<EquipmentModel>> => {
    const response = await apiClient.get<ApiResponse<EquipmentModel>>(
      `equipment/models/${modelId}`
    );
    return response.data;
  },

  assignEquipmentToCustomer: async (
    data: AssignEquipmentParams
  ): Promise<ApiResponse<EquipmentDetail>> => {
    const response = await apiClient.post<ApiResponse<EquipmentDetail>>(
      `equipment/assign`,
      data
    );
    return response.data;
  },

  unassignEquipmentFromCustomer: async (
    data: UnassignEquipmentParams
  ): Promise<ApiResponse<EquipmentDetail>> => {
    const response = await apiClient.post<ApiResponse<EquipmentDetail>>(
      `equipment/unassign`,
      data
    );
    return response.data;
  },

  create: async (model_id: number) => {
    const response = await apiClient.post<ApiResponse<EquipmentDetail>>(
      `equipment`,
      { model_id }
    );
    return response.data;
  },

  findById: async (id: string): Promise<ApiResponse<EquipmentDetail>> => {
    const response = await apiClient.get<ApiResponse<EquipmentDetail>>(
      `equipment/${id}`
    );
    return response.data;
  },

  findAll: async (
    filters: EquipmentFilters
  ): Promise<PaginatedResponse<EquipmentDetail>> => {
    const response = await apiClient.get<PaginatedResponse<EquipmentDetail>>(
      `equipment`,
      { params: filters }
    );
    return response.data;
  },

  getAllByCustomerId: async (
    customerId: string
  ): Promise<ApiResponse<EquipmentDetail[]>> => {
    const response = await apiClient.get<ApiResponse<EquipmentDetail[]>>(
      `equipment/customer/${customerId}`
    );
    return response.data;
  },

  getEquipmentAlerts: async (
    filters: EquipmentAlertFilters
  ): Promise<PaginatedResponse<CustomerEquipmentAlert>> => {
    const response = await apiClient.get<PaginatedResponse<CustomerEquipmentAlert>>(
      "customers/equipment-alerts",
      { params: filters }
    );
    return response.data;
  },
};
