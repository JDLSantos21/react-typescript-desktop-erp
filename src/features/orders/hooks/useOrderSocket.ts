import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/shared/contexts/SocketContext";
import { orderKeys } from "../api/order.keys";
import { toast } from "sonner";

export const useOrderSocket = () => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleOrderCreated = () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.counts() });

      toast.info("Nuevo pedido recibido", {
        description: `Se ha creado un nuevo pedido.`,
      });
    };

    const handleOrderUpdated = (data: { id: number }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.counts() });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(data.id.toString()),
      });
    };

    const handleOrderDeleted = () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.counts() });
    };

    socket.on("order:created", handleOrderCreated);
    socket.on("order:updated", handleOrderUpdated);
    socket.on("order:deleted", handleOrderDeleted);

    return () => {
      socket.off("order:created", handleOrderCreated);
      socket.off("order:updated", handleOrderUpdated);
      socket.off("order:deleted", handleOrderDeleted);
    };
  }, [socket, queryClient]);
};
