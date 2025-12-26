import { ButtonHTMLAttributes, ComponentType } from "react";
import { IconBaseProps } from "react-icons";
import { Spinner } from "./Spinner";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover border-primary",
  secondary: "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200",
  outline: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700 border-red-600",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-50 border-transparent",
};

const sizes = {
  xs: "h-6 px-2 py-1 text-xs",
  sm: "h-8 px-3 py-1.5 text-xs",
  md: "h-10 px-4 py-2 text-sm",
  lg: "h-12 px-5 py-3 text-base",
  icon: "h-8 w-8 p-0",
};

const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  icon: "",
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
    "rounded-sm transition-all duration-150 border outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200 disabled:focus:ring-0 font-medium";
  const hasIconOrLoading = Icon || isLoading;
  const isIconOnly = size === "icon";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        hasIconOrLoading || isIconOnly
          ? "flex items-center gap-2 justify-center"
          : ""
      } ${
        disabled || isLoading
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {Icon && iconPosition === "left" && !isLoading && (
        <Icon
          className={`${
            isIconOnly ? "w-4 h-4" : iconSizes[size]
          } ${iconClassName}`}
        />
      )}
      {!isIconOnly && children}
      {Icon && iconPosition === "right" && !isLoading && (
        <Icon className={`${iconSizes[size]} ${iconClassName}`} />
      )}
      {isLoading && <Spinner size="sm" />}
    </button>
  );
};
