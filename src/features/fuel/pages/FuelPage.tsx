import { useGetFuelTank } from "../hooks/useFuel";
import FuelGauge from "../components/FuelGauge";
import SectionLoader from "@/shared/components/SectionLoader";
import { ErrorState } from "@/shared/components/ErrorState";

export default function FuelPage() {
  const { data: tank, isLoading, isError, error, refetch } = useGetFuelTank();

  return (
    <div className="p-6">
      {isLoading ? (
        <SectionLoader
          className="h-64"
          placeholder="Cargando estado del tanque"
        />
      ) : isError ? (
        <ErrorState
          error={error}
          title="No se pudo cargar el estado del tanque"
          onRetry={() => refetch()}
        />
      ) : tank?.data ? (
        <FuelGauge
          currentLevel={tank.data.currentLevel}
          capacity={tank.data.capacity}
          minLevel={tank.data.minLevel}
        />
      ) : null}
    </div>
  );
}
