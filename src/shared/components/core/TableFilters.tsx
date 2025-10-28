import { ReactNode } from "react";
import { Button } from "./Button";

interface TableFiltersProps {
  children: ReactNode;
  onClearFilters?: () => void;
  showClearButton?: boolean;
  hasActiveFilters?: boolean;
}

export const TableFilters = ({
  children,
  onClearFilters,
  showClearButton = true,
  hasActiveFilters = false,
}: TableFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 flex flex-wrap gap-4">{children}</div>

      {showClearButton && hasActiveFilters && onClearFilters && (
        <div className="flex-shrink-0">
          <Button variant="outline" onClick={onClearFilters}>
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
  const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  };

  return <div className={`flex-1 grid ${colsMap[cols]} gap-4`}>{children}</div>;
};
