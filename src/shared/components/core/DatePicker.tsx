import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Seleccionar fecha",
  error,
  helperText,
  disabled,
  className,
}: DatePickerProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-xs font-medium mb-1.5 text-input-label">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal cursor-pointer",
              !value && "text-muted-foreground",
              error && "border-danger focus-visible:ring-danger/20",
              "h-10 px-3 py-2 text-sm border-border bg-background hover:bg-background-hover shadow-none"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(value, "PPP", { locale: es })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            locale={es}
          />
        </PopoverContent>
      </Popover>
      {(error || helperText) && (
        <p
          className={cn(
            "text-xs mt-1.5",
            error ? "text-danger" : "text-text-muted"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
