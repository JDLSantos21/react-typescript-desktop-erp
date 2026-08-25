import z from "zod";

const baseSchema = z.object({
  vehicleId: z.string().min(1, "Debe seleccionar un vehículo"),
  gallons: z.coerce
    .number()
    .min(1, "Debe ingresar una cantidad de combustible"),
  consumedAt: z.string().optional().nullable(),
  tankRefillId: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Schema para vehículos - requiere driver y mileage
const vehicleSchema = baseSchema.extend({
  vehicleType: z.literal("VEHICLE"),
  driverId: z.string().min(1, "Debe seleccionar un conductor"),
  mileage: z.coerce.number().min(1, "Debe ingresar el kilometraje"),
});

// Schema para planta - no requiere driver ni mileage
const plantSchema = baseSchema.extend({
  vehicleType: z.literal("PLANT"),
  driverId: z.string().optional().nullable(),
  mileage: z.coerce.number().optional().nullable(),
});

export const registerConsumptionSchema = z.discriminatedUnion("vehicleType", [
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
  pricePerGallon: z.coerce
    .number()
    .min(1, "Debe ingresar el precio por galón"),
});

export type RegisterRefillInput = z.input<typeof registerRefillSchema>;
export type RegisterRefillFormData = z.infer<typeof registerRefillSchema>;

export const fuelTankSchema = z.object({
  capacity: z.coerce.number().positive("La capacidad debe ser mayor que cero"),
  currentLevel: z.coerce.number().min(0, "El nivel actual no puede ser negativo"),
  minLevel: z.coerce.number().min(0, "El nivel mínimo no puede ser negativo"),
}).refine((data) => data.currentLevel <= data.capacity, { message: "El nivel actual no puede superar la capacidad", path: ["currentLevel"] }).refine((data) => data.minLevel <= data.capacity, { message: "El nivel mínimo no puede superar la capacidad", path: ["minLevel"] });

export type FuelTankFormInput = z.input<typeof fuelTankSchema>;
export type FuelTankFormData = z.infer<typeof fuelTankSchema>;
