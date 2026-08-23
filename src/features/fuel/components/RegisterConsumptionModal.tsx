import { Modal } from "@/shared/components/core/Modal";
import { SearchSelect } from "@/shared/components/core/SearchSelect";
import { Controller, useForm } from "react-hook-form";
import {
  RegisterConsumptionFormData,
  RegisterConsumptionInput,
  registerConsumptionSchema,
} from "../schemas/fuel.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/shared/components/core/Input";
import { Textarea } from "@/shared/components/core/Textarea";
import { Button } from "@/shared/components/core/Button";
import { useGetEmployees } from "@/features/employees/hooks/useEmployee";
import { useGetVehicles } from "@/features/vehicles/hooks/useVehicles";
import { useRegisterFuelConsumption } from "../hooks/useFuel";
import { useEffect } from "react";

interface RegisterConsumptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function RegisterConsumptionModal({
  isOpen,
  onClose,
}: RegisterConsumptionModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterConsumptionInput, unknown, RegisterConsumptionFormData>({
    resolver: zodResolver(registerConsumptionSchema),
    defaultValues: {
      vehicleType: "VEHICLE",
      tankRefillId: null,
      notes: null,
      consumedAt: null,
    },
  });

  const vehicleType = watch("vehicleType");

  const { data: drivers, isLoading: isLoadingDrivers } = useGetEmployees(
    {
      position: "CHOFER",
      limit: 100,
    },
    isOpen,
  );

  const { data: vehicles, isLoading: isLoadingVehicles } = useGetVehicles(
    {
      limit: 100,
    },
    isOpen,
  );

  // Limpiar campos exclusivos de vehículo al cambiar a planta
  useEffect(() => {
    if (vehicleType === "PLANT") {
      setValue("driverId", null);
      setValue("mileage", null);

      if (!isLoadingVehicles && vehicles?.data) {
        const plant = vehicles.data.find((vehicle) =>
          vehicle.currentTag.toUpperCase().includes("PLANTA"),
        );

        if (plant) {
          setValue("vehicleId", plant.id, { shouldValidate: true });
        } else {
          setValue("vehicleId", "", { shouldValidate: true });
        }
      }
    }
  }, [vehicleType, setValue, vehicles?.data, isLoadingVehicles]);

  const { mutateAsync: registerConsumption, isPending } =
    useRegisterFuelConsumption();

  const onSubmit = async (data: RegisterConsumptionFormData) => {
    console.log(data);
    try {
      await registerConsumption(data);
      reset();
    } catch {}
  };

  const driverOptions =
    drivers?.data?.map((driver) => ({
      value: driver.id,
      label: `${driver.name} ${driver.lastName}`,
    })) || [];

  const vehicleOptions =
    vehicles?.data?.map((vehicle) => ({
      value: vehicle.id,
      label: vehicle.currentTag,
    })) || [];

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Registrar consumo de combustible"
    >
      <Modal.Body>
        <form
          id="register-consumption-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Controller
            name="vehicleType"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={field.value === "VEHICLE" ? "primary" : "outline"}
                  onClick={() => field.onChange("VEHICLE")}
                >
                  Vehículo
                </Button>
                <Button
                  type="button"
                  variant={field.value === "PLANT" ? "primary" : "outline"}
                  onClick={() => field.onChange("PLANT")}
                >
                  Planta
                </Button>
              </div>
            )}
          />

          {vehicleType === "VEHICLE" && (
            <Controller
              name="driverId"
              control={control}
              render={({ field }) => (
                <SearchSelect
                  label="Conductor"
                  options={driverOptions}
                  value={field.value ?? undefined}
                  onValueChange={field.onChange}
                  placeholder="Buscar conductor..."
                  error={errors.driverId?.message}
                  disabled={isLoadingDrivers}
                />
              )}
            />
          )}

          <Controller
            name="vehicleId"
            control={control}
            render={({ field }) => (
              <SearchSelect
                label={vehicleType === "VEHICLE" ? "Vehículo" : "Planta"}
                options={vehicleOptions}
                value={field.value}
                onValueChange={field.onChange}
                placeholder={
                  vehicleType === "VEHICLE"
                    ? "Buscar vehículo..."
                    : isLoadingVehicles
                      ? "Buscando planta..."
                      : "Planta seleccionada"
                }
                error={
                  vehicleType === "PLANT" &&
                  !isLoadingVehicles &&
                  !vehicles?.data?.some((v) =>
                    v.currentTag.toUpperCase().includes("PLANTA"),
                  )
                    ? "No se ha encontrado ninguna planta registrada en el sistema."
                    : errors.vehicleId?.message
                }
                disabled={isLoadingVehicles || vehicleType === "PLANT"}
              />
            )}
          />

          <div
            className={`grid gap-4 ${vehicleType === "VEHICLE" ? "grid-cols-3" : "grid-cols-2"}`}
          >
            {vehicleType === "VEHICLE" && (
              <Input
                label="Kilometraje"
                type="number"
                placeholder="Ingrese el kilometraje"
                error={errors.mileage?.message}
                {...register("mileage")}
              />
            )}

            <Input
              label="Cantidad de combustible"
              type="number"
              placeholder="0.0"
              error={errors.gallons?.message}
              helperText="Limite max: 150 galones"
              {...register("gallons")}
            />

            <Input
              label="Fecha"
              type="datetime-local"
              placeholder="Ingrese la fecha"
              error={errors.consumedAt?.message}
              {...register("consumedAt")}
            />
          </div>

          <Textarea
            label="Notas"
            placeholder="Ingrese notas adicionales"
            error={errors.notes?.message}
            className="min-h-24"
            {...register("notes")}
          />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="register-consumption-form"
          isLoading={isPending}
        >
          Registrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
