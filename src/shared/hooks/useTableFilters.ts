import { useState, useCallback } from "react";

export interface TableFilters {
  search?: string;
  [key: string]: any;
}

export interface PaginationState {
  page: number;
  limit: number;
}

export interface UseTableFiltersProps {
  initialFilters?: TableFilters;
  page?: number;
  limit?: number;
}

export const useTableFilters = ({
  initialFilters = {},
  page = 1,
  limit = 10,
}: UseTableFiltersProps = {}) => {
  const [filters, setFilters] = useState<TableFilters>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>({
    page,
    limit,
  });

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Reset a primera página al cambiar filtros
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<TableFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    // Reset a primera página al cambiar filtros
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setPagination({ page: 1, limit: 10 });
  }, [initialFilters]);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination({ page: 1, limit });
  }, []);

  // Construir query params
  const queryParams = {
    ...filters,
    page: pagination.page,
    limit: pagination.limit,
  };

  return {
    filters,
    pagination,
    updateFilter,
    updateFilters,
    clearFilters,
    setPage,
    setLimit,
    queryParams,
  };
};
