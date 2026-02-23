import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/shared/utils/cn";

const tooltipVariants = cva("", {
  variants: {
    variant: {
      default: "bg-gray-900 text-white border-gray-900",
      info: "bg-blue-600 text-white border-blue-600",
      warning: "bg-amber-500 text-white border-amber-500",
      error: "bg-red-600 text-white border-red-600",
      success: "bg-green-600 text-white border-green-600",
    },
    size: {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-xs",
      lg: "px-4 py-2 text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

const arrowVariants = cva("", {
  variants: {
    variant: {
      default: "bg-gray-900 fill-gray-900",
      info: "bg-blue-600 fill-blue-600",
      warning: "bg-amber-500 fill-amber-500",
      error: "bg-red-600 fill-red-600",
      success: "bg-green-600 fill-green-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
  asChild?: boolean;
}

export const Tooltip = ({
  children,
  content,
  side = "top",
  align = "center",
  variant,
  size,
  delayDuration = 200,
  className,
  asChild = false,
}: TooltipProps) => {
  return (
    <ShadcnTooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className={cn(tooltipVariants({ variant, size }), className)}
        arrowClassName={arrowVariants({ variant })}
      >
        {content}
      </TooltipContent>
    </ShadcnTooltip>
  );
};
