import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import {
  EquipmentAssignmentDetail,
  EquipmentAssignment,
  EquipmentAssignmentDocument,
  EquipmentDetail,
  EquipmentDocument,
  EquipmentLabelPrint,
  EquipmentDashboard,
  EquipmentInactivityAlert,
  EquipmentMonitoringSettings,
  EquipmentLocationEvent,
  EquipmentSite,
} from "@/shared/types/entities/equipment.types";
import { EquipmentAssignmentFilters, EquipmentFilters, EquipmentInactivityAlertFilters } from "../types/equipment.dto";
import {
  CreateEquipmentOutput,
  UnassignEquipmentInput,
} from "../types/equipment";
import {
  Equipment,
  EquipmentModel,
} from "@/shared/types/entities/equipment.types";
import type { ProductCatalogItem } from "@/shared/types/entities/order.types";

export const EquipmentService = {
  getAll: async (
    params?: EquipmentFilters,
  ): Promise<PaginatedResponse<Equipment>> => {
    const response = await apiClient.get<PaginatedResponse<Equipment>>(
      `equipment`,
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<EquipmentDetail>> => {
    const response = await apiClient.get<ApiResponse<EquipmentDetail>>(
      `equipment/${id}`,
    );
    return response.data;
  },

  getDashboard: async (): Promise<ApiResponse<EquipmentDashboard>> => {
    const response = await apiClient.get<ApiResponse<EquipmentDashboard>>("equipment/dashboard");
    return response.data;
  },

  getAssignments: async (params?: EquipmentAssignmentFilters): Promise<PaginatedResponse<EquipmentAssignment>> => {
    const response = await apiClient.get<PaginatedResponse<EquipmentAssignment>>("equipment/assignments", { params });
    return response.data;
  },

  getInactivityAlerts: async (params?: EquipmentInactivityAlertFilters): Promise<PaginatedResponse<EquipmentInactivityAlert>> => {
    const response = await apiClient.get<PaginatedResponse<EquipmentInactivityAlert>>("equipment/inactivity-alerts", { params });
    return response.data;
  },

  getMonitoringSettings: async (): Promise<ApiResponse<EquipmentMonitoringSettings>> => {
    const response = await apiClient.get<ApiResponse<EquipmentMonitoringSettings>>("equipment/monitoring/settings");
    return response.data;
  },

  updateMonitoringSettings: async (defaultOrderInactivityDays: number): Promise<ApiResponse<EquipmentMonitoringSettings>> => {
    const response = await apiClient.patch<ApiResponse<EquipmentMonitoringSettings>>("equipment/monitoring/settings", { defaultOrderInactivityDays });
    return response.data;
  },

  getModelMonitoringProducts: async (modelId: number): Promise<ApiResponse<ProductCatalogItem[]>> => {
    const response = await apiClient.get<ApiResponse<ProductCatalogItem[]>>(`equipment/models/${modelId}/monitoring-products`);
    return response.data;
  },

  updateModelMonitoringProducts: async (modelId: number, productIds: number[]): Promise<ApiResponse<ProductCatalogItem[]>> => {
    const response = await apiClient.patch<ApiResponse<ProductCatalogItem[]>>(`equipment/models/${modelId}/monitoring-products`, { productIds });
    return response.data;
  },

  updateAssignmentMonitoring: async (assignmentId: number, orderInactivityDays: number | null) => {
    const response = await apiClient.patch(`equipment/assignments/${assignmentId}/monitoring`, { orderInactivityDays });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `equipment/${id}`,
    );
    return response.data;
  },

  getAllByCustomerId: async (
    customerId: string,
  ): Promise<ApiResponse<EquipmentDetail[]>> => {
    const response = await apiClient.get<ApiResponse<EquipmentDetail[]>>(
      `equipment/customer/${customerId}`,
    );
    return response.data;
  },

  getAllModels: async (): Promise<ApiResponse<EquipmentModel[]>> => {
    const response =
      await apiClient.get<ApiResponse<EquipmentModel[]>>(`equipment/models`);
    return response.data;
  },

  createModel: async (
    model: Omit<EquipmentModel, "id" | "createdAt" | "updatedAt">,
  ): Promise<ApiResponse<EquipmentModel>> => {
    const response = await apiClient.post<ApiResponse<EquipmentModel>>(
      `equipment/models`,
      model,
    );
    return response.data;
  },

  updateModel: async (
    id: number,
    model: Partial<Omit<EquipmentModel, "id" | "createdAt" | "updatedAt">>,
  ): Promise<ApiResponse<EquipmentModel>> => {
    const response = await apiClient.patch<ApiResponse<EquipmentModel>>(
      `equipment/models/${id}`,
      model,
    );
    return response.data;
  },

  deleteModel: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `equipment/models/${id}`,
    );
    return response.data;
  },

  createEquipment: async (equipment: {
    modelId: number;
    siteId: number;
  }): Promise<ApiResponse<CreateEquipmentOutput>> => {
    console.log(equipment);
    const response = await apiClient.post<ApiResponse<CreateEquipmentOutput>>(
      `equipment`,
      equipment,
    );
    return response.data;
  },

  assignEquipment: async (data: {
    equipmentId: string;
    customerId: string;
    customerAddressId: number;
    notes?: string;
  }) => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      `equipment/assign`,
      {
        equipmentId: data.equipmentId,
        customerId: data.customerId,
        customerAddressId: data.customerAddressId,
        notes: data.notes,
      },
    );
    return response.data;
  },

  unassignEquipment: async (data: UnassignEquipmentInput) => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      `equipment/unassign`,
      {
        assignmentId: data.assignmentId,
        siteId: data.siteId,
        reason: data.reason,
        notes: data.notes,
      },
    );
    return response.data;
  },

  getSites: async (includeInactive = false): Promise<ApiResponse<EquipmentSite[]>> => {
    const response = await apiClient.get<ApiResponse<EquipmentSite[]>>("equipment/sites", { params: { includeInactive } });
    return response.data;
  },

  createSite: async (data: Omit<EquipmentSite, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<EquipmentSite>> => {
    const response = await apiClient.post<ApiResponse<EquipmentSite>>("equipment/sites", data);
    return response.data;
  },

  updateSite: async (id: number, data: Omit<EquipmentSite, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<EquipmentSite>> => {
    const response = await apiClient.patch<ApiResponse<EquipmentSite>>(`equipment/sites/${id}`, data);
    return response.data;
  },

  getAssignment: async (id: number): Promise<ApiResponse<EquipmentAssignmentDetail>> => {
    const response = await apiClient.get<ApiResponse<EquipmentAssignmentDetail>>(`equipment/assignments/${id}`);
    return response.data;
  },

  getLocationHistory: async (equipmentId: string): Promise<ApiResponse<EquipmentLocationEvent[]>> => {
    const response = await apiClient.get<ApiResponse<EquipmentLocationEvent[]>>(`equipment/${equipmentId}/location-history`);
    return response.data;
  },

  moveEquipment: async (equipmentId: string, siteId: number, notes?: string) => {
    const response = await apiClient.put(`equipment/${equipmentId}/location`, { siteId, notes });
    return response.data;
  },

  getCustomerDocumentStatus: async (customerId: string): Promise<ApiResponse<{ hasIdentity: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ hasIdentity: boolean }>>(`equipment/customers/${customerId}/document-status`);
    return response.data;
  },

  getCustomerDocuments: async (customerId: string): Promise<ApiResponse<EquipmentDocument[]>> => {
    const response = await apiClient.get<ApiResponse<EquipmentDocument[]>>(`equipment/customers/${customerId}/documents`);
    return response.data;
  },

  attachCustomerDocument: async (customerId: string, fileId: string, replaceActive = false) => {
    const response = await apiClient.post(`equipment/customers/${customerId}/documents`, { fileId, type: "CEDULA", replaceActive });
    return response.data;
  },

  removeCustomerDocument: async (customerId: string, documentId: string) => {
    const response = await apiClient.delete(`equipment/customers/${customerId}/documents/${documentId}`);
    return response.data;
  },

  getCustomerAssignmentDocuments: async (customerId: string): Promise<ApiResponse<EquipmentAssignmentDocument[]>> => {
    const response = await apiClient.get<ApiResponse<EquipmentAssignmentDocument[]>>(`equipment/customers/${customerId}/assignment-documents`);
    return response.data;
  },

  attachContract: async (assignmentId: number, fileId: string, replaceActive = false) => {
    const response = await apiClient.post(`equipment/assignments/${assignmentId}/documents`, { fileId, type: "CONTRATO", replaceActive });
    return response.data;
  },

  removeAssignmentDocument: async (assignmentId: number, documentId: string) => {
    const response = await apiClient.delete(`equipment/assignments/${assignmentId}/documents/${documentId}`);
    return response.data;
  },

  uploadFile: async (file: File): Promise<string> => {
    const intent = await apiClient.post<ApiResponse<{ fileId: string; uploadUrl: string }>>("storage/uploads", {
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    });
    const { fileId, uploadUrl } = intent.data.data;
    const upload = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
    if (!upload.ok) throw new Error("No se pudo cargar el archivo al almacenamiento");
    await apiClient.post(`storage/uploads/${fileId}/complete`);
    return fileId;
  },

  getDownloadUrl: async (fileId: string): Promise<ApiResponse<{ url: string; originalName: string }>> => {
    const response = await apiClient.get<ApiResponse<{ url: string; originalName: string }>>(`storage/files/${fileId}/download`);
    return response.data;
  },

  deliver: async (data: { serialNumber: string; latitude: number; longitude: number; accuracyMeters?: number; customerIdentityFileId?: string }) => {
    const response = await apiClient.post<ApiResponse<EquipmentAssignmentDetail>>("equipment/deliver", data);
    return response.data;
  },

  authorizeLabelPrint: async (equipmentId: string, reason?: string): Promise<ApiResponse<EquipmentLabelPrint>> => {
    const response = await apiClient.post<ApiResponse<EquipmentLabelPrint>>(`equipment/${equipmentId}/label-prints`, { reason });
    return response.data;
  },

  completeLabelPrint: async (id: string, status: "IMPRESO" | "FALLIDO") => {
    const response = await apiClient.patch(`equipment/label-prints/${id}`, { status });
    return response.data;
  },

  getLabelPrints: async (equipmentId: string): Promise<ApiResponse<EquipmentLabelPrint[]>> => {
    const response = await apiClient.get<ApiResponse<EquipmentLabelPrint[]>>(`equipment/${equipmentId}/label-prints`);
    return response.data;
  },
};
