import { createContext, useContext, useEffect, useReducer } from "react";
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

type SocketAction =
  | { type: "INIT"; payload: Socket }
  | { type: "CONNECTED" }
  | { type: "DISCONNECTED" }
  | { type: "CLEAR" };

const socketReducer = (
  state: { socket: Socket | null; isConnected: boolean },
  action: SocketAction,
) => {
  switch (action.type) {
    case "INIT":
      return { ...state, socket: action.payload };
    case "CONNECTED":
      return { ...state, isConnected: true };
    case "DISCONNECTED":
      return { ...state, isConnected: false };
    case "CLEAR":
      return { socket: null, isConnected: false };
    default:
      return state;
  }
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socketState, dispatch] = useReducer(socketReducer, {
    socket: null,
    isConnected: false,
  });
  const { socket, isConnected } = socketState;

  const { accessToken, isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
      isAuthenticated: state.isAuthenticated,
    })),
  );

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      dispatch({ type: "CLEAR" });
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

      dispatch({ type: "INIT", payload: socketInstance });

      socketInstance.on("connect", () => dispatch({ type: "CONNECTED" }));
      socketInstance.on("connect_error", () =>
        dispatch({ type: "DISCONNECTED" }),
      );
      socketInstance.on("disconnect", () => dispatch({ type: "DISCONNECTED" }));

      return () => {
        socketInstance.disconnect();
      };
    } catch (error) {
      console.error("No se pude iniciar la conexión al socket", baseApiUrl);
      dispatch({ type: "CLEAR" });
      return;
    }
  }, [isAuthenticated, accessToken]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
