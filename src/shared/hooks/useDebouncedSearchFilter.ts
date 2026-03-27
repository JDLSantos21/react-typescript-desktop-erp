import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

interface UseDebouncedSearchFilterOptions {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
}

export const useDebouncedSearchFilter = ({
  value,
  onChange,
  delay = 400,
}: UseDebouncedSearchFilterOptions) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, delay);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== inputValue) {
      return;
    }

    if (debouncedValue === value) {
      return;
    }

    onChange(debouncedValue);
  }, [debouncedValue, inputValue, onChange, value]);

  const clearInput = useCallback(() => {
    setInputValue("");
  }, []);

  return {
    inputValue,
    setInputValue,
    clearInput,
    hasPendingValue: inputValue.trim() !== "" && inputValue !== value,
  };
};
