import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { PermissionLevel } from "@/shared/authorization/permissions";
import { useCanAccess } from "@/shared/authorization/usePermission";

export function PermissionRoute({
  minimumLevel,
  children,
}: {
  minimumLevel: PermissionLevel;
  children: ReactNode;
}) {
  return useCanAccess(minimumLevel) ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
}
