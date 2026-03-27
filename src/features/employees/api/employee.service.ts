import { apiClient } from "@/shared/api/client";
import { ApiResponse } from "@/shared/types/api.types";
import { Employee } from "@/shared/types/entities/employee.types";
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
  ): Promise<ApiResponse<Employee[]>> => {
    const res = await apiClient.get<ApiResponse<Employee[]>>(`/employees`, {
      params,
    });
    return res.data;
  };
}
