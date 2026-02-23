import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/shared/stores/authStore";
import { useShallow } from "zustand/shallow";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { accessToken, isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
      isAuthenticated: state.isAuthenticated,
    })),
  );

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setIsConnected(false);
      setSocket(null);
      return;
    }

    const baseApiUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

    try {
      const url = new URL(baseApiUrl);
      const socketUrl = url.origin;

      const socketInstance = io(socketUrl, {
        auth: {
          token: accessToken,
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketInstance.on("connect", () => setIsConnected(true));

      socketInstance.on("connect_error", () => setIsConnected(false));

      socketInstance.on("disconnect", () => setIsConnected(false));

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } catch (error) {
      console.error("No se pude iniciar la conexión al socket", baseApiUrl);
      setIsConnected(false);
      return;
    }
  }, [isAuthenticated, accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
