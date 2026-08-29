import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { Button } from "@/shared/components/core/Button";
import { Vehicle } from "@/shared/types/entities/vehicle.type";
import { extractApiError } from "@/shared/utils/error-handler";
import { useCreateVehicle, useUpdateVehicle } from "../hooks/useVehicles";
import {
  vehicleSchema,
  VehicleFormData,
  VehicleFormInput,
} from "../schemas/vehicle.schema";

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle;
}

const emptyValues: VehicleFormInput = {
  licensePlate: "",
  chasis: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  currentTag: "",
};

const toFormValues = (vehicle?: Vehicle): VehicleFormInput =>
  vehicle
    ? {
        licensePlate: vehicle.licensePlate,
        chasis: vehicle.chasis,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        currentTag: vehicle.currentTag,
      }
    : emptyValues;

export function VehicleFormModal({
  isOpen,
  onClose,
  vehicle,
}: VehicleFormModalProps) {
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const isEditing = Boolean(vehicle);
  const isPending = createVehicle.isPending || updateVehicle.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormInput, unknown, VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (isOpen) reset(toFormValues(vehicle));
  }, [isOpen, reset, vehicle]);

  const onSubmit = async (data: VehicleFormData) => {
    try {
      if (vehicle) {
        await updateVehicle.mutateAsync({ id: vehicle.id, data });
        toast.success("Vehículo actualizado correctamente");
      } else {
        await createVehicle.mutateAsync(data);
        toast.success("Vehículo registrado correctamente");
      }
      onClose();
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar vehículo" : "Registrar vehículo"}
      size="lg"
      closeOnOverlayClick={!isPending}
    >
      <Modal.Body>
        <p className="mb-6 text-sm text-text-secondary">
          {isEditing
            ? "Actualiza los datos operativos e identificadores del vehículo."
            : "Registra la unidad de flota. La placa, el chasis y la ficha deben ser únicos."}
        </p>
        <form
          id="vehicle-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Input
            label="Placa"
            placeholder="A123456"
            error={errors.licensePlate?.message}
            {...register("licensePlate")}
          />
          <Input
            label="Ficha"
            placeholder="FICHA-001"
            error={errors.currentTag?.message}
            {...register("currentTag")}
          />
          <Input
            className="md:col-span-2"
            label="Chasis"
            placeholder="Número de chasis"
            error={errors.chasis?.message}
            {...register("chasis")}
          />
          <Input
            label="Marca"
            placeholder="Ej. Toyota"
            error={errors.brand?.message}
            {...register("brand")}
          />
          <Input
            label="Modelo"
            placeholder="Ej. Hilux"
            error={errors.model?.message}
            {...register("model")}
          />
          <Input
            label="Año"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            error={errors.year?.message}
            {...register("year")}
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" form="vehicle-form" isLoading={isPending}>
          {isEditing ? "Guardar cambios" : "Registrar vehículo"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
