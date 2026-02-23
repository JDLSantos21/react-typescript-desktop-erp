import { HistoryIcon, OrderIcon, TruckIcon } from "@/shared/components/icons";
import { getStatusDotColor } from "@/shared/utils/status.utils";
import { OrderStatus } from "@/shared/types/entities/order.types";
import { useGetInProgressOrdersCount } from "../hooks/useOrder";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Spinner } from "@/shared/components/core/Spinner";

export const OrdersStats = () => {
  const { data, isLoading, isRefetching } = useGetInProgressOrdersCount();

  const stats: {
    label: string;
    count: number;
    icon: any;
    status: OrderStatus;
  }[] = [
    {
      label: "Pendientes",
      count: data?.data.pending ?? 0,
      icon: HistoryIcon,
      status: "PENDIENTE",
    },
    {
      label: "Preparando",
      count: data?.data.preparing ?? 0,
      icon: OrderIcon,
      status: "PREPARANDO",
    },
    {
      label: "Despachados",
      count: data?.data.dispatched ?? 0,
      icon: TruckIcon,
      status: "DESPACHADO",
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {isRefetching && <Spinner size="sm" className="text-gray-400 mr-1" />}
      {data ? (
        stats.map((stat) => {
          const dotColorClass = getStatusDotColor(stat.status);

          return (
            <div
              key={stat.label}
              className="flex items-center gap-1.5 h-10 px-2 py-1.5 bg-white border border-border rounded-md shadow-xs w-20"
            >
              <div className={`p-1 rounded-full ${dotColorClass}`}>
                <stat.icon className="text-white w-3 h-3" />
              </div>
              <div className="flex items-baseline gap-1.5 border-l border-border pl-1.5">
                <span className="text-sm font-medium tracking-wider">
                  {stat.count.toString().padStart(3, "0")}
                </span>
              </div>
            </div>
          );
        })
      ) : isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 h-10 px-2 py-1.5 bg-white border border-border rounded-md shadow-xs w-20"
          >
            <Skeleton className="w-6 h-6 rounded-full" />
            <div className="flex items-baseline gap-1.5 border-l border-border pl-1.5">
              <Skeleton className="w-8 h-5 rounded" />
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-red-500">
          Ocurrió un error al cargar las estadísticas de pedidos.
        </div>
      )}
    </div>
  );
};
