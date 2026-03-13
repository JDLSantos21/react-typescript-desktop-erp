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
