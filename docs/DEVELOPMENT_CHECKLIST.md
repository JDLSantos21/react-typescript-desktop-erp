# 🎯 Checklist de Desarrollo - ERP React Desktop

> **Guía rápida para implementar nuevas features**

---

## ✅ Crear un Nuevo Módulo/Feature

### 1. Crear Estructura de Carpetas

```bash
src/features/[nombre-modulo]/
├── api/
│   └── [modulo].service.ts
├── components/
├── hooks/
├── pages/
├── schemas/
└── types/
    └── [modulo].types.ts
```

### 2. Definir Tipos

```typescript
// src/features/[modulo]/types/[modulo].types.ts

// Entidad principal del backend
export interface ModuloEntity {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// DTO para crear
export interface CreateModuloDto {
  name: string;
}

// DTO para actualizar
export interface UpdateModuloDto {
  name?: string;
}

// Filtros de búsqueda
export interface ModuloFilters {
  search?: string;
  page?: number;
  limit?: number;
}
```

### 3. Crear Service API

```typescript
// src/features/[modulo]/api/[modulo].service.ts

import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import {
  ModuloEntity,
  CreateModuloDto,
  UpdateModuloDto,
  ModuloFilters,
} from "../types/[modulo].types";

export const moduloService = {
  fetchAll: async (
    filters?: ModuloFilters
  ): Promise<PaginatedResponse<ModuloEntity>> => {
    const { data } = await apiClient.get<PaginatedResponse<ModuloEntity>>(
      "/[modulo]",
      { params: filters }
    );
    return data;
  },

  fetchById: async (id: number): Promise<ApiResponse<ModuloEntity>> => {
    const { data } = await apiClient.get<ApiResponse<ModuloEntity>>(
      `/[modulo]/${id}`
    );
    return data;
  },

  create: async (dto: CreateModuloDto): Promise<ApiResponse<ModuloEntity>> => {
    const { data } = await apiClient.post<ApiResponse<ModuloEntity>>(
      "/[modulo]",
      dto
    );
    return data;
  },

  update: async (
    id: number,
    dto: UpdateModuloDto
  ): Promise<ApiResponse<ModuloEntity>> => {
    const { data } = await apiClient.put<ApiResponse<ModuloEntity>>(
      `/[modulo]/${id}`,
      dto
    );
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/[modulo]/${id}`);
  },
};
```

### 4. Crear Hooks de React Query

```typescript
// src/features/[modulo]/hooks/useModulo.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { moduloService } from "../api/[modulo].service";
import {
  ModuloFilters,
  CreateModuloDto,
  UpdateModuloDto,
} from "../types/[modulo].types";

// Query Key Factory
const moduloKeys = {
  all: ["modulo"] as const,
  lists: () => [...moduloKeys.all, "list"] as const,
  list: (filters?: ModuloFilters) => [...moduloKeys.lists(), filters] as const,
  details: () => [...moduloKeys.all, "detail"] as const,
  detail: (id: number) => [...moduloKeys.details(), id] as const,
};

// Hook para lista
export const useModulos = (filters?: ModuloFilters) => {
  return useQuery({
    queryKey: moduloKeys.list(filters),
    queryFn: () => moduloService.fetchAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para detalle
export const useModuloDetail = (id: number) => {
  return useQuery({
    queryKey: moduloKeys.detail(id),
    queryFn: () => moduloService.fetchById(id),
    enabled: !!id,
  });
};

// Hook para crear
export const useCreateModulo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateModuloDto) => moduloService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduloKeys.lists() });
    },
  });
};

// Hook para actualizar
export const useUpdateModulo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateModuloDto }) =>
      moduloService.update(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: moduloKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: moduloKeys.lists() });
    },
  });
};

// Hook para eliminar
export const useDeleteModulo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => moduloService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduloKeys.lists() });
    },
  });
};
```

### 5. Crear Schema de Validación

```typescript
// src/features/[modulo]/schemas/[modulo]Schema.ts

import { z } from "zod";

export const createModuloSchema = z.object({
  name: z
    .string()
    .min(3, "Nombre debe tener al menos 3 caracteres")
    .max(100, "Nombre no puede exceder 100 caracteres"),
});

