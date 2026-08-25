import { z } from "zod";

export const materialSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  description: z.string().trim().max(255).nullable().optional(),
  categoryId: z.coerce.number().int().positive("Seleccione una categoría"),
  unitId: z.coerce.number().int().positive("Seleccione una unidad"),
  stock: z.coerce.number().min(0, "El stock no puede ser negativo"),
  minimumStock: z.coerce.number().min(0, "El mínimo no puede ser negativo"),
});

export const stockMoveSchema = z.object({
  materialId: z.coerce.number().int().positive("Seleccione un material"),
  type: z.enum(["ENTRADA", "SALIDA", "AJUSTE"]),
  quantity: z.coerce.number().min(0, "Ingrese una cantidad válida").max(50),
  description: z.string().trim().max(1000).nullable().optional(),
  date: z.string().nullable().optional(),
});

export type MaterialFormData = z.infer<typeof materialSchema>;
export type StockMoveFormData = z.infer<typeof stockMoveSchema>;
export type MaterialFormInput = z.input<typeof materialSchema>;
export type StockMoveFormInput = z.input<typeof stockMoveSchema>;
