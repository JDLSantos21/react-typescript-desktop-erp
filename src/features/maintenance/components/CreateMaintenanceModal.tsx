import { useState } from "react";
import { toast } from "sonner";
import { useGetVehicles } from "@/features/vehicles/hooks/useVehicles";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { Select } from "@/shared/components/core/Select";
import { extractApiError } from "@/shared/utils/error-handler";
import { useCreateMaintenance, useMaintenanceDrivers } from "../hooks/useMaintenance";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMaintenanceModal({ isOpen, onClose }: Props) {
  const create = useCreateMaintenance();
  const vehicles = useGetVehicles({ page: 1, limit: 100 }, isOpen);
  const drivers = useMaintenanceDrivers();
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [scheduledDate, setScheduledDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!vehicleId) return toast.error("Selecciona un vehículo.");
    try {
      await create.mutateAsync({
        vehicleId,
        scheduledDate,
        driverId: driverId || undefined,
        notes: notes || undefined,
      });
      toast.success("Mantenimiento generado");
      setVehicleId("");
      setDriverId("");
      setNotes("");
      onClose();
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  };

  const vehicleOptions = (vehicles.data?.data ?? []).map((vehicle) => ({
    value: vehicle.id,
    label: vehicle.licensePlate + " · " + vehicle.brand + " " + vehicle.model,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generar mantenimiento" size="lg">
      <form onSubmit={submit}>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Usa esta acción sólo para un trabajo extraordinario. Para el plan
              preventivo, configura los criterios desde el detalle del vehículo.
            </p>
            <Select label="Vehículo" placeholder="Selecciona una unidad" value={vehicleId} onValueChange={setVehicleId} options={vehicleOptions} disabled={vehicles.isLoading} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Fecha programada" type="date" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} required />
              <Select label="Conductor (opcional)" placeholder="Sin asignar" value={driverId} onValueChange={setDriverId} options={(drivers.data?.data ?? []).map((driver) => ({ value: driver.id, label: driver.name + " " + driver.lastName }))} />
            </div>
            <Input label="Motivo u observación" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ej. revisión por ruido inusual" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="outline" onClick={onClose} disabled={create.isPending}>Cancelar</Button>
          <Button type="submit" isLoading={create.isPending}>Generar trabajo</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
