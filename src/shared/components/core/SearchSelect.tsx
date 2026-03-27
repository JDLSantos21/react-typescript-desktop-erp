import { useState, useEffect, useRef, useCallback } from "react";
import {
  SearchIcon,
  ChevronDownIcon,
  CheckIcon,
  LoaderIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export interface SearchSelectOption {
  value: string;
  label: string;
}

interface SearchSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options?: SearchSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  onSearch?: (query: string) => Promise<SearchSelectOption[]>;
  disabled?: boolean;
  emptyMessage?: string;
  debounceMs?: number;
  allowClear?: boolean;
  clearLabel?: string;
  className?: string;
}

export function SearchSelect({
  label,
  error,
  helperText,
  placeholder = "Buscar...",
  options: localOptions = [],
  value,
  onValueChange,
  onSearch,
  disabled = false,
  emptyMessage = "No se encontraron resultados",
  debounceMs = 300,
  allowClear = false,
  clearLabel = "Limpiar selección",
  className = "w-full",
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [asyncOptions, setAsyncOptions] = useState<SearchSelectOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Determinar la fuente de opciones
  const isAsync = !!onSearch;
  const baseOptions = isAsync ? asyncOptions : localOptions;

  // Filtrado local
  const filteredOptions = isAsync
    ? baseOptions
    : baseOptions.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase()),
      );

  // Label del item seleccionado
  const allOptions = [...localOptions, ...asyncOptions];
  const selectedLabel = allOptions.find((opt) => opt.value === value)?.label;

  // Búsqueda async con debounce
  const handleAsyncSearch = useCallback(
    (searchQuery: string) => {
      if (!onSearch) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!searchQuery.trim()) {
        setAsyncOptions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await onSearch(searchQuery);
          setAsyncOptions(results);
        } catch {
          setAsyncOptions([]);
        } finally {
          setIsSearching(false);
        }
      }, debounceMs);
    },
    [onSearch, debounceMs],
  );

  // Limpiar debounce al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Focus en el input al abrir el dropdown
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      if (isAsync) setAsyncOptions([]);
    }
  }, [open, isAsync]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (isAsync) handleAsyncSearch(val);
  };

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setOpen(false);
  };

  const handleClear = () => {
    onValueChange("");
    setOpen(false);
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-xs font-medium mb-1.5 text-input-label">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`
              w-full h-10 px-3 py-2 text-sm text-left
              rounded-md border bg-background
              transition-colors duration-200
              flex items-center justify-between gap-2
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              ${error ? "border-danger focus:ring-danger/20" : "border-border"}
              ${disabled ? "opacity-50 cursor-not-allowed bg-background-secondary" : "cursor-pointer"}
            `}
          >
            <span
              className={
                selectedLabel ? "text-text-primary" : "text-text-muted"
              }
            >
              {selectedLabel || placeholder}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-text-muted shrink-0" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 w-(--radix-popover-trigger-width)  z-10000"
          align="start"
          sideOffset={4}
        >
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            {isSearching ? (
              <LoaderIcon className="w-4 h-4 text-text-muted animate-spin shrink-0" />
            ) : (
              <SearchIcon className="w-4 h-4 text-text-muted shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full text-sm bg-transparent outline-none placeholder:text-text-muted"
            />
          </div>

          {/* Options list */}
          <div className="max-h-52 overflow-y-auto py-1">
            {allowClear && value ? (
              <button
                type="button"
                onClick={handleClear}
                className="w-full px-3 py-2 text-sm text-left text-text-muted hover:bg-background-hover"
              >
                {clearLabel}
              </button>
            ) : null}

            {filteredOptions.length === 0 ? (
              <p className="px-3 py-4 text-sm text-text-muted text-center">
                {isSearching ? "Buscando..." : emptyMessage}
              </p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full px-3 py-2 text-sm text-left
                      flex items-center justify-between
                      transition-colors duration-100
                      ${isSelected ? "bg-primary/10 text-primary font-medium" : "text-text-primary hover:bg-background-hover"}
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <CheckIcon className="w-4 h-4 text-primary shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {(error || helperText) && (
        <p
          className={`text-xs mt-1.5 ${
            error ? "text-danger" : "text-text-muted"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
