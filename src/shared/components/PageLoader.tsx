import { Spinner } from "./core/Spinner";

export const PageLoader = () => {
  return (
    <div className="min-h-full flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Spinner size="lg" className="mx-auto" />

        <div className="space-y-1">
          <p className="text-sm font-medium text-text-primary">Cargando</p>
          <p className="text-xs text-text-secondary">
            Por favor espera un momento
          </p>
        </div>
      </div>
    </div>
  );
};
