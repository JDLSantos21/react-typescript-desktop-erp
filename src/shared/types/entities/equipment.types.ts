import { Customer, CustomerAddress } from "./customer.types";
import type { ProductCatalogItem } from "./order.types";

export type EquipmentStatus = "DISPONIBLE" | "ASIGNADO" | "MANTENIMIENTO" | "DAÑADO" | "INHABILITADO";
export type EquipmentDeliveryStatus = "PENDIENTE" | "ENTREGADO";
export type EquipmentAssignmentStatus = "ACTIVO" | "REMOVIDO" | "DEVUELTO" | "MANTENIMIENTO" | "DAÑADO";
export type UnassignReason = Exclude<EquipmentAssignmentStatus, "ACTIVO">;
export type EquipmentSiteType = "PLANTA" | "ALMACEN" | "OTRO";
export type EquipmentDocumentType = "CEDULA" | "CONTRATO";

export interface EquipmentModel {
  id: number;
  name: string;
  brand?: string | null;
  type: "ANAQUEL" | "NEVERA" | "OTROS";
  capacity?: number | null;
  createdAt: string;
  updatedAt: string;
  monitoredProducts?: ProductCatalogItem[];
}

export interface EquipmentSite {
  id: number;
  name: string;
  type: EquipmentSiteType;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentLocation {
  id: number;
  latitude: number;
  longitude: number;
  address?: string | null;
  description?: string | null;
  gpsUpdatedAt: string;
}

export interface StoredFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface EquipmentDocument {
  id: string;
  type: EquipmentDocumentType;
  file: StoredFile;
  isActive: boolean;
  createdAt: string;
}

export interface EquipmentAssignmentDocument extends EquipmentDocument {
  assignment: {
    id: number;
    assignedAt: string;
    equipment: Pick<Equipment, "id" | "serialNumber" | "model">;
  };
}

export interface EquipmentAssignment {
  id: number;
  equipmentId: string;
  assignedAt: string;
  unassignedAt?: string | null;
  deliveredAt?: string | null;
  deliveryStatus: EquipmentDeliveryStatus;
  status: EquipmentAssignmentStatus;
  notes?: string | null;
  orderInactivityDays?: number | null;
  createdAt: string;
  updatedAt: string;
  customer?: Pick<Customer, "id" | "businessName" | "representativeName"> & { documents?: EquipmentDocument[] };
  customerAddress?: CustomerAddress;
  deliveryLocation?: EquipmentLocation | null;
  deliveryAccuracyMeters?: number | null;
  documents?: EquipmentDocument[];
  equipment?: Pick<Equipment, "id" | "serialNumber" | "model">;
}

export interface Equipment {
  id: string;
  serialNumber: string;
  status: EquipmentStatus;
  model: EquipmentModel;
  currentSite?: EquipmentSite | null;
  location?: EquipmentLocation | null;
  updatedAt: string;
  createdAt: string;
  assignments?: EquipmentAssignment[];
}

export interface EquipmentDetail extends Equipment {
  assignments: EquipmentAssignment[];
  reports: Array<{ id: number; title: string; status: string; createdAt: string }>;
}

export interface EquipmentAssignmentDetail extends EquipmentAssignment {
  equipment: Equipment;
  customer: Customer & { documents?: EquipmentDocument[] };
  customerAddress: CustomerAddress;
  checklist: {
    delivered: boolean;
    customerIdentity: boolean;
    contract: boolean;
    pendingCount: number;
  };
}

export interface EquipmentLocationEvent {
  id: string;
  type: "REGISTRO" | "TRASLADO" | "ASIGNACION" | "ENTREGA" | "RETIRO";
  site?: EquipmentSite | null;
  latitude?: number | null;
  longitude?: number | null;
  accuracyMeters?: number | null;
  description?: string | null;
  recordedAt: string;
}

export interface EquipmentLabelPrint {
  id: string;
  printNumber: number;
  isReprint: boolean;
  reason?: string | null;
  status: "AUTORIZADO" | "IMPRESO" | "FALLIDO";
  createdAt: string;
}

export interface EquipmentDashboard {
  summary: {
    total: number;
    available: number;
    maintenance: number;
    damaged: number;
    pendingDelivery: number;
    delivered: number;
    pendingReports: number;
    inactivityAlerts: number;
    upcomingInactivity: number;
    monitoredAssignments: number;
  };
  typeDistribution: Array<{ type: EquipmentModel["type"]; count: number }>;
  siteDistribution: Array<{ name: string; count: number }>;
  priorityAssignments: EquipmentAssignment[];
  attentionReports: Array<{
    id: number;
    title: string;
    priority: "BAJA" | "MEDIA" | "ALTA" | "CRITICA";
    createdAt: string;
    equipment: Pick<Equipment, "id" | "serialNumber" | "model">;
    customer: Pick<Customer, "id" | "businessName">;
  }>;
  recentEvents: Array<EquipmentLocationEvent & { equipment: Pick<Equipment, "id" | "serialNumber" | "model"> }>;
  inactivityAlerts: EquipmentInactivityAlert[];
}

export interface EquipmentMonitoringSettings {
  id: string;
  defaultOrderInactivityDays: number;
  updatedAt: string;
}

export type EquipmentInactivityAlertState = "ALERTA" | "PROXIMO";

export interface EquipmentInactivityAlert {
  assignmentId: number;
  assignedAt: string;
  deliveredAt: string;
  orderInactivityDays?: number | null;
  effectiveDays: number;
  lastOrderAt?: string | null;
  dueAt: string;
  state: EquipmentInactivityAlertState;
  daysOverdue: number;
  daysRemaining: number;
  products: Array<Pick<ProductCatalogItem, "id" | "name">>;
  customer: Pick<Customer, "id" | "businessName">;
  equipment: { id: string; serialNumber: string; modelName: string };
  address: { branchName?: string | null; direction?: string | null };
}
