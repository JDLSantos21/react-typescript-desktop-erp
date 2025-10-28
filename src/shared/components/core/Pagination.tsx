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
    className="px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
    .filter((num) => num <= totalItems)
    .map((num) => ({
      value: num.toString(),
      label: num.toString(),
    }));

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center justify-center gap-2 self-end">
        {showFirstLast && (
          <NavButton
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
          >
            <ChevronDoubleLeftIcon />
          </NavButton>
        )}

        <NavButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeftIcon />
        </NavButton>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-700">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 bg-white cursor-pointer hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        <NavButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon />
        </NavButton>

        {showFirstLast && (
          <NavButton
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronDoubleRightIcon />
          </NavButton>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onLimitChange && (
          <Select
            className="border-primary"
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
        <p className="font-light text-sm text-nowrap">por página</p>
      </div>
    </div>
  );
};
