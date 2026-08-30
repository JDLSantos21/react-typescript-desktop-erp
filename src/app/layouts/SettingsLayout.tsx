import {
  ArrowLeft,
  Boxes,
  Fuel,
  Mail,
  MapPinned,
  Package,
  ShoppingBasket,
  Truck,
  Users,
  UserRound,
  Wrench,
  BellRing,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Toaster } from "sileo";
import { PermissionLevel, canAccess } from "@/shared/authorization/permissions";
import { useAuthStore } from "@/shared/stores/authStore";

type SettingsItem = {
  label: string;
  href: string;
  icon: typeof Package;
  minimumLevel: PermissionLevel;
};

const navItemClasses = (isActive: boolean) => {
  if (isActive) {
    return "flex h-11 items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/80 px-3 text-sm font-medium text-blue-700 transition-colors";
  }
  return "flex h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700";
};

const groups: Array<{ label: string; items: SettingsItem[] }> = [
  {
    label: "Acceso",
    items: [
      {
        label: "Empleados",
        href: "/settings/employees",
        icon: UserRound,
        minimumLevel: PermissionLevel.ADMINISTRATION,
      },
      {
        label: "Usuarios y roles",
        href: "/settings/access",
        icon: Users,
        minimumLevel: PermissionLevel.SYSTEM_ADMIN,
      },
    ],
  },
  {
    label: "Operación",
    items: [
      {
        label: "Correo electrónico",
        href: "/settings/email",
        icon: Mail,
        minimumLevel: PermissionLevel.ADMINISTRATION,
      },
      {
        label: "Vehículos",
        href: "/settings/vehicles",
        icon: Truck,
        minimumLevel: PermissionLevel.SUPERVISION,
      },
      {
        label: "Procedimientos de mantenimiento",
        href: "/settings/maintenance/procedures",
        icon: Wrench,
        minimumLevel: PermissionLevel.SUPERVISION,
      },
      {
        label: "Combustible",
        href: "/settings/fuel",
        icon: Fuel,
        minimumLevel: PermissionLevel.ADMINISTRATION,
      },
    ],
  },
  {
    label: "Catálogos",
    items: [
      {
        label: "Productos",
        href: "/settings/products",
        icon: ShoppingBasket,
        minimumLevel: PermissionLevel.ADVANCED_OPERATIONS,
      },
      {
        label: "Inventario",
        href: "/settings/inventory",
        icon: Package,
        minimumLevel: PermissionLevel.SUPERVISION,
      },
      {
        label: "Modelos de equipo",
        href: "/settings/equipment/models",
        icon: Boxes,
        minimumLevel: PermissionLevel.ADVANCED_OPERATIONS,
      },
      {
        label: "Unidades de equipo",
        href: "/settings/equipment/units",
        icon: Boxes,
        minimumLevel: PermissionLevel.ADVANCED_OPERATIONS,
      },
      {
        label: "Ubicaciones de equipos",
        href: "/settings/equipment/locations",
        icon: MapPinned,
        minimumLevel: PermissionLevel.SUPERVISION,
      },
      {
        label: "Seguimiento de consumo",
        href: "/settings/equipment/monitoring",
        icon: BellRing,
        minimumLevel: PermissionLevel.SUPERVISION,
      },
    ],
  },
];

export function SettingsLayout() {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-text-primary">
      <Toaster
        offset={{ top: 24, right: 24 }}
        position="top-right"
        options={{
          fill: "#FFFFFF",
          roundness: 12,
          styles: { description: "text-gray-600! text-sm!" },
        }}
      />
      <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-20 items-center gap-3 border-b border-gray-200 px-4">
          <img src="/logo.png" alt="Logo" className="max-h-14 max-w-32 object-contain" />
          <div className="min-w-0 border-l border-gray-200 pl-3">
            <p className="truncate text-sm font-semibold text-gray-900">Configuración</p>
            <p className="truncate text-xs text-gray-500">Administración del ERP</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {groups.map((group) => {
            const items = group.items.filter((item) =>
              canAccess(user, item.minimumLevel),
            );
            if (!items.length) return null;
            return (
              <section key={group.label} className="mb-6">
                <p className="mb-2 px-3 text-xs font-medium text-gray-500">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {items.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === "/settings"}
                      className={({ isActive }) => navItemClasses(isActive)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </section>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-3">
          <NavLink
            to="/dashboard"
            className="flex h-11 items-center gap-3 rounded-lg border border-transparent px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al ERP
          </NavLink>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
