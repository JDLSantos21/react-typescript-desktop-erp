import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { CustomerPage } from "@/features/customers/pages/CustomerPage";

//Lazy
const LoginPage = () => import("@/features/auth/pages/LoginPage");
const DashboardPage = () => import("@/features/dashboard/pages/DashboardPage");

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    lazy: LoginPage,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        lazy: DashboardPage,
      },
      {
        path: "/customers",
        Component: CustomerPage,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
