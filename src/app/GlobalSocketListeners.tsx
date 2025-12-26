import { useOrderSocket } from "@/features/orders/hooks/useOrderSocket";

export const GlobalSocketListeners = () => {
  useOrderSocket();

  return null;
};
