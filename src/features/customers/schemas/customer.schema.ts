import { z } from "zod";

export const customerPhoneSchema = z.object({
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(100, "Máximo 100 caracteres"),
  phoneNumber: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(/^[\d\s\-\+\(\)]+$/, "Formato inválido")
    .min(7, "Mínimo 7 caracteres")
    .max(20, "Máximo 20 caracteres"),
  type: z.enum(["MOVIL", "FIJO", "TRABAJO", "OTROS"]),
  hasWhatsapp: z.boolean(),
  isPrimary: z.boolean(),
});

export const customerAddressSchema = z.object({
  branchName: z
    .string()
    .max(100, "Máximo 100 caracteres")
    .optional()
    .or(z.literal("")),
  direction: z
    .string()
    .min(1, "La dirección es obligatoria")
    .min(5, "Mínimo 5 caracteres")
    .max(255, "Máximo 255 caracteres"),
  city: z
    .string()
    .min(1, "La ciudad es obligatoria")
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
  isPrimary: z.boolean(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  locationSource: z.enum(["MANUAL", "MAP", "MOBILE_GPS"]).optional(),
}).refine((value) => (value.latitude == null) === (value.longitude == null), {
  message: "Debe indicar latitud y longitud juntas",
  path: ["latitude"],
});

const customerBaseSchema = z.object({
  businessName: z
    .string()
    .min(1, "El nombre del negocio es obligatorio")
    .max(150, "Máximo 150 caracteres"),
  representativeName: z
    .string()
    .min(1, "El representante es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  rnc: z
    .string()
    .min(9, "RNC inválido (mínimo 9 caracteres)")
    .max(11, "RNC inválido (máximo 11 caracteres)")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  notes: z
    .string()
    .max(500, "Máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export const createCustomerSchema = customerBaseSchema.extend({
  phones: z
    .array(customerPhoneSchema)
    .min(1, "Debe agregar al menos un teléfono"),
  addresses: z
    .array(customerAddressSchema)
    .min(1, "Debe agregar al menos una dirección"),
});

export const updateCustomerSchema = customerBaseSchema;
export const addCustomerPhoneSchema = customerPhoneSchema;
export const addCustomerAddressSchema = customerAddressSchema;

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;
export type CustomerPhoneFormData = z.infer<typeof customerPhoneSchema>;
export type CustomerAddressFormData = z.infer<typeof customerAddressSchema>;
