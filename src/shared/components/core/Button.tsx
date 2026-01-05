import { ButtonHTMLAttributes, ComponentType } from "react";
import { IconBaseProps } from "react-icons";
import { Spinner } from "./Spinner";

const variants = {
  // El primario ahora es Slate-900 (Negro corporativo moderno)
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 border border-transparent shadow-sm shadow-slate-200 hover:shadow-md",
  // El secundario es un gris muy suave
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-transparent",
  // Outline limpio
  outline:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
  // Danger más suave
  danger:
    "bg-rose-500 text-white hover:bg-rose-600 border border-transparent shadow-sm shadow-rose-200",
  // Ghost minimalista
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent",
};

const sizes = {
  xs: "h-7 px-2.5 text-xs rounded-lg",
  sm: "h-9 px-3 text-xs font-medium rounded-lg",
  md: "h-10 px-4 py-2 text-sm font-medium rounded-xl",
  lg: "h-12 px-6 text-base font-medium rounded-xl",
  icon: "h-10 w-10 p-0 flex items-center justify-center rounded-xl",
};

const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  icon: "w-5 h-5",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  isLoading?: boolean;
  size?: keyof typeof sizes;
  icon?: ComponentType<IconBaseProps>;
  iconPosition?: "left" | "right";
  iconClassName?: string;
}

export const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  iconClassName = "",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const hasIconOrLoading = Icon || isLoading;
  const isIconOnly = size === "icon";

  return (
    <button
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${
          hasIconOrLoading && !isIconOnly
            ? "flex items-center gap-2 justify-center"
            : ""
        } 
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Spinner
          size="sm"
          className={
            variant === "outline" || variant === "ghost"
              ? "text-slate-900"
              : "text-white"
          }
        />
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon
              className={`${
                isIconOnly ? "w-5 h-5" : iconSizes[size]
              } ${iconClassName}`}
            />
          )}
          {!isIconOnly && children}
          {Icon && iconPosition === "right" && (
            <Icon className={`${iconSizes[size]} ${iconClassName}`} />
          )}
        </>
      )}
    </button>
  );
};
