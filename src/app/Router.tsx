import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PageErrorBoundary } from "@/shared/components/error-boundary/PageErrorBoundary";
import { PageLoader } from "@/shared/components/PageLoader";
import { lazy, Suspense } from "react";

// Lazy loaded pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));

const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/DashboardPage"),
);

const CustomerPage = lazy(
  () => import("@/features/customers/pages/CustomerPage"),
);

const CustomerDetailPage = lazy(
  () => import("@/features/customers/pages/CustomerDetailPage"),
);

const CreateCustomerPage = lazy(
  () => import("@/features/customers/pages/CreateCustomerPage"),
);

const CustomerOrdersHistoryPage = lazy(
  () => import("@/features/customers/pages/CustomerOrdersHistoryPage"),
);

const OrdersPage = lazy(() => import("@/features/orders/pages/OrdersPage"));

const CreateOrderPage = lazy(
  () => import("@/features/orders/pages/CreateOrderPage"),
);

const OrderDetailPage = lazy(
  () => import("@/features/orders/pages/OrderDetailPage"),
);

const EditOrderPage = lazy(
  () => import("@/features/orders/pages/EditOrderPage"),
);

const EquipmentsPage = lazy(
  () => import("@/features/equipments/pages/EquipmentsPage"),
);

const EquipmentDetailPage = lazy(
  () => import("@/features/equipments/pages/EquipmentDetailPage"),
);

const CreateEquipmentPage = lazy(
  () => import("@/features/equipments/pages/CreateEquipmentPage"),
);

const FuelPage = lazy(() => import("@/features/fuel/pages/FuelPage"));

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
        path: "/fuel",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="combustible">
                  <FuelPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/customers",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="clientes">
                  <CustomerPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="detalle de cliente">
                  <CustomerDetailPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "new",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="nuevo cliente">
                  <CreateCustomerPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: ":id/orders-history",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="historial de pedidos">
                  <CustomerOrdersHistoryPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/orders",

        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="pedidos">
                  <OrdersPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="detalle del pedido">
                  <OrderDetailPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="editar pedido">
                  <EditOrderPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "new/:customerId?",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="crear pedido">
                  <CreateOrderPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/equipments",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="equipos">
                  <EquipmentsPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="detalle del equipo">
                  <EquipmentDetailPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "create",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="crear equipo">
                  <CreateEquipmentPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
