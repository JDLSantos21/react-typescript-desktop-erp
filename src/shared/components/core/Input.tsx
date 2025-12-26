import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: "default" | "filled" | "outlined";
  inputSize?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 px-3 py-1.5 text-sm",
  md: "h-10 px-3 py-2 text-sm",
  lg: "h-12 px-4 py-3 text-base",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      variant = "default",
      inputSize = "md",
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "w-full rounded-md transition-colors duration-200 focus:outline-none";

    const variantStyles = {
      default: `border bg-background ${
        error
          ? "border-danger focus:ring-2 focus:ring-danger/20"
          : "border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
      }`,
      filled: `border-0 ${
        error
          ? "bg-danger/10 focus:bg-danger/20"
          : "bg-background-secondary focus:bg-background-hover"
      }`,
      outlined: `border-2 bg-transparent ${
        error
          ? "border-danger focus:border-danger"
          : "border-border focus:border-primary"
      }`,
    };

    const disabledStyles = disabled
      ? "opacity-50 cursor-not-allowed bg-background-secondary"
      : "";

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-xs font-medium mb-1.5 text-input-label"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={`
              ${baseStyles}
              ${variantStyles[variant]}
              ${sizeClasses[inputSize]}
              ${disabledStyles}
              ${startIcon ? "pl-10" : ""}
              ${endIcon ? "pr-10" : ""}
              ${className}
            `}
            {...props}
          />

          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {endIcon}
            </div>
          )}
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

Input.displayName = "Input";
