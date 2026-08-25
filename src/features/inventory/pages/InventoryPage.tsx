import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { InventoryMoveRow } from "../components/InventoryTables";
import { useInventoryDashboard } from "../hooks/useInventory";

const activityLabel = (date: string) =>
  new Intl.DateTimeFormat("es-DO", { weekday: "short" }).format(
    new Date(`${date}T12:00:00`),
  );

export default function InventoryPage() {
  const dashboard = useInventoryDashboard();

  useHeaderConfig({
    title: "Inventario",
    description: "Visión operativa de existencias y actividad reciente",
  });

  const summary = dashboard.data?.data.summary;
  const activity = dashboard.data?.data.activity ?? [];
  const recentMoves = dashboard.data?.data.recentMoves ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gray-50/50">
      {dashboard.isLoading ? (
        <SectionLoader placeholder="Cargando inventario" />
      ) : dashboard.isError ? (
        <ErrorState title="No se pudo cargar el resumen de inventario" error={dashboard.error} onRetry={dashboard.refetch} />
      ) : (
        <>
          <section className="grid shrink-0 divide-y divide-gray-100 border-b border-gray-200 bg-white px-6 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
            <Metric label="Materiales registrados" value={summary?.totalMaterials ?? 0} />
            <Metric label="Con existencia" value={summary?.availableMaterials ?? 0} />
            <Metric label="Bajo mínimo" value={summary?.materialsBelowMinimum ?? 0} tone={(summary?.materialsBelowMinimum ?? 0) > 0 ? "warning" : "neutral"} />
            <Metric label="Sin existencias" value={summary?.outOfStock ?? 0} tone={(summary?.outOfStock ?? 0) > 0 ? "danger" : "neutral"} />
            <Metric label="Movimientos (7 días)" value={summary?.movementCount ?? 0} />
          </section>

          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.5fr)_minmax(22rem,0.8fr)]">
              <section className="min-w-0 border-b border-gray-200 pb-8 xl:border-r xl:border-b-0 xl:pr-8">
                <h2 className="text-base font-semibold text-text-primary">Actividad de los últimos 7 días</h2>
                <p className="mt-1 text-sm text-text-secondary">Cantidad de movimientos registrados por día.</p>
                <div className="mt-5 h-64 min-w-0">
                  <ResponsiveContainer minWidth={0} initialDimension={{ width: 640, height: 256 }}>
                    <BarChart data={activity.map((item) => ({ ...item, label: activityLabel(item.date) }))} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <Tooltip cursor={{ fill: "#f9fafb" }} />
                      <Legend />
                      <Bar dataKey="entries" name="Entradas" fill="#2563eb" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="exits" name="Salidas" fill="#d97706" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="adjustments" name="Ajustes" fill="#64748b" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section>
                <h2 className="text-base font-semibold text-text-primary">Últimos movimientos</h2>
                <p className="mt-1 text-sm text-text-secondary">Trazabilidad reciente de la operación.</p>
                <div className="mt-4 divide-y divide-gray-100 border-y border-gray-200">
                  {recentMoves.length === 0 ? (
                    <p className="py-6 text-sm text-text-muted">Aún no hay movimientos.</p>
                  ) : (
                    recentMoves.map((move) => <InventoryMoveRow key={move.id} move={move} compact />)
                  )}
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "warning" | "danger" }) {
  const valueClass = tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "text-text-primary";
  return <div className="px-5 py-4 first:pl-0 last:pr-0"><p className="text-xs text-text-muted">{label}</p><p className={`mt-1 text-2xl font-semibold ${valueClass}`}>{value}</p></div>;
}
