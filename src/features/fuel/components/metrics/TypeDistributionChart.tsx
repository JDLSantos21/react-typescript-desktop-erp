import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TypeDistribution } from "@/shared/types/entities/fuel.types";

const TYPE_COLORS: Record<string, string> = {
  Vehículo: "#3b82f6",
  "Planta Eléctrica": "#f59e0b",
};

const DEFAULT_COLOR = "#94a3b8";

function getColor(type: string): string {
  return TYPE_COLORS[type] ?? DEFAULT_COLOR;
}

interface TypeDistributionChartProps {
  distribution?: TypeDistribution[];
}

export default function TypeDistributionChart({
  distribution,
}: TypeDistributionChartProps) {
  if (!distribution || distribution.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-text-secondary">
        Sin datos disponibles
      </div>
    );
  }

  // Total de galones
  const totalGallons = distribution.reduce((sum, d) => sum + d.totalGallons, 0);

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full">
      {/* Gráfico donut */}
      <div
        className="relative w-full"
        style={{ minHeight: 180, flex: "1 1 0" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={distribution}
              dataKey="totalGallons"
              nameKey="type"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={3}
              strokeWidth={0}
            >
              {distribution.map((entry) => (
                <Cell key={entry.type} fill={getColor(entry.type)} />
              ))}
            </Pie>
            <Tooltip
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const item = payload[0].payload as TypeDistribution;
                return (
                  <div className="bg-white rounded-lg shadow-lg border border-gray-100 px-3 py-2 text-sm">
                    <p className="font-semibold text-text-primary">
                      {item.type}
                    </p>
                    <p className="text-text-secondary">
                      {item.totalGallons.toLocaleString()} gal (
                      {item.percentage}%)
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Label central del donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-text-primary leading-tight">
            {totalGallons.toLocaleString()}
          </span>
          <span className="text-xs text-text-secondary">galones</span>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {distribution.map((entry) => (
          <div key={entry.type} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: getColor(entry.type) }}
            />
            <span className="text-text-secondary">{entry.type}</span>
            <span className="font-semibold text-text-primary">
              {entry.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
