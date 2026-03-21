import {
  Equipment,
  EquipmentModel,
  UnassignReason,
} from "@/shared/types/entities/equipment.types";

export interface EquipmentModelFormInput extends Omit<
  EquipmentModel,
  "id" | "createdAt" | "updatedAt"
> {}

export interface CreateEquipmentOutput extends Omit<
  Equipment,
  "assignments" | "location"
> {}

export interface UnassignEquipmentInput {
  assignmentId: number;
  reason: UnassignReason;
  notes?: string;
}
