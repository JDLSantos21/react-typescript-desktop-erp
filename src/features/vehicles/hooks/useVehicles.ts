import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/query-client";
import { vehicleKeys } from "../api/vehicle.keys";
import { GetVehicleParams, VehicleInput } from "../types/vehicles";
import { VehicleService } from "../api/vehicles.service";

export const useGetVehicles = (params: GetVehicleParams, enabled = true) => {
  return useQuery({
    queryKey: vehicleKeys.list(params),
    queryFn: () => VehicleService.getVehicles(params),
    enabled,
  });
};

export const useGetVehicle = (id?: string) =>
  useQuery({
    queryKey: vehicleKeys.detail(id ?? ""),
    queryFn: () => VehicleService.getVehicle(id ?? ""),
    enabled: Boolean(id),
  });

const invalidateVehicles = () =>
  queryClient.invalidateQueries({ queryKey: vehicleKeys.all });

export const useCreateVehicle = () =>
  useMutation({
    mutationFn: (data: VehicleInput) => VehicleService.createVehicle(data),
    onSuccess: invalidateVehicles,
  });

export const useUpdateVehicle = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: VehicleInput }) =>
      VehicleService.updateVehicle(id, data),
    onSuccess: invalidateVehicles,
  });

export const useDeleteVehicle = () =>
  useMutation({
    mutationFn: VehicleService.deleteVehicle,
    onSuccess: invalidateVehicles,
  });
