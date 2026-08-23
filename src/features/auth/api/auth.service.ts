import { apiClient } from "@/shared/api/client";
import { ApiResponse } from "@/shared/types/api.types";
import {
  LoginDto,
  refreshTokenRes,
  LoginResponse,
} from "@/shared/types/entities/user.types";

export const authService = {
  login: async (credentials: LoginDto): Promise<ApiResponse<LoginResponse>> => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );
    return data;
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<ApiResponse<refreshTokenRes>> => {
    const { data } = await apiClient.post<ApiResponse<refreshTokenRes>>(
      "/auth/refresh-token",
      { refreshToken }
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
      "/auth/active-tokens"
    );
    return data;
  },
};
