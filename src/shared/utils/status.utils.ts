import { OrderStatus } from "../types/entities/order.types";

/**
 * Obtiene las clases de Tailwind para el color de fondo, texto y borde según el estado.
 * Útil para Badges, filas de tablas, o indicadores de estado.
 * @param status - El estado (ej: "PENDIENTE", "ENTREGADO")
 * @returns String con las clases de Tailwind
 */
export const getStatusColor = (status: string): string => {
  const upperStatus = status?.toUpperCase() || "";

  switch (upperStatus) {
    case "PENDIENTE":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "PREPARANDO":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "DESPACHADO":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "ENTREGADO":
      return "bg-green-50 text-green-700 border-green-200";
    case "ACTIVO":
      return "bg-green-50 text-green-700 border-green-200";
    case "DISPONIBLE":
      return "bg-green-50 text-green-700 border-green-200";
    case "ASIGNADO":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "MANTENIMIENTO":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "DAÑADO":
      return "bg-red-50 text-red-700 border-red-200";
    case "INHABILITADO":
      return "bg-gray-50 text-gray-700 border-gray-200";
    case "CANCELADO":
      return "bg-red-50 text-red-700 border-red-200";
    case "DEVUELTO":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

/**
 * Obtiene la clase de Tailwind para el color de fondo (punto/dot) según el estado.
 * Útil para Timelines o indicadores circulares.
 * @param status - El estado
 * @returns String con la clase de Tailwind (ej: "bg-yellow-500")
 */
export const getStatusDotColor = (status: OrderStatus): string => {
  const upperStatus = status?.toUpperCase() || "";

  switch (upperStatus) {
    case "PENDIENTE":
      return "bg-yellow-500";
    case "PREPARANDO":
      return "bg-blue-500";
    case "DESPACHADO":
      return "bg-purple-500";
    case "ENTREGADO":
      return "bg-green-500";
    case "CANCELADO":
      return "bg-red-500";
    case "DEVUELTO":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
  }
};
