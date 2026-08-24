# Estrategia de zona horaria

## Regla de dominio

- Un **instante** (creación, entrega, consumo, auditoría) se guarda y se transmite en UTC con ISO 8601, por ejemplo `2026-08-24T01:58:28.499Z`.
- Una **fecha operativa** sin hora (por ejemplo, la fecha programada de un pedido) se guarda como `DATE` y se transmite como `YYYY-MM-DD`. Nunca se convierte a UTC porque no representa un instante.
- El navegador envía la zona IANA detectada automáticamente en `X-Timezone`, por ejemplo `America/Santo_Domingo` o `Europe/Madrid`.
- Los filtros que reciben `startDate` y `endDate` interpretan esas fechas como días completos en la zona del usuario y el backend los convierte a un intervalo UTC semiabierto: `[inicio, inicio del día siguiente)`.

## Configuración de desarrollo y producción

En `erp-api/.env`:

```env
SERVER_TIME_ZONE=UTC
DB_TIME_ZONE=UTC
BUSINESS_TIME_ZONE=America/Santo_Domingo
```

`SERVER_TIME_ZONE` fija el proceso Node en UTC. `DB_TIME_ZONE` fija cada conexión de TypeORM/PostgreSQL de la aplicación en UTC. `BUSINESS_TIME_ZONE` es el fallback para tareas internas o clientes que no envían `X-Timezone`.

Para fijar adicionalmente la configuración global de una base PostgreSQL administrada, ejecutar una vez con un usuario administrador:

```sql
ALTER DATABASE agualily SET TIME ZONE 'UTC';
```

Luego abrir una conexión nueva y comprobar:

```sql
SHOW TimeZone;
SELECT now();
```

`DB_SYNCHRONIZE` queda en `false`. Los cambios de esquema se aplican con `pnpm db:migrate:time`; la migración temporal convierte los timestamps históricos interpretándolos como UTC y separa las fechas operativas como `DATE`.

No se debe sustituir una zona IANA por un offset fijo como `UTC-4`: los offsets cambian en países con horario de verano. República Dominicana usa `America/Santo_Domingo`.

## Prueba manual

1. Reiniciar `erp-api` después de cambiar el `.env`.
2. Crear un pedido el 23 de agosto a las 21:58 en República Dominicana. Se verá almacenado como `2026-08-24T01:58:00.000Z`.
3. Consultar `GET /orders?startDate=2026-08-23&endDate=2026-08-23` con `X-Timezone: America/Santo_Domingo`.
4. El pedido debe aparecer porque el intervalo real es desde `2026-08-23T04:00:00.000Z` hasta, sin incluirlo, `2026-08-24T04:00:00.000Z`.

En Postman hay que añadir manualmente la cabecera `X-Timezone`; el frontend la agrega automáticamente.
