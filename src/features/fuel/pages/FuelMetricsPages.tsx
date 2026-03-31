import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useGetFuelMetrics } from "../hooks/useFuel";
import KpisSection from "../components/metrics/KpisSection";
import TypeDistributionChart from "../components/metrics/TypeDistributionChart";
import TopVehiclesChart from "../components/metrics/TopVehiclesChart";
import ConsumptionTrendChart from "../components/metrics/ConsumptionTrendChart";
import EfficiencyAlertsSection from "../components/metrics/EfficiencyAlertsSection";

export default function FuelMetricsPage() {
  useHeaderConfig({
    title: "Metricas y Analisis",
    description: "Analisis del consumo de combustible",
  });

  const { data } = useGetFuelMetrics();

  const kpis = data?.data.summary;

  return (
    <div className="p-6 space-y-6">
      <KpisSection kpis={kpis} />

      <section
        className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col"
        style={{ height: 320 }}
      >
        <h3 className="font-bold tracking-wider text-text-secondary text-sm uppercase mb-3">
          Tendencia de consumo
        </h3>
        <div className="flex-1">
          <ConsumptionTrendChart trend={data?.data.consumptionTrend} />
        </div>
      </section>

      <section className="flex gap-4 justify-between">
        <div
          className="w-1/2 bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col"
          style={{ minHeight: 320 }}
        >
          <h3 className="font-bold tracking-wider text-text-secondary text-sm uppercase mb-3">
            Top vehículos por consumo
          </h3>
          <div className="flex-1">
            <TopVehiclesChart vehicles={data?.data.topVehicles} />
          </div>
        </div>
        <div
          className="w-1/2 bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col"
          style={{ minHeight: 320 }}
        >
          <h3 className="font-bold tracking-wider text-text-secondary text-sm uppercase mb-3">
            Distribución por tipo
          </h3>
          <div className="flex-1">
            <TypeDistributionChart distribution={data?.data.typeDistribution} />
          </div>
        </div>
      </section>

      <EfficiencyAlertsSection alerts={data?.data.efficiencyAlerts} />
    </div>
  );
}
