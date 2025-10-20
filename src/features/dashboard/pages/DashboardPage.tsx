import { useLogout } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components";
import { useNavigate } from "react-router-dom";

export const Component = () => {
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold">Dashboard ERP</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-2 text-xl font-semibold">Módulo 1</h2>
            <p className="text-gray-600">Contenido próximamente</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-2 text-xl font-semibold">Módulo 2</h2>
            <p className="text-gray-600">Contenido próximamente</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="mb-2 text-xl font-semibold">Módulo 3</h2>
            <p className="text-gray-600">Contenido próximamente</p>
          </div>
        </div>
        <Button onClick={() => logoutMutation.mutate()} className="mt-6">
          Cerrar sesión
        </Button>
        <Button onClick={() => navigate("/customers")} className="mt-6">
          Ir a Clientes
        </Button>
      </div>
    </div>
  );
};
