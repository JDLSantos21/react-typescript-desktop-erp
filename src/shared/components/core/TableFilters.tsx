import { HTMLAttributes, ReactNode } from "react";
import { Button } from "./Button";
import { cn } from "@/shared/utils/cn";

interface TableFiltersProps extends HTMLAttributes<HTMLDivElement> {
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
  className,
  ...props
}: TableFiltersProps) => {
  // Legacy Mode: if onClearFilters is provided, use the old layout
  if (onClearFilters) {
    return (
      <div className={cn("flex items-center gap-4", className)} {...props}>
        <div className="flex-1 flex flex-wrap gap-4">{children}</div>

        {showClearButton && hasActiveFilters && (
          <div className="flex-shrink-0">
            <Button variant="outline" onClick={onClearFilters}>
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Flexible Mode: simple wrapper
  return (
    <div className={cn("flex flex-wrap gap-4", className)} {...props}>
      {children}
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
