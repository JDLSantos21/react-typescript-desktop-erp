# Estado de migración a `erp-api`

Actualizado: 2026-08-23

## Objetivo actual

Hacer que `react-typescript-desktop-erp` funcione contra `erp-api` antes de rediseñar la interfaz o ampliar el producto. `erp-clean-architecture-api` se conserva como referencia funcional durante la migración, no como backend de producción.

## Fuentes de verdad

1. Reglas de negocio confirmadas por el usuario.
2. Contratos ejecutables y pruebas de `erp-api`.
3. Consumo real de API en el frontend.
4. Comportamiento del backend original, sólo cuando el contrato nuevo todavía no está definido.
5. Documentación histórica.

Convenciones establecidas:

- JSON y DTOs nuevos usan `camelCase`.
- `snake_case` queda restringido a nombres físicos de columnas SQL y contratos externos que lo exijan; no se usa en formularios, estado del frontend, query strings ni cuerpos HTTP propios.
- Instantes se almacenan y transmiten en UTC; fechas operativas sin hora usan `YYYY-MM-DD`. Los filtros de calendario se interpretan en la zona IANA enviada por el navegador. Ver `docs/TIMEZONE_STRATEGY.md`.
- La base de desarrollo fue migrada: 85 columnas temporales se convirtieron a `TIMESTAMPTZ` o `DATE` según su semántica. `DB_SYNCHRONIZE` queda desactivado.
- Las respuestas HTTP usan `{ success, data, meta }`; las listas paginadas agregan `meta.pagination`.
- La identidad del usuario se obtiene del JWT. Nunca se acepta `userId` del cuerpo para acciones autenticadas.
- Los seriales de equipos y códigos de rastreo se generan en el backend.
- Los permisos se validan siempre en el backend; el frontend sólo adapta navegación y acciones a las capacidades recibidas.

## Estado verificado

| Área | Estado | Evidencia / pendiente |
| --- | --- | --- |
| Build frontend | Pasa | `pnpm build`; advertencia por Node 20.18.1, Vite requiere 20.19+ o 22.12+ |
| Build NestJS | Pasa | `pnpm build` |
| Pruebas NestJS | Pasa | 7 suites, 22 pruebas |
| E2E NestJS básico | Pasa con alertas | Conecta a PostgreSQL; Redis reporta `ECONNRESET` y Jest detecta recursos abiertos |
| Backend original | No compila | Errores de tipos de parámetros Express; no se corregirá salvo que sea necesario para recuperar una regla de negocio |

## Compatibilidad por módulo

### Autenticación

- Login y respuesta de tokens usan el contrato NestJS actual.
- Refresh y logout del frontend ya envían `refreshToken`.
- Pendiente: prueba E2E real de login, rotación del refresh token, logout y expiración.
- Pendiente de producción: secretos obligatorios, política de cookies/tokens, rate limiting y auditoría de sesiones.

### Clientes

- DTOs principales, direcciones y teléfonos usan `camelCase` y coinciden con NestJS.
- Se corrigió `notes` en edición de cliente.
- El listado acepta `search` y `active`; la búsqueda general cubre negocio, representante, RNC, correo y teléfono. El frontend omite parámetros vacíos.
- Pendiente: pruebas de CRUD completas, reglas de dirección/teléfono principal y borrado/desactivación.

### Pedidos

- Crear pedido usa `customerAddressId` y DTOs anidados compatibles.
- El selector de fechas compartido y las listas usan `startDate/endDate` de extremo a extremo.
- Estado usa `PATCH /orders/:id/status` con `status` y `description` separados.
- Estadísticas rápidas usan `GET /orders/stats`.
- La identidad del creador y del usuario que cambia estado se pasa desde el JWT al servicio, fuera del DTO público.
- NestJS genera códigos de rastreo y `GET /orders/tracking/:trackingCode` ya está en un controlador público separado. La respuesta se limita a estado, fechas, productos e historial; excluye cliente, usuarios y notas internas.
- Las rutas autenticadas usan un mapeador de respuesta explícito compatible con el frontend (`date`, `products`, `address`, `phone`, `customer`, `assignedTo`). Ya no devuelven directamente la entidad TypeORM.
- Los eventos WebSocket de pedidos usan el mismo mapeador seguro y no publican la entidad ni credenciales de usuarios relacionados.
- El frontend distingue el contrato público de rastreo del contrato interno de pedido y tolera direcciones, teléfonos o asignaciones ausentes.
- Antes de exponer el rastreo en Internet faltan rate limiting, monitoreo y una política explícita contra enumeración de códigos.
- No se encontró envío de correo implementado en ninguno de los dos backends. Debe añadirse mediante eventos/outbox para que crear un pedido no dependa de la disponibilidad del proveedor de correo.

### Equipos

- El backend vuelve a generar seriales con formato `ANQ|NEV|EQP-AÑO-####`, como hacía el backend original.
- El frontend sólo envía `modelId`; el backend devuelve también la relación `model` necesaria para el comprobante y la etiqueta.
- Las rutas estáticas (`models`, `reports`) se registran antes de `:id` y una prueba HTTP protege ese orden.
- Asignación, desasignación, solicitudes y reportes obtienen la identidad desde el JWT, fuera de los DTOs públicos.
- Pendiente: prueba de integración con base de datos para colisiones concurrentes y flujo crear-imprimir-asignar-desasignar.

