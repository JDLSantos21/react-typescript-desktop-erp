import {
  DashboardIcon,
  EquipmentIcon,
  FuelIcon,
  GasMeterIcon,
  HistoryIcon,
  MenuIcon,
  OrderIcon,
  StackIcon,
  TruckIcon,
  UsersIcon,
} from "../icons";
import { SidebarItem } from "./SidebarItem";
import { NavigationItem } from "./sidebar.types";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const navigationItems: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  {
    name: "Combustible",
    href: "/fuel",
    icon: FuelIcon,
    children: [
      { name: "Historial", icon: HistoryIcon, href: "/fuel/history" },
      { name: "Reabastecimientos", icon: GasMeterIcon, href: "/fuel/refills" },
    ],
  },
  { name: "Inventario", href: "/inventory", icon: StackIcon },
  { name: "Vehículos", href: "/vehicles", icon: TruckIcon },
  {
    name: "Equipos",
    href: "/equipments",
    icon: EquipmentIcon,
    children: [{ name: "Nuevo equipo", href: "/equipments/create" }],
  },
  {
    name: "Clientes",
    href: "/customers",
    icon: UsersIcon,
    children: [{ name: "Nuevo cliente", href: "/customers/new" }],
  },
  {
    name: "Pedidos",
    href: "/orders",
    icon: OrderIcon,
    children: [{ name: "Nuevo pedido", href: "/orders/new" }],
  },
];

export function Sidebar() {
  const location = useLocation();

  // Find which item should be initially open based on current route
  const getActiveParent = () => {
    const match = navigationItems.find(
      (item) => item.children && location.pathname.startsWith(item.href),
    );
    return match?.name ?? null;
  };

  const [openItem, setOpenItem] = useState<string | null>(getActiveParent);

  // Auto-open the correct parent when route changes
  useEffect(() => {
    const active = getActiveParent();
    if (active) setOpenItem(active);
  }, [location.pathname]);

  const handleToggle = (itemName: string) => {
    setOpenItem((prev) => (prev === itemName ? null : itemName));
  };

  return (
    <aside className="flex flex-col w-64 bg-white border-r border-gray-200">
      {/* Sidebar header */}
      <div className="h-20 flex justify-between items-center border-b border-gray-200">
        <img src="./logo.png" alt="Logo" className="max-h-full" />
        <div className="w-1/5 flex justify-center">
          <MenuIcon className="h-5 w-5" />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="px-4 py-6 space-y-1">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.name}
              item={item}
              isOpen={openItem === item.name}
              onToggle={() => handleToggle(item.name)}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
