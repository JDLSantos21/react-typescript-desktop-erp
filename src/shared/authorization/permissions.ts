import type { User, UserRole } from "@/shared/types/entities/user.types";

export const PermissionLevel = {
  READ_ONLY: 1,
  BASIC_OPERATIONS: 2,
  ADVANCED_OPERATIONS: 3,
  SUPERVISION: 4,
  ADMINISTRATION: 5,
  SYSTEM_ADMIN: 6,
} as const;

export type PermissionLevel = (typeof PermissionLevel)[keyof typeof PermissionLevel];

const ROLE_LEVEL: Record<UserRole, PermissionLevel> = {
  USER: PermissionLevel.READ_ONLY,
  CHOFER: PermissionLevel.BASIC_OPERATIONS,
  OPERADOR: PermissionLevel.ADVANCED_OPERATIONS,
  SUPERVISOR: PermissionLevel.SUPERVISION,
  ADMINISTRATIVO: PermissionLevel.ADMINISTRATION,
  ADMIN: PermissionLevel.SYSTEM_ADMIN,
};

export function getUserPermissionLevel(user: User | null | undefined): number {
  return Math.max(
    ...((user?.roles ?? []).map((role) => ROLE_LEVEL[role] ?? 0)),
    0,
  );
}

export function canAccess(
  user: User | null | undefined,
  requiredLevel: PermissionLevel,
): boolean {
  return getUserPermissionLevel(user) >= requiredLevel;
}
