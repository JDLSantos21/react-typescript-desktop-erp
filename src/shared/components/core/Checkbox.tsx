import { InputHTMLAttributes, forwardRef } from "react";
import { CheckIcon } from "../icons";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative flex items-center">
            {/* Input oculto pero funcional */}
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              {...props}
            />
            {/* Checkbox visual personalizado */}
            <div
              className={`
                w-4 h-4 
                rounded border-2 border-gray-300
                flex items-center justify-center
                transition-all duration-150
                peer-checked:bg-primary peer-checked:border-primary
                peer-hover:border-primary/50
                peer-focus:ring-2 peer-focus:ring-primary/20 peer-focus:ring-offset-1
                peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                ${className}
              `}
            >
              <CheckIcon className="w-3 h-3 text-white transition-opacity duration-150" />
            </div>
          </div>
          {label && (
            <span className="text-sm text-input-label select-none">
              {label}
            </span>
          )}
        </label>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
