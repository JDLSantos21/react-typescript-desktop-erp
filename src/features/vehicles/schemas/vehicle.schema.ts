import z from "zod";

const currentYear = new Date().getFullYear();

const requiredText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio`)
    .max(maxLength, `Máximo ${maxLength} caracteres`);

export const vehicleSchema = z.object({
  licensePlate: requiredText("La placa", 20),
  chasis: requiredText("El chasis", 50),
  brand: requiredText("La marca", 50),
  model: requiredText("El modelo", 50),
  year: z.coerce
    .number({ message: "El año debe ser un número" })
    .int("El año debe ser un número entero")
    .min(1900, "El año debe ser 1900 o posterior")
    .max(currentYear + 1, `El año no puede superar ${currentYear + 1}`),
  currentTag: requiredText("El tag", 50),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
export type VehicleFormInput = z.input<typeof vehicleSchema>;
