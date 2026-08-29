export interface Vehicle {
  id: string;
  licensePlate: string;
  chasis: string;
  brand: string;
  model: string;
  year: number;
  currentTag: string;
  createdAt: string;
  updatedAt: string;
}

export type VehicleMaintenanceHealth = "OK" | "UPCOMING" | "DUE" | "SCHEDULED";

export interface VehicleOperationalSummary {
  latestFuelConsumption: {
    id: number;
    mileage: number | null;
    gallons: number;
    consumedAt: string;
  } | null;
  maintenance: {
    projection: {
      status: VehicleMaintenanceHealth;
      currentMileage: number | null;
      nextDueDate: string | null;
      nextDueMileage: number | null;
      remainingDays: number | null;
      remainingKilometers: number | null;
      triggeredBy: Array<"TIME" | "MILEAGE">;
      schedule: {
        intervalMonths: number | null;
        intervalKilometers: number | null;
        warningDays: number;
        warningKilometers: number;
        isActive: boolean;
      };
      activeMaintenance: {
        id: string;
        status: string;
        scheduledDate: string | null;
        triggerReason: "MANUAL" | "TIME" | "MILEAGE" | "TIME_AND_MILEAGE";
      } | null;
    } | null;
    lastCompleted: {
      id: string;
      performedDate: string | null;
      currentMileage: number | null;
      triggerReason: "MANUAL" | "TIME" | "MILEAGE" | "TIME_AND_MILEAGE";
    } | null;
  };
}
