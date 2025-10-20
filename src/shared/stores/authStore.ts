import { User } from "@/shared/types/entities/user.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (accessToken: string, refreshToken: string, user: User) =>
        set({ accessToken, refreshToken, user, isAuthenticated: true }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
      updateTokens: (accessToken: string, refreshToken: string) =>
        set({ accessToken, refreshToken }),
    }),
    {
      name: "auth-storage",
    }
  )
);
