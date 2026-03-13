import { AxiosError } from "axios";
import { ApiError } from "../types/api.types";

/**
 * Extrae el mensaje de error estructurado desde AxiosError
 */
export function extractApiError(error: unknown): {
  message: string;
  code: number;
  statusCode: number;
} {
  if (error instanceof AxiosError && error.response) {
    const apiError = error.response.data as ApiError;

    if (apiError?.error) {
      return {
        message: apiError.error.message,
        code: apiError.error.code,
        statusCode: error.response.status,
      };
    }

    return {
      message: error.message || "Ocurrió un error desconocido del servidor",
      code: error.response.status,
      statusCode: error.response.status,
    };
  }

  if (error instanceof AxiosError && !error.response) {
    return {
      message: "Ocurrió un error de conexión. Verifica tu red.",
      code: 0,
      statusCode: 0,
    };
  }

  return {
    message:
      error instanceof Error ? error.message : "Ocurrió un error desconocido",
    code: -1,
    statusCode: -1,
  };
}

