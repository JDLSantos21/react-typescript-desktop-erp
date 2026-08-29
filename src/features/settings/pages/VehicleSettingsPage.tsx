import { useMemo } from "react";
import { PlusIcon } from "@/shared/components/icons";
import { Button } from "@/shared/components/core/Button";
import { useModal } from "@/shared/hooks/useModal";
import { VehicleFormModal } from "@/features/vehicles/components/VehicleFormModal";
import { SettingsPageHeader } from "../components/SettingsPageHeader";

export default function VehicleSettingsPage() {
  const vehicleModal = useModal();
  const actions = useMemo(
    () => (
      <Button
        variant="outline"
        size="sm"
        icon={PlusIcon}
        onClick={vehicleModal.open}
      >
        Registrar vehículo
      </Button>
    ),
    [vehicleModal.open],
  );
  return (
    <>
      <SettingsPageHeader
        title="Vehículos"
        description="Registro administrativo e identificadores de las unidades de flota"
        actions={actions}
      />
      <div className="p-8">
        <div className="max-w-2xl border-y border-slate-200 py-6">
          <h2 className="text-base font-semibold text-slate-900">
            Alta de unidades
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
            Cada placa, chasis y ficha debe corresponder a una unidad física y
            única antes de incorporarla a la operación.
          </p>
          <Button
            className="mt-5"
            variant="outline"
            icon={PlusIcon}
            onClick={vehicleModal.open}
          >
            Registrar vehículo
          </Button>
        </div>
      </div>
      <VehicleFormModal
        isOpen={vehicleModal.isOpen}
        onClose={vehicleModal.close}
      />
    </>
  );
}
