# 📚 ERP React Desktop - Guía del Proyecto

> **Documento de referencia para arquitectura, convenciones y mejores prácticas**  
> Última actualización: 20 de octubre de 2025

---

## 📋 Índice

1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Convenciones de Código](#convenciones-de-código)
5. [Gestión de Estado](#gestión-de-estado)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [API Integration](#api-integration)
8. [Formularios y Validación](#formularios-y-validación)
9. [Routing y Navegación](#routing-y-navegación)
10. [Patrones y Mejores Prácticas](#patrones-y-mejores-prácticas)
11. [Testing](#testing)
12. [Deployment](#deployment)

---

## 🛠 Stack Tecnológico

### Core

- **Tauri v2**: Desktop wrapper multiplataforma
- **React 19**: UI library con Server Components
- **TypeScript 5.8**: Type safety
- **Vite 7**: Build tool y dev server

### Estado y Data Fetching

- **Zustand 5**: Estado global ligero con persistencia
- **React Query (TanStack Query) 5**: Data fetching, caching y sincronización servidor
- **React Hook Form 7**: Gestión de formularios
- **Zod 4**: Validación de esquemas

### UI y Styling

- **TailwindCSS 4**: Utility-first CSS framework
- **React Router DOM 7**: Routing con lazy loading

### Comunicación

- **Axios 1.12**: HTTP client con interceptores

---

## 🏗 Arquitectura del Proyecto

### Principio: Feature-Based Architecture

El proyecto sigue una arquitectura modular orientada a **features/dominios**, donde cada módulo es autónomo y contiene todo lo relacionado a una funcionalidad específica.

```
Principios:
✅ Cohesión alta dentro de cada feature
✅ Bajo acoplamiento entre features
✅ Código compartido solo en /shared
✅ Separación clara de responsabilidades
```

### Clean Architecture Alignment

Este frontend se alinea con la Clean Architecture del backend:

| Backend Layer                    | Frontend Equivalente |
| -------------------------------- | -------------------- |
| Domain (entities, use cases)     | Types, Hooks         |
| Data (datasources, repositories) | API Services         |
| Presentation (controllers, DTOs) | Components, Pages    |

---

## 📁 Estructura de Carpetas

### Estructura Completa

```
erp-react-desktop/
├── src/
│   ├── app/                          # ⚙️ Configuración de la aplicación
│   │   ├── App.tsx                   # Entry point, providers
│   │   ├── router.tsx                # Configuración de rutas
│   │   └── ProtectedRoute.tsx        # HOC para rutas protegidas
│   │
│   ├── features/                     # 🎯 Módulos por dominio (FEATURE-BASED)
│   │   ├── auth/                     # Módulo de autenticación
│   │   │   ├── api/
│   │   │   │   └── auth.service.ts   # Llamadas a endpoints de auth
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── LogoutButton.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts        # useLogin, useLogout
│   │   │   ├── pages/
│   │   │   │   └── LoginPage.tsx
│   │   │   ├── schemas/
│   │   │   │   └── loginSchema.ts    # Zod schemas
│   │   │   └── types/
│   │   │       └── auth.types.ts     # Tipos específicos
│   │   │
│   │   ├── orders/                   # Módulo de pedidos
│   │   │   ├── api/
│   │   │   │   └── orders.service.ts
│   │   │   ├── components/
│   │   │   │   ├── OrderCard.tsx
│   │   │   │   ├── OrderFilters.tsx
│   │   │   │   └── OrderStatusBadge.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useOrders.ts      # useQuery para lista
│   │   │   │   ├── useCreateOrder.ts # useMutation
│   │   │   │   └── useOrderDetail.ts
│   │   │   ├── pages/
│   │   │   │   ├── OrdersListPage.tsx
│   │   │   │   ├── OrderDetailPage.tsx
│   │   │   │   └── CreateOrderPage.tsx
│   │   │   ├── schemas/
│   │   │   │   └── orderSchema.ts
│   │   │   └── types/
│   │   │       └── order.types.ts
│   │   │
│   │   ├── vehicles/                 # Módulo de vehículos
│   │   ├── inventory/                # Módulo de inventario
│   │   ├── customers/                # Módulo de clientes
│   │   └── dashboard/                # Dashboard principal
│   │
│   ├── shared/                       # 🔄 Código compartido transversal
│   │   ├── api/
│   │   │   └── client.ts             # Axios instance + interceptores
│   │   ├── components/               # Componentes reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── hooks/                    # Hooks genéricos
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── useMediaQuery.ts
│   │   ├── lib/                      # Librerías configuradas
│   │   │   └── query-client.ts       # React Query config
│   │   ├── stores/                   # Zustand stores globales
│   │   │   └── authStore.ts          # Estado de autenticación
│   │   ├── types/                    # Tipos compartidos
│   │   │   ├── api.types.ts          # ApiResponse, PaginatedResponse
│   │   │   └── entities/             # Entidades del dominio
│   │   │       ├── user.types.ts
│   │   │       ├── order.types.ts
│   │   │       └── vehicle.types.ts
│   │   └── utils/                    # Utilidades
│   │       ├── formatters.ts
│   │       ├── validators.ts
│   │       └── constants.ts
│   │
│   ├── assets/                       # Assets estáticos
│   │   ├── fonts/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── styles/                       # Estilos globales
│   │   └── globals.css
│   │
│   ├── main.tsx                      # Entry point de React
│   └── vite-env.d.ts                 # Tipos de Vite
│
├── src-tauri/                        # Código Rust de Tauri
├── public/                           # Assets públicos
├── .env                              # Variables de entorno
├── .env.example                      # Template de variables
├── vite.config.ts                    # Config de Vite
├── tsconfig.json                     # Config de TypeScript
├── tailwind.config.ts                # Config de TailwindCSS
├── package.json
├── ARCHITECTURE.md                   # Documentación de arquitectura
└── PROJECT_GUIDE.md                  # Este archivo
```

---

## 📝 Convenciones de Código

### Nomenclatura

#### Archivos y Carpetas

```typescript
// ✅ Componentes: PascalCase
LoginForm.tsx;
OrderCard.tsx;

// ✅ Hooks: camelCase con prefijo "use"
useAuth.ts;
useOrders.ts;

// ✅ Services: camelCase con sufijo ".service"
auth.service.ts;
orders.service.ts;

// ✅ Types: camelCase con sufijo ".types"
user.types.ts;
api.types.ts;

// ✅ Schemas: camelCase con sufijo "Schema"
loginSchema.ts;
orderSchema.ts;

// ✅ Stores: camelCase con sufijo "Store"
authStore.ts;
ordersStore.ts;

// ✅ Utils: camelCase
formatters.ts;
validators.ts;

// ✅ Pages: PascalCase con sufijo "Page"
LoginPage.tsx;
OrdersListPage.tsx;
```

#### Variables y Funciones

```typescript
// ✅ Variables: camelCase
const userName = "John";
const isAuthenticated = true;

// ✅ Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = "http://localhost:3000";
const MAX_RETRY_ATTEMPTS = 3;

// ✅ Funciones: camelCase
function handleSubmit() {}
const fetchUserData = async () => {};

// ✅ Componentes: PascalCase
const LoginForm = () => {};
export function OrderCard() {}

// ✅ Interfaces/Types: PascalCase
interface User {}
type OrderStatus = "PENDING" | "COMPLETED";
```

### Imports

Orden de imports:

```typescript
// 1. React y librerías externas
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// 2. Shared (con alias @)
import { Button, Card } from "@/shared/components";
import { useAuthStore } from "@/shared/stores/authStore";
import { ApiResponse } from "@/shared/types/api.types";

// 3. Feature-local (rutas relativas)
import { ordersService } from "../api/orders.service";
import { OrderCard } from "../components/OrderCard";
import { useOrders } from "../hooks/useOrders";

// 4. Estilos (si aplica)
import "./styles.css";
```

### Comentarios

```typescript
// ✅ JSDoc para funciones públicas
/**
 * Obtiene la lista de órdenes con filtros opcionales
 * @param filters - Objeto con filtros de búsqueda
 * @param pagination - Configuración de paginación
 * @returns Promise con lista de órdenes
 */
export const fetchOrders = async (
  filters?: OrderFilters,
  pagination?: Pagination
): Promise<ApiResponse<Order[]>> => {
  // Implementación...
};

// ✅ Comentarios inline para lógica compleja
// Verificar si el token expiró antes de hacer refresh
if (isTokenExpired(token)) {
  await refreshToken();
}

// ❌ Evitar comentarios obvios
// Set user to null
const user = null;
```

---

## 🗂 Gestión de Estado

### Zustand (Estado Global)

**Cuándo usar**: Estado que necesita compartirse entre múltiples componentes no relacionados.

```typescript
// src/shared/stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // State inicial
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      // Actions
      setAuth: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user, isAuthenticated: true }),

      updateTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // Nombre en localStorage
    }
  )
);

// Uso en componentes
const MyComponent = () => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return <button onClick={clearAuth}>Logout</button>;
};
```

### React Query (Server State)

**Cuándo usar**: Datos del servidor, sincronización, caché.

```typescript
// src/features/orders/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "../api/orders.service";

// Query para lista
export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: () => ordersService.fetchOrders(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Query para detalle
export const useOrderDetail = (orderId: number) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => ordersService.fetchOrderById(orderId),
    enabled: !!orderId, // Solo ejecutar si hay ID
  });
};

// Mutation para crear
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: () => {
      // Invalidar cache de lista
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

// Uso en componente
const OrdersList = () => {
  const { data, isLoading, error } = useOrders({ status: "PENDING" });
  const createOrder = useCreateOrder();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.data.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};
```

### Estado Local (useState)

**Cuándo usar**: Estado específico de un componente.

```typescript
const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  return <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
};
```

---

## 🔐 Sistema de Autenticación

### Flujo Completo

```
┌─────────────┐
│  LoginPage  │
└──────┬──────┘
       │
       ├─ useLogin() mutation
       │
       ├─ authService.login()
       │
       ├─ API: POST /auth/login
       │      { username, password }
       │
       ├─ Response: { accessToken, refreshToken, user }
       │
       ├─ authStore.setAuth()
       │      └─ Guarda en localStorage
       │
       └─ navigate("/dashboard")
```

### Token Refresh Automático

El interceptor de Axios maneja el refresh automáticamente:

```typescript
// src/shared/api/client.ts

1. Request falla con 401
2. Interceptor detecta el error
3. Si es /refresh-token → logout
4. Si ya intentó refresh → logout
5. Si hay refresh en progreso → encolar request
6. Intentar refresh:
   - Éxito: actualizar tokens, reintentar request
   - Fallo: logout y redirect a login
```

### Protección de Rutas

```typescript
// src/app/router.tsx

export const router = createBrowserRouter([
  {
    path: "/login",
    lazy: () => import("@/features/auth/pages/LoginPage"),
  },
  {
    element: <ProtectedRoute />, // 🔒 Wrapper protegido
    children: [
      {
        path: "/dashboard",
        lazy: () => import("@/features/dashboard/pages/DashboardPage"),
      },
      {
        path: "/orders",
        children: [
          {
            index: true,
            lazy: () => import("@/features/orders/pages/OrdersListPage"),
          },
          {
            path: ":id",
            lazy: () => import("@/features/orders/pages/OrderDetailPage"),
          },
        ],
      },
    ],
  },
]);
```

---

## 🌐 API Integration

### Estructura de Respuestas

Todas las respuestas de la API siguen este formato:

```typescript
// src/shared/types/api.types.ts

// Respuesta exitosa simple
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    path: string;
    method: HttpMethod;
  };
}

// Respuesta paginada
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    timestamp: string;
    path: string;
    method: HttpMethod;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Error
interface ApiError {
  success: false;
  error: {
    code: number;
    message: string;
  };
  meta: {
    timestamp: string;
    path: string;
    method: HttpMethod;
  };
}
```

### Services Pattern

Cada feature tiene su propio service:

```typescript
// src/features/orders/api/orders.service.ts

import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import { Order, CreateOrderDto, UpdateOrderDto } from "../types/order.types";

export const ordersService = {
  // GET /api/orders
  fetchOrders: async (
    filters?: OrderFilters
  ): Promise<PaginatedResponse<Order>> => {
    const { data } = await apiClient.get<PaginatedResponse<Order>>("/orders", {
      params: filters,
    });
    return data;
  },

  // GET /api/orders/:id
  fetchOrderById: async (id: number): Promise<ApiResponse<Order>> => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data;
  },

  // POST /api/orders
  createOrder: async (dto: CreateOrderDto): Promise<ApiResponse<Order>> => {
    const { data } = await apiClient.post<ApiResponse<Order>>("/orders", dto);
    return data;
  },

  // PUT /api/orders/:id
  updateOrder: async (
    id: number,
    dto: UpdateOrderDto
  ): Promise<ApiResponse<Order>> => {
    const { data } = await apiClient.put<ApiResponse<Order>>(
      `/orders/${id}`,
      dto
    );
    return data;
  },

  // DELETE /api/orders/:id
  deleteOrder: async (id: number): Promise<void> => {
    await apiClient.delete(`/orders/${id}`);
  },
};
```

---

## 📝 Formularios y Validación

### React Hook Form + Zod

```typescript
// 1. Definir schema Zod
// src/features/orders/schemas/orderSchema.ts
import { z } from "zod";

export const createOrderSchema = z.object({
  customerId: z.string().uuid("ID de cliente inválido"),
  items: z
    .array(
      z.object({
        productId: z.number().positive(),
        quantity: z.number().min(1, "Cantidad mínima: 1"),
      })
    )
    .min(1, "Debe agregar al menos un producto"),
  scheduledDate: z.date().optional(),
  notes: z.string().max(500).optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;

// 2. Usar en componente
// src/features/orders/pages/CreateOrderPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderSchema, CreateOrderFormData } from "../schemas/orderSchema";

export const CreateOrderPage = () => {
  const createOrder = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
  });

  const onSubmit = async (data: CreateOrderFormData) => {
    await createOrder.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="ID Cliente"
        {...register("customerId")}
        error={errors.customerId?.message}
      />

      <Input
        label="Notas"
        {...register("notes")}
        error={errors.notes?.message}
      />

      <Button type="submit" isLoading={isSubmitting}>
        Crear Pedido
      </Button>
    </form>
  );
};
```

---

## 🧭 Routing y Navegación

### Lazy Loading

Todas las páginas usan lazy loading para code splitting:

```typescript
// src/app/router.tsx

const router = createBrowserRouter([
  {
    path: "/orders",
    children: [
      {
        index: true,
        lazy: () => import("@/features/orders/pages/OrdersListPage"),
      },
      {
        path: "create",
        lazy: () => import("@/features/orders/pages/CreateOrderPage"),
      },
      {
        path: ":id",
        lazy: () => import("@/features/orders/pages/OrderDetailPage"),
      },
    ],
  },
]);

// La página debe exportar Component
// src/features/orders/pages/OrdersListPage.tsx
export const Component = () => {
  return <div>Orders List</div>;
};
```

### Navegación Programática

```typescript
import { useNavigate } from "react-router-dom";

const MyComponent = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard");
    // O con state
    navigate("/orders/123", { state: { from: "dashboard" } });
  };

  return <button onClick={handleSuccess}>Go</button>;
};
```

---

## ⚡ Patrones y Mejores Prácticas

### 1. Custom Hooks Pattern

Encapsula lógica reutilizable:

```typescript
// src/shared/hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Uso
const MyComponent = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data } = useOrders({ search: debouncedSearch });
};
```

### 2. Compound Components Pattern

Para componentes complejos:

```typescript
// src/shared/components/Card/Card.tsx
export const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="card">{children}</div>;
};

Card.Header = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-header">{children}</div>;
};

Card.Body = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-body">{children}</div>;
};

Card.Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="card-footer">{children}</div>;
};

// Uso
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>;
```

### 3. Error Boundaries

```typescript
// src/shared/components/ErrorBoundary.tsx
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }

    return this.props.children;
  }
}

// Uso en App.tsx
<ErrorBoundary fallback={<ErrorPage />}>
  <RouterProvider router={router} />
</ErrorBoundary>;
```

### 4. Loading States

```typescript
// Skeleton loading para mejor UX
const OrdersList = () => {
  const { data, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div>
        {[...Array(5)].map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return data?.data.map((order) => <OrderCard key={order.id} order={order} />);
};
```

---

## 🧪 Testing

### Estructura de Tests

```
src/
├── features/
│   └── orders/
│       ├── components/
│       │   ├── OrderCard.tsx
│       │   └── OrderCard.test.tsx
│       └── hooks/
│           ├── useOrders.ts
│           └── useOrders.test.ts
```

### Testing Library

```typescript
// src/features/orders/components/OrderCard.test.tsx
import { render, screen } from "@testing-library/react";
import { OrderCard } from "./OrderCard";

describe("OrderCard", () => {
  it("renders order information correctly", () => {
    const order = {
      id: 1,
      trackingCode: "ORD-001",
      status: "PENDING",
    };

    render(<OrderCard order={order} />);

    expect(screen.getByText("ORD-001")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
  });
});
```

---

## 🚀 Deployment

### Build para Producción

```bash
# Web build
pnpm build

# Tauri build (desktop)
pnpm tauri build
```

### Variables de Entorno

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_API_BASE_URL=https://api.example.com/api
```

---

## 📚 Recursos Adicionales

- [Documentación de Tauri](https://tauri.app/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [TailwindCSS](https://tailwindcss.com/)

---

## 🔄 Changelog

- **2025-10-20**: Documento inicial con arquitectura base, autenticación con refresh tokens
