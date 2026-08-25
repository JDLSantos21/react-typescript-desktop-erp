import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../api/auth.service";
import { useAuthStore } from "@/shared/stores/authStore";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/shared/lib/query-client";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response.data;
      setAuth(accessToken, refreshToken, user);
      navigate("/dashboard");
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(refreshToken!),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });
};

export const useRevokeAllTokens = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.revokeAllTokens,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });
};

export const useSystemUsers = () =>
  useQuery({
    queryKey: ["auth", "users"],
    queryFn: authService.getUsers,
    staleTime: 60_000,
  });
export const useSystemRoles = () =>
  useQuery({
    queryKey: ["auth", "roles"],
    queryFn: authService.getRoles,
    staleTime: 5 * 60_000,
  });
export const useRegisterSystemUser = () =>
  useMutation({
    mutationFn: authService.registerUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["auth", "users"] }),
  });
export const useAssignSystemUserRoles = () =>
  useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: number[] }) =>
      authService.setUserRoles(userId, roleIds),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["auth", "users"] }),
  });
