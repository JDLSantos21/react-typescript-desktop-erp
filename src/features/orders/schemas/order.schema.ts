import { z } from "zod";

export const createOrderSchema = z.object({
  customerId: z.string().min(1, "El cliente es requerido"),
  addressId: z.number().min(1, "La dirección es requerida"),
  phoneId: z.number().min(1, "El teléfono es requerido"),
  deliveryDate: z.string().optional(),
  deliveryNotes: z.string().optional(),
  notes: z.string().optional(),
  products: z
    .array(
      z.object({
        productId: z.number().min(1, "El producto es requerido"),
        quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
        price: z.number().min(0, "El precio no puede ser negativo"),
      })
    )
    .min(1, "Debe agregar al menos un producto"),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  name: z.enum(
    [
      "PENDIENTE",
      "PREPARANDO",
      "DESPACHADO",
      "ENTREGADO",
      "CANCELADO",
      "DEVUELTO",
    ],
    {
      error: "El estado es requerido",
    }
  ),
  description: z
    .string()
    .max(50, "La descripción no puede tener más de 50 caracteres")
    .optional(),
});

export type UpdateOrderStatusFormData = z.infer<typeof UpdateOrderStatusSchema>;
