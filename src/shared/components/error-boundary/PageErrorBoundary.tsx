import { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { Button } from "../core/Button";
import { useNavigate } from "react-router-dom";

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName?: string;
}

/**
 * Error Boundary específico para páginas completas
 * Muestra un fallback optimizado para errores a nivel de página
 *
 * @example
 * // En Router.tsx o layouts
 * <PageErrorBoundary pageName="Dashboard">
 *   <DashboardPage />
 * </PageErrorBoundary>
 */
export function PageErrorBoundary({
  children,
  pageName = "esta página",
}: PageErrorBoundaryProps) {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      boundaryName={`Page: ${pageName}`}
      fallback={(error, resetError) => (
        <div className="min-h-screen flex items-center justify-center bg-background-secondary p-4">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Icono de error */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-danger"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Mensaje */}
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Ocurrió un error
              </h1>
              <p className="text-text-secondary">
                No pudimos cargar {pageName}. Intenta de nuevo o vuelve al
                inicio.
              </p>
            </div>

            {/* Detalles en desarrollo */}
            {import.meta.env.DEV && (
              <div className="bg-background rounded-lg p-4 text-left">
                <p className="text-xs font-semibold text-text-secondary mb-1">
                  Error:
                </p>
                <pre className="text-xs text-danger overflow-x-auto">
                  {error.message}
                </pre>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col gap-3">
              <Button variant="primary" onClick={resetError} className="w-full">
                Intentar de nuevo
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
