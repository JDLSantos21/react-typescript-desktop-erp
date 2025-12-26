import { apiClient } from "@/shared/api/client";
import { ApiResponse } from "@/shared/types/api.types";
import { Employee } from "@/shared/types/entities/employee.types";

export class EmployeeService {
  static getAllDrivers = async (): Promise<ApiResponse<Employee[]>> => {
    const res = await apiClient.get<ApiResponse<Employee[]>>(
      `/employees?position=CHOFER`
    );
    return res.data;
  };
}
