export type UserRole =
  | "ADMIN"
  | "ADMINISTRATIVO"
  | "SUPERVISOR"
  | "CHOFER"
  | "OPERADOR"
  | "USER";

/** @deprecated Use UserRole. */
export type userRole = UserRole;

export interface User {
  id: string;
  username: string;
  name: string;
  lastName: string;
  employeeId: string | null;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface refreshTokenReq {
  refreshToken: string;
}

export interface refreshTokenRes {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterUserDto {
  username: string;
  password: string;
  name: string;
  lastName: string;
  roleIds: number[];
  employeeId?: string;
}