### Combustible

- La portada y las métricas consumen el contrato unificado `GET /fuel/dashboard`.
- Se eliminó la dependencia de la ruta legacy inexistente `/fuel/dashboard/summary`.
- `alertThreshold` ya usa el nombre aceptado por NestJS.
- Registro de consumo usa `vehicleId`, `driverId`, `tankRefillId`, `consumedAt` y `vehicleType`; los valores del tipo son `VEHICLE` y `PLANT`.
- Registro de recarga usa `pricePerGallon`.
- Los filtros de consumos y recargas usan DTOs camelCase validados. Los rangos `startDate/endDate` ya se aplican realmente en SQL y los filtros vacíos se normalizan sin producir `400`.
- El dashboard responde aun cuando el tanque no está configurado e informa `tankConfigured: false`; el frontend muestra ese estado y deshabilita registrar consumos. La capacidad y el nivel deben configurarse explícitamente, nunca suponerse.
- Pendiente: validar consultas SQL con datos reales, rangos de fechas, zona horaria y tanque sin configuración.

### Empleados y vehículos

- Los servicios básicos de listado existen en frontend y backend.
- Pendiente: validación E2E de filtros y paginación.
- El sidebar enlaza a `/vehicles`, pero el router no define esa pantalla; actualmente termina en la redirección global.

### Inventario y mantenimiento

- NestJS contiene módulos de inventario y mantenimiento.
- Los contratos públicos de mantenimiento ya usan `vehicleId`, `scheduledDate`, `dateFrom`, `dateTo`, `sortBy` y `sortOrder`; los filtros están validados y el ordenamiento está limitado a columnas permitidas.
- El frontend no tiene rutas funcionales para estos módulos; `/inventory` aparece en el sidebar pero cae en la redirección global.
- Se consideran migración incompleta, no trabajo de rediseño.

## Prioridad de ejecución

### P0 — Aplicación funcional

1. Crear una suite E2E autenticada contra una base de prueba aislada.
2. Validar flujos verticales en este orden: auth, clientes, pedidos, equipos, combustible, empleados/vehículos, inventario/mantenimiento.
3. Corregir rutas muertas del sidebar: implementar el módulo o no mostrarlo hasta que exista.
4. Crear la superficie web pública de rastreo y protegerla con rate limiting; no debe formar parte del shell autenticado del ERP.
5. Implementar correo de pedido mediante cola/outbox, reintentos e idempotencia.
6. Definir migraciones y seed reproducibles; no depender de `synchronize` en producción.

### P1 — Preparación para producción

1. Resolver Redis y los recursos abiertos al apagar NestJS.
2. Fijar Node 22 LTS para desarrollo y CI.
3. Añadir CI: formato, lint sin autoescritura, build, unitarias, integración y E2E.
4. Revisar CORS, Helmet, rate limiting, secretos, logs sin datos sensibles, health checks y backups.
5. Añadir trazabilidad: request ID, auditoría de acciones y monitoreo de trabajos/colas.
6. Reducir el bundle principal y verificar que `qikpos` no dependa de `fs` en el navegador/Tauri.

### P2 — Arquitectura y producto

1. Publicar un contrato OpenAPI desde NestJS y generar/validar tipos del cliente para evitar divergencias manuales.
2. Definir módulos de dominio y límites de dependencias en ambos repositorios.
3. Crear matriz RBAC: rol, permiso, recurso y acción; evitar lógica basada sólo en nombres de rol en la UI.
4. Diseñar configuración de empresa, branding y futura separación multiempresa sin codificar la empresa actual.
5. Formalizar eventos de dominio para pedidos, notificaciones, auditoría y sincronización en tiempo real.

### P3 — Rediseño de experiencia

- Mantener un único shell con sidebar y módulos orientados a tareas. Abrir múltiples ventanas/módulos independientes sólo cuando exista una necesidad operativa comprobada.
- Usar navegación primaria por dominios y acciones contextuales dentro de cada módulo.
- Quitar acciones como “Nuevo equipo” del árbol principal. En `Equipos`, usar una acción primaria junto al listado y un flujo de creación dedicado, claro y validado.
- Diseñar por rol y por flujo completo: objetivo, lista, detalle, acción, confirmación, error, auditoría y recuperación.
- Crear primero inventario de pantallas y flujos; después tokens/componentes reutilizables; finalmente rediseñar módulo por módulo.

## Base de conocimiento

La documentación del repositorio debe seguir siendo la fuente versionada. Obsidian puede abrirla directamente como vault o consumir una carpeta `docs/knowledge-base` con:

- glosario del dominio;
- mapa de módulos y dependencias;
- contratos API y eventos;
- flujos por rol;
- matriz RBAC;
- decisiones ADR;
- runbooks de despliegue, backups e incidentes;
- planes y estado de migración.

Las skills para IA deben crearse después de estabilizar estas convenciones. Una skill debe apuntar a reglas duraderas y verificables, no copiar planes temporales ni documentación desactualizada.
