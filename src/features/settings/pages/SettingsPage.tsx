import { Navigate } from "react-router-dom";
import { PermissionLevel, canAccess } from "@/shared/authorization/permissions";
import { useAuthStore } from "@/shared/stores/authStore";

const settingsDestinations = [
  { href: "/settings/access", level: PermissionLevel.SYSTEM_ADMIN },
  { href: "/settings/employees", level: PermissionLevel.ADMINISTRATION },
  { href: "/settings/vehicles", level: PermissionLevel.SUPERVISION },
  { href: "/settings/maintenance/procedures", level: PermissionLevel.SUPERVISION },
  { href: "/settings/fuel", level: PermissionLevel.ADMINISTRATION },
  { href: "/settings/inventory", level: PermissionLevel.SUPERVISION },
  {
    href: "/settings/equipment/models",
    level: PermissionLevel.ADVANCED_OPERATIONS,
  },
] as const;

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const firstAvailable = settingsDestinations.find((destination) =>
    canAccess(user, destination.level),
  );

  return <Navigate to={firstAvailable?.href ?? "/dashboard"} replace />;
}
