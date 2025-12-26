import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PageErrorBoundary, PageLoader } from "@/shared/components";
import { lazy, Suspense } from "react";

// Lazy loaded pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));

const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage")
);

const CustomerPage = lazy(
  () => import("@/features/customers/pages/CustomerPage")
);

const CustomerDetailPage = lazy(
  () => import("@/features/customers/pages/CustomerDetailPage")
);

const CreateCustomerPage = lazy(
  () => import("@/features/customers/pages/CreateCustomerPage")
);

const OrdersPage = lazy(() => import("@/features/orders/pages/OrdersPage"));

const CreateOrderPage = lazy(
  () => import("@/features/orders/pages/CreateOrderPage")
);

const OrderDetailPage = lazy(
  () => import("@/features/orders/pages/OrderDetailPage")
);

const EditOrderPage = lazy(
  () => import("@/features/orders/pages/EditOrderPage")
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PageErrorBoundary pageName="inicio de sesion">
          <LoginPage />
        </PageErrorBoundary>
      </Suspense>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PageErrorBoundary pageName="dashboard">
              <DashboardPage />
            </PageErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: "/customers",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PageErrorBoundary pageName="clientes">
              <CustomerPage />
            </PageErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: "/customers/details/:customerId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PageErrorBoundary pageName="detalle de cliente">
              <CustomerDetailPage />
            </PageErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: "/customers/new",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PageErrorBoundary pageName="nuevo cliente">
              <CreateCustomerPage />
            </PageErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: "/orders",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PageErrorBoundary pageName="pedidos">
              <OrdersPage />
            </PageErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: "/orders/new/:customerId?",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PageErrorBoundary pageName="crear pedido">
              <CreateOrderPage />
            </PageErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: "/orders/:id/edit",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PageErrorBoundary pageName="editar pedido">
              <EditOrderPage />
            </PageErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: "/orders/:id?",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PageErrorBoundary pageName="detalle del pedido">
              <OrderDetailPage />
            </PageErrorBoundary>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
