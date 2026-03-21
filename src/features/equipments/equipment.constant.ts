import { UnassignReason } from "@/shared/types/entities/equipment.types";

export const EquipmentStatus = {
  DISPONIBLE: "Disponible",
  ASIGNADO: "Asignado",
  MANTENIMIENTO: "En mantenimiento",
  DAÑADO: "Dañado",
  INHABILITADO: "Inhabilitado",
};

export const unassignReasons: Record<UnassignReason, string> = {
  DAÑADO: "Dañado",
  DEVUELTO: "Devuelto",
  MANTENIMIENTO: "Mantenimiento",
  REMOVIDO: "Removido",
};
