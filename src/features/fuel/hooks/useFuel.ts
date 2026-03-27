import { useMutation, useQuery } from "@tanstack/react-query";
import { FuelKeys } from "../api/fuel.keys";
import { FuelService } from "../api/fuel.service";
import { GetFuelConsumptionsParams } from "../types/fuel";
import { RegisterConsumptionFormData } from "../schemas/fuel.schema";
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

export const useGetFuelConsumptions = (params: GetFuelConsumptionsParams) => {
  return useQuery({
    queryKey: FuelKeys.consumptions(params),
    queryFn: () => FuelService.getConsumptions(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
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
