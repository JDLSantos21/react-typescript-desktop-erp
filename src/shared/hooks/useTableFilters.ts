import { useState, useCallback } from "react";

export interface TableFilters {
  search?: string;
  [key: string]: any;
}

export interface UseTableFiltersProps {
  initialFilters?: TableFilters;
}

export const useTableFilters = ({
  initialFilters = {},
}: UseTableFiltersProps = {}) => {
  const [filters, setFilters] = useState<TableFilters>(initialFilters);

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<TableFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
  };
};
