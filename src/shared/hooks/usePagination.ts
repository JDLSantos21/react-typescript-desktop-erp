import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { APP_CONFIG } from "../constants/config";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsePaginationProps {
  defaultLimit?: number;
  syncWithUrl?: boolean;
}

export interface UsePaginationReturn {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetPagination: () => void;
  paginationParams: {
    page: number;
    limit: number;
  };
}

/**
 * Hook reutilizable para manejo de paginación con sincronización opcional con URL
 * Optimizado para rendimiento con memoización y callbacks estables
 */
export const usePagination = ({
  defaultLimit = APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
  syncWithUrl = true,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extraer valores de URL o usar defaults
  const page = useMemo(() => {
    if (!syncWithUrl) return 1;
    return Number(searchParams.get("page")) || 1;
  }, [searchParams, syncWithUrl]);

  const limit = useMemo(() => {
    if (!syncWithUrl) return defaultLimit;
    return Number(searchParams.get("limit")) || defaultLimit;
  }, [searchParams, defaultLimit, syncWithUrl]);

  // Actualizar página (resetea a 1 si es inválida)
  const setPage = useCallback(
    (newPage: number) => {
      if (!syncWithUrl) return;

      setSearchParams(
        (prev) => {
          const validPage = Math.max(1, newPage);
          prev.set("page", String(validPage));
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams, syncWithUrl],
  );

  // Actualizar límite (resetea página a 1)
  const setLimit = useCallback(
    (newLimit: number) => {
      if (!syncWithUrl) return;

      setSearchParams(
        (prev) => {
          prev.set("limit", String(newLimit));
          prev.set("page", "1"); // Reset página al cambiar límite
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams, syncWithUrl],
  );

  // Resetear paginación a valores por defecto
  const resetPagination = useCallback(() => {
    if (!syncWithUrl) return;

    setSearchParams(
      (prev) => {
        prev.delete("page");
        prev.delete("limit");
        return prev;
      },
      { replace: true },
    );
  }, [setSearchParams, syncWithUrl]);

  // Parámetros para queries - memoizados para evitar re-renders
  const paginationParams = useMemo(
    () => ({
      page,
      limit,
    }),
    [page, limit],
  );

  return {
    page,
    limit,
    setPage,
    setLimit,
    resetPagination,
    paginationParams,
  };
};
