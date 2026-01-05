import { Input, Button, Select, DatePicker } from "@/shared/components";
import { FilterIcon, SearchIcon } from "@/shared/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useState, useEffect } from "react";
import { OrderStatus } from "@/shared/types/entities/order.types";
import { format } from "date-fns";
import { useDebounce } from "@/shared/hooks";

interface OrdersFilterProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: {
    status?: OrderStatus;
    scheduledDate?: string;
  }) => void;
}

export const OrdersFilter = ({
  onSearch,
  onFilterChange,
}: OrdersFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [status, setStatus] = useState<OrderStatus | "ALL">("ALL");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleStatusChange = (value: string) => {
    const newStatus = value as OrderStatus | "ALL";
    setStatus(newStatus);
    applyFilters(newStatus, date);
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    applyFilters(status, newDate);
  };

  const applyFilters = (
    currentStatus: OrderStatus | "ALL",
    currentDate: Date | undefined
  ) => {
    onFilterChange({
      status: currentStatus === "ALL" ? undefined : currentStatus,
      scheduledDate: currentDate
        ? format(currentDate, "yyyy-MM-dd")
        : undefined,
    });
  };

  const clearFilters = () => {
    setStatus("ALL");
    setDate(undefined);
    onFilterChange({ status: undefined, scheduledDate: undefined });
    setIsPopoverOpen(false);
  };

  const statusOptions = [
    { value: "ALL", label: "Todos los estados" },
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "PREPARANDO", label: "Preparando" },
    { value: "DESPACHADO", label: "Despachado" },
    { value: "ENTREGADO", label: "Entregado" },
    { value: "CANCELADO", label: "Cancelado" },
    { value: "DEVUELTO", label: "Devuelto" },
  ];

  const activeFiltersCount = (status !== "ALL" ? 1 : 0) + (date ? 1 : 0);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 relative group">
        <Input
          startIcon={<SearchIcon className="w-4 h-4" />}
          placeholder="Buscar por cliente, tracking, dirección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white border-slate-200 focus:bg-white shadow-sm"
          inputSize="md"
        />
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`gap-2 border-slate-200 shadow-sm ${
              activeFiltersCount > 0
                ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                : "bg-white text-slate-600"
            }`}
          >
            <FilterIcon className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-900 text-[10px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-5 rounded-xl border-slate-100 shadow-xl"
          align="end"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h4 className="font-semibold text-slate-800">Filtrar Pedidos</h4>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-500 font-medium hover:underline"
                >
                  Limpiar todo
                </button>
              )}
            </div>

            <div className="space-y-4">
              <Select
                options={statusOptions}
                value={status}
                label="Estado del pedido"
                onValueChange={handleStatusChange}
                placeholder="Cualquiera"
              />

              <DatePicker
                label="Fecha programada"
                value={date}
                onChange={handleDateSelect}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