export const updateModuloSchema = z.object({
  name: z
    .string()
    .min(3, "Nombre debe tener al menos 3 caracteres")
    .max(100, "Nombre no puede exceder 100 caracteres")
    .optional(),
});

export type CreateModuloFormData = z.infer<typeof createModuloSchema>;
export type UpdateModuloFormData = z.infer<typeof updateModuloSchema>;
```

### 6. Crear Componentes

```typescript
// src/features/[modulo]/components/ModuloCard.tsx

import { ModuloEntity } from "../types/[modulo].types";
import { Card } from "@/shared/components";

interface ModuloCardProps {
  modulo: ModuloEntity;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const ModuloCard = ({ modulo, onEdit, onDelete }: ModuloCardProps) => {
  return (
    <Card>
      <h3>{modulo.name}</h3>
      <p>ID: {modulo.id}</p>
      <div>
        <button onClick={() => onEdit?.(modulo.id)}>Editar</button>
        <button onClick={() => onDelete?.(modulo.id)}>Eliminar</button>
      </div>
    </Card>
  );
};
```

### 7. Crear Páginas

```typescript
// src/features/[modulo]/pages/ModulosListPage.tsx

import { useState } from "react";
import { useModulos } from "../hooks/useModulo";
import { ModuloCard } from "../components/ModuloCard";
import { LoadingSpinner } from "@/shared/components";

export const Component = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useModulos({ search });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Lista de Módulos</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar..."
      />
      <div>
        {data?.data.map((modulo) => (
          <ModuloCard key={modulo.id} modulo={modulo} />
        ))}
      </div>
    </div>
  );
};
```

### 8. Agregar Rutas

```typescript
// src/app/router.tsx

import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/[modulo]",
    children: [
      {
        index: true,
        lazy: () => import("@/features/[modulo]/pages/ModulosListPage"),
      },
      {
        path: "create",
        lazy: () => import("@/features/[modulo]/pages/CreateModuloPage"),
      },
      {
        path: ":id",
        lazy: () => import("@/features/[modulo]/pages/ModuloDetailPage"),
      },
    ],
  },
]);
```

---

## ✅ Crear Componente Compartido

### Ubicación

```
src/shared/components/[ComponentName].tsx
```

### Template

```typescript
// src/shared/components/MyComponent.tsx

import { ReactNode } from "react";

interface MyComponentProps {
  children?: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}

