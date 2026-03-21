import z from "zod";

export const modelSchema = z.object({
  name: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(50, "Máximo 50 caracteres"),
  type: z.enum(["ANAQUEL", "NEVERA", "OTROS"]),
  brand: z.string().min(1, "La marca es obligatoria"),
  capacity: z.coerce
    .number({ message: "La capacidad debe ser un número" })
    .min(1, "La capacidad es obligatoria"),
});

export type ModelFormData = z.infer<typeof modelSchema>;
export type ModelFormInput = z.input<typeof modelSchema>;

export const unassignSchema = z.object({
  assignmentId: z.number().min(1, "La asignación es obligatoria"),
  reason: z.enum(["DAÑADO", "DEVUELTO", "MANTENIMIENTO", "REMOVIDO"], {
    error: "Debe seleccionar un motivo válido",
  }),
  notes: z.string().max(255, "Máximo 255 caracteres").optional(),
});

export type UnassignFormData = z.infer<typeof unassignSchema>;
export type UnassignFormInput = z.input<typeof unassignSchema>;
