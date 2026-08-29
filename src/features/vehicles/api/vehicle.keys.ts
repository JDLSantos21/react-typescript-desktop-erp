import { GetVehicleParams } from "../types/vehicles";

export const vehicleKeys = {
  all: ["vehicles"],
  list: (params: GetVehicleParams) => ["vehicles", params],
  detail: (id: string) => ["vehicles", id],
  operationalSummary: (id: string) => ["vehicles", id, "operational-summary"],
};
