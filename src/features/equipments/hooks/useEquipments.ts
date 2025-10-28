import { useQuery } from "@tanstack/react-query";
import { EquipmentKeys } from "../api/equipment.keys";
import { EquipmentService } from "../api/equipment.service";

export const useGetEquipmentsByCustomerId = (customerId: string) => {
  return useQuery({
    queryKey: EquipmentKeys.list({ customerId }),
    queryFn: () => EquipmentService.getAllByCustomerId(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};
