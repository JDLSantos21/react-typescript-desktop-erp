# Arquitectura Frontend - ERP React Desktop

> **Documento técnico de arquitectura y decisiones de diseño**  
> Relacionado: [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) | [DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md)

---

## Stack Tecnológico

- **Tauri**: Desktop wrapper
- **React 19 + TypeScript**: UI library
- **TailwindCSS 4**: Styling
- **Zustand**: Estado global
- **React Query**: Data fetching y cache
- **React Router DOM**: Routing
- **React Hook Form + Zod**: Formularios y validación
- **Axios**: HTTP client

## Estructura del Proyecto

```
src/
├── app/                    # Configuración de la aplicación
│   ├── App.tsx            # Entry point con providers
│   ├── router.tsx         # Configuración de rutas
│   └── ProtectedRoute.tsx # HOC para rutas protegidas
│
├── features/              # Módulos por dominio (feature-based)
│   ├── auth/
│   │   ├── api/          # Services de API
│   │   ├── components/   # Componentes específicos
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Páginas del módulo
│   │   └── types/        # Tipos específicos
│   │
│   ├── orders/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── types/
│   │
│   └── [otros módulos...]
│
├── shared/                # Código compartido
│   ├── api/
│   │   └── client.ts     # Axios instance con interceptores
│   ├── components/       # Componentes reutilizables
│   ├── hooks/           # Hooks reutilizables
│   ├── lib/             # Librerías configuradas
│   ├── stores/          # Zustand stores globales
│   ├── types/           # Tipos compartidos
│   └── utils/           # Utilidades
│
├── assets/              # Assets estáticos
└── styles/             # Estilos globales
```

## Patrones Implementados

### 1. Feature-Based Architecture

Cada módulo de negocio (orders, vehicles, inventory) es autónomo con su propia estructura interna.

### 2. API Client con Interceptores

- Inyección automática de JWT
- Manejo de refresh tokens
- Redirección automática en 401

### 3. Estado Global (Zustand)

- Persistencia automática con localStorage
- Store para autenticación

### 4. Data Fetching (React Query)

- Cache inteligente (5 min staleTime)
- Retry automático en queries
- Invalidación optimista en mutations

### 5. Routing Protegido

- Rutas públicas vs privadas
- Lazy loading de páginas
- Redirección automática

## Próximos Pasos

1. **Implementar módulo Orders**

   - CRUD completo
   - Filtros y paginación
   - Integración con API

2. **Componentes compartidos avanzados**

   - Modal
   - Table con paginación
   - ErrorBoundary
   - Toast notifications

3. **Formularios con React Hook Form + Zod**

   - Esquemas de validación
   - Error handling
   - Submit con React Query

4. **Layouts**
   - Sidebar navigation
   - Header con user menu
   - Breadcrumbs

---

## Documentación Relacionada

- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)**: Guía completa del proyecto con convenciones, patrones y estructura detallada
- **[DEVELOPMENT_CHECKLIST.md](./DEVELOPMENT_CHECKLIST.md)**: Checklist y templates rápidos para desarrollo

---

## Comandos

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Tauri dev (desktop)
pnpm tauri dev

# Tauri build
pnpm tauri build
```
