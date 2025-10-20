# ERP React Desktop

> **Sistema de gestión empresarial (ERP) multiplataforma con Tauri + React + TypeScript**

Desktop application para gestión de pedidos, vehículos, inventario, clientes y empleados.

---

## 🚀 Quick Start

```bash
# Instalar dependencias
pnpm install

# Desarrollo web
pnpm dev

# Desarrollo desktop (Tauri)
pnpm tauri dev

# Build para producción
pnpm tauri build
```

---

## 📚 Documentación

### Para Desarrolladores

| Documento                                                       | Descripción                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| **[PROJECT_GUIDE.md](./docs/PROJECT_GUIDE.md)**                 | 📖 Guía completa del proyecto: arquitectura, convenciones, patrones |
| **[DEVELOPMENT_CHECKLIST.md](./docs/DEVELOPMENT_CHECKLIST.md)** | ✅ Checklist y templates rápidos para desarrollo                    |
| **[API_REFERENCE.md](./docs/API_REFERENCE.md)**                 | 🔌 Referencia de endpoints y contratos del backend                  |
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**                   | 🏗️ Decisiones de arquitectura y diseño técnico                      |

### Lectura Recomendada

1. **Nuevo en el proyecto**: Empieza con [PROJECT_GUIDE.md](./docs/PROJECT_GUIDE.md)
2. **Implementar feature**: Usa [DEVELOPMENT_CHECKLIST.md](./docs/DEVELOPMENT_CHECKLIST.md)
3. **Integrar con API**: Consulta [API_REFERENCE.md](./docs/API_REFERENCE.md)
4. **Decisiones técnicas**: Revisa [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 🛠 Stack Tecnológico

### Core

- **Tauri v2**: Desktop wrapper multiplataforma
- **React 19**: UI library
- **TypeScript 5.8**: Type safety
- **Vite 7**: Build tool y dev server

### Estado y Data

- **Zustand 5**: Estado global con persistencia
- **React Query 5**: Data fetching, caching y sincronización
- **React Hook Form 7**: Gestión de formularios
- **Zod 4**: Validación de esquemas

### UI

- **TailwindCSS 4**: Utility-first CSS
- **React Router DOM 7**: Routing con lazy loading

### Comunicación

- **Axios 1.12**: HTTP client con interceptores

---

## 📁 Estructura del Proyecto

```
erp-react-desktop/
├── src/
│   ├── app/                 # ⚙️ Configuración (App.tsx, router, ProtectedRoute)
│   ├── features/            # 🎯 Módulos por dominio (auth, orders, vehicles...)
│   │   └── [modulo]/
│   │       ├── api/         # Services de API
│   │       ├── components/  # Componentes del módulo
│   │       ├── hooks/       # Custom hooks
│   │       ├── pages/       # Páginas del módulo
│   │       ├── schemas/     # Validación Zod
│   │       └── types/       # Tipos específicos
│   ├── shared/              # 🔄 Código compartido
│   │   ├── api/            # Axios client
│   │   ├── components/     # Componentes reutilizables
│   │   ├── hooks/          # Hooks genéricos
│   │   ├── lib/            # Configuración de librerías
│   │   ├── stores/         # Zustand stores
│   │   ├── types/          # Tipos compartidos
│   │   └── utils/          # Utilidades
│   ├── assets/             # Assets estáticos
│   └── styles/             # Estilos globales
├── src-tauri/              # Código Rust de Tauri
├── docs/                   # 📚 Documentación
└── public/                 # Assets públicos
```

Ver [PROJECT_GUIDE.md](./docs/PROJECT_GUIDE.md) para detalles completos.

---

## 🔐 Sistema de Autenticación

- JWT con refresh tokens automáticos
- Duración: Access token (15 min), Refresh token (7 días)
- Refresh automático mediante interceptores de Axios
- Persistencia en localStorage con Zustand

Ver implementación en [PROJECT_GUIDE.md - Sistema de Autenticación](./docs/PROJECT_GUIDE.md#-sistema-de-autenticación)

---

## 🎯 Features Principales

### Implementados

- ✅ Autenticación con JWT + Refresh Tokens
- ✅ Routing protegido con lazy loading
- ✅ Sistema de gestión de estado (Zustand + React Query)
- ✅ API client con interceptores y manejo de errores
- ✅ Componentes base compartidos
- ✅ Validación de formularios (React Hook Form + Zod)

### En Desarrollo

- 🚧 Módulo de Pedidos (Orders)
- 🚧 Módulo de Vehículos
- 🚧 Módulo de Inventario
- 🚧 Dashboard con métricas
- 🚧 Sistema de reportes

Ver roadmap completo en [ARCHITECTURE.md - Próximos Pasos](./docs/ARCHITECTURE.md#próximos-pasos)

---

## 🔧 Comandos Disponibles

```bash
# Desarrollo
pnpm dev                 # Servidor de desarrollo web (puerto 1420)
pnpm tauri dev           # App desktop con hot reload

# Build
pnpm build               # Build web
pnpm tauri build         # Build desktop (Windows/Linux/macOS)

# Calidad de código
pnpm lint               # Linter
pnpm tsc --noEmit       # Type checking

# Testing (próximamente)
pnpm test               # Run tests
pnpm test:watch         # Tests en watch mode
```

---

## 🌍 Variables de Entorno

```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api
```

Ver `.env.example` para más configuraciones.

---

## 📦 Integración con Backend

Este frontend se conecta a la API ubicada en:

```
C:\Workspace\erp-clean-architecture-api
```

La API usa Clean Architecture con Node.js + TypeScript + Prisma.

Ver endpoints disponibles en [API_REFERENCE.md](./docs/API_REFERENCE.md)

---

## 🤝 Convenciones de Desarrollo

### Nomenclatura

- **Componentes**: PascalCase (`OrderCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.ts`)
- **Services**: camelCase con sufijo `.service` (`auth.service.ts`)
- **Types**: camelCase con sufijo `.types` (`order.types.ts`)

### Imports

```typescript
// 1. React y librerías externas
import { useState } from "react";

// 2. Shared (alias @)
import { Button } from "@/shared/components";

// 3. Feature-local (relativo)
import { useOrders } from "../hooks/useOrders";
```

Ver convenciones completas en [PROJECT_GUIDE.md - Convenciones](./docs/PROJECT_GUIDE.md#-convenciones-de-código)

---

## 🧪 Testing (Próximamente)

```bash
pnpm test
```

---

## 📝 Contribuir

1. Lee [PROJECT_GUIDE.md](./docs/PROJECT_GUIDE.md) para entender la arquitectura
2. Usa [DEVELOPMENT_CHECKLIST.md](./docs/DEVELOPMENT_CHECKLIST.md) como referencia
3. Sigue las convenciones de nomenclatura y estructura
4. Crea PR con descripción clara

---

## 📄 Licencia

Propietario - Uso interno

---

## 🔗 Enlaces

- **Backend**: `https://github.com/JDLSantos21/erp-clean-architecture-api`
- **Mobile**: (próximamente)

---

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

---

**Última actualización**: 20 de octubre de 2025
