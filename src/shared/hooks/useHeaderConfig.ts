import { useEffect } from "react";
import { useHeader, HeaderConfig } from "@/shared/contexts/HeaderContext";

export function useHeaderConfig(config: HeaderConfig) {
  const { setHeaderConfig, resetHeader } = useHeader();

  useEffect(() => {
    setHeaderConfig(config);

    return () => {
      resetHeader();
    };
  }, [config.title, config.description, setHeaderConfig, resetHeader]);
}
