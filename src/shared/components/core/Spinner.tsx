import { FiLoader } from "react-icons/fi";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

export const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return <FiLoader className={`animate-spin ${sizes[size]}  ${className}`} />;
};
