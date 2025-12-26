import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/shared/stores/authStore";

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
  const { accessToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      // Asumimos que la URL del socket es la misma que la base de la API,
      // pero si la API tiene un prefijo como /api/v1, tal vez necesitemos ajustar esto.
      // Por lo general, socket.io se monta en la raíz del servidor.
      // Vamos a intentar extraer el origen de la URL de la API si es posible,
      // o usar una variable de entorno específica si existiera.
      // Por ahora usaremos VITE_API_BASE_URL pero ten en cuenta esto.

      const url = new URL(import.meta.env.VITE_API_BASE_URL);
      const socketUrl = url.origin; // Esto nos da http://localhost:3000 si la base es http://localhost:3000/api

      const socketInstance = io(socketUrl, {
        auth: {
          token: accessToken,
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
        setIsConnected(true);
      });

      socketInstance.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        setIsConnected(false);
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
