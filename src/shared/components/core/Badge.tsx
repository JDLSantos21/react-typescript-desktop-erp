import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: BadgeProps) => {
  const variants = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-sky-100 text-sky-800",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-[11px]",
    md: "px-2.5 py-1 text-[12px]",
    lg: "px-3 py-1.5 text-[13px]",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${variants[variant]} ${sizes[size]} ${className} border-1`}
    >
      {children}
    </span>
  );
};
