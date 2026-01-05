import {
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "../icons";
import { Select } from "./Select";

interface PaginationProps {
  limit: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showFirstLast?: boolean;
}

// Botones de navegación minimalistas (sin borde, solo hover)
const NavButton = ({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-9 h-9 flex items-center justify-center text-slate-500 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
  >
    {children}
  </button>
);

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onLimitChange,
  showFirstLast = true,
  limit,
  totalItems,
}: PaginationProps) => {
  const getPageNumbers = () => {
    // ... (Tu misma lógica de getPageNumbers se mantiene igual)
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
    return pages;
  };

  const pages = getPageNumbers();
  const resultsToShow = [5, 10, 20, 50];

  const selectOptions = resultsToShow
    .filter((num) => num <= totalItems || num === 5) // Ajuste defensivo
    .map((num) => ({
      value: num.toString(),
      label: num.toString(),
    }));

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
      {/* Texto informativo */}
      <div className="text-xs text-slate-400 font-medium">
        Página {currentPage} de {totalPages}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {showFirstLast && (
            <NavButton
              disabled={currentPage === 1}
              onClick={() => onPageChange(1)}
            >
              <ChevronDoubleLeftIcon className="w-4 h-4" />
            </NavButton>
          )}

          <NavButton
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </NavButton>

          <div className="flex items-center px-2 gap-1 border-l border-r border-slate-100 mx-1">
            {pages.map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 text-center text-slate-300 text-xs"
                >
                  •••
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`
                        min-w-[32px] h-8 px-2 text-xs font-bold rounded-lg transition-all duration-200
                        ${
                          currentPage === page
                            ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }
                      `}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <NavButton
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </NavButton>

          {showFirstLast && (
            <NavButton
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
            >
              <ChevronDoubleRightIcon className="w-4 h-4" />
            </NavButton>
          )}
        </div>

        {/* Selector de Límite - Estilizado minimalista */}
        <div className="flex items-center gap-2">
          {onLimitChange && (
            <Select
              className="h-8 text-xs border-slate-200 w-[70px]"
              value={limit.toString()}
              onValueChange={(value) => {
                const newLimit = parseInt(value, 10);
                if (!isNaN(newLimit) && newLimit > 0 && onLimitChange) {
                  onLimitChange(newLimit);
                }
              }}
              options={selectOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
};
