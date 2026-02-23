import { Input } from "@/shared/components/core/Input";
import { Button } from "@/shared/components/core/Button";
import { Select } from "@/shared/components/core/Select";
import { DatePicker } from "@/shared/components/core/DatePicker";
import { FilterIcon, SearchIcon } from "@/shared/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useState, useEffect } from "react";
import { OrderStatus } from "@/shared/types/entities/order.types";
import { format } from "date-fns";
import { useDebounce } from "@/shared/hooks/useDebounce";

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
      <div className="flex-1 max-w-md">
        <Input
          startIcon={<SearchIcon className="text-gray-400" />}
          placeholder="Buscar pedido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white"
        />
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            icon={FilterIcon}
            variant="outline"
            className="gap-2 relative bg-white"
          >
            <span className="hidden sm:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium leading-none">Filtros avanzados</h4>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Select
                options={statusOptions}
                value={status}
                label="Estado"
                onValueChange={handleStatusChange}
                placeholder="Seleccionar estado"
              />
            </div>

            <div className="space-y-2">
              <DatePicker
                label="Fecha de entrega"
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
