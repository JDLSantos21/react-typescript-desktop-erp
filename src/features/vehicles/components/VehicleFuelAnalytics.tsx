import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/shared/components/EmptyState";
import SectionLoader from "@/shared/components/SectionLoader";
import { formatDateTime } from "@/shared/utils/formatters";
import { useGetVehicleFuelAnalytics } from "@/features/fuel/hooks/useFuel";

const monthLabel = (month: string) => new Intl.DateTimeFormat("es-DO", { month: "short", year: "2-digit" }).format(new Date(`${month}-01T12:00:00`));

export function VehicleFuelAnalytics({ vehicleId }: { vehicleId: string }) {
  const { data, isLoading } = useGetVehicleFuelAnalytics(vehicleId);
  const analytics = data?.data;
  if (isLoading) return <SectionLoader placeholder="Calculando métricas de combustible" />;
  if (!analytics || analytics.history.length === 0) return <EmptyState title="Sin datos suficientes de combustible" description="Las tendencias y el rendimiento se mostrarán al registrar consumos para esta unidad." />;
  const chartData = analytics.history.map((item) => ({ ...item, label: monthLabel(item.month) }));
  return <div className="space-y-8">
    <div>
      <h2 className="text-sm font-semibold text-text-primary">Consumo y rendimiento mensual</h2>
      <p className="mt-1 text-sm text-text-secondary">Últimos cinco meses con registros. Cada línea usa su propia escala para mantener ambas tendencias legibles.</p>
    </div>
    <div className="h-72 w-full"><ResponsiveContainer><LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} /><YAxis yAxisId="gallons" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} /><YAxis yAxisId="efficiency" orientation="right" tickLine={false} axisLine={false} unit=" km/g" tick={{ fontSize: 12, fill: "#6b7280" }} /><Tooltip formatter={(value, name) => [name === "Rendimiento" ? `${Number(value).toFixed(2)} km/g` : `${Number(value).toFixed(2)} gal`, name]} /><Legend /><Line yAxisId="gallons" type="monotone" dataKey="totalGallons" name="Consumo" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} /><Line yAxisId="efficiency" type="monotone" dataKey="efficiency" name="Rendimiento" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} connectNulls /></LineChart></ResponsiveContainer></div>
    <div className="grid gap-6 border-y border-gray-100 py-6 sm:grid-cols-3"><Metric label="Promedio mensual" value={`${analytics.summary.averageMonthlyConsumption.toFixed(2)} gal`} /><Metric label="Rendimiento promedio" value={analytics.summary.averageEfficiency === null ? "Sin lecturas suficientes" : `${analytics.summary.averageEfficiency.toFixed(2)} km/g`} /><Metric label="Galones del período" value={`${analytics.summary.totalGallons.toFixed(2)} gal`} /></div>
    <section><h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-400">Últimos consumos registrados</h3><div className="space-y-3">{analytics.recentConsumptions.map((entry) => <div key={entry.id} className="grid grid-cols-3 gap-4 border-b border-gray-100 pb-3 text-sm"><span>{formatDateTime(entry.consumedAt)}</span><span>{entry.gallons.toFixed(2)} gal</span><span className="text-text-secondary">{entry.mileage.toLocaleString()} km</span></div>)}</div></section>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div><p className="text-xs text-text-muted">{label}</p><p className="mt-1 text-sm font-medium text-text-primary">{value}</p></div>; }