export const MyComponent = ({
  children,
  variant = "primary",
  className = "",
  onClick,
}: MyComponentProps) => {
  const baseStyles = "base-class";
  const variantStyles = {
    primary: "primary-class",
    secondary: "secondary-class",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
```

### Exportar en index

```typescript
// src/shared/components/index.ts

export { MyComponent } from "./MyComponent";
export { Button } from "./Button";
export { Input } from "./Input";
// ...
```

---

## ✅ Crear Custom Hook

### Ubicación

```
src/shared/hooks/[useHookName].ts
```

### Template

```typescript
// src/shared/hooks/useDebounce.ts

import { useState, useEffect } from "react";

/**
 * Hook para debounce de valores
 * @param value - Valor a hacer debounce
 * @param delay - Delay en milisegundos
 * @returns Valor con debounce aplicado
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Uso:
// const debouncedSearch = useDebounce(searchTerm, 500);
```

---

## ✅ Agregar Nueva Entidad al Backend

### 1. Verificar endpoint en API

```bash
# Verificar que existe en:
erp-clean-architecture-api/src/presentation/[modulo]/routes.ts
```

### 2. Crear tipos basados en la entidad del backend

```typescript
// Copiar estructura de:
erp -
  clean -
  architecture -
  api / src / domain / entities / [modulo] / [Entity].ts;

// Y crear en frontend:
src / shared / types / entities / [modulo].types.ts;
```

### 3. Verificar DTOs del backend

```typescript
// Ver en:
erp-clean-architecture-api/src/domain/dtos/[modulo]/

// Y crear schemas de validación equivalentes con Zod
src/features/[modulo]/schemas/[modulo]Schema.ts
```

---

## ✅ Manejar Errores

### En Queries

```typescript
const MyComponent = () => {
  const { data, isLoading, error, isError } = useModulos();

  if (isError) {
    return (
      <div className="error">
        <h3>Error al cargar datos</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Reintentar</button>
      </div>
    );
  }

  // ...
};
```

### En Mutations

```typescript
const MyComponent = () => {
  const createModulo = useCreateModulo();

  const handleSubmit = async (data: CreateModuloDto) => {
    try {
      await createModulo.mutateAsync(data);
      // Éxito
      toast.success("Creado exitosamente");
    } catch (error) {
      // Error
      toast.error("Error al crear");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      {createModulo.isError && (
        <p className="error">{createModulo.error.message}</p>
      )}
    </form>
  );
};
```

---

## ✅ Optimistic Updates

Para mejor UX, actualiza la UI antes de la respuesta del servidor:

```typescript
export const useUpdateModulo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateModuloDto }) =>
      moduloService.update(id, dto),

    // Optimistic update
    onMutate: async ({ id, dto }) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: moduloKeys.detail(id) });

      // Snapshot del valor anterior
      const previousModulo = queryClient.getQueryData(moduloKeys.detail(id));

      // Actualizar cache optimistamente
      queryClient.setQueryData(moduloKeys.detail(id), (old: any) => ({
        ...old,
        data: { ...old.data, ...dto },
      }));

      // Retornar context para rollback
      return { previousModulo };
    },

    // En caso de error, hacer rollback
    onError: (err, { id }, context) => {
      queryClient.setQueryData(moduloKeys.detail(id), context?.previousModulo);
    },

    // Siempre refetch al final
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: moduloKeys.detail(id) });
    },
  });
};
```

---

## ✅ Paginación

### Backend

Verifica que el endpoint soporte paginación:

```
GET /api/modulo?page=1&limit=10
```

### Frontend

```typescript
// Hook con paginación
export const useModulos = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: moduloKeys.list({ page, limit }),
    queryFn: () => moduloService.fetchAll({ page, limit }),
    keepPreviousData: true, // Mantener data anterior mientras carga
  });
};

// Componente
const ModulosList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isPreviousData } = useModulos(page);

  return (
    <div>
      {/* Lista */}
      {data?.data.map((item) => (
        <ModuloCard key={item.id} modulo={item} />
      ))}

      {/* Paginación */}
      <div>
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>
          Página {page} de {data?.meta.pagination.totalPages}
        </span>
        <button
          onClick={() => setPage((old) => old + 1)}
          disabled={page === data?.meta.pagination.totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
```

---

## ✅ Filtros y Búsqueda

```typescript
const ModulosList = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
  });

  // Debounce para búsqueda
  const debouncedSearch = useDebounce(filters.search, 500);

  const { data } = useModulos({
    ...filters,
    search: debouncedSearch,
  });

  return (
    <div>
      <input
        type="text"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        placeholder="Buscar..."
      />

      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">Todos</option>
        <option value="ACTIVE">Activo</option>
        <option value="INACTIVE">Inactivo</option>
      </select>

      {/* Lista */}
    </div>
  );
};
```

---

## 🎨 Estilos con TailwindCSS

### Clases Comunes

```typescript
// Contenedor principal
<div className="container mx-auto px-4 py-8">

// Card
<div className="bg-white rounded-lg shadow-md p-6">

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Button primario
<button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">

// Input
<input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

// Loading spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
```

---

## 📝 Checklist de PR

Antes de hacer pull request:

- [ ] Código sigue convenciones de nomenclatura
- [ ] No hay console.log() en producción
- [ ] Errores manejados correctamente
- [ ] Loading states implementados
- [ ] Tipos TypeScript completos (no `any`)
- [ ] Componentes tienen PropTypes/interfaces
- [ ] Código formateado (prettier)
- [ ] No hay warnings en consola
- [ ] Tested en dev environment
- [ ] Variables de entorno documentadas en .env.example

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Tauri dev (desktop)
pnpm tauri dev

# Tauri build
pnpm tauri build

# Lint
pnpm lint

# Type check
pnpm tsc --noEmit
```

---

## 📚 Links Rápidos

- [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) - Guía completa del proyecto
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentación de arquitectura
- [Backend API](../erp-clean-architecture-api/) - Código del backend
