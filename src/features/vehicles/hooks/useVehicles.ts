import { useQuery } from "@tanstack/react-query";
import { vehicleKeys } from "../api/vehicle.keys";
import { GetVehicleParams } from "../types/vehicles";
import { VehicleService } from "../api/vehicles.service";

export const useGetVehicles = (params: GetVehicleParams, enabled = true) => {
  return useQuery({
    queryKey: vehicleKeys.list(params),
    queryFn: () => VehicleService.getVehicles(params),
    enabled,
  });
};
