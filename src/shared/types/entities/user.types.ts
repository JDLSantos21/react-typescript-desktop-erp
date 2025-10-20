export type userRole =
  | "ADMIN"
  | "ADMINISTRATIVO"
  | "SUPERVISOR"
  | "CHOFER"
  | "OPERADOR";

export interface User {
  id: string;
  username: string;
  name: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  roles: userRole[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface refreshTokenReq {
  refresh_token: string;
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
}
