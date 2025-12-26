import { useEffect } from "react";
import { toast } from "sonner";

export const useRefetchToast = (
  isRefetching: boolean,
  message: string = "Actualizando información..."
) => {
  useEffect(() => {
    if (isRefetching) {
      toast.loading(message, {
        id: "refetch-toast",
        position: "top-center",
      });
    } else {
      toast.dismiss("refetch-toast");
    }
  }, [isRefetching, message]);
};
