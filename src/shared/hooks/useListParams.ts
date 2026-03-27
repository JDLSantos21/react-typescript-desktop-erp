import { useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { APP_CONFIG } from "../constants/config";

type FilterValue = string | number | boolean | null | undefined;
type FiltersState = Record<string, FilterValue>;
type FilterConfig<TValue extends FilterValue> = {
  parse?: (rawValue: string) => TValue;
  serialize?: (value: TValue) => string | undefined;
  isEmpty?: (value: TValue) => boolean;
};

interface UseListParamsOptions<TFilters extends FiltersState> {
  initialFilters: TFilters;
  filterConfig?: Partial<{
    [K in keyof TFilters]: FilterConfig<TFilters[K]>;
  }>;
  defaultLimit?: number;
  syncWithUrl?: boolean;
}

interface UseListParamsReturn<TFilters extends FiltersState> {
  filters: TFilters;
  page: number;
  limit: number;
  setFilter: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
  setFilters: (updates: Partial<TFilters>) => void;
  resetFilters: () => void;
  clearAll: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetPagination: () => void;
  hasActiveFilters: boolean;
  queryParams: TFilters & {
    page: number;
    limit: number;
  };
}

const isBlankString = (value: string) => value.trim() === "";

const isEmptyFilterValue = (value: FilterValue) => {
  if (value === null || value === undefined) return true;

  if (typeof value === "string") return isBlankString(value);

  return false;
};

const parseFilterValue = (rawValue: string, defaultValue: FilterValue) => {
  if (typeof defaultValue === "number") {
    const parsedValue = Number(rawValue);
    return Number.isFinite(parsedValue) ? parsedValue : defaultValue;
  }

  if (typeof defaultValue === "boolean") return rawValue === "true";

  return rawValue;
};

const serializeFilterValue = <TValue extends FilterValue>(
  value: TValue,
  config?: FilterConfig<TValue>,
) => {
  if (config?.serialize) {
    return config.serialize(value);
  }

  if (typeof value === "string") {
    return isBlankString(value) ? undefined : value;
  }

  return value;
};

const buildQueryFilterValue = <TValue extends FilterValue>(
  value: TValue,
  config?: FilterConfig<TValue>,
) => {
  if (config?.serialize) {
    return config.serialize(value);
  }

  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized === "" ? undefined : normalized;
  }

  return value;
};

const buildFiltersFromSearchParams = <TFilters extends FiltersState>(
  searchParams: URLSearchParams,
  initialFilters: TFilters,
  filterConfig: Partial<{
    [K in keyof TFilters]: FilterConfig<TFilters[K]>;
  }>,
) => {
  const nextFilters = {} as TFilters;

  (Object.keys(initialFilters) as Array<keyof TFilters>).forEach((key) => {
    const rawValue = searchParams.get(String(key));

    if (rawValue === null) {
      nextFilters[key] = initialFilters[key];
      return;
    }

    const config = filterConfig[key];

    nextFilters[key] = (
      config?.parse
        ? config.parse(rawValue)
        : parseFilterValue(rawValue, initialFilters[key])
    ) as TFilters[keyof TFilters];
  });

  return nextFilters;
};

const areFiltersEqual = <TFilters extends FiltersState>(
  left: TFilters,
  right: TFilters,
  filterConfig: Partial<{
    [K in keyof TFilters]: FilterConfig<TFilters[K]>;
  }>,
) =>
  (Object.keys(left) as Array<keyof TFilters>).every(
    (key) =>
      buildQueryFilterValue(left[key], filterConfig[key]) ===
      buildQueryFilterValue(right[key], filterConfig[key]),
  );

