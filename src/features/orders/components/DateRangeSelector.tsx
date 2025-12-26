import { Button, CalendarIcon } from "@/shared/components";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { es } from "date-fns/locale";
import { formatDate } from "@/shared/utils";

interface DateRangeSelectorProps {
  value: { start_date: string; end_date: string };
  onChange: (range: { start_date: string; end_date: string }) => void;
  className?: string;
}

export default function DateRangeSelector({
  value,
  onChange,
  className,
}: DateRangeSelectorProps) {
  const sanitizedDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({
    from: undefined,
    to: undefined,
  });

  const displayDateRange = useMemo(() => {
    if (!value.start_date || !value.end_date) return "Selecciona el rango";

    const startDate = sanitizedDate(value.start_date);
    const endDate = sanitizedDate(value.end_date);

    const start = dayjs(startDate).format("DD MMM");
    const end = dayjs(endDate).format("DD MMM");

    return `${start} - ${end}`;
  }, [value]);

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" icon={CalendarIcon} iconClassName="w-5 h-5">
            {displayDateRange}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto">
          <Calendar
            locale={es}
            mode="range"
            selected={{
              from:
                customRange.from ||
                (value.start_date
                  ? (() => {
                      const [year, month, day] = value.start_date
                        .split("-")
                        .map(Number);
                      return new Date(year, month - 1, day);
                    })()
                  : undefined),
              to:
                customRange.to ||
                (value.end_date
                  ? (() => {
                      const [year, month, day] = value.end_date
                        .split("-")
                        .map(Number);
                      return new Date(year, month - 1, day);
                    })()
                  : undefined),
            }}
            onSelect={(range) => {
              if (range) {
                setCustomRange(range);
                console.log(range);
                if (range.from && range.to) {
                  onChange({
                    start_date: formatDate(range.from, "YYYY-MM-DD"),
                    end_date: formatDate(range.to, "YYYY-MM-DD"),
                  });
                }
              }
            }}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
        {/* Aquí iría el contenido del popover, como un selector de fechas */}
      </Popover>
    </div>
  );
}
