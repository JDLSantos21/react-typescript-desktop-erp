import { Employee } from "./employee.types";
import { User } from "./user.types";
import { Vehicle } from "./vehicle.type";

export interface FuelTank {
  id: number;
  capacity: number;
  currentLevel: number;
  minLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface FuelConsumption {
  id: number;
  gallons: number;
  mileage: number;
  tankRefillId: number | null;
  notes: string | null;
  driver: Pick<Employee, "id" | "name" | "lastName">;
  user: Pick<User, "id" | "name" | "lastName">;
  vehicle: Pick<Vehicle, "id" | "currentTag">;
  consumedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FuelSummary {
  currentTankLevel: number;
  minLevel: number;
  tankCapacity: number;
  tankPercentage: number;
  todayConsumption: number;
  weeklyConsumption: number;
  monthlyConsumption: number;
  averageFleetEfficiency: number;
  totalCostThisMonth: number;
  totalCostLastMonth: number;
}
