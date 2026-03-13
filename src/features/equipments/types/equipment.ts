import { Equipment, EquipmentModel } from "@/shared/types/entities/equipment.types";

export interface EquipmentModelFormInput extends Omit<EquipmentModel, "id" | "createdAt" | "updatedAt"> {}

export interface CreateEquipmentOutput extends Omit<Equipment, "assignments" | "location"> {}
