import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { PermissionRoute } from "./PermissionRoute";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { PageErrorBoundary } from "@/shared/components/error-boundary/PageErrorBoundary";
import { PageLoader } from "@/shared/components/PageLoader";
import { lazy, Suspense } from "react";
import RefillsPage from "@/features/fuel/pages/RefillsPage";

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

const VehiclesPage = lazy(
  () => import("@/features/vehicles/pages/VehiclesPage"),
);

const VehicleDetailPage = lazy(
  () => import("@/features/vehicles/pages/VehicleDetailPage"),
);

const MaintenancePage = lazy(
  () => import("@/features/maintenance/pages/MaintenancePage"),
);

const InventoryPage = lazy(
  () => import("@/features/inventory/pages/InventoryPage"),
);

const InventoryMaterialsPage = lazy(
  () => import("@/features/inventory/pages/InventoryMaterialsPage"),
);

const InventoryMovementsPage = lazy(
  () => import("@/features/inventory/pages/InventoryMovementsPage"),
);

const SettingsPage = lazy(
  () => import("@/features/settings/pages/SettingsPage"),
);
const InventorySettingsPage = lazy(
  () => import("@/features/settings/pages/InventorySettingsPage"),
);
const VehicleSettingsPage = lazy(
  () => import("@/features/settings/pages/VehicleSettingsPage"),
);
const MaintenanceProceduresSettingsPage = lazy(
  () => import("@/features/settings/pages/MaintenanceProceduresSettingsPage"),
);
const FuelSettingsPage = lazy(
  () => import("@/features/settings/pages/FuelSettingsPage"),
);
const EquipmentModelsSettingsPage = lazy(
  () => import("@/features/settings/pages/EquipmentModelsSettingsPage"),
);
const EquipmentUnitsSettingsPage = lazy(
  () => import("@/features/settings/pages/EquipmentUnitsSettingsPage"),
);
const AccessSettingsPage = lazy(
  () => import("@/features/settings/pages/AccessSettingsPage"),
);
const EmployeesSettingsPage = lazy(
  () => import("@/features/settings/pages/EmployeesSettingsPage"),
);
const ProductsSettingsPage = lazy(
  () => import("@/features/settings/pages/ProductsSettingsPage"),
);
const EmailSettingsPage = lazy(
  () => import("@/features/settings/pages/EmailSettingsPage"),
);

const FuelPage = lazy(() => import("@/features/fuel/pages/FuelPage"));

const FuelHistoryPage = lazy(
  () => import("@/features/fuel/pages/FuelHistoryPage"),
);

const RefillsDetailPage = lazy(
  () => import("@/features/fuel/pages/RefillsDetailPage"),
);

const FuelMetricsPage = lazy(
  () => import("@/features/fuel/pages/FuelMetricsPages"),
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
        path: "/fuel",
        element: (
          <PermissionRoute minimumLevel={PermissionLevel.ADMINISTRATION}>
            <Outlet />
          </PermissionRoute>
        ),
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
          {
            path: "history",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="historial de combustible">
                  <FuelHistoryPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "refills",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="recargas de combustible">
                  <RefillsPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "refills/:id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="detalle de recarga">
                  <RefillsDetailPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "metrics",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="metricas de combustible">
                  <FuelMetricsPage />
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
              <PermissionRoute
                minimumLevel={PermissionLevel.ADVANCED_OPERATIONS}
              >
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="nuevo cliente">
                    <CreateCustomerPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
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
              <PermissionRoute
                minimumLevel={PermissionLevel.ADVANCED_OPERATIONS}
              >
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="editar pedido">
                    <EditOrderPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
            ),
          },
          {
            path: "new/:customerId?",
            element: (
              <PermissionRoute
                minimumLevel={PermissionLevel.ADVANCED_OPERATIONS}
              >
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="crear pedido">
                    <CreateOrderPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
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
        ],
      },
      {
        path: "/vehicles",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="vehículos">
                  <VehiclesPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="detalle del vehículo">
                  <VehicleDetailPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "create",
            element: <Navigate to="/settings/vehicles" replace />,
          },
        ],
      },
      {
        path: "/maintenance",
        element: (
          <PermissionRoute minimumLevel={PermissionLevel.SUPERVISION}>
            <Suspense fallback={<PageLoader />}>
              <PageErrorBoundary pageName="mantenimiento">
                <MaintenancePage />
              </PageErrorBoundary>
            </Suspense>
          </PermissionRoute>
        ),
      },
      {
        path: "/inventory",
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="inventario">
                  <InventoryPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "materials",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="materiales de inventario">
                  <InventoryMaterialsPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "movements",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="movimientos de inventario">
                  <InventoryMovementsPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "create",
            element: <Navigate to="/settings/equipment/units" replace />,
          },
        ],
      },
      {
        path: "/inventory/settings",
        element: <Navigate to="/settings/inventory" replace />,
      },
      {
        path: "/settings",
        element: (
          <PermissionRoute minimumLevel={PermissionLevel.ADVANCED_OPERATIONS}>
            <Outlet />
          </PermissionRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="configuración">
                  <SettingsPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "access",
            element: (
              <PermissionRoute minimumLevel={PermissionLevel.SYSTEM_ADMIN}>
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="usuarios y roles">
                    <AccessSettingsPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
            ),
          },
          {
            path: "employees",
            element: (
              <PermissionRoute minimumLevel={PermissionLevel.ADMINISTRATION}>
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="gestión de empleados">
                    <EmployeesSettingsPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
            ),
          },
          {
            path: "email",
            element: (
              <PermissionRoute minimumLevel={PermissionLevel.ADMINISTRATION}>
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="correo electrónico">
                    <EmailSettingsPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
            ),
          },
          {
            path: "products",
            element: (
              <PermissionRoute minimumLevel={PermissionLevel.ADVANCED_OPERATIONS}>
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="productos">
                    <ProductsSettingsPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
            ),
          },
          {
            path: "inventory",
            element: (
              <PermissionRoute minimumLevel={PermissionLevel.SUPERVISION}>
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="configuración de inventario">
                    <InventorySettingsPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
            ),
          },
          {
            path: "vehicles",
            element: (
              <PermissionRoute minimumLevel={PermissionLevel.SUPERVISION}>
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="registro de vehículos">
                    <VehicleSettingsPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
            ),
          },
          {
            path: "maintenance/procedures",
            element: (
              <PermissionRoute minimumLevel={PermissionLevel.SUPERVISION}>
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="procedimientos de mantenimiento">
                    <MaintenanceProceduresSettingsPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
            ),
          },
          {
            path: "fuel",
            element: (
              <PermissionRoute minimumLevel={PermissionLevel.ADMINISTRATION}>
                <Suspense fallback={<PageLoader />}>
                  <PageErrorBoundary pageName="configuración de tanque">
                    <FuelSettingsPage />
                  </PageErrorBoundary>
                </Suspense>
              </PermissionRoute>
            ),
          },
          {
            path: "equipment/models",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="modelos de equipo">
                  <EquipmentModelsSettingsPage />
                </PageErrorBoundary>
              </Suspense>
            ),
          },
          {
            path: "equipment/units",
            element: (
              <Suspense fallback={<PageLoader />}>
                <PageErrorBoundary pageName="generar equipos">
                  <EquipmentUnitsSettingsPage />
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
