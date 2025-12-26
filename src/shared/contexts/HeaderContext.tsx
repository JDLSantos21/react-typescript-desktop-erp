import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";

export interface HeaderConfig {
  title: string;
  description?: string;
  actions?: ReactNode;
  customContent?: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  dropdownMenu?: ReactNode;
}

interface HeaderDispatchContextType {
  setHeaderConfig: (config: HeaderConfig) => void;
  resetHeader: () => void;
}

const defaultConfig: HeaderConfig = {
  title: "",
  description: "",
  actions: null,
};

const HeaderStateContext = createContext<HeaderConfig | undefined>(undefined);
const HeaderDispatchContext = createContext<
  HeaderDispatchContextType | undefined
>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeaderConfig>(defaultConfig);

  const setHeaderConfig = useCallback((newConfig: HeaderConfig) => {
    setConfig(newConfig);
  }, []);

  const resetHeader = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  const dispatch = useMemo(
    () => ({ setHeaderConfig, resetHeader }),
    [setHeaderConfig, resetHeader]
  );

  return (
    <HeaderDispatchContext.Provider value={dispatch}>
      <HeaderStateContext.Provider value={config}>
        {children}
      </HeaderStateContext.Provider>
    </HeaderDispatchContext.Provider>
  );
}

export function useHeaderState() {
  const context = useContext(HeaderStateContext);
  if (context === undefined) {
    throw new Error("useHeaderState must be used within a HeaderProvider");
  }
  return context;
}

export function useHeaderDispatch() {
  const context = useContext(HeaderDispatchContext);
  if (context === undefined) {
    throw new Error("useHeaderDispatch must be used within a HeaderProvider");
  }
  return context;
}

export function useHeader() {
  const config = useHeaderState();
  const dispatch = useHeaderDispatch();
  return { config, ...dispatch };
}
