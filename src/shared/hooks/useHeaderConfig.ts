import { useEffect } from "react";
import {
  useHeaderDispatch,
  HeaderConfig,
} from "@/shared/contexts/HeaderContext";

export function useHeaderConfig(config?: HeaderConfig) {
  const { setHeaderConfig, resetHeader } = useHeaderDispatch();

  useEffect(() => {
    if (config) {
      setHeaderConfig(config);

      return () => {
        resetHeader();
      };
    }
  }, [
    config?.title,
    config?.description,
    config?.customContent,
    config?.actions,
    setHeaderConfig,
    resetHeader,
  ]);

  return { setHeaderConfig, resetHeader };
}
