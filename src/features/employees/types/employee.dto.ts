import { PaginationParams } from "@/shared/types/api.types";
import { EmployeePosition } from "@/shared/types/entities/employee.types";

export interface GetEmployeeParams extends PaginationParams {
  name?: string;
  lastName?: string;
  position?: EmployeePosition;
  phoneNumber?: string;
  cedula?: string;
  employeeCode?: string;
  search?: string;
  isActive?: boolean;
}

export interface EmployeeQueryDto {
  page: number;
  limit: number;
  name?: string;
  lastName?: string;
  position?: EmployeePosition;
  phoneNumber?: string;
  cedula?: string;
  employeeCode?: string;
  search?: string;
  isActive?: boolean;
}
