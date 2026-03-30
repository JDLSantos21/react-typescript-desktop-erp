import z from "zod";

const baseSchema = z.object({
  vehicle_id: z.string().min(1, "Debe seleccionar un vehículo"),
  gallons: z.coerce
    .number()
    .min(1, "Debe ingresar una cantidad de combustible"),
  consumed_at: z.string().optional().nullable(),
  tank_refill_id: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Schema para vehículos - requiere driver y mileage
const vehicleSchema = baseSchema.extend({
  vehicle_type: z.literal("vehicle"),
  driver_id: z.string().min(1, "Debe seleccionar un conductor"),
  mileage: z.coerce.number().min(1, "Debe ingresar el kilometraje"),
});

// Schema para planta - no requiere driver ni mileage
const plantSchema = baseSchema.extend({
  vehicle_type: z.literal("plant"),
  driver_id: z.string().optional().nullable(),
  mileage: z.coerce.number().optional().nullable(),
});

export const registerConsumptionSchema = z.discriminatedUnion("vehicle_type", [
  vehicleSchema,
  plantSchema,
]);

export type RegisterConsumptionFormData = z.infer<
  typeof registerConsumptionSchema
>;
export type RegisterConsumptionInput = z.input<
  typeof registerConsumptionSchema
>;

export const registerRefillSchema = z.object({
  gallons: z.coerce
    .number()
    .min(1, "Debe ingresar una cantidad de combustible"),
  price_per_gallon: z.coerce
    .number()
    .min(1, "Debe ingresar el precio por galón"),
});

export type RegisterRefillInput = z.input<typeof registerRefillSchema>;
export type RegisterRefillFormData = z.infer<typeof registerRefillSchema>;
