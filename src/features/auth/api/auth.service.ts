import { apiClient } from "@/shared/api/client";
import { ApiResponse } from "@/shared/types/api.types";
import {
  LoginDto,
  refreshTokenRes,
  LoginResponse,
  RegisterUserDto,
  User,
} from "@/shared/types/entities/user.types";

export interface SystemRole {
  id: number;
  name: User["roles"][number];
  hierarchyLevel: number;
  description: string | null;
}

export const authService = {
  login: async (credentials: LoginDto): Promise<ApiResponse<LoginResponse>> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials,
    );
    return data;
  },

  refreshToken: async (
    refreshToken: string,
  ): Promise<ApiResponse<refreshTokenRes>> => {
    const { data } = await apiClient.post<ApiResponse<refreshTokenRes>>(
      "/auth/refresh-token",
      { refreshToken },
    );
    return data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post("/auth/logout", { refreshToken });
  },

  revokeAllTokens: async (): Promise<void> => {
    await apiClient.post("/auth/revoke-all");
  },

  getActiveTokens: async (): Promise<ApiResponse<string[]>> => {
    const { data } = await apiClient.get<ApiResponse<any[]>>(
      "/auth/active-tokens",
    );
    return data;
  },

  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const { data } = await apiClient.get<ApiResponse<User[]>>("/auth");
    return data;
  },

  getRoles: async (): Promise<ApiResponse<SystemRole[]>> => {
    const { data } =
      await apiClient.get<ApiResponse<SystemRole[]>>("/auth/roles");
    return data;
  },

  registerUser: async (input: RegisterUserDto): Promise<ApiResponse<User>> => {
    const { roleIds, ...user } = input;
    const { data } = await apiClient.post<ApiResponse<User>>("/auth/register", {
      ...user,
      roles: roleIds,
    });
    return data;
  },

  setUserRoles: async (userId: string, roleIds: number[]): Promise<void> => {
    await apiClient.post(`/auth/set-roles/${userId}`, { roles: roleIds });
  },
};
