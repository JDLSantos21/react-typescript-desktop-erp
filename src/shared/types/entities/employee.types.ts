export type EmployeePosition =
  | "CHOFER"
  | "CAJERO"
  | "OPERADOR"
  | "SUPERVISOR"
  | "ADMINISTRACION";

export interface Employee {
  id: string;
  userId?: string | null;
  employeeCode: string;
  name: string;
  lastName: string;
  position: EmployeePosition;
  phoneNumber?: string | null;
  cedula?: string | null;
  licenseExpirationDate?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeInput {
  name: string;
  lastName: string;
  employeeCode: string;
  position: EmployeePosition;
  phoneNumber?: string;
  cedula?: string;
  licenseExpirationDate?: string;
  isActive?: boolean;
}
