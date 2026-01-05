import { apiClient } from "@/shared/api/client";
import { ApiResponse } from "@/shared/types/api.types";
import { Employee } from "@/shared/types/entities/employee.types";

export type EmployeePosition =
  | "CHOFER"
  | "CAJERO"
  | "OPERADOR"
  | "SUPERVISOR"
  | "ADMINISTRACION";

interface CreateEmployee {
  name: string;
  last_name: string;
  employee_code: string;
  position: EmployeePosition;
  cedula?: string;
  phone_number?: string;
  license_expiration_date?: string;
}

interface EmployeeQueryParams {
  search: string;
  name: string;
  last_name: string;
  position: EmployeePosition;
  phone_number: string;
  cedula: string;
  employee_code: string;
  page: number;
  limit: number;
}

export class EmployeeService {
  static getAllDrivers = async (): Promise<ApiResponse<Employee[]>> => {
    const res = await apiClient.get<ApiResponse<Employee[]>>(
      `/employees?position=CHOFER`
    );
    return res.data;
  };

  create = async (
    employeeData: CreateEmployee
  ): Promise<ApiResponse<Employee>> => {
    const res = await apiClient.post<ApiResponse<Employee>>(
      `/employees`,
      employeeData
    );
    return res.data;
  };

  findAll = async (
    filters: EmployeeQueryParams
  ): Promise<ApiResponse<Employee[]>> => {
    const res = await apiClient.get<ApiResponse<Employee[]>>(`/employees`, {
      params: filters,
    });
    return res.data;
  };

  findById = async (employeeId: string): Promise<ApiResponse<Employee>> => {
    const res = await apiClient.get<ApiResponse<Employee>>(
      `/employees/${employeeId}`
    );
    return res.data;
  };

  deleteById = async (employeeId: string): Promise<void> => {
    await apiClient.delete<void>(`/employees/${employeeId}`);
  };
}
