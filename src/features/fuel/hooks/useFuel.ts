import { useMutation, useQuery } from "@tanstack/react-query";
import { FuelKeys } from "../api/fuel.keys";
import { FuelService } from "../api/fuel.service";
import { GetFuelConsumptionsParams, GetTankRefillsParams } from "../types/fuel";
import {
  RegisterConsumptionFormData,
  RegisterRefillFormData,
  FuelTankFormData,
} from "../schemas/fuel.schema";
import { sileo } from "sileo";
import { extractApiError } from "@/shared/utils/error-handler";
import { queryClient } from "@/shared/lib/query-client";

export const useGetFuelTank = () => {
  return useQuery({
    queryKey: FuelKeys.tank(),
    queryFn: () => FuelService.getTank(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useGetFuelConsumptions = (
  params?: GetFuelConsumptionsParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: FuelKeys.consumptions(params),
    queryFn: () => FuelService.getConsumptions(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled,
  });
};

export const useGetFuelSummary = () => {
  return useQuery({
    queryKey: FuelKeys.summary(),
    queryFn: () => FuelService.getFuelSummary(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useRegisterFuelConsumption = () => {
  return useMutation({
    mutationFn: (data: RegisterConsumptionFormData) =>
      FuelService.registerConsumption(data),
    onSuccess: () => {
      sileo.success({
        title: "Consumo registrado",
        description: "El consumo se ha registrado correctamente",
      });

      queryClient.invalidateQueries({ queryKey: FuelKeys.all });
    },
    onError: (error) => {
      sileo.error({
        title: "No se pudo registrar el consumo",
        description:
          extractApiError(error).message || "Ocurrió un problema desconocido",
      });
    },
  });
};

export const useGetTankRefills = (params?: GetTankRefillsParams) => {
  return useQuery({
    queryKey: FuelKeys.refills(params),
    queryFn: () => FuelService.getRefills(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetFuelRefillById = (id: string) => {
  return useQuery({
    queryKey: FuelKeys.refillById(id),
    queryFn: () => FuelService.getRefillById(id),
    staleTime: 1000 * 60 * 5,
  });
};

export const useRegisterTankRefill = () => {
  return useMutation({
    mutationFn: (data: RegisterRefillFormData) =>
      FuelService.registerRefill(data),
    onSuccess: () => {
      sileo.success({
        title: "Reabastecimiento registrado",
        description: "El reabastecimiento se ha registrado correctamente",
      });

      queryClient.invalidateQueries({ queryKey: FuelKeys.all });
    },
    onError: (error) => {
      sileo.error({
        title: "No se pudo reabastecer",
        description:
          extractApiError(error).message || "Ocurrió un problema desconocido",
      });
    },
  });
};

export const useResetFuelTank = () => {
  return useMutation({
    mutationFn: (data: { password: string }) => FuelService.resetTank(data),
    onSuccess: () => {
      sileo.success({
        title: "Tanque reseteado",
        description: "El tanque se ha reseteado correctamente",
      });

      queryClient.invalidateQueries({ queryKey: FuelKeys.all });
    },
    onError: (error) => {
      sileo.error({
        title: "No se pudo resetear el tanque",
        description:
          extractApiError(error).message || "Ocurrió un problema desconocido",
      });
    },
  });
};

export const useGetFuelMetrics = () => {
  return useQuery({
    queryKey: FuelKeys.metrics(),
    queryFn: () => FuelService.getFuelMetrics(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateFuelTank = () => useMutation({
  mutationFn: (data: FuelTankFormData) => FuelService.createTank(data),
  onSuccess: () => {
    sileo.success({ title: "Tanque configurado", description: "El tanque principal quedó registrado correctamente" });
    queryClient.invalidateQueries({ queryKey: FuelKeys.all });
  },
  onError: (error) => sileo.error({ title: "No se pudo configurar el tanque", description: extractApiError(error).message }),
});

export const useGetVehicleFuelAnalytics = (vehicleId?: string, enabled = true) =>
  useQuery({
    queryKey: [...FuelKeys.all, "vehicle-analytics", vehicleId],
    queryFn: () => FuelService.getVehicleAnalytics(vehicleId ?? ""),
    enabled: Boolean(vehicleId) && enabled,
    staleTime: 1000 * 60 * 5,
  });
