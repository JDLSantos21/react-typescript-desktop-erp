import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EquipmentKeys } from "../api/equipment.keys";
import {
  AssignEquipmentParams,
  EquipmentAlertFilters,
  EquipmentFilters,
  EquipmentService,
  UnassignEquipmentParams,
  UpdateModelParams,
} from "../api/equipment.service";
import { EquipmentModel } from "@/shared/types/entities/equipment.types";

export const useGetEquipmentsByCustomerId = (customerId: string) => {
  return useQuery({
    queryKey: EquipmentKeys.list({ customerId }),
    queryFn: () => EquipmentService.getAllByCustomerId(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

// Models
export const useCreateEquipmentModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<EquipmentModel, "id" | "createdAt" | "updatedAt">) => 
      EquipmentService.createModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.models() });
    },
  });
};

export const useUpdateEquipmentModel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ modelId, data }: UpdateModelParams) => 
      EquipmentService.updateModel({ modelId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.models() });
    },
  });
};

export const useGetAllEquipmentModels = () => {
  return useQuery({
    queryKey: EquipmentKeys.models(),
    queryFn: () => EquipmentService.getAllModels(),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

export const useGetModelById = (modelId: number) => {
  return useQuery({
    queryKey: EquipmentKeys.models(),
    queryFn: () => EquipmentService.findModelById(modelId),
    enabled: !!modelId,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

export const useAssignEquipmentToCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AssignEquipmentParams) => 
      EquipmentService.assignEquipmentToCustomer(data),
    onSuccess: (_, variables) => {
      // Invalidate equipment list queries
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.lists() });
      // Invalidate specific equipment detail
      if (variables.equipment_id) {
        queryClient.invalidateQueries({ 
          queryKey: EquipmentKeys.detail(variables.equipment_id) 
        });
      }
      // Invalidate customer equipment list
      if (variables.customer_id) {
        queryClient.invalidateQueries({ 
          queryKey: EquipmentKeys.list({ customerId: variables.customer_id }) 
        });
      }
    },
  });
};

export const useUnassignEquipmentFromCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UnassignEquipmentParams) => 
      EquipmentService.unassignEquipmentFromCustomer(data),
    onSuccess: () => {
      // Invalidate all equipment list queries to refresh status
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.lists() });
      // Note: We don't have equipment_id in UnassignEquipmentParams, 
      // so we invalidate all detail queries to be safe
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.details() });
    },
  });
};

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (model_id: number) => EquipmentService.create(model_id),
    onSuccess: () => {
      // Invalidate equipment list queries
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.lists() });
    },
  });
};

export const useFindEquipmentById = (equipmentId: string) => {
  return useQuery({
    queryKey: EquipmentKeys.detail(equipmentId),
    queryFn: () => EquipmentService.findById(equipmentId),
    enabled: !!equipmentId,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

export const useFindAllEquipments = (filters: EquipmentFilters) => {
  return useQuery({
    queryKey: EquipmentKeys.list(filters),
    queryFn: () => EquipmentService.findAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetEquipmentAlerts = (filters: EquipmentAlertFilters) => {
  return useQuery({
    queryKey: EquipmentKeys.alert(filters),
    queryFn: () => EquipmentService.getEquipmentAlerts(filters),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
