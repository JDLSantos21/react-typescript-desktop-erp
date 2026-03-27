import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";
import { Button } from "./Button";
import { CalendarIcon } from "@/shared/components/icons";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import dayjs from "dayjs";
import { formatDate } from "@/shared/utils/formatters";

interface DateRangeValue {
  start_date?: string;
  end_date?: string;
}

interface DateRangeSelectorProps {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  className?: string;
  placeholder?: string;
  allowClear?: boolean;
}

const parseDateString = (dateStr?: string) => {
  if (!dateStr) {
    return undefined;
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function DateRangeSelector({
  value,
  onChange,
  className,
  placeholder = "Selecciona el rango",
  allowClear = true,
}: DateRangeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(
    undefined,
  );

  const selectedRange = useMemo<DateRange>(
    () =>
      draftRange ?? {
        from: parseDateString(value.start_date),
        to: parseDateString(value.end_date),
      },
    [draftRange, value.end_date, value.start_date],
  );

  const displayDateRange = useMemo(() => {
    if (!value.start_date || !value.end_date) {
      return placeholder;
    }

    return `${dayjs(value.start_date).format("DD MMM")} - ${dayjs(value.end_date).format("DD MMM")}`;
  }, [placeholder, value.end_date, value.start_date]);

  return (
    <div>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);

          if (!nextOpen) {
            setDraftRange(undefined);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            icon={CalendarIcon}
            iconClassName="w-5 h-5"
            className={className}
          >
            {displayDateRange}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto space-y-3 p-3">
          <Calendar
            locale={es}
            mode="range"
            selected={selectedRange}
            onSelect={(range) => {
              setDraftRange(range);

              if (range?.from && range?.to) {
                onChange({
                  start_date: formatDate(range.from, "YYYY-MM-DD"),
                  end_date: formatDate(range.to, "YYYY-MM-DD"),
                });
              }
            }}
            numberOfMonths={2}
            disabled={(date) => date > new Date()}
          />

          {allowClear && (value.start_date || value.end_date) ? (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-text-secondary hover:text-text-primary"
                onClick={() => {
                  setDraftRange(undefined);
                  onChange({
                    start_date: undefined,
                    end_date: undefined,
                  });
                  setOpen(false);
                }}
              >
                Limpiar rango
              </button>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}
