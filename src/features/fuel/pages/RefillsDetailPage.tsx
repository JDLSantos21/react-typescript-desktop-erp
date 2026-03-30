import { FuelRefillAsideMenu } from "../components/FuelRefillAsideMenu";
import { useParams } from "react-router-dom";
import { useGetFuelRefillById, useGetFuelTank } from "../hooks/useFuel";
import { FuelImpactCard } from "../components/FuelImpactCard";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { formatDate } from "@/shared/utils/formatters";
import { useModal } from "@/shared/hooks/useModal";
import ConsumptionsTableModal from "../components/ConsumptionsTableModal";
import { PageLoader } from "@/shared/components/PageLoader";
import { EmptyState } from "@/shared/components/EmptyState";
import { GasMeterIcon } from "@/shared/components/icons";

export default function RefillsDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: refill, isLoading } = useGetFuelRefillById(id!);

  const { data: tank } = useGetFuelTank();

  useHeaderConfig({
    title: `Detalles de reabastecimiento`,
    showBackButton: true,
  });

  const modal = useModal();

  if (isLoading) return <PageLoader />;

  if (!isLoading && !refill?.data)
    return (
      <EmptyState
        className="h-full"
        title="No se encontró el reabastecimiento"
        description="No se pudo encontrar el reabastecimiento o no existe."
        icon={<GasMeterIcon className="w-12 h-12" />}
      />
    );

  return (
    <div className="flex h-full max-w-6xl">
      <div className="flex-1 px-8 pt-8">
        {refill?.data && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Nro. #{refill.data.id}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                  {refill.data.user.name?.[0] || ""}
                  {refill.data.user.lastName?.[0] || ""}
                </span>
                <span className="font-medium text-gray-700">
                  {refill.data.user.name} {refill.data.user.lastName}
                </span>
              </div>
              <span>•</span>
              <span>{formatDate(refill.data.createdAt, "full")}</span>
            </div>
          </div>
        )}

        <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm max-w-2xl mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
            Resumen General
          </h2>
          <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-400 mb-1 tracking-wider uppercase">
                Cantidad
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-800">
                  {refill?.data.gallons?.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  Gal.
                </span>
              </div>
            </div>

            <div className="w-px h-10 bg-gray-100 hidden md:block" />

            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-400 mb-1 tracking-wider uppercase">
                Precio por galón
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-800">
                  ${refill?.data.pricePerGallon?.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="w-px h-10 bg-gray-100 hidden md:block" />

            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-400 mb-1 tracking-wider uppercase">
                Costo Total
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-600">
                  $
                  {(
                    (refill?.data.pricePerGallon || 0) *
                    (refill?.data.gallons || 0)
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </section>
        {tank?.data && refill?.data && (
          <section>
            <FuelImpactCard
              previousLevel={refill.data.previousLevel}
              newLevel={refill.data.newLevel}
              increment={refill.data.gallons}
              capacity={tank.data.capacity}
            />
          </section>
        )}
      </div>
      <div>
        <FuelRefillAsideMenu
          refill={refill?.data!}
          onOpenConsumptions={modal.open}
        />
      </div>
      <ConsumptionsTableModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        tankRefillId={Number(id)}
      />
    </div>
  );
}
