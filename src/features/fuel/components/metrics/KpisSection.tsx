import {
  DollarIcon,
  FuelIcon,
  StatsIcon,
  GasMeterIcon,
} from "@/shared/components/icons";
import { DashboardKPIs } from "@/shared/types/entities/fuel.types";
import { TrendingDown, TrendingUp } from "lucide-react";
import { type ReactNode } from "react";

interface KpisSectionProps {
  kpis?: DashboardKPIs;
}

interface KpiConfig {
  label: string;
  icon: ReactNode;
  iconBg: string;
  getValue: (kpis: DashboardKPIs) => string;
  getChange: (kpis: DashboardKPIs) => number;
  unit: string;
}

const KPI_CONFIGS: KpiConfig[] = [
  {
    label: "Consumo total",
    icon: <FuelIcon className="w-5 h-5 text-blue-600" />,
    iconBg: "bg-blue-50",
    getValue: (k) => k.totalConsumption.toLocaleString(),
    getChange: (k) => k.consumptionChange,
    unit: "Galones",
  },
  {
    label: "Costo total",
    icon: <DollarIcon className="w-5 h-5 text-emerald-600" />,
    iconBg: "bg-emerald-50",
    getValue: (k) => `$${k.totalCost.toLocaleString()}`,
    getChange: (k) => k.costChange,
    unit: "DOP",
  },
  {
    label: "Eficiencia promedio",
    icon: <StatsIcon className="w-5 h-5 text-violet-600" />,
    iconBg: "bg-violet-50",
    getValue: (k) => k.avgFleetEfficiency.toLocaleString(),
    getChange: (k) => k.efficiencyChange,
    unit: "KM/Galón",
  },
  {
    label: "Precio promedio",
    icon: <GasMeterIcon className="w-5 h-5 text-amber-600" />,
    iconBg: "bg-amber-50",
    getValue: (k) => `$${k.avgPricePerGallon.toLocaleString()}`,
    getChange: (k) => k.priceChange,
    unit: "DOP/Galón",
  },
];

/**
 * Indicador de cambio porcentual vs período anterior.
 * Verde con flecha arriba = positivo, Rojo con flecha abajo = negativo.
 */
function ChangeIndicator({ value }: { value: number }) {
  if (value === 0) return null;

  const isPositive = value > 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${
        isPositive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
      }`}
    >
      {isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export default function KpisSection({ kpis }: KpisSectionProps) {
  return (
    <section className="grid grid-cols-4 gap-4">
      {KPI_CONFIGS.map((config) => (
        <div
          key={config.label}
          className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col gap-3"
        >
          {/* Icono + indicador de cambio */}
          <div className="flex items-center justify-between">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.iconBg}`}
            >
              {config.icon}
            </div>
            {kpis && <ChangeIndicator value={config.getChange(kpis)} />}
          </div>

          {/* Label */}
          <h4 className="font-semibold text-xs tracking-wider text-text-secondary uppercase">
            {config.label}
          </h4>

          {/* Valor + unidad */}
          <div>
            <p className="text-2xl font-bold tracking-tight text-text-primary">
              {kpis ? config.getValue(kpis) : "—"}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">{config.unit}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
