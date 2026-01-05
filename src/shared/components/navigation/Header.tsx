import { useAuthStore } from "@/shared/stores/authStore";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Button, ReturnIcon } from "@/shared/components";
import { useHeader } from "@/shared/contexts/HeaderContext";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { motion } from "motion/react"; // Opcional para el hover

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const { config } = useHeader();
  const navigate = useNavigate();

  const nameInitial = user?.name.charAt(0).toUpperCase();

  const displayName = (name: string, lastName: string) => {
    const shortName = name.charAt(0).toUpperCase() + ".";
    return name.split(" ").length === 1
      ? `${name} ${lastName}`
      : `${shortName} ${lastName}`;
  };

  return (
    <header className="sticky top-0 z-30 h-20 flex items-center bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
      {/* Contenido Principal */}
      <div className="flex-1 flex items-center px-6 md:px-8">
        {config.customContent ? (
          <div className="flex-1 flex items-center gap-4">
            {config.showBackButton && (
              <Button
                icon={ReturnIcon}
                variant="ghost"
                onClick={config.onBack || (() => navigate(-1))}
                size="icon"
                className="text-slate-400 hover:text-slate-800"
              />
            )}
            {config.customContent}
          </div>
        ) : (
          <div className="flex flex-1 justify-between items-center">
            {/* Título y Descripción */}
            <div className="flex items-center gap-4">
              {config.showBackButton && (
                <Button
                  icon={ReturnIcon}
                  variant="ghost"
                  onClick={config.onBack || (() => navigate(-1))}
                  size="icon"
                  className="rounded-full hover:bg-slate-100 text-slate-500"
                />
              )}
              <div>
                {config.title && (
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                    {config.title}
                  </h2>
                )}
                {config.description && (
                  <p className="text-sm text-slate-500 font-medium">
                    {config.description}
                  </p>
                )}
              </div>
            </div>

            {/* Acciones */}
            {(config.actions || config.dropdownMenu) && (
              <div className="flex items-center gap-3">
                {config.actions}
                {config.dropdownMenu}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Perfil de Usuario (Pill Style) */}
      <div className="px-6 md:px-8 border-l border-slate-100 h-10 flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <button className="group flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full hover:bg-slate-50 transition-all duration-200 outline-none ring-offset-2 focus:ring-2 focus:ring-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-800 leading-none">
                  {displayName(user?.name || "", user?.lastName || "")}
                </p>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">
                  {user?.roles[0] || "Usuario"}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-slate-200 group-hover:scale-105 transition-transform">
                {nameInitial}
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-56 bg-white p-1.5 rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <div className="px-2 py-1.5 mb-1 border-b border-slate-50">
              <p className="text-xs font-bold text-slate-800">Mi Cuenta</p>
            </div>

            <button
              className="w-full text-left px-2 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2"
              onClick={() => logoutMutation.mutate()}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Cerrar
              sesión
            </button>

            <div className="mt-1 pt-1 border-t border-slate-50 px-2 py-1 text-[10px] text-slate-300 text-center">
              v{import.meta.env.VITE_APP_VERSION || "1.0.0"}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
