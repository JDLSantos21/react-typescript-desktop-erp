import { ReactNode } from "react";
import { Button } from "./Button";
import { XIcon } from "lucide-react"; // Asumiendo que usas iconos, o usa tu texto

interface TableFiltersProps {
  children: ReactNode;
  onClearFilters?: () => void;
  showClearButton?: boolean;
  hasActiveFilters?: boolean;
  className?: string;
}

export const TableFilters = ({
  children,
  onClearFilters,
  showClearButton = true,
  hasActiveFilters = false,
  className = "",
}: TableFiltersProps) => {
  return (
    <div className={`flex items-end gap-3 w-full ${className}`}>
      {/* Área de filtros */}
      <div className="flex-1 flex flex-wrap items-center gap-3">{children}</div>

      {/* Botón de limpiar */}
      {showClearButton && hasActiveFilters && onClearFilters && (
        <div className="flex-shrink-0 animate-in fade-in zoom-in duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 h-10 px-4 rounded-xl border border-rose-100"
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

TableFilters.Grid = ({
  children,
  cols = 4,
}: {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
}) => {
  // Actualizado con gaps consistentes
  const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  return <div className={`grid ${colsMap[cols]} gap-4 w-full`}>{children}</div>;
};
