import { MdHome, MdAddShoppingCart, MdLocalShipping } from "react-icons/md";
import { FaBox } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: MdHome },
    { name: "Combustible", href: "/fuel", icon: MdLocalShipping },
    { name: "Inventario", href: "/inventory", icon: FaBox },
    { name: "Vehículos", href: "/vehicles", icon: MdLocalShipping },
    { name: "Clientes", href: "/customers", icon: FaUsersLine },
    { name: "Pedidos", href: "/orders", icon: MdAddShoppingCart },
  ];

  const currentPath = location.pathname;

  return (
    <aside className="flex flex-col w-64 text-white bg-gray-50">
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = currentPath.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 p-3 transition-all duration-200 group relative backdrop-blur-sm h-12 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100/50"
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
