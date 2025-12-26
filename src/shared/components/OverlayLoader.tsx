import { Button } from "./core/Button";
import { Spinner } from "./core/Spinner";
import { X } from "lucide-react";

interface OverlayLoaderProps {
  title?: string;
  description?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  cancelText?: string;
}

export const OverlayLoader = ({
  title = "Procesando",
  description = "Por favor espera un momento",
  showCancel = false,
  onCancel,
  cancelText = "Cancelar",
}: OverlayLoaderProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 space-y-6">
        {/* Spinner */}
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>

        {/* Cancel Button */}
        {showCancel && onCancel && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              icon={X}
              iconPosition="left"
            >
              {cancelText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
