import { z } from "zod";

/**
 * Schema de validación para crear dirección de cliente
 * Se usa con React Hook Form para validación del formulario
 */
export const createCustomerAddressSchema = z.object({
  branch_name: z
    .string()
    .max(100, "La sucursal no puede exceder 100 caracteres")
    .optional(),
  direction: z
    .string()
    .min(1, "La dirección es obligatoria")
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(255, "La dirección no puede exceder 255 caracteres"),
  city: z
    .string()
    .min(1, "La ciudad es obligatoria")
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "La ciudad no puede exceder 100 caracteres"),
  is_primary: z.boolean(),
});

export type CreateCustomerAddressFormData = z.infer<
  typeof createCustomerAddressSchema
>;

export const createCustomerPhoneSchema = z.object({
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(100, "La descripción no puede exceder 100 caracteres"),
  phone_number: z
    .string()
    .min(1, "El número de teléfono es obligatorio")
    .regex(
      /^[\d\s\-\+\(\)]+$/,
      "El número de teléfono solo puede contener dígitos, espacios, +, -, ( y )"
    )
    .min(7, "El número de teléfono debe tener al menos 7 caracteres")
    .max(20, "El número de teléfono no puede exceder 20 caracteres"),
  type: z.enum(["MOVIL", "FIJO", "TRABAJO", "OTROS"], {
    message: "Tipo de teléfono inválido",
  }),
  has_whatsapp: z.boolean(),
  is_primary: z.boolean(),
});

export type CreateCustomerPhoneFormData = z.infer<
  typeof createCustomerPhoneSchema
>;
