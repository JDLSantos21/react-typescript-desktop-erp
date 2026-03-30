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

export interface FuelRefill {
  id: number;
  gallons: number;
  pricePerGallon: number;
  previousLevel: number;
  newLevel: number;
  user: Pick<User, "id" | "name" | "lastName">;
  createdAt: string;
  updatedAt: string;
}

export interface TankReset {
  id: number;
  previousLevel: number;
  userId: Pick<User, "id">;
  tankRefillId: Pick<FuelRefill, "id">;
  createdAt: string;
  updatedAt: string;
}
