# 🔌 Integración con Backend API - ERP

> **Referencia de endpoints y contratos de la API**  
> Backend actual ubicado en: `C:\w\erp-api`

---

## 📍 Base URL

```
Development: http://localhost:4000
```

---

## 🔐 Autenticación

### POST /auth/login

**Descripción**: Iniciar sesión y obtener tokens

**Request**:

```json
{
  "username": "string",
  "password": "string"
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "user": {
      "id": "uuid",
      "name": "string",
      "lastName": "string",
      "roles": ["ADMIN", "SUPERVISOR"]
    }
  },
  "meta": {
    "timestamp": "2025-10-20T12:00:00Z",
    "path": "/api/auth/login",
    "method": "POST"
  }
}
```

**Errores**:

- 400: Credenciales inválidas
- 401: Usuario o contraseña incorrectos

---

### POST /auth/refresh-token

**Descripción**: Renovar access token usando refresh token

**Request**:

```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response** (200):

```json
{
  "success": true,
  "data": {
    "accessToken": "nuevo_access_token",
    "refreshToken": "nuevo_refresh_token",
    "user": {
      "id": "uuid",
      "name": "string",
      "lastName": "string",
      "roles": ["ADMIN"]
    }
  }
}
```

**Nota**: El refresh token anterior se revoca automáticamente.

---

### POST /auth/logout

**Descripción**: Cerrar sesión y revocar tokens

**Headers**: `Authorization: Bearer <accessToken>`

**Request**:

```json
{
  "refreshToken": "eyJhbG..." // Opcional
}
```

**Response** (204): No Content

**Comportamiento**:

- Si envías `refreshToken`: revoca solo ese token
- Si no envías nada: revoca TODOS los tokens del usuario

---

### POST /auth/revoke-all

**Descripción**: Revocar todos los tokens del usuario (cerrar sesión en todos los dispositivos)

**Headers**: `Authorization: Bearer <accessToken>`

**Response** (204): No Content

---

### GET /auth/active-tokens

**Descripción**: Listar tokens activos del usuario

**Headers**: `Authorization: Bearer <accessToken>`

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "deviceInfo": "Chrome on Windows",
      "createdAt": "2025-10-20T12:00:00Z",
      "expiresAt": "2025-10-27T12:00:00Z"
    }
  ]
}
```

---

### GET /auth

**Descripción**: Listar todos los usuarios (solo ADMIN)

**Headers**: `Authorization: Bearer <accessToken>`

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "string",
      "name": "string",
      "lastName": "string",
      "roles": ["ADMIN"],
      "createdAt": "2025-10-20T12:00:00Z"
    }
  ]
}
```

---

### GET /auth/:id

**Descripción**: Obtener usuario por ID

**Headers**: `Authorization: Bearer <accessToken>`

**Response** (200):

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "string",
    "name": "string",
    "lastName": "string",
    "roles": ["ADMIN", "SUPERVISOR"],
    "createdAt": "2025-10-20T12:00:00Z",
    "updatedAt": "2025-10-20T12:00:00Z"
  }
}
```

---

## 📦 Pedidos (Orders)

### GET /order

**Descripción**: Listar pedidos con filtros y paginación

**Headers**: `Authorization: Bearer <accessToken>`

**Query Params**:

