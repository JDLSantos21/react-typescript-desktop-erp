import { useAuthStore } from "@/shared/stores/authStore";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Button, ReturnIcon } from "@/shared/components";
import { useHeader } from "@/shared/contexts/HeaderContext";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const { config } = useHeader();
  const navigate = useNavigate();

  const nameInitial = user?.name.charAt(0).toUpperCase();

  const displayName = (name: string, lastName: string) => {
    const shortName = name.charAt(0).toUpperCase() + ".";
    if (name.split(" ").length === 1) {
      return `${name} ${lastName}`;
    } else {
      return `${shortName} ${lastName}`;
    }
  };

  return (
    <header className="h-20 flex items-center bg-white border-b border-gray-100">
      {config.customContent ? (
        <div className="flex justify-between items-center flex-1 h-full">
          <div className="flex-1 flex items-center">
            {config.showBackButton && (
              <div className="pl-4">
                <Button
                  icon={ReturnIcon}
                  variant="ghost"
                  onClick={config.onBack || (() => navigate(-1))}
                  size="icon"
                />
              </div>
            )}
            {config.customContent}
          </div>
        </div>
      ) : (
        <div className="flex justify-between flex-1 items-center">
          {/* Dynamic title and description */}
          <div className="flex-1 px-6 flex items-center">
            {config.showBackButton && (
              <Button
                icon={ReturnIcon}
                className="mr-4"
                variant="ghost"
                onClick={config.onBack || (() => navigate(-1))}
                size="icon"
              />
            )}
            <div>
              {config.title && (
                <>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    {config.title}
                  </h2>
                  {config.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {config.description}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Dynamic actions (buttons, datepicker, filters) */}
          {(config.actions || config.dropdownMenu) && (
            <div className="px-6 flex items-center gap-2">
              {config.actions}
              {config.dropdownMenu}
            </div>
          )}
        </div>
      )}

      {/* User menu */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-3 border border-gray-100 h-full w-[250px] px-4 select-none cursor-pointer hover:bg-gray-50 transition-colors duration-150">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-sm flex items-center justify-center text-gray-700 font-medium">
              <span>{nameInitial}</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-gray-900">
                {displayName(user?.name || "", user?.lastName || "")}
              </p>
              <p className="text-xs text-gray-500">{user?.roles.join(", ")}</p>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[248px] bg-white z-50 p-0 border border-border shadow-lg"
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => logoutMutation.mutate()}
          >
            Cerrar sesión
          </button>

          <div className="w-full justify-start rounded-none px-4 py-2 text-sm text-gray-500">
            Versión {import.meta.env.VITE_APP_VERSION || "1.0.0"}
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
};
