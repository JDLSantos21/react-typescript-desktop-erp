import { ButtonHTMLAttributes, ComponentType } from "react";
import { IconBaseProps } from "react-icons";
import { Spinner } from "./Spinner";

const variants = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200",
  outline: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizes = {
  sm: "h-8 px-3 py-1.5 text-sm",
  md: "h-10 px-4 py-2 text-sm",
  lg: "h-12 px-5 py-3 text-lg",
};

const iconSizes = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
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
  const baseStyles = "rounded-md transition-colors border";
  const hasIconOrLoading = Icon || isLoading;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        hasIconOrLoading ? "flex items-center gap-2 justify-center" : ""
      } ${
        disabled || isLoading
          ? "opacity-70 cursor-not-allowed"
          : "cursor-pointer"
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {Icon && iconPosition === "left" && !isLoading && (
        <Icon className={`${iconSizes[size]} ${iconClassName}`} />
      )}
      {children}
      {Icon && iconPosition === "right" && !isLoading && (
        <Icon className={`${iconSizes[size]} ${iconClassName}`} />
      )}
      {isLoading && <Spinner size="sm" />}
    </button>
  );
};
