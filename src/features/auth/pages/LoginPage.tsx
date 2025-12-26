import { useLogin } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAuthSchema, LoginAuthSchema } from "../schemas/AuthSchema";
import { Button, Input, InputPassword } from "@/shared/components";
import { CiUser } from "react-icons/ci";
import { extractApiError } from "@/shared/utils";

export default function LoginPage() {
  const loginMutation = useLogin();

  const { isPending, mutateAsync: login, error } = loginMutation;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginAuthSchema>({
    resolver: zodResolver(loginAuthSchema),
  });

  const onSubmit = (data: LoginAuthSchema) => login(data);

  // Extraer información del error de la API
  const apiError = error ? extractApiError(error) : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-secondary">
      <div className="max-w-md w-full bg-background rounded-lg shadow-modal p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-text-primary">
          ERP - Inicio de Sesión
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre de usuario"
            placeholder="Ingrese su usuario"
            startIcon={<CiUser className="text-primary h-5 w-5" />}
            error={errors.username?.message}
            {...register("username")}
          />

          <InputPassword
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            error={errors.password?.message}
            {...register("password")}
          />

          {apiError && (
            <div className="text-danger text-sm">{apiError.message}</div>
          )}

          <Button variant="primary" type="submit" isLoading={isPending}>
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
