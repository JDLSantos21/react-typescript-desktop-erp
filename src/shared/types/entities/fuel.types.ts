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

// === KPIs superiores del dashboard ===

export interface DashboardKPIs {
  tankConfigured: boolean;
  currentTankLevel: number;
  tankCapacity: number;
  minLevel: number;
  tankPercentage: number;
  totalConsumption: number;
  consumptionChange: number; // % vs período anterior
  totalCost: number;
  costChange: number;
  avgFleetEfficiency: number; // km/gal
  efficiencyChange: number;
  avgPricePerGallon: number;
  priceChange: number;
}

// === Puntos de la gráfica de tendencia ===

export interface ConsumptionTrendPoint {
  date: string; // ISO date (YYYY-MM-DD)
  label: string; // Formato legible (DD/MM/YYYY)
  fuelUsage: number; // Galones consumidos
  cost: number; // Costo estimado
}

// === Top vehículos con mayor consumo ===

export interface TopVehicleConsumption {
  vehicleId: string;
  name: string; // currentTag del vehículo
  licensePlate: string;
  totalGallons: number;
}

// === Distribución por tipo (Vehículo vs Planta) ===

export interface TypeDistribution {
  type: string;
  totalGallons: number;
  percentage: number;
}

// === Alertas de eficiencia ===

export type AlertSeverity = "WARNING" | "CRITICAL";
export type EfficiencyAlertType = "HIGH_CONSUMPTION" | "CONSUMPTION_SPIKE";

export interface EfficiencyAlert {
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  alertType: EfficiencyAlertType;
  message: string;
  severity: AlertSeverity;
  currentValue: number;
  referenceValue: number; // Promedio de flota o valor previo
}

// === Entidad principal del dashboard ===

export interface FuelDashboard {
  summary: DashboardKPIs;
  consumptionTrend: ConsumptionTrendPoint[];
  topVehicles: TopVehicleConsumption[];
  typeDistribution: TypeDistribution[];
  efficiencyAlerts: EfficiencyAlert[];
}

export interface VehicleFuelAnalytics {
  history: Array<{ month: string; totalGallons: number; totalKilometers: number; efficiency: number | null }>;
  recentConsumptions: Array<{ id: number; gallons: number; mileage: number; consumedAt: string }>;
  summary: { records: number; totalGallons: number; averageMonthlyConsumption: number; averageEfficiency: number | null };
}
