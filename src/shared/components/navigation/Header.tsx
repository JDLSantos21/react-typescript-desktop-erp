import { useAuthStore } from "@/shared/stores/authStore";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { LogoutIcon } from "@/shared/components";
import { useHeader } from "@/shared/contexts/HeaderContext";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const { config } = useHeader();

  const nameInitial = user?.name.charAt(0).toUpperCase();

  return (
    <header className="h-20 flex items-center bg-white border-b border-gray-200">
      <div className="flex justify-between flex-1 items-center">
        {/* Dynamic title and description */}
        <div className="flex-1 px-4">
          {config.title && (
            <>
              <h2 className="text-xl font-bold text-gray-800">
                {config.title}
              </h2>
              {config.description && (
                <p className="text-sm text-gray-500">{config.description}</p>
              )}
            </>
          )}
        </div>

        {/* Dynamic actions (buttons, datepicker, filters) */}
        {config.actions && <div className="px-4">{config.actions}</div>}
      </div>

      {/* User menu */}
      <div className="flex items-center gap-2 border-l h-full w-[250px] px-4">
        <div>
          <div
            className="w-12 h-12 rounded-full bg-gray-200 text-lg flex items-center justify-center text-gray-600 font-semibold cursor-pointer hover:bg-red-100 transition-colors duration-300 group"
            onClick={() => logoutMutation.mutate()}
          >
            <span className="group-hover:hidden">{nameInitial}</span>
            <span className="group-hover:block hidden">
              <LogoutIcon className="text-red-500" />
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">
            {user?.name} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500">{user?.roles.join(", ")}</p>
        </div>
      </div>
    </header>
  );
};