```
?page=1
&limit=10
&status=PENDIENTE|PREPARANDO|DESPACHADO|ENTREGADO|CANCELADO|DEVUELTO
&customerId=uuid
&assignedToId=uuid
&startDate=2025-10-01
&endDate=2025-10-31
&search=tracking_code_or_customer_name
```

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trackingCode": "ORD-001",
      "status": "PENDIENTE",
      "date": "2025-10-20T12:00:00Z",
      "scheduledDate": "2025-10-21T12:00:00Z",
      "deliveredDate": null,
      "notes": "Nota opcional",
      "deliveryNotes": null,
      "products": [
        {
          "id": 1,
          "name": "Producto A",
          "quantity": 10,
          "size": "50kg",
          "unit": "SACO"
        }
      ],
      "customer": {
        "id": "uuid",
        "businessName": "Empresa X",
        "representativeName": "Juan Pérez"
      },
      "address": {
        "id": 1,
        "branchName": "Sucursal Centro",
        "city": "Santa Cruz",
        "direction": "Av. Principal #123",
        "coordinates": {
          "latitude": -17.8145,
          "longitude": -63.156
        }
      },
      "phone": {
        "id": 1,
        "number": "+59177777777",
        "hasWhatsapp": true,
        "type": "MOBILE"
      },
      "assignedTo": {
        "id": "uuid",
        "name": "Carlos López"
      }
    }
  ],
  "meta": {
    "timestamp": "2025-10-20T12:00:00Z",
    "path": "/api/order",
    "method": "GET",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

---

### GET /order/:id

**Descripción**: Obtener detalle de un pedido

**Headers**: `Authorization: Bearer <accessToken>`

**Response** (200): Mismo formato que un item de la lista

---

### POST /order

**Descripción**: Crear nuevo pedido

**Headers**: `Authorization: Bearer <accessToken>`

**Request**:

```json
{
  "customerId": "uuid",
  "customerAddressId": 1,
  "products": [
    {
      "productId": 1,
      "requestedQuantity": 10
    },
    {
      "productId": 2,
      "requestedQuantity": 5
    }
  ],
  "scheduledDate": "2025-10-21T12:00:00Z", // Opcional
  "notes": "Nota opcional"
}
```

**Response** (201):

```json
{
  "success": true,
  "data": {
    // Mismo formato que GET /order/:id
  }
}
```

**Errores**:

- 400: Datos inválidos
- 404: Cliente o producto no encontrado

---

### PUT /order/:id

**Descripción**: Actualizar pedido

**Headers**: `Authorization: Bearer <accessToken>`

**Request**:

```json
{
  "customerAddressId": 2,
  "scheduledDate": "2025-10-22T12:00:00Z",
  "notes": "Nueva nota",
  "products": [
    {
      "productId": 1,
      "requestedQuantity": 15
    }
  ]
}
```

**Response** (200): Pedido actualizado

**Errores**:

- 404: Pedido no encontrado
- 400: No se puede editar pedido en estado ENTREGADO o CANCELADO

---

### PATCH /order/:id/status

**Descripción**: Actualizar solo el estado del pedido

**Headers**: `Authorization: Bearer <accessToken>`

**Request**:

```json
{
  "status": "PREPARANDO",
  "deliveryNotes": "Nota de entrega" // Requerido si status=ENTREGADO
}
```

**Response** (200): Pedido actualizado

**Validaciones de transición de estado**:

```
PENDIENTE → PREPARANDO, CANCELADO
PREPARANDO → DESPACHADO, CANCELADO
DESPACHADO → ENTREGADO, DEVUELTO
ENTREGADO → No permite cambios
CANCELADO → No permite cambios
DEVUELTO → No permite cambios
```

---

### PATCH /order/:id/assign

**Descripción**: Asignar pedido a un empleado

**Headers**: `Authorization: Bearer <accessToken>`

**Request**:

```json
{
  "employeeId": "uuid"
}
```

**Response** (200): Pedido actualizado

**Errores**:

- 400: El pedido debe estar PENDIENTE o PREPARANDO

---

### PATCH /order/:id/unassign

**Descripción**: Desasignar pedido de un empleado

**Headers**: `Authorization: Bearer <accessToken>`

**Response** (200): Pedido actualizado

---

## 🚗 Vehículos (Vehicles)

### GET /vehicles

**Descripción**: Listar vehículos

**Headers**: `Authorization: Bearer <accessToken>`

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "internalCode": "VEH-001",
      "brand": "Toyota",
      "model": "Hilux",
      "year": 2020,
      "licensePlate": "ABC-123",
      "status": "DISPONIBLE|EN_USO|MANTENIMIENTO|FUERA_DE_SERVICIO",
      "type": "CAMIONETA|CAMION|AUTOMOVIL",
      "fuelType": "DIESEL|GASOLINA|GAS|ELECTRICO",
      "isActive": true
    }
  ]
}
```

---

### POST /vehicles

**Descripción**: Crear vehículo

**Request**:

```json
{
  "brand": "Toyota",
  "model": "Hilux",
  "year": 2020,
  "licensePlate": "ABC-123",
  "type": "CAMIONETA",
  "fuelType": "DIESEL"
}
```

---

## 📦 Inventario (Inventory)

### GET /inventory/products

**Descripción**: Listar productos

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cemento Portland",
      "category": "CONSTRUCCION",
      "unit": "SACO",
      "size": "50kg",
      "currentStock": 500,
      "minStock": 100,
      "price": 45.5,
      "isActive": true
    }
  ]
}
```

---

## 👥 Clientes (Customers)

### GET /customers

**Descripción**: Listar clientes

