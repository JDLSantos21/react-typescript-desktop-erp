import { Vehicle } from "@/shared/types/entities/vehicle.type";
import { Employee } from "@/shared/types/entities/employee.types";

export type MaintenanceStatus =
  | "PROGRAMADO"
  | "EN_PROGRESO"
  | "COMPLETADO"
  | "CANCELADO"
  | "VENCIDO"
  | "PARCIAL";

export interface Maintenance {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  scheduledDate?: string | null;
  performedDate?: string | null;
  notes?: string | null;
  status: MaintenanceStatus;
  totalCost?: number | null;
  performedBy?: string | null;
  currentMileage?: number | null;
  nextScheduledDate?: string | null;
  nextScheduledMileage?: number | null;
  triggerReason?: "MANUAL" | "TIME" | "MILEAGE" | "TIME_AND_MILEAGE";
  isAutomatic?: boolean;
  driverId?: string | null;
  driver?: Employee | null;
  authorizedByUserId?: string | null;
  authorizedAt?: string | null;
  authorizationSignature?: string | null;
  maintenanceItems?: MaintenanceItem[];
  createdAt: string;
}

export interface MaintenanceItem {
  id: string;
  procedureId: number;
  isCompleted: boolean;
  cost?: number | null;
  notes?: string | null;
  completedAt?: string | null;
  procedure?: { id: number; name: string; category: string; description?: string | null };
}

export type MaintenanceProcedureCategory =
  | "MOTOR"
  | "DIFERENCIAL"
  | "FRENOS"
  | "FILTROS"
  | "ACEITE"
  | "LLANTAS"
  | "ELECTRICO"
  | "CARROCERIA"
  | "PREVENTIVO";

export interface MaintenanceProcedure {
  id: number;
  name: string;
  category: MaintenanceProcedureCategory;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceProcedureInput {
  name: string;
  category: MaintenanceProcedureCategory;
  description?: string;
  isActive?: boolean;
}

export interface MaintenanceDetail extends Maintenance {
  lastCompletedMaintenance: Maintenance | null;
}

export interface MaintenanceQuery {
  page?: number;
  limit?: number;
  vehicleId?: string;
  status?: MaintenanceStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "scheduledDate" | "status" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface CreateMaintenanceInput {
  vehicleId: string;
  scheduledDate: string;
  notes?: string;
  driverId?: string;
}

export interface AuthorizeMaintenanceInput {
  password: string;
  driverId?: string | null;
  notes?: string;
}

export interface ProcessMaintenanceInput {
  maintenanceId: string;
  performedDate: string;
  completeMaintenance?: boolean;
  performedBy?: string;
  notes?: string;
  completedProcedures: Array<{
    procedureId: number;
    isCompleted: boolean;
    cost?: number;
    notes?: string;
  }>;
}

export interface MaintenanceSchedule {
  id: number;
  vehicleId: string;
  intervalMonths?: number | null;
  intervalKilometers?: number | null;
  baselineMileage?: number | null;
  baselineDate?: string | null;
  warningDays: number;
  warningKilometers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MaintenanceProjectionStatus =
  | "OK"
  | "UPCOMING"
  | "DUE"
  | "SCHEDULED";

export interface MaintenanceProjection {
  vehicle: Pick<Vehicle, "id" | "licensePlate" | "brand" | "model">;
  schedule: MaintenanceSchedule;
  currentMileage: number | null;
  nextDueDate: string | null;
  nextDueMileage: number | null;
  remainingDays: number | null;
  remainingKilometers: number | null;
  status: MaintenanceProjectionStatus;
  triggeredBy: Array<"TIME" | "MILEAGE">;
  activeMaintenance: Maintenance | null;
}

export interface MaintenanceDashboard {
  scheduled: Maintenance[];
  upcoming: MaintenanceProjection[];
  summary: {
    scheduled: number;
    overdue: number;
    due: number;
    upcoming: number;
  };
}

export interface MaintenanceScheduleInput {
  intervalMonths?: number | null;
  intervalKilometers?: number | null;
  warningDays?: number;
  warningKilometers?: number;
  isActive?: boolean;
}
