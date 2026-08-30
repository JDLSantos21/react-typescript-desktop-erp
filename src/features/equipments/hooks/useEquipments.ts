import { useMutation, useQuery } from "@tanstack/react-query";
import { EquipmentKeys } from "../api/equipment.keys";
import { EquipmentService } from "../api/equipment.service";
import { EquipmentAssignmentFilters, EquipmentFilters, EquipmentInactivityAlertFilters } from "../types/equipment.dto";
import {
  EquipmentModelFormInput,
  UnassignEquipmentInput,
} from "../types/equipment";
import { queryClient } from "@/shared/lib/query-client";
import { extractApiError } from "@/shared/utils/error-handler";
import { sileo } from "sileo";
import { EquipmentSite } from "@/shared/types/entities/equipment.types";

export const useGetEquipments = (params?: EquipmentFilters) => {
  return useQuery({
    queryKey: EquipmentKeys.list(params),
    queryFn: () => EquipmentService.getAll(params),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

export const useEquipmentDashboard = () =>
  useQuery({
    queryKey: EquipmentKeys.dashboard(),
    queryFn: EquipmentService.getDashboard,
  });

export const useEquipmentAssignments = (params?: EquipmentAssignmentFilters) =>
  useQuery({
    queryKey: EquipmentKeys.assignments(params),
    queryFn: () => EquipmentService.getAssignments(params),
  });

export const useEquipmentInactivityAlerts = (params?: EquipmentInactivityAlertFilters, enabled = true) =>
  useQuery({
    queryKey: EquipmentKeys.inactivityAlerts(params),
    queryFn: () => EquipmentService.getInactivityAlerts(params),
    enabled,
  });

export const useEquipmentMonitoringSettings = () =>
  useQuery({
    queryKey: EquipmentKeys.monitoringSettings(),
    queryFn: EquipmentService.getMonitoringSettings,
  });

export const useUpdateEquipmentMonitoringSettings = () =>
  useMutation({
    mutationFn: EquipmentService.updateMonitoringSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EquipmentKeys.all }),
  });

export const useModelMonitoringProducts = (modelId?: number) =>
  useQuery({
    queryKey: EquipmentKeys.modelMonitoringProducts(modelId ?? 0),
    queryFn: () => EquipmentService.getModelMonitoringProducts(modelId ?? 0),
    enabled: Boolean(modelId),
  });

export const useUpdateModelMonitoringProducts = () =>
  useMutation({
    mutationFn: ({ modelId, productIds }: { modelId: number; productIds: number[] }) => EquipmentService.updateModelMonitoringProducts(modelId, productIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.modelMonitoringProducts(variables.modelId) });
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.all });
    },
  });

export const useUpdateAssignmentMonitoring = () =>
  useMutation({
    mutationFn: ({ assignmentId, orderInactivityDays }: { assignmentId: number; orderInactivityDays: number | null }) => EquipmentService.updateAssignmentMonitoring(assignmentId, orderInactivityDays),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.assignment(variables.assignmentId) });
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.all });
    },
  });

export const useDeleteEquipment = () => {
  return useMutation({
    mutationFn: (id: string) => EquipmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EquipmentKeys.all,
      });

      sileo.success({
        title: "Eliminación Exitosa",
        description: "El equipo ha sido eliminado correctamente",
      });
    },
    onError: (data) => {
      sileo.error({
        title: "Ocurrió un error",
        description:
          extractApiError(data).message ?? "Error al eliminar equipo",
      });
    },
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

export const useUpdateModel = () =>
  useMutation({
    mutationFn: ({
      id,
      model,
    }: {
      id: number;
      model: EquipmentModelFormInput;
    }) => EquipmentService.updateModel(id, model),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.models() }),
  });

export const useDeleteModel = () =>
  useMutation({
    mutationFn: EquipmentService.deleteModel,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.models() }),
  });

export const useCreateEquipment = () => {
  return useMutation({
    mutationFn: (model: { modelId: number; siteId: number }) =>
      EquipmentService.createEquipment(model),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EquipmentKeys.list(),
      });
    },
  });
};

export const useEquipmentSites = (includeInactive = false) =>
  useQuery({
    queryKey: [...EquipmentKeys.sites(), includeInactive],
    queryFn: () => EquipmentService.getSites(includeInactive),
  });

