import { ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import { Alert } from "../core/Alert";
import { Button } from "../core/Button";

interface FeatureErrorBoundaryProps {
  children: ReactNode;
  featureName?: string;
}

/**
 * Error Boundary para secciones específicas de una página
 * Muestra un error inline sin romper toda la página
 *
 * @example
 * // Dentro de una página
 * <FeatureErrorBoundary featureName="Lista de clientes">
 *   <CustomerTable />
 * </FeatureErrorBoundary>
 *
 * <FeatureErrorBoundary featureName="Gráfica de ventas">
 *   <SalesChart />
 * </FeatureErrorBoundary>
 */
export function FeatureErrorBoundary({
  children,
  featureName = "esta sección",
}: FeatureErrorBoundaryProps) {
  return (
    <ErrorBoundary
      boundaryName={`Feature: ${featureName}`}
      fallback={(error, resetError) => (
        <Alert variant="danger" className="my-4">
          <div className="space-y-3">
            {/* Título */}
            <div>
              <h3 className="font-semibold text-text-primary">
                Error al cargar {featureName}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                Ocurrió un problema al renderizar esta sección.
              </p>
            </div>

            {/* Detalles en desarrollo */}
            {import.meta.env.DEV && (
              <div className="bg-background-secondary rounded p-2">
                <pre className="text-xs text-danger overflow-x-auto">
                  {error.message}
                </pre>
              </div>
            )}

            {/* Acción */}
            <div>
              <Button variant="outline" size="sm" onClick={resetError}>
                Reintentar
              </Button>
            </div>
          </div>
        </Alert>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
