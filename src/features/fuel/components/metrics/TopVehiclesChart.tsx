import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BarShapeProps } from "recharts/types/cartesian/Bar";
import type { TopVehicleConsumption } from "@/shared/types/entities/fuel.types";

const BAR_COLORS = ["#3b82f6", "#60a5fa", "#93bbfd", "#bdd7fe", "#dbeafe"];

interface TopVehiclesChartProps {
  vehicles?: TopVehicleConsumption[];
}

export default function TopVehiclesChart({ vehicles }: TopVehiclesChartProps) {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-text-secondary">
        Sin datos disponibles
      </div>
    );
  }

  // Tomar solo los 5 primeros y ordenar de mayor a menor
  const top5 = [...vehicles]
    .sort((a, b) => b.totalGallons - a.totalGallons)
    .slice(0, 5);

  // El máximo para calcular el dominio con padding visual
  const maxGallons = Math.max(...top5.map((v) => v.totalGallons));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={top5} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#f1f5f9"
          />
          <XAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="number"
            domain={[0, Math.ceil(maxGallons * 1.15)]}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) => `${value}g`}
            width={50}
          />
          <Tooltip
            cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const item = payload[0].payload as TopVehicleConsumption;
              return (
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-sm">
                  <p className="font-semibold text-text-primary">{item.name}</p>
                  <p className="text-text-secondary text-xs">
                    {item.licensePlate}
                  </p>
                  <p className="text-text-secondary mt-1">
                    {item.totalGallons.toLocaleString()} galones
                  </p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="totalGallons"
            radius={[6, 6, 0, 0]}
            barSize={32}
            shape={(props: BarShapeProps) => {
              const index = props.index as number;
              return (
                <rect
                  x={props.x as number}
                  y={props.y as number}
                  width={props.width as number}
                  height={props.height as number}
                  rx={6}
                  ry={6}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
