import { GetFuelConsumptionsParams, GetTankRefillsParams } from "../types/fuel";

export const FuelKeys = {
  all: ["fuel"] as const,
  tank: () => [...FuelKeys.all, "tank"] as const,
  consumptions: (params?: GetFuelConsumptionsParams) =>
    [...FuelKeys.all, "consumptions", params] as const,
  summary: () => [...FuelKeys.all, "summary"] as const,
  metrics: () => [...FuelKeys.all, "metrics"] as const,
  refills: (params?: GetTankRefillsParams) =>
    [...FuelKeys.all, "refills", params] as const,
  refillById: (id: string) => [...FuelKeys.all, "refill", id] as const,
};