export const useCreateEquipmentSite = () =>
  useMutation({
    mutationFn: (data: Omit<EquipmentSite, "id" | "createdAt" | "updatedAt">) => EquipmentService.createSite(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EquipmentKeys.sites() }),
  });

export const useUpdateEquipmentSite = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<EquipmentSite, "id" | "createdAt" | "updatedAt"> }) => EquipmentService.updateSite(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EquipmentKeys.sites() }),
  });

export const useEquipmentAssignment = (id?: number) =>
  useQuery({
    queryKey: EquipmentKeys.assignment(id ?? 0),
    queryFn: () => EquipmentService.getAssignment(id ?? 0),
    enabled: Boolean(id),
  });

export const useEquipmentLocationHistory = (equipmentId?: string) =>
  useQuery({
    queryKey: EquipmentKeys.locationHistory(equipmentId ?? ""),
    queryFn: () => EquipmentService.getLocationHistory(equipmentId ?? ""),
    enabled: Boolean(equipmentId),
  });

export const useCustomerDocumentStatus = (customerId?: string) =>
  useQuery({
    queryKey: EquipmentKeys.customerDocumentStatus(customerId ?? ""),
    queryFn: () => EquipmentService.getCustomerDocumentStatus(customerId ?? ""),
    enabled: Boolean(customerId),
  });

export const useCustomerDocuments = (customerId?: string, enabled = true) =>
  useQuery({
    queryKey: EquipmentKeys.customerDocuments(customerId ?? ""),
    queryFn: () => EquipmentService.getCustomerDocuments(customerId ?? ""),
    enabled: Boolean(customerId) && enabled,
  });

export const useCustomerAssignmentDocuments = (customerId?: string, enabled = true) =>
  useQuery({
    queryKey: EquipmentKeys.customerAssignmentDocuments(customerId ?? ""),
    queryFn: () => EquipmentService.getCustomerAssignmentDocuments(customerId ?? ""),
    enabled: Boolean(customerId) && enabled,
  });

export const useMoveEquipment = () =>
  useMutation({
    mutationFn: ({ equipmentId, siteId, notes }: { equipmentId: string; siteId: number; notes?: string }) => EquipmentService.moveEquipment(equipmentId, siteId, notes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EquipmentKeys.all }),
  });

export const useAttachCustomerDocument = () =>
  useMutation({
    mutationFn: ({ customerId, file, replaceActive = false }: { customerId: string; file: File; replaceActive?: boolean }) => EquipmentService.uploadFile(file).then((fileId) => EquipmentService.attachCustomerDocument(customerId, fileId, replaceActive)),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.customerDocuments(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.customerDocumentStatus(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.all });
    },
  });

export const useRemoveCustomerDocument = () =>
  useMutation({
    mutationFn: ({ customerId, documentId }: { customerId: string; documentId: string }) => EquipmentService.removeCustomerDocument(customerId, documentId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.customerDocuments(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.customerDocumentStatus(variables.customerId) });
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.all });
    },
  });

export const useAttachContract = () =>
  useMutation({
    mutationFn: ({ assignmentId, file, replaceActive = false }: { assignmentId: number; file: File; replaceActive?: boolean }) => EquipmentService.uploadFile(file).then((fileId) => EquipmentService.attachContract(assignmentId, fileId, replaceActive)),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.assignment(variables.assignmentId) });
      queryClient.invalidateQueries({ queryKey: EquipmentKeys.all });
    },
  });

export const useRemoveAssignmentDocument = () =>
  useMutation({
    mutationFn: ({ assignmentId, documentId }: { assignmentId: number; documentId: string }) => EquipmentService.removeAssignmentDocument(assignmentId, documentId),
    onSuccess: (_data, variables) => queryClient.invalidateQueries({ queryKey: EquipmentKeys.assignment(variables.assignmentId) }),
  });

export const useDeliverEquipment = () =>
  useMutation({
    mutationFn: EquipmentService.deliver,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EquipmentKeys.all }),
  });

export const useLabelPrints = (equipmentId?: string) =>
  useQuery({
    queryKey: EquipmentKeys.labelPrints(equipmentId ?? ""),
    queryFn: () => EquipmentService.getLabelPrints(equipmentId ?? ""),
    enabled: Boolean(equipmentId),
  });

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
