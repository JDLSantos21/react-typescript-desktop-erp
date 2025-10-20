import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/authStore";
import { MainLayout } from "./layouts/MainLayout";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
};