**Response** (200):

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "businessName": "Empresa X S.R.L.",
      "representativeName": "Juan Pérez",
      "nit": "1234567890",
      "isActive": true,
      "addresses": [
        {
          "id": 1,
          "branchName": "Sucursal Centro",
          "city": "Santa Cruz",
          "direction": "Av. Principal #123",
          "latitude": -17.8145,
          "longitude": -63.156
        }
      ],
      "phones": [
        {
          "id": 1,
          "number": "+59177777777",
          "hasWhatsapp": true,
          "type": "MOBILE"
        }
      ]
    }
  ]
}
```

---

## 🔧 Manejo de Errores

### Formato de Error Estándar

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Descripción del error"
  },
  "meta": {
    "timestamp": "2025-10-20T12:00:00Z",
    "path": "/api/order",
    "method": "POST"
  }
}
```

### Códigos Comunes

| Código | Descripción                                   |
| ------ | --------------------------------------------- |
| 400    | Bad Request - Datos inválidos                 |
| 401    | Unauthorized - Token inválido o expirado      |
| 403    | Forbidden - Sin permisos                      |
| 404    | Not Found - Recurso no encontrado             |
| 409    | Conflict - Conflicto de datos (ej: duplicado) |
| 500    | Internal Server Error                         |

---

## 🛡️ Sistema de Roles

### Roles Disponibles

- **ADMIN**: Acceso total
- **ADMINISTRATIVO**: Gestión de pedidos, clientes, inventario
- **SUPERVISOR**: Visualización y supervisión
- **CHOFER**: Solo pedidos asignados
- **OPERADOR**: Operaciones básicas

### Endpoints Protegidos por Rol

| Endpoint                 | Roles Permitidos                  |
| ------------------------ | --------------------------------- |
| POST /auth/set-roles/:id | ADMIN                             |
| DELETE /order/:id        | ADMIN, ADMINISTRATIVO             |
| POST /vehicles           | ADMIN, ADMINISTRATIVO             |
| GET /reports/\*          | ADMIN, ADMINISTRATIVO, SUPERVISOR |

---

## 📊 Tipos Compartidos

### OrderStatus

```typescript
type OrderStatus =
  | "PENDIENTE"
  | "PREPARANDO"
  | "DESPACHADO"
  | "ENTREGADO"
  | "CANCELADO"
  | "DEVUELTO";
```

### VehicleStatus

```typescript
type VehicleStatus =
  | "DISPONIBLE"
  | "EN_USO"
  | "MANTENIMIENTO"
  | "FUERA_DE_SERVICIO";
```

### UserRole

```typescript
type UserRole =
  | "ADMIN"
  | "ADMINISTRATIVO"
  | "SUPERVISOR"
  | "CHOFER"
  | "OPERADOR";
```

---

## 🔄 Paginación y Filtros

Todos los endpoints de lista soportan:

```
?page=1              // Número de página (default: 1)
&limit=10            // Items por página (default: 10, max: 100)
&search=texto        // Búsqueda general
&sortBy=field        // Campo para ordenar
&sortOrder=asc|desc  // Orden ascendente/descendente
```

---

## 📝 Notas Importantes

1. **Tokens**:

   - Access token dura 15 minutos
   - Refresh token dura 7 días
   - Refresh automático implementado en axios interceptor

2. **Paginación**:

   - Máximo 100 items por página
   - Default: 10 items

3. **Fechas**:

   - Formato ISO 8601: `2025-10-20T12:00:00Z`
   - Timezone: UTC

4. **IDs**:

   - Usuarios: UUID v4
   - Otros recursos: Integer autoincremental

5. **Validación**:
   - Todos los endpoints validan datos con DTOs en el backend
   - Frontend debe validar con Zod antes de enviar

---

## 🔗 Referencias

- Backend Source: `C:\Workspace\erp-clean-architecture-api`
- Controllers: `src/presentation/[modulo]/controller.ts`
- Routes: `src/presentation/[modulo]/routes.ts`
- DTOs: `src/domain/dtos/[modulo]/`
- Entities: `src/domain/entities/[modulo]/`
# Aviso de migración

Este documento describe principalmente el contrato histórico de `erp-clean-architecture-api` y contiene rutas desactualizadas. Para el estado vigente de compatibilidad con NestJS, consulte [MIGRATION_STATUS.md](./MIGRATION_STATUS.md). Los contratos nuevos deben quedar respaldados por pruebas en `erp-api` antes de actualizar esta referencia.

---
