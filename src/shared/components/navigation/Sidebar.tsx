import {
  DashboardIcon,
  EquipmentIcon,
  FuelIcon,
  GasMeterIcon,
  HistoryIcon,
  MenuIcon,
  OrderIcon,
  SettingsIcon,
  StackIcon,
  StatsIcon,
  TruckIcon,
  UsersIcon,
} from "../icons";
import { SidebarItem } from "./SidebarItem";
import { NavigationItem } from "./sidebar.types";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/authStore";
import { PermissionLevel, canAccess } from "@/shared/authorization/permissions";

const navigationItems: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  {
    name: "Combustible",
    href: "/fuel",
    icon: FuelIcon,
    minimumPermissionLevel: PermissionLevel.ADMINISTRATION,
    children: [
      { name: "Historial", icon: HistoryIcon, href: "/fuel/history" },
      { name: "Reabastecimientos", icon: GasMeterIcon, href: "/fuel/refills" },
      { name: "Metricas", icon: StatsIcon, href: "/fuel/metrics" },
    ],
  },
  {
    name: "Inventario",
    href: "/inventory",
    icon: StackIcon,
    children: [
      { name: "Materiales", href: "/inventory/materials" },
      { name: "Movimientos", href: "/inventory/movements" },
    ],
  },
  {
    name: "Vehículos",
    href: "/vehicles",
    icon: TruckIcon,
    children: [
      {
        name: "Mantenimiento",
        href: "/maintenance",
        minimumPermissionLevel: PermissionLevel.SUPERVISION,
      },
    ],
  },
  {
    name: "Equipos",
    href: "/equipments",
    icon: EquipmentIcon,
  },
  {
    name: "Clientes",
    href: "/customers",
    icon: UsersIcon,
    children: [
      {
        name: "Nuevo cliente",
        href: "/customers/new",
        minimumPermissionLevel: PermissionLevel.ADVANCED_OPERATIONS,
      },
    ],
  },
  {
    name: "Pedidos",
    href: "/orders",
    icon: OrderIcon,
    children: [
      {
        name: "Nuevo pedido",
        href: "/orders/new",
        minimumPermissionLevel: PermissionLevel.ADVANCED_OPERATIONS,
      },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const visibleNavigationItems = navigationItems
    .filter((item) =>
      item.minimumPermissionLevel
        ? canAccess(user, item.minimumPermissionLevel)
        : true,
    )
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) =>
        child.minimumPermissionLevel
          ? canAccess(user, child.minimumPermissionLevel)
          : true,
      ),
    }));

  // Find which item should be initially open based on current route
  const getActiveParent = () => {
    const match = visibleNavigationItems.find(
      (item) => item.children && location.pathname.startsWith(item.href),
    );
    return match?.name ?? null;
  };

  const [openItem, setOpenItem] = useState<string | null>(getActiveParent);

  // Auto-open the correct parent when route changes
  useEffect(() => {
    const active = getActiveParent();
    if (active) setOpenItem(active);
  }, [location.pathname, user]);

  const handleToggle = (itemName: string) => {
    setOpenItem((prev) => (prev === itemName ? null : itemName));
  };

  return (
    <aside className="flex flex-col w-64 bg-white border-r border-gray-200">
      {/* Sidebar header */}
      <div className="h-20 flex justify-between items-center border-b border-gray-200">
        <img src="/logo.png" alt="Logo" className="max-h-full" />
        <div className="w-1/5 flex justify-center">
          <MenuIcon className="h-5 w-5" />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="px-4 py-6 space-y-1">
          {visibleNavigationItems.map((item) => (
            <SidebarItem
              key={item.name}
              item={item}
              isOpen={openItem === item.name}
              onToggle={() => handleToggle(item.name)}
            />
          ))}
        </ul>
      </nav>
      {canAccess(user, PermissionLevel.ADVANCED_OPERATIONS) ? (
        <div className="border-t border-gray-200 p-3">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"}`
            }
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Configuración</span>
          </NavLink>
        </div>
      ) : null}
    </aside>
  );
}
