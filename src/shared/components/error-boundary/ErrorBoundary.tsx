import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "../core/Button";
import { Card } from "../core/Card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  boundaryName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, boundaryName } = this.props;

    console.error(
      `Error capturado en ErrorBoundary${
        boundaryName ? ` (${boundaryName})` : ""
      }:`,
      error,
      errorInfo
    );

    if (onError) {
      onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (fallback) {
        return fallback(error, this.resetError);
      }

      return (
        <DefaultErrorFallback error={error} resetError={this.resetError} />
      );
    }

    return children;
  }
}

/**
 * Componente de fallback por defecto cuando ocurre un error
 */
interface DefaultErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function DefaultErrorFallback({
  error,
  resetError,
}: DefaultErrorFallbackProps) {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-secondary p-4">
      <Card className="max-w-2xl w-full">
        <div className="text-center space-y-4">
          {/* Icono de error */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-danger"
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

          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Algo salió mal
            </h1>
            <p className="text-text-secondary">
              Ha ocurrido un error inesperado en la aplicación.
            </p>
          </div>

          {isDevelopment && (
            <div className="bg-background-secondary rounded-lg p-4 text-left">
              <p className="text-sm font-semibold text-text-primary mb-2">
                Detalles del error:
              </p>
              <pre className="text-xs text-danger overflow-x-auto">
                {error.message}
              </pre>
              {error.stack && (
                <pre className="text-xs text-text-secondary mt-2 overflow-x-auto">
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Recargar página
            </Button>
            <Button variant="primary" onClick={resetError}>
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
