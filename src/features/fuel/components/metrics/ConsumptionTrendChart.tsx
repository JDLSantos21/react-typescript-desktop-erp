import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ConsumptionTrendPoint } from "@/shared/types/entities/fuel.types";

interface ConsumptionTrendChartProps {
  trend?: ConsumptionTrendPoint[];
}

export default function ConsumptionTrendChart({
  trend,
}: ConsumptionTrendChartProps) {
  if (!trend || trend.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-text-secondary">
        Sin datos disponibles
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={trend}
          margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
        >
          {/* Gradiente para el área bajo la curva */}
          <defs>
            <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: string) => {
              // Mostrar solo día/mes (ej: "31/03")
              const parts = value.split("/");
              return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : value;
            }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) => `${value}g`}
            width={50}
          />
          <Tooltip
            content={({ payload, label }) => {
              if (!payload || payload.length === 0) return null;
              const point = payload[0].payload as ConsumptionTrendPoint;
              return (
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-sm">
                  <p className="font-semibold text-text-primary mb-1">
                    {label}
                  </p>
                  <p className="text-text-secondary">
                    Consumo:{" "}
                    <span className="font-medium text-text-primary">
                      {point.fuelUsage.toLocaleString()} gal
                    </span>
                  </p>
                  {point.cost > 0 && (
                    <p className="text-text-secondary">
                      Costo:{" "}
                      <span className="font-medium text-text-primary">
                        ${point.cost.toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="fuelUsage"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#fuelGradient)"
            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{
              r: 6,
              fill: "#3b82f6",
              strokeWidth: 2,
              stroke: "#fff",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
