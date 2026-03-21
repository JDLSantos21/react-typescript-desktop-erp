import { useMutation, useQuery } from "@tanstack/react-query";
import { EquipmentKeys } from "../api/equipment.keys";
import { EquipmentService } from "../api/equipment.service";
import { EquipmentFilters } from "../types/equipment.dto";
import {
  EquipmentModelFormInput,
  UnassignEquipmentInput,
} from "../types/equipment";
import { queryClient } from "@/shared/lib/query-client";
import { extractApiError } from "@/shared/utils/error-handler";
import { sileo } from "sileo";

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

export const useGetModels = () => {
  return useQuery({
    queryKey: EquipmentKeys.models(),
    queryFn: () => EquipmentService.getAllModels(),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

export const useCreateModel = () => {
  return useMutation({
    mutationFn: (model: EquipmentModelFormInput) =>
      EquipmentService.createModel(model),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EquipmentKeys.models(),
      });
    },
  });
};

export const useCreateEquipment = () => {
  return useMutation({
    mutationFn: (model: { model_id: number }) =>
      EquipmentService.createEquipment(model),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EquipmentKeys.list(),
      });
    },
  });
};

export const useAssignEquipment = () => {
  return useMutation({
    mutationFn: (data: {
      equipmentId: string;
      customerId: string;
      customerAddressId: number;
      notes?: string;
    }) => EquipmentService.assignEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EquipmentKeys.all,
      });

      sileo.success({
        title: "Asignación Exitosa",
        description: "El equipo ha sido asignado correctamente",
      });
    },
    onError: (data) => {
      sileo.error({
        title: "Ocurrió un error",
        description: extractApiError(data).message ?? "Error al asignar equipo",
      });
    },
  });
};

export const useUnassignEquipment = () => {
  return useMutation({
    mutationFn: (data: UnassignEquipmentInput) =>
      EquipmentService.unassignEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EquipmentKeys.all,
      });

      sileo.success({
        title: "Desasignación Exitosa",
        description:
          "La asignación de este equipo ha sido eliminada correctamente",
      });
    },
    onError: (data) => {
      sileo.error({
        title: "Ocurrió un error",
        description:
          extractApiError(data).message ?? "Error al eliminar asignación",
      });
    },
  });
};
