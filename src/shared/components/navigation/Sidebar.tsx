import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
  DashboardIcon,
  EquipmentIcon,
  FuelIcon,
  MenuIcon,
  OrderIcon,
  StackIcon,
  TruckIcon,
  UsersIcon,
} from "../icons";

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    { name: "Combustible", href: "/fuel", icon: FuelIcon },
    { name: "Inventario", href: "/inventory", icon: StackIcon },
    { name: "Vehículos", href: "/vehicles", icon: TruckIcon },
    { name: "Equipos", href: "/equipments", icon: EquipmentIcon },
    { name: "Clientes", href: "/customers", icon: UsersIcon },
    { name: "Pedidos", href: "/orders", icon: OrderIcon },
  ];

  return (
    <aside className="sticky top-0 h-screen w-[280px] flex flex-col bg-white border-r border-slate-100/60 font-sans shadow-[2px_0_24px_-12px_rgba(0,0,0,0.02)]">
      {/* Header Limpio */}
      <div className="h-24 flex items-center px-8 justify-between mb-2">
        <div className="flex items-center gap-3">
          {/* Isotipo Minimalista */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-200">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-white fill-current"
            >
              <path d="M3 3h18v18H3z" /> {/* Icono placeholder */}
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Logistics<span className="text-slate-400">Pro</span>
          </span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = currentPath.startsWith(item.href);

            return (
              <li key={item.name} className="relative">
                <Link
                  to={item.href}
                  className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group outline-none ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {/* Fondo Animado (Layout Animation) */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 bg-slate-100 rounded-2xl"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Icono */}
                  <div className="relative z-10 flex items-center justify-center">
                    <item.icon
                      className={`w-[20px] h-[20px] transition-colors duration-200 ${
                        isActive
                          ? "text-slate-900 stroke-[2px]"
                          : "text-slate-400 group-hover:text-slate-600 stroke-[1.5px]"
                      }`}
                    />
                  </div>

                  {/* Texto */}
                  <span className="relative z-10 text-sm font-medium tracking-wide">
                    {item.name}
                  </span>

                  {/* Indicador de estado (Punto sutil) */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 w-1.5 h-1.5 rounded-full bg-slate-900 z-10"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Ajustes */}
      <div className="p-6 border-t border-slate-50">
        <button className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-white shadow-sm flex items-center justify-center text-slate-600">
            <MenuIcon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800">Ajustes</p>
            <p className="text-[10px] font-medium text-slate-400 group-hover:text-slate-500">
              Configuración general
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
