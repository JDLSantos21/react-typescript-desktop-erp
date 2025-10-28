import z from "zod";

export const createAuthSchema = z.object({
  username: z
    .string()
    .min(4, "El nombre de usuario debe tener al menos 4 caracteres"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

export type CreateAuthSchema = z.infer<typeof createAuthSchema>;

export const loginAuthSchema = z.object({
  username: z
    .string()
    .min(4, "El nombre de usuario debe tener al menos 4 caracteres"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

export type LoginAuthSchema = z.infer<typeof loginAuthSchema>;
