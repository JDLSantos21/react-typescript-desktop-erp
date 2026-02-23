import { ReactNode } from "react";
import { Button } from "./core/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error | unknown;
  icon?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  showDetails?: boolean;
  variant?: "error" | "warning" | "network";
  className?: string;
}

export const ErrorState = ({
  title,
  message,
  error,
  icon,
  onRetry,
  retryLabel = "Reintentar",
  showDetails = import.meta.env.DEV,
  variant = "error",
  className = "",
}: ErrorStateProps) => {
  // Determinar título y mensaje según variante si no se proporcionan
  const defaultContent = {
    error: {
      title: "Ha ocurrido un error",
      message:
        "No pudimos completar la operación. Por favor, intenta nuevamente.",
    },
    warning: {
      title: "Atención requerida",
      message: "Ocurrió un problema que requiere tu atención.",
    },
    network: {
      title: "Error de conexión",
      message:
        "No pudimos conectar con el servidor. Verifica tu conexión a internet.",
    },
  };

  const content = defaultContent[variant];
  const finalTitle = title || content.title;
  const finalMessage = message || content.message;

  // Extraer mensaje de error si existe
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : null;

  // Icono por defecto según variante
  const defaultIcons = {
    error: (
      <svg
        className="w-16 h-16 text-danger"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-16 h-16 text-warning"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    network: (
      <svg
        className="w-16 h-16 text-text-muted"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="mb-4">{icon || defaultIcons[variant]}</div>

      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {finalTitle}
      </h3>

      <p className="text-sm text-text-secondary max-w-md mb-4">
        {finalMessage}
      </p>

      {showDetails && errorMessage ? (
        <details className="mb-6 max-w-lg w-full">
          <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary mb-2">
            Detalles técnicos
          </summary>
          <div className="mt-2 p-3 bg-background-secondary rounded-md text-left">
            <code className="text-xs text-danger break-all">
              {errorMessage}
            </code>
          </div>
        </details>
      ) : null}

      {onRetry ? (
        <Button onClick={onRetry} variant="primary">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
};
