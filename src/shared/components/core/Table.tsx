import { ReactNode } from "react";
// Hemos quitado motion de las filas para evitar el parpadeo

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  showFooter?: boolean;
  minRows?: number;
  maxHeight?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  tableLayout?: "fixed" | "auto";
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyMessage = "No hay datos para mostrar",
  showFooter = false,
  minRows = 5,
  maxHeight = "calc(100vh - 250px)",
  className = "",
  headerClassName = "",
  rowClassName = "",
  tableLayout = "fixed",
}: TableProps<T>) => {
  // -- ESTADO DE CARGA (SKELETON) --
  // Mantenemos el skeleton porque es útil visualmente, pero estático
  if (isLoading) {
    return (
      <div
        className={`w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm ${className}`}
      >
        {/* Fake Header */}
        <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4">
          <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
        {/* Fake Rows */}
        <div className="p-0">
          {[...Array(minRows)].map((_, i) => (
            <div
              key={i}
              className="h-[52px] border-b border-slate-50 flex items-center px-4 gap-4 last:border-0"
            >
              {columns.map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-3 bg-slate-100 rounded animate-pulse"
                  style={{ width: `${Math.random() * 40 + 30}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -- ESTADO VACÍO --
  if (data.length === 0) {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200 border-dashed text-center ${className}`}
      >
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
          <span className="text-xl">📭</span>
        </div>
        <p className="text-slate-900 font-medium">Sin resultados</p>
        <p className="text-sm text-slate-400 mt-1">{emptyMessage}</p>
      </div>
    );
  }

  // -- TABLA PRINCIPAL --
  return (
    <div
      className={`w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col ${className}`}
    >
      {/* Contenedor scrolleable */}
      <div
        className="overflow-auto custom-scrollbar relative"
        style={{ maxHeight }}
      >
        <table
          className={`w-full border-collapse ${
            tableLayout === "fixed" ? "table-fixed" : "table-auto"
          }`}
        >
          {/* Header Sticky - Usamos z-20 para asegurar que flote sobre el contenido */}
          <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm border-b border-slate-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider 
                    first:pl-6 last:pr-6 whitespace-nowrap bg-slate-50
                    ${headerClassName} 
                    ${column.headerClassName || column.className || ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <svg
                        className="w-3 h-3 text-slate-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 16l-4-4h8l-4 4zm0-8l4 4H8l4-4z" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body - Renderizado nativo del navegador para máximo rendimiento */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`
                    group transition-colors duration-150 ease-in-out
                    ${onRowClick ? "cursor-pointer hover:bg-slate-50" : ""}
                    ${rowClassName}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={`${keyExtractor(item)}-${column.key}`}
                    className={`
                        py-3.5 px-4 text-sm text-slate-700
                        first:pl-6 last:pr-6
                        ${column.className || ""}
                    `}
                  >
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Opcional */}
      {showFooter && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3 text-xs font-medium text-slate-500 flex justify-between items-center">
          <span>
            Total mostrados:{" "}
            <strong className="text-slate-700">{data.length}</strong>
          </span>
        </div>
      )}
    </div>
  );
};
