import {
  Button,
  EmptyState,
  ErrorState,
  Pagination,
  PlusIcon,
} from "@/shared/components";
import { useHeaderConfig, usePagination } from "@/shared/hooks";
import { useNavigate } from "react-router-dom";
import { useGetOrders } from "../hooks/useOrder";

import DateRangeSelector from "../components/DateRangeSelector";
import { useCallback, useState } from "react";
import dayjs from "dayjs";
import OrderCard from "../components/OrderCard";
import { formatDate } from "@/shared/utils";
import { OrdersStats } from "../components/OrdersStats";
import { OrdersFilter } from "../components/OrdersFilter";
import { OrderStatus } from "@/shared/types/entities/order.types";
import SectionLoader from "@/shared/components/SectionLoader";

export default function OrdersPage() {
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const startDate = dayjs().subtract(28, "day").toDate();
    return {
      start_date: formatDate(startDate, "YYYY-MM-DD"),
      end_date: formatDate(today, "YYYY-MM-DD"),
    };
  });

  const [filters, setFilters] = useState({
    search: "",
    status: undefined as OrderStatus | undefined,
    scheduledDate: undefined as string | undefined,
  });

  const navigate = useNavigate();

  const { setPage, setLimit, paginationParams } = usePagination({
    defaultLimit: 12,
    syncWithUrl: true,
  });

  const handleDateRangeChange = useCallback(
    (newRange: { start_date: string; end_date: string }) => {
      setDateRange(newRange);
      setPage(1);
    },
    []
  );

  const handleSearch = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, search: term }));
    setPage(1);
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: { status?: OrderStatus; scheduledDate?: string }) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setPage(1);
    },
    []
  );

  const { data, isLoading, isError } = useGetOrders({
    ...paginationParams,
    ...dateRange,
    ...filters,
  });

  const paginationMeta = data?.meta.pagination;

  useHeaderConfig({
    title: "Pedidos",
    description: "Gestiona y revisa los pedidos realizados.",
    actions: (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          icon={PlusIcon}
          onClick={() => navigate("/orders/new")}
        >
          Nuevo pedido
        </Button>
        <DateRangeSelector value={dateRange} onChange={handleDateRangeChange} />
      </div>
    ),
  });

  return (
    <div className="flex flex-col justify-between h-full bg-gray-50/50">
      <div className="w-full bg-white px-4 py-2 flex gap-2 shadow-xs border-b border-border">
        <OrdersFilter
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        <OrdersStats />
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center gap-4">
          <SectionLoader placeholder="Cargando pedidos" />
        </div>
      ) : isError ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <ErrorState title="Ocurrió un problema al cargar los pedidos." />
        </div>
      ) : data && data.data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <EmptyState
            title="No hay pedidos"
            description="No se encontraron pedidos con los criterios seleccionados."
          />
        </div>
      ) : (
        <ul className="flex-1 grid grid-cols-3 2xl:grid-cols-4 gap-2 p-4 pt-2 overflow-y-auto show-scrollbar scrollbar-black">
          {data &&
            data.data.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
        </ul>
      )}

      {paginationMeta && paginationMeta.totalPages > 1 && (
        <div className="w-full px-3 bg-white py-1 border-t border-border">
          <Pagination
            currentPage={paginationMeta.page}
            totalPages={paginationMeta.totalPages}
            totalItems={paginationMeta.total}
            limit={paginationMeta.limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            showFirstLast
          />
        </div>
      )}
    </div>
  );
}
