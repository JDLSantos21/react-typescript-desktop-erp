export const FuelKeys = {
  all: ["fuel"] as const,
  tank: () => [...FuelKeys.all, "tank"] as const,
};
