import { Customer } from "./customer.types";

export type EquipmentStatus =
  | "DISPONIBLE"
  | "ASIGNADO"
  | "MANTENIMIENTO"
  | "DAÑADO"
  | "INHABILITADO";

export type EquipmentAssignmentStatus =
  | "ACTIVO"
  | "REMOVIDO"
  | "DEVUELTO"
  | "MANTENIMIENTO"
  | "DAÑADO";

export interface EquipmentModel {
  id: number;
  name: string;
  brand?: string | null;
  type: string;
  capacity?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentAssignment {
  id: number;
  assignedAt: string;
  unassignedAt?: string | null;
  deliveredAt?: string | null;
  status: EquipmentAssignmentStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: Pick<Customer, "id" | "businessName" | "representativeName">;
}

interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface EquipmentLocation {
  id: number;
  coordinates: Coordinates;
  address?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  serialNumber: string;
  status: EquipmentStatus;
  model: EquipmentModel;
  updatedAt: string;
  createdAt: string;
}

export interface EquipmentDetail extends Equipment {
  assignments: EquipmentAssignment[];
  locations: EquipmentLocation[];
}
