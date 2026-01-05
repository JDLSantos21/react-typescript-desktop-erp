import { HistoryIcon, OrderIcon, TruckIcon } from "@/shared/components/icons";
import { OrderStatus } from "@/shared/types/entities/order.types";
import { useGetInProgressOrdersCount } from "../hooks/useOrder";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const OrdersStats = () => {
  const { data, isLoading } = useGetInProgressOrdersCount();

  const stats = [
    {
      label: "Pendientes",
      count: data?.data.pending ?? 0,
      icon: HistoryIcon,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Preparando",
      count: data?.data.preparing ?? 0,
      icon: OrderIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Despachados",
      count: data?.data.dispatched ?? 0,
      icon: TruckIcon,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  if (isLoading)
    return (
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    );

  return (
    <div className="flex items-center p-1 bg-slate-100/50 rounded-xl border border-slate-200/50">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5",
            index !== stats.length - 1 && "border-r border-slate-200"
          )}
        >
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center",
              stat.bg,
              stat.color
            )}
          >
            <stat.icon className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {stat.label}
            </span>
            <span className="text-sm font-bold text-slate-700">
              {stat.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
