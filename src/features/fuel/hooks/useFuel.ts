import { useQuery } from "@tanstack/react-query";
import { FuelKeys } from "../api/fuel.keys";
import { FuelService } from "../api/fuel.service";

export const useGetFuelTank = () => {
  return useQuery({
    queryKey: FuelKeys.tank(),
    queryFn: () => FuelService.getTank(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
