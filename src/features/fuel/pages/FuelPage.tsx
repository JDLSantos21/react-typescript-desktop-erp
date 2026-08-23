import FuelGauge, { FuelGaugeSkeleton } from "../components/FuelGauge";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import RecentFuelConsumptionsTable from "../components/RecentFuelConsumptionsTable";
import { FuelIcon } from "@/shared/components/icons";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useGetFuelSummary } from "../hooks/useFuel";
import { Button } from "@/shared/components/core/Button";
import { useMemo } from "react";
import { useModal } from "@/shared/hooks/useModal";
import RegisterConsumptionModal from "../components/RegisterConsumptionModal";
import { useNavigate } from "react-router-dom";

export default function FuelPage() {
  const registerModal = useModal();
  const navigate = useNavigate();

  const {
    data: summary,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFuelSummary();
  const dashboardSummary = summary?.data.summary;

  const headerActions = useMemo(() => {
    return (
      <div className="flex gap-2">
        <Button
          onClick={registerModal.open}
          variant="outline"
          disabled={!dashboardSummary?.tankConfigured}
        >
          Registrar consumo
        </Button>
      </div>
    );
  }, [dashboardSummary?.tankConfigured, registerModal.open]);

  useHeaderConfig({
    title: "Combustible",
    description: "Monitoreo del estado del tanque de combustible",
    actions: headerActions,
  });

  const metrics = [
    {
      label: "Consumo del período",
      value: `${dashboardSummary?.totalConsumption ?? 0}`,
      unit: "GAL",
      icon: <FuelIcon />,
    },
    {
      label: "Costo del período",
      value: `${dashboardSummary?.totalCost ?? 0}`,
      unit: "RD$",
      icon: <FuelIcon />,
    },
    {
      label: "Eficiencia promedio",
      value: `${dashboardSummary?.avgFleetEfficiency ?? 0}`,
      unit: "KM/G",
      icon: <FuelIcon />,
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 p-6 h-full">
        <section className="flex gap-8">
          <div>
            {isLoading ? (
              <FuelGaugeSkeleton />
            ) : isError || !dashboardSummary ? (
              <ErrorState
                error={error}
                title="No se pudo cargar el estado del tanque"
                onRetry={() => refetch()}
              />
            ) : !dashboardSummary.tankConfigured ? (
              <EmptyState
                className="min-w-75 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                title="Tanque no configurado"
                description="Define la capacidad, el nivel actual y el nivel mínimo antes de registrar consumos."
              />
            ) : (
              <FuelGauge
                currentLevel={dashboardSummary.currentTankLevel}
                capacity={dashboardSummary.tankCapacity}
                minLevel={dashboardSummary.minLevel}
              />
            )}
          </div>
          <div className="flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <h3 className="text-lg inline-flex items-center h-16 font-bold tracking-wider text-gray-500">
                Métricas rápidas
              </h3>
              <Button
                onClick={() => navigate("/fuel/metrics")}
                variant="link"
                size="sm"
              >
                Ver estadísticas detalladas
              </Button>
            </div>
            <div className="flex gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-white border space-y-3 border-gray-100 rounded-xl p-5 shadow-sm h-50 w-50"
                >
                  {metric.icon}
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm tracking-wider text-text-secondary uppercase">
                      {metric.label}
                    </h4>
                  </div>
                  <p className="text-3xl font-bold tracking-wider text-text-primary">
                    {metric.value}
                  </p>
                  <p className="text-xs text-text-secondary">{metric.unit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-wider text-gray-500">
              Consumos recientes
            </h3>
          </div>
          <div className="flex-1">
            <RecentFuelConsumptionsTable />
          </div>
        </section>
      </div>
      <RegisterConsumptionModal
        isOpen={registerModal.isOpen}
        onClose={registerModal.close}
      />
    </>
  );
}
