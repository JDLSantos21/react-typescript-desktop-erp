import { useAuthStore } from "@/shared/stores/authStore";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/components";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  return (
    <header className="flex items-center justify-between px-6 py-2 bg-white border-b border-gray-200">
      {/* Breadcrumbs o título */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Sistema ERP
          {/* Aquí puedes agregar breadcrumbs dinámicos */}
        </h2>
      </div>

      {/* User menu */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">
            {user?.name} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500">{user?.roles.join(", ")}</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => logoutMutation.mutate()}
          isLoading={logoutMutation.isPending}
        >
          Logout
        </Button>
      </div>
    </header>
  );
};
