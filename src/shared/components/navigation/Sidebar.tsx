import { Link, useLocation } from "react-router-dom";
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

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    { name: "Combustible", href: "/fuel", icon: FuelIcon },
    { name: "Inventario", href: "/inventory", icon: StackIcon },
    { name: "Vehículos", href: "/vehicles", icon: TruckIcon },
    { name: "Equipos", href: "/equipments", icon: EquipmentIcon },
    { name: "Clientes", href: "/customers", icon: UsersIcon },
    { name: "Pedidos", href: "/orders", icon: OrderIcon },
  ];

  const currentPath = location.pathname;

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
        <ul className="px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = currentPath.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 p-3 rounded-sm transition-all duration-200 group relative backdrop-blur-sm h-12 ${
                    isActive
                      ? "bg-gradient-to-r from-white to-gray-100 text-text-secondary shadow-sm border border-blue-100/50"
                      : "text-slate-600 hover:bg-white/60 hover:text-slate-800 hover:shadow-sm border border-transparent hover:border-slate-200/60"
                  }`}
                >
                  <item.icon className="w-5 h-5 from-blue-500 to-indigo-50" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
