import { useQuery } from "@tanstack/react-query";
import { EquipmentKeys } from "../api/equipment.keys";
import { EquipmentService } from "../api/equipment.service";
import { EquipmentFilters } from "../types/equipment.dto";

export const useGetEquipments = (params?: EquipmentFilters) => {
  return useQuery({
    queryKey: EquipmentKeys.list(params),
    queryFn: () => EquipmentService.getAll(params),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

export const useGetEquipmentById = (id?: string) => {
  return useQuery({
    queryKey: EquipmentKeys.detail(id ?? ""),
    queryFn: () => EquipmentService.getById(id ?? ""),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

export const useGetEquipmentsByCustomerId = (customerId: string) => {
  return useQuery({
    queryKey: EquipmentKeys.list({ customerId }),
    queryFn: () => EquipmentService.getAllByCustomerId(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};
