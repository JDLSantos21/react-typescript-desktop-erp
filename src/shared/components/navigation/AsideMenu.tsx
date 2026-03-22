import { ReactNode } from "react";
import { Tooltip } from "../core/Tooltip";

interface AsideMenuProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function AsideMenu({
  title = "Acciones",
  children,
  className = "",
}: AsideMenuProps) {
  return (
    <aside className={`p-6 h-fit xl:w-70 sticky top-2 mr-2 ${className}`}>
      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium">
          {title}
        </h2>
      </div>
      <nav className="space-y-1.5">{children}</nav>
    </aside>
  );
}

interface AsideButtonProps {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
  className?: string;
  disabled?: boolean;
  tooltip?: string | ReactNode;
  tooltipVariant?: "default" | "info" | "warning" | "error" | "success";
}

export function AsideButton({
  label,
  onClick,
  icon,
  variant = "default",
  className = "",
  disabled = false,
  tooltip,
  tooltipVariant = "default",
}: AsideButtonProps) {
  const button = (
    <button
      disabled={disabled}
      className={`
        group w-full text-left cursor-pointer 
        px-3 py-2 rounded-md
        text-sm ${
          variant === "danger"
            ? "text-red-600 hover:bg-red-50"
            : "text-gray-700 hover:bg-gray-50"
        }
        transition-colors duration-150
        flex items-center gap-3
        focus:outline-none ${className} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      onClick={onClick}
    >
      {icon && (
        <span
          className={`${
            variant === "danger" ? "text-red-500" : "text-gray-400"
          } transition-colors`}
        >
          {icon}
        </span>
      )}
      <span>{label}</span>
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip
        content={tooltip}
        variant={tooltipVariant}
        side="right"
        align="center"
        asChild
      >
        <div className="w-full">{button}</div>
      </Tooltip>
    );
  }

  return button;
}