export const useListParams = <TFilters extends FiltersState>({
  initialFilters,
  filterConfig = {},
  defaultLimit = APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
  syncWithUrl = true,
}: UseListParamsOptions<TFilters>): UseListParamsReturn<TFilters> => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFiltersRef = useRef(initialFilters);
  const initialFilterValues = initialFiltersRef.current;
  const filterConfigRef = useRef(filterConfig);
  const filterConfigValues = filterConfigRef.current;

  const [localState, setLocalState] = useState(() => ({
    filters: initialFilterValues,
    page: 1,
    limit: defaultLimit,
  }));

  const filters = useMemo(() => {
    if (!syncWithUrl) {
      return localState.filters;
    }

    return buildFiltersFromSearchParams(
      searchParams,
      initialFilterValues,
      filterConfigValues,
    );
  }, [
    filterConfigValues,
    initialFilterValues,
    localState.filters,
    searchParams,
    syncWithUrl,
  ]);

  const page = useMemo(() => {
    if (!syncWithUrl) {
      return localState.page;
    }

    const rawPage = Number(searchParams.get("page"));
    return Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  }, [localState.page, searchParams, syncWithUrl]);

  const limit = useMemo(() => {
    if (!syncWithUrl) {
      return localState.limit;
    }

    const rawLimit = Number(searchParams.get("limit"));
    return Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : defaultLimit;
  }, [defaultLimit, localState.limit, searchParams, syncWithUrl]);

  const updateUrlState = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams);
          updater(nextParams);
          return nextParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setFilters = useCallback(
    (updates: Partial<TFilters>) => {
      if (!syncWithUrl) {
        setLocalState((currentState) => ({
          ...currentState,
          filters: {
            ...currentState.filters,
            ...updates,
          },
          page: 1,
        }));
        return;
      }

      updateUrlState((params) => {
        (
          Object.entries(updates) as Array<
            [keyof TFilters, TFilters[keyof TFilters]]
          >
        ).forEach(([key, value]) => {
          const normalizedValue = serializeFilterValue(
            value,
            filterConfigValues[key],
          );

          if (normalizedValue === undefined || normalizedValue === null) {
            params.delete(String(key));
            return;
          }

          params.set(String(key), String(normalizedValue));
        });

        params.delete("page");
      });
    },
    [filterConfigValues, syncWithUrl, updateUrlState],
  );

  const setFilter = useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      setFilters({ [key]: value } as unknown as Partial<TFilters>);
    },
    [setFilters],
  );

  const resetFilters = useCallback(() => {
    if (!syncWithUrl) {
      setLocalState((currentState) => ({
        ...currentState,
        filters: initialFilterValues,
        page: 1,
      }));
      return;
    }

    updateUrlState((params) => {
      Object.keys(initialFilterValues).forEach((key) => {
        params.delete(key);
      });
      params.delete("page");
    });
  }, [initialFilterValues, syncWithUrl, updateUrlState]);

  const setPage = useCallback(
    (nextPage: number) => {
      const safePage = Math.max(1, nextPage);

      if (!syncWithUrl) {
        setLocalState((currentState) => ({
          ...currentState,
          page: safePage,
        }));
        return;
      }

      updateUrlState((params) => {
        if (safePage === 1) {
          params.delete("page");
          return;
        }

        params.set("page", String(safePage));
      });
    },
    [syncWithUrl, updateUrlState],
  );

  const setLimit = useCallback(
    (nextLimit: number) => {
      const safeLimit = Math.max(1, nextLimit);

      if (!syncWithUrl) {
        setLocalState((currentState) => ({
          ...currentState,
          limit: safeLimit,
          page: 1,
        }));
        return;
      }

      updateUrlState((params) => {
        if (safeLimit === defaultLimit) {
          params.delete("limit");
        } else {
          params.set("limit", String(safeLimit));
        }

        params.delete("page");
      });
    },
    [defaultLimit, syncWithUrl, updateUrlState],
  );

  const resetPagination = useCallback(() => {
    if (!syncWithUrl) {
      setLocalState((currentState) => ({
        ...currentState,
        page: 1,
        limit: defaultLimit,
      }));
      return;
    }

    updateUrlState((params) => {
      params.delete("page");
      params.delete("limit");
    });
  }, [defaultLimit, syncWithUrl, updateUrlState]);

  const clearAll = useCallback(() => {
    if (!syncWithUrl) {
      setLocalState({
        filters: initialFilterValues,
        page: 1,
        limit: defaultLimit,
      });
      return;
    }

    updateUrlState((params) => {
      Object.keys(initialFilterValues).forEach((key) => {
        params.delete(key);
      });
      params.delete("page");
      params.delete("limit");
    });
  }, [defaultLimit, initialFilterValues, syncWithUrl, updateUrlState]);

  const hasActiveFilters = useMemo(
    () => !areFiltersEqual(filters, initialFilterValues, filterConfigValues),
    [filterConfigValues, filters, initialFilterValues],
  );

  const queryParams = useMemo(() => {
    const activeFilters = {} as TFilters;

    (
      Object.entries(filters) as Array<
        [keyof TFilters, TFilters[keyof TFilters]]
      >
    ).forEach(([key, value]) => {
      const config = filterConfigValues[key];

      if (config?.isEmpty ? config.isEmpty(value) : isEmptyFilterValue(value)) {
        return;
      }

      activeFilters[key] = buildQueryFilterValue(
        value,
        config,
      ) as TFilters[keyof TFilters];
    });

    return {
      ...activeFilters,
      page,
      limit,
    };
  }, [filterConfigValues, filters, limit, page]);

  return {
    filters,
    page,
    limit,
    setFilter,
    setFilters,
    resetFilters,
    clearAll,
    setPage,
    setLimit,
    resetPagination,
    hasActiveFilters,
    queryParams,
  };
};
