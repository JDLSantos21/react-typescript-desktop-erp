import type { ReactNode } from "react";
import { useCanAccess } from "./usePermission";
import type { PermissionLevel } from "./permissions";

interface PermissionGateProps {
  minimumLevel: PermissionLevel;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  minimumLevel,
  children,
  fallback = null,
}: PermissionGateProps) {
  return useCanAccess(minimumLevel) ? children : fallback;
}
