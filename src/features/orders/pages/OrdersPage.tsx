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
import { useCallback, useState } from "react";
import dayjs from "dayjs";
import OrderCard from "../components/OrderCard";
import { formatDate } from "@/shared/utils";
import { OrdersStats } from "../components/OrdersStats";
import { OrdersFilter } from "../components/OrdersFilter";
import { OrderStatus } from "@/shared/types/entities/order.types";
import SectionLoader from "@/shared/components/SectionLoader";
import { motion } from "motion/react";

export default function OrdersPage() {
  // ... (Tu lógica de estado se mantiene intacta)
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

  const { data, isLoading, isError, refetch } = useGetOrders({
    ...paginationParams,
    ...dateRange, // Nota: DateRangeSelector debería pasarse como filtro o en el header, aquí lo mantengo como lo tenías
    ...filters,
  });

  const paginationMeta = data?.meta.pagination;

  useHeaderConfig({
    title: "Gestión de Pedidos",
    description: "Monitorea y procesa las solicitudes de tus clientes.",
    actions: (
      <Button
        onClick={() => navigate("/orders/new")}
        icon={PlusIcon}
        className="rounded-xl bg-slate-900 shadow-lg shadow-slate-200"
      >
        Crear Pedido
      </Button>
    ),
  });

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Barra de Herramientas Unificada */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        <div className="flex-1 max-w-2xl">
          <OrdersFilter
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="flex-shrink-0">
          <OrdersStats />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {isLoading ? (
          <SectionLoader placeholder="Cargando pedidos..." />
        ) : isError ? (
          <ErrorState
            title="Error de conexión"
            message="No pudimos cargar los pedidos."
            onRetry={() => refetch()}
          />
        ) : data && data.data.length === 0 ? (
          <EmptyState
            title="Sin pedidos recientes"
            description="No hay pedidos que coincidan con tus filtros actuales."
            action={{
              label: "Crear nuevo pedido",
              onClick: () => navigate("/orders/new"),
            }}
          />
        ) : (
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 content-start"
          >
            {data &&
              data.data.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
          </motion.ul>
        )}
      </div>

      {/* Paginación */}
      {paginationMeta && paginationMeta.totalPages > 1 && (
        <div className="px-6 py-4 bg-white border-t border-slate-100">
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
