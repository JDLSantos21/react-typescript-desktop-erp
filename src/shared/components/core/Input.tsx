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
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm", // Un poco más alto para modernidad (44px)
  lg: "h-14 px-4 text-base",
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
    // Base limpia sin borde duro inicial, usamos ring para foco
    const baseStyles =
      "w-full rounded-xl transition-all duration-200 outline-none font-medium placeholder:text-slate-400";

    const variantStyles = {
      default: `border bg-white ${
        error
          ? "border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
          : "border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-4 focus:ring-slate-50"
      }`,
      filled: `border-transparent ${
        error
          ? "bg-rose-50 text-rose-900 focus:bg-white focus:ring-2 focus:ring-rose-500"
          : "bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-slate-200 focus:shadow-sm"
      }`,
      outlined: `bg-transparent border-2 ${
        error
          ? "border-rose-500 text-rose-900"
          : "border-slate-200 text-slate-800 focus:border-slate-900"
      }`,
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-xs font-semibold mb-2 text-slate-700 ml-1"
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {startIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors">
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
              ${disabled ? "opacity-60 cursor-not-allowed bg-slate-50" : ""}
              ${startIcon ? "pl-11" : ""}
              ${endIcon ? "pr-11" : ""}
              ${className}
            `}
            {...props}
          />

          {endIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {endIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            className={`text-xs mt-2 ml-1 font-medium ${
              error ? "text-rose-500" : "text-slate-400"
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
