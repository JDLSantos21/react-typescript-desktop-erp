import { useAuthStore } from "@/shared/stores/authStore";
import { canAccess, getUserPermissionLevel, type PermissionLevel } from "./permissions";

export function usePermissionLevel(): number {
  return useAuthStore((state) => getUserPermissionLevel(state.user));
}

export function useCanAccess(requiredLevel: PermissionLevel): boolean {
  return useAuthStore((state) => canAccess(state.user, requiredLevel));
}
