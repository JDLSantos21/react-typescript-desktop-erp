import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PageErrorBoundary, PageLoader } from "@/shared/components";
import { lazy, Suspense } from "react";

// Lazy loaded pages
const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((module) => ({
    default: module.LoginPage,
  }))
);
const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  }))
);
const CustomerPage = lazy(() =>
  import("@/features/customers/pages/CustomerPage").then((module) => ({
    default: module.CustomerPage,
  }))
);
const CustomerDetailPage = lazy(
  () => import("@/features/customers/pages/CustomerDetailPage")
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: (
      <PageErrorBoundary pageName="inicio de sesion">
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
      </PageErrorBoundary>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: (
          <PageErrorBoundary pageName="dashboard">
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          </PageErrorBoundary>
        ),
      },
      {
        path: "/customers",
        element: (
          <PageErrorBoundary pageName="clientes">
            <Suspense fallback={<PageLoader />}>
              <CustomerPage />
            </Suspense>
          </PageErrorBoundary>
        ),
      },
      {
        path: "/customers/details/:customerId",
        element: (
          <PageErrorBoundary pageName="detalle de cliente">
            <Suspense fallback={<PageLoader />}>
              <CustomerDetailPage />
            </Suspense>
          </PageErrorBoundary>
        ),
      },
      {
        path: "/customers/new",
        element: (
          <PageErrorBoundary pageName="nuevo cliente">
            <Suspense fallback={<PageLoader />}>
              <CustomerDetailPage />
            </Suspense>
          </PageErrorBoundary>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
