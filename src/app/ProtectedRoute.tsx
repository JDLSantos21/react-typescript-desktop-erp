import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/authStore";
import { MainLayout } from "./layouts/MainLayout";
import { SettingsLayout } from "./layouts/SettingsLayout";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return location.pathname.startsWith("/settings") ? (
    <SettingsLayout />
  ) : (
    <MainLayout />
  );
};
