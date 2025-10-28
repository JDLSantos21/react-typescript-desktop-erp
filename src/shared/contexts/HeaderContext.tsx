import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface HeaderConfig {
  title: string;
  description?: string;
  actions?: ReactNode;
}

interface HeaderContextType {
  config: HeaderConfig;
  setHeaderConfig: (config: HeaderConfig) => void;
  resetHeader: () => void;
}

const defaultConfig: HeaderConfig = {
  title: "",
  description: "",
  actions: null,
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeaderConfig>(defaultConfig);

  const setHeaderConfig = useCallback((newConfig: HeaderConfig) => {
    setConfig(newConfig);
  }, []);

  const resetHeader = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  return (
    <HeaderContext.Provider value={{ config, setHeaderConfig, resetHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within HeaderProvider");
  }
  return context;
}
