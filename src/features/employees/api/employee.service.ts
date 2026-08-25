import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import { Employee, EmployeeInput } from "@/shared/types/entities/employee.types";
import { GetEmployeeParams } from "../types/employee.dto";

export class EmployeeService {
  static getAllDrivers = async (): Promise<ApiResponse<Employee[]>> => {
    const res = await apiClient.get<ApiResponse<Employee[]>>(
      `/employees?position=CHOFER`,
    );
    return res.data;
  };

  static getEmployees = async (
    params: GetEmployeeParams,
  ): Promise<PaginatedResponse<Employee>> => {
    const res = await apiClient.get<PaginatedResponse<Employee>>(`/employees`, {
      params,
    });
    return res.data;
  };

  static create = async (data: EmployeeInput): Promise<ApiResponse<Employee>> => {
    const res = await apiClient.post<ApiResponse<Employee>>("/employees", data);
    return res.data;
  };

  static update = async (
    id: string,
    data: Partial<EmployeeInput>,
  ): Promise<ApiResponse<Employee>> => {
    const res = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data);
    return res.data;
  };

  static linkAccount = async (
    id: string,
    userId: string | null,
  ): Promise<ApiResponse<Employee>> => {
    const res = await apiClient.put<ApiResponse<Employee>>(
      `/employees/${id}/account`,
      { userId },
    );
    return res.data;
  };
}
