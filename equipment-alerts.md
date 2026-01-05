# Alertas de Clientes con Equipos sin Pedidos Recientes

## Descripción

Esta funcionalidad permite identificar clientes que tienen equipos asignados pero no han realizado pedidos de los productos correspondientes en un período de tiempo específico.

## Lógica de Negocio

### Equipos y Productos Esperados

- **NEVERA**: Los clientes deben pedir "Hielo en Funda"
- **ANAQUEL**: Los clientes deben pedir "Botellón de Agua" o variantes

### Flujo

1. Se identifican clientes con equipos asignados (activos por defecto)
2. Se verifica su historial de pedidos con estado "ENTREGADO"
3. Se calcula el tiempo desde el último pedido con productos esperados
4. Se genera una alerta si el tiempo excede el límite especificado

## Endpoint

### `GET /api/customers/equipment-alerts`

#### Parámetros Query

- `page` (number): Página actual (default: 1)
- `limit` (number): Resultados por página (default: 10)
- `daysWithoutOrder` (number): Días mínimos sin pedido para generar alerta
- `equipmentType` (string): Tipo de equipo ('ANAQUEL' | 'NEVERA')
- `equipmentStatus` (string): Estado del equipo ('ACTIVO', 'REMOVIDO', etc.)
- `customerName` (string): Filtrar por nombre del cliente
- `search` (string): Búsqueda general (nombre, RNC, representante)
- `includeInactiveEquipment` (boolean): Incluir equipos inactivos (default: false)

#### Ejemplo

```bash
GET /api/customers/equipment-alerts?page=1&limit=20&daysWithoutOrder=18&equipmentType=NEVERA
```

#### Response

```json
{
  "data": [
    {
      "id": "uuid-del-cliente",
      "businessName": "Empresa XYZ",
      "representativeName": "Juan Pérez",
      "rnc": "123456789",
      "email": "contacto@empresa.com",
      "primaryPhone": "809-555-1234",
      "primaryAddress": "Calle Principal #123",
      "equipmentAlerts": [
        {
          "id": 123,
          "serialNumber": "NV-001",
          "equipmentType": "NEVERA",
          "modelName": "Nevera Industrial 500L",
          "assignedAt": "2024-01-15T00:00:00.000Z",
          "deliveredAt": "2024-01-16T00:00:00.000Z",
          "status": "ACTIVO",
          "daysWithoutOrder": 25,
          "expectedProducts": ["Hielo en Funda"],
          "lastOrderWithExpectedProducts": "2024-12-01T00:00:00.000Z"
        }
      ],
      "lastOrderDate": "2024-12-10T00:00:00.000Z",
      "daysSinceLastOrder": 15,
      "totalOrders": 45
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

## Casos de Uso Típicos

### 1. Alertas para Seguimiento de Ventas

```bash
# Clientes con neveras que no piden hielo en 18 días
GET /api/customers/equipment-alerts?daysWithoutOrder=18&equipmentType=NEVERA
```

### 2. Alertas para Equipos en General

```bash
# Todos los clientes con equipos sin pedidos en 30 días
GET /api/customers/equipment-alerts?daysWithoutOrder=30
```

### 3. Clientes Específicos

```bash
# Buscar cliente específico con alertas
GET /api/customers/equipment-alerts?customerName=Empresa%20XYZ&daysWithoutOrder=15
```

## Arquitectura

La implementación sigue los principios de **Clean Architecture**:

- **Domain Layer**: DTOs, Use Cases, Repository Interfaces
- **Infrastructure Layer**: Repository Implementations, Datasources
- **Presentation Layer**: Controllers, Routes, Response DTOs

## Componentes Creados

1. **DTOs**:
   - `CustomerEquipmentQueryDTO`: Parámetros de consulta
   - `CustomerEquipmentAlertResponseDto`: Formato de respuesta

2. **Use Case**:
   - `FindCustomersWithEquipmentButNoRecentOrders`: Lógica de negocio

3. **Repository Method**:
   - `findCustomersWithEquipmentButNoRecentOrders`: Consulta compleja

4. **Controller & Route**:
   - `getCustomersWithEquipmentAlerts`: Endpoint REST

## Consideraciones

- Solo se consideran pedidos con estado "ENTREGADO"
- Los días se calculan desde la fecha del pedido entregado
- Se pueden incluir equipos inactivos si se especifica
- El filtro de productos es flexible (búsqueda por coincidencia parcial)