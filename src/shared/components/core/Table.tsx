import { memo, ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string; // Para controlar ancho de columna
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  showFooter?: boolean;
  minRows?: number; // Mínimo de filas a mostrar para altura consistente
  maxHeight?: string; // Altura máxima del contenedor scrolleable (ej: "500px", "60vh")
  className?: string;
  tableLayout?: "fixed" | "auto"; // Controla el layout de la tabla
}

const TableComponent = <T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyMessage = "No hay datos disponibles",
  showFooter = false,
  minRows,
  maxHeight = "calc(100vh - 300px)",
  className = "",
  tableLayout = "fixed",
}: TableProps<T>) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-[48.39px] bg-gray-200 rounded mb-1"></div>
          {[...Array(minRows || 5)].map((_, i) => (
            <div
              key={`skeleton-row-${i}`}
              className="h-[48.8px] bg-gray-100 mb-1 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header fijo */}
      <div className="overflow-x-auto shrink-0">
        <table
          className={`w-full border-collapse ${
            tableLayout === "fixed" ? "table-fixed" : "table-auto"
          } ${className}`}
        >
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`py-4 text-left text-xs font-medium text-text-primary uppercase tracking-wider ${
                    column.className || ""
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Body scrolleable */}
      <div
        className="overflow-y-auto overflow-x-auto tbody-scrolleable flex-1 min-h-0"
        style={{ maxHeight }}
      >
        <table
          className={`w-full border-collapse ${
            tableLayout === "fixed" ? "table-fixed" : "table-auto"
          }`}
        >
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={
                  onRowClick
                    ? "hover:bg-gray-50 cursor-pointer transition-colors"
                    : ""
                }
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-3 whitespace-nowrap text-sm max-xl:text-xs text-gray-900 ${
                      column.className || ""
                    }`}
                  >
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="border-t border-border-light">
          <table className="w-full">
            <tfoot>
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-sm text-gray-900"
                >
                  Total de registros: {data.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export const Table = memo(TableComponent) as typeof TableComponent;
