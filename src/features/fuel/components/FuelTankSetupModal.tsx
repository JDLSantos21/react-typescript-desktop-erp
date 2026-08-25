import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { useCreateFuelTank } from "../hooks/useFuel";
import { fuelTankSchema, type FuelTankFormData, type FuelTankFormInput } from "../schemas/fuel.schema";

export function FuelTankSetupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const createTank = useCreateFuelTank();
  const { register, handleSubmit, formState: { errors } } = useForm<FuelTankFormInput, unknown, FuelTankFormData>({ resolver: zodResolver(fuelTankSchema), defaultValues: { capacity: 0, currentLevel: 0, minLevel: 0 } });
  const submit = async (data: FuelTankFormData) => { await createTank.mutateAsync(data); onClose(); };
  return <Modal isOpen={isOpen} onClose={onClose} title="Configurar tanque principal" size="md" closeOnOverlayClick={!createTank.isPending}><Modal.Body><p className="mb-6 text-sm leading-6 text-text-secondary">Registra la capacidad y los niveles iniciales del tanque que alimenta la operación. Esta configuración debe reflejar la existencia física.</p><form id="fuel-tank-setup" onSubmit={handleSubmit(submit)} className="space-y-4"><Input label="Capacidad (galones)" type="number" min="0" step="0.01" error={errors.capacity?.message} {...register("capacity")} /><Input label="Nivel actual (galones)" type="number" min="0" step="0.01" error={errors.currentLevel?.message} {...register("currentLevel")} /><Input label="Nivel mínimo de alerta (galones)" type="number" min="0" step="0.01" error={errors.minLevel?.message} {...register("minLevel")} /></form></Modal.Body><Modal.Footer><Button type="button" variant="outline" onClick={onClose} disabled={createTank.isPending}>Cancelar</Button><Button type="submit" form="fuel-tank-setup" isLoading={createTank.isPending}>Guardar configuración</Button></Modal.Footer></Modal>;
}
