import { useMemo } from "react";
import { Button } from "@/shared/components/core/Button";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { useModal } from "@/shared/hooks/useModal";
import TankStatusCard from "@/features/fuel/components/TankStatusCard";
import ResetTankDialog from "@/features/fuel/components/ResetTankDialog";
import { FuelTankSetupModal } from "@/features/fuel/components/FuelTankSetupModal";
import { useGetFuelTank } from "@/features/fuel/hooks/useFuel";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

export default function FuelSettingsPage() {
  const setupModal = useModal();
  const resetModal = useModal();
  const tankQuery = useGetFuelTank();
  const tank = tankQuery.data?.data;
  const actions = useMemo(
    () =>
      !tank ? (
        <Button variant="outline" size="sm" onClick={setupModal.open}>
          Configurar tanque
        </Button>
      ) : undefined,
    [setupModal.open, tank],
  );
  return (
    <>
      <SettingsPageHeader
        title="Combustible"
        description="Tanque principal y límites que sostienen la operación de combustible"
        actions={actions}
      />
      <div className="p-8">
        <div className="max-w-2xl">
          {tankQuery.isLoading ? (
            <SectionLoader placeholder="Cargando configuración del tanque" />
          ) : tank ? (
            <TankStatusCard
              tank={tank}
              isModalOpen={true}
              onResetClick={resetModal.open}
            />
          ) : tankQuery.isError ? (
            <div className="border-y border-slate-200 py-6">
              <h2 className="text-base font-semibold text-slate-900">
                Tanque no configurado
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
                Antes de registrar recargas o consumos, define el tanque
                principal y su nivel inicial.
              </p>
              <Button
                variant="outline"
                className="mt-5"
                onClick={setupModal.open}
              >
                Configurar tanque
              </Button>
            </div>
          ) : (
            <ErrorState
              title="No se pudo leer la configuración del tanque"
              onRetry={tankQuery.refetch}
            />
          )}
        </div>
      </div>
      <FuelTankSetupModal
        isOpen={setupModal.isOpen}
        onClose={setupModal.close}
      />
      {tank ? (
        <ResetTankDialog
          isOpen={resetModal.isOpen}
          onClose={resetModal.close}
          onSuccess={resetModal.close}
        />
      ) : null}
    </>
  );
}
