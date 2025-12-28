import { ReactNode, forwardRef } from "react";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string; // Para react-hook-form
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  startIcon?: ReactNode;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = "Seleccionar...",
      value,
      defaultValue,
      onValueChange,
      name,
      disabled,
      className = "",
      size = "md",
      startIcon,
    },
    ref
  ) => {
    const sizeMap: Record<"sm" | "md" | "lg", "sm" | "default"> = {
      sm: "sm",
      md: "default",
      lg: "default",
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium mb-1.5 text-input-label">
            {label}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10">
              {startIcon}
            </div>
          )}

          <ShadcnSelect
            value={value ?? defaultValue}
            onValueChange={onValueChange}
            disabled={disabled}
            name={name}
          >
            <SelectTrigger
              ref={ref}
              size={sizeMap[size]}
              className={`
                w-full
                ${size === "lg" ? "h-12 px-4 py-3 text-base" : ""}
                ${
                  error
                    ? "border-danger focus:border-danger focus:ring-danger/20"
                    : ""
                }
                ${startIcon ? "pl-10" : ""}
                ${className}
              `}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.icon && (
                    <span className="mr-2 inline-flex">{option.icon}</span>
                  )}
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadcnSelect>
        </div>

        {(error || helperText) && (
          <p
            className={`text-xs mt-1.5 ${
              error ? "text-danger" : "text-text-muted"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
