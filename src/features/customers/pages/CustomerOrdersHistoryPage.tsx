import { useGetOrders } from "@/features/orders/hooks/useOrder";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { usePagination } from "@/shared/hooks/usePagination";
import { useParams } from "react-router-dom";
import { orderHistoryTableColumns } from "../config/orderHistoryTableConfig";
import { Table } from "@/shared/components/core/Table";
import { Pagination } from "@/shared/components/core/Pagination";
import { FeatureErrorBoundary } from "@/shared/components/error-boundary/FeatureErrorBoundary";
import { APP_CONFIG } from "@/shared/constants/config";

export default function CustomerOrdersHistoryPage() {
  const { id } = useParams();

  const { setPage, setLimit, paginationParams } = usePagination({
    defaultLimit: APP_CONFIG.PAGINATION.DEFAULT_LIMIT,
    syncWithUrl: true,
  });

  const { data: orders, isLoading } = useGetOrders({
    customer_id: id,
    ...paginationParams,
  });

  const pagination = orders?.meta.pagination;

  const customerName = orders?.data[0]?.customer?.businessName || null;

  useHeaderConfig({
    title: "Historial de pedidos",
    description: customerName ? `Pedidos de ${customerName}` : "Pedidos",
    showBackButton: true,
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6">
        <FeatureErrorBoundary featureName="historial de pedidos">
          <Table
            columns={orderHistoryTableColumns}
            data={orders?.data || []}
            keyExtractor={(order) => order.id}
            isLoading={isLoading}
            emptyMessage="No se encontraron pedidos"
          />
        </FeatureErrorBoundary>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="w-full left-0 px-3 bg-white py-1 border-t border-border">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            limit={pagination.limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            showFirstLast
          />
        </div>
      )}
    </div>
  );
}
