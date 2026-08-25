import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import { apiClient } from "@/shared/api/client";
import { Employee } from "@/shared/types/entities/employee.types";
import {
  AuthorizeMaintenanceInput,
  CreateMaintenanceInput,
  Maintenance,
  MaintenanceDashboard,
  MaintenanceDetail,
  MaintenanceProjection,
  MaintenanceProcedure,
  MaintenanceProcedureInput,
  MaintenanceQuery,
  MaintenanceSchedule,
  MaintenanceScheduleInput,
  MaintenanceStatus,
  ProcessMaintenanceInput,
} from "../types/maintenance";

export class MaintenanceService {
  static async procedures(includeInactive = false) {
    const response = await apiClient.get<ApiResponse<MaintenanceProcedure[]>>(
      "/maintenance/procedures",
      { params: includeInactive ? { includeInactive: true } : undefined },
    );
    return response.data;
  }

  static async createProcedure(data: MaintenanceProcedureInput) {
    const response = await apiClient.post<ApiResponse<MaintenanceProcedure>>(
      "/maintenance/procedures",
      data,
    );
    return response.data;
  }

  static async updateProcedure(
    id: number,
    data: Partial<MaintenanceProcedureInput>,
  ) {
    const response = await apiClient.put<ApiResponse<MaintenanceProcedure>>(
      `/maintenance/procedures/${id}`,
      data,
    );
    return response.data;
  }

  static async deactivateProcedure(id: number) {
    await apiClient.delete(`/maintenance/procedures/${id}`);
  }

  static async list(params: MaintenanceQuery) {
    const response = await apiClient.get<PaginatedResponse<Maintenance>>(
      "/maintenance/maintenances",
      { params },
    );
    return response.data;
  }

  static async create(data: CreateMaintenanceInput) {
    const response = await apiClient.post<ApiResponse<Maintenance>>(
      "/maintenance/maintenances",
      data,
    );
    return response.data;
  }

  static async get(id: string) {
    const response = await apiClient.get<ApiResponse<MaintenanceDetail>>(
      "/maintenance/maintenances/" + id,
    );
    return response.data;
  }

  static async authorize(id: string, data: AuthorizeMaintenanceInput) {
    const response = await apiClient.post<ApiResponse<Maintenance>>(
      "/maintenance/maintenances/" + id + "/authorize",
      data,
    );
    return response.data;
  }

  static async process(data: ProcessMaintenanceInput) {
    const response = await apiClient.post<ApiResponse<Maintenance>>(
      "/maintenance/maintenances/process",
      data,
    );
    return response.data;
  }

  static async drivers() {
    const response =
      await apiClient.get<ApiResponse<Employee[]>>("/maintenance/drivers");
    return response.data;
  }

  static async updateStatus(id: string, status: MaintenanceStatus) {
    const response = await apiClient.put<ApiResponse<Maintenance>>(
      "/maintenance/maintenances/" + id + "/status",
      { status },
    );
    return response.data;
  }

  static async dashboard() {
    const response = await apiClient.get<ApiResponse<MaintenanceDashboard>>(
      "/maintenance/dashboard",
    );
    return response.data;
  }

  static async getVehicleSchedule(vehicleId: string) {
    const response = await apiClient.get<ApiResponse<MaintenanceProjection | null>>(
      "/maintenance/setup/schedules/" + vehicleId,
    );
    return response.data;
  }

  static async updateVehicleSchedule(
    vehicleId: string,
    data: MaintenanceScheduleInput,
  ) {
    const response = await apiClient.put<ApiResponse<MaintenanceSchedule>>(
      "/maintenance/setup/schedules/" + vehicleId,
      data,
    );
    return response.data;
  }
}
