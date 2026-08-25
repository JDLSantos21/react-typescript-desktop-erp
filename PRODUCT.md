# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Personal operativo y administrativo que gestiona la operación diaria desde una aplicación de escritorio.
- Supervisores y administradores que necesitan consultar y mantener datos operativos. La definición final de permisos por rol sigue abierta.

## Product Purpose

Este ERP permite administrar la operación de una empresa de distribución, incluidos clientes, pedidos, combustible, equipos y vehículos. Debe poder adaptarse posteriormente a otras empresas sin exponer una identidad específica de la empresa actual.

## Positioning

Una herramienta de operación de escritorio que conecta los datos maestros y la ejecución diaria en módulos claros, con trazabilidad suficiente para que la operación pueda crecer sin perder control.

## Operating Context

- El personal registra y consulta información durante la jornada operativa.
- Los vehículos son activos operativos: su identificación debe ser fácil de encontrar, corregir y consultar sin mezclar el registro con otros catálogos.
- El backend es una API NestJS independiente y el frontend usa contratos HTTP tipados.
- El producto se ejecuta como aplicación web y tiene integración Tauri en el repositorio para uso de escritorio.

## Capabilities and Constraints

- Módulos existentes: clientes, pedidos, combustible, equipos, inventario y vehículos.
- La aplicación debe usar TypeScript, componentes reutilizables y límites claros entre UI, estado remoto, contratos y servicios HTTP.
- Las reglas de negocio pertenecen al backend; el frontend replica validaciones de experiencia sin sustituir la validación del servidor.
- La gestión detallada de roles, configuración multiempresa, seguimiento público de pedidos y mensajería WhatsApp son objetivos posteriores, no requisitos implementados de este módulo.
- Hechos inferidos de la solicitud del usuario: la interfaz debe evitar formularios y catálogos no relacionados en una misma pantalla, y debe priorizar flujos profesionales de ERP de escritorio.

## Evidence on Hand

- Implementación existente en `src/features` y contratos con `erp-api`.
- No se deben inventar indicadores, asignaciones, telemetría o historial de mantenimiento cuando el endpoint no los entregue.

## Product Principles

1. Cada módulo resuelve una tarea operativa concreta y separa los catálogos o flujos que tienen responsabilidades distintas.
2. La información debe ser encontrable y accionable con pocos pasos, incluso cuando el volumen de registros crezca.
3. Los contratos tipados y la validación de servidor son la fuente de verdad de los datos.
4. Los componentes y patrones compartidos se reutilizan antes de crear soluciones locales.
5. El producto debe poder evolucionar a roles y múltiples empresas sin acoplar la interfaz a una empresa específica.
