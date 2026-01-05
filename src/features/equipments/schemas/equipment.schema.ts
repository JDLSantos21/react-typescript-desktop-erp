import { z } from "zod";

export const createEquipmentSchema = z.object({
  model_id: z.string().min(1, "Debe seleccionar un modelo de equipo"),
});

export const updateEquipmentSchema = z.object({
  serial_number: z.string().min(1, "El número de serie es requerido"),
  status: z.enum(["DISPONIBLE", "ASIGNADO", "MANTENIMIENTO", "DAÑADO", "INHABILITADO"]),
  model_id: z.number().min(1, "Debe seleccionar un modelo de equipo"),
});

export const createEquipmentModelSchema = z.object({
  name: z.string().min(1, "El nombre del modelo es requerido"),
  type: z.string().min(1, "El tipo de equipo es requerido"),
  brand: z.string().optional(),
  capacity: z.number().optional(),
});

export const updateEquipmentModelSchema = createEquipmentModelSchema.partial();

export type CreateEquipmentFormData = z.infer<typeof createEquipmentSchema>;
export type UpdateEquipmentFormData = z.infer<typeof updateEquipmentSchema>;
export type CreateEquipmentModelFormData = z.infer<typeof createEquipmentModelSchema>;
export type UpdateEquipmentModelFormData = z.infer<typeof updateEquipmentModelSchema>;