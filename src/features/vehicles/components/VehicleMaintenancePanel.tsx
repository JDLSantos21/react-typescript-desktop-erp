import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Gauge, TimerReset } from "lucide-react";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { Input } from "@/shared/components/core/Input";
import { Button } from "@/shared/components/core/Button";
import SectionLoader from "@/shared/components/SectionLoader";
import { ErrorState } from "@/shared/components/ErrorState";
import { extractApiError } from "@/shared/utils/error-handler";
import { formatLongDate } from "@/shared/utils/formatters";
import {
  useUpdateVehicleMaintenanceSchedule,
  useVehicleMaintenanceSchedule,
} from "@/features/maintenance/hooks/useMaintenance";
import type { MaintenanceProjection } from "@/features/maintenance/types/maintenance";

interface ScheduleForm {
  useTime: boolean;
  intervalMonths: number;
  useMileage: boolean;
  intervalKilometers: number;
  warningDays: number;
  warningKilometers: number;
  isActive: boolean;
}

export function VehicleMaintenancePanel({ vehicleId }: { vehicleId: string }) {
  const scheduleQuery = useVehicleMaintenanceSchedule(vehicleId);
  const updateSchedule = useUpdateVehicleMaintenanceSchedule();
  const projection = scheduleQuery.data?.data ?? null;
  const { register, handleSubmit, watch, reset, setError, formState: { errors } } = useForm<ScheduleForm>({
    defaultValues: {
      useTime: true,
      intervalMonths: 2,
      useMileage: true,
      intervalKilometers: 5000,
      warningDays: 15,
      warningKilometers: 500,
      isActive: true,
    },
  });
  const useTime = watch("useTime");
  const useMileage = watch("useMileage");

  useEffect(() => {
    const schedule = projection?.schedule;
    if (!schedule) return;
    reset({
      useTime: schedule.intervalMonths != null,
      intervalMonths: schedule.intervalMonths ?? 2,
      useMileage: schedule.intervalKilometers != null,
      intervalKilometers: schedule.intervalKilometers ?? 5000,
      warningDays: schedule.warningDays,
      warningKilometers: schedule.warningKilometers,
      isActive: schedule.isActive,
    });
  }, [projection, reset]);

  const onSubmit = async (values: ScheduleForm) => {
    if (!values.useTime && !values.useMileage) {
      setError("useTime", { message: "Selecciona al menos un criterio" });
      return;
    }
    try {
      await updateSchedule.mutateAsync({
        vehicleId,
        data: {
          intervalMonths: values.useTime ? values.intervalMonths : null,
          intervalKilometers: values.useMileage ? values.intervalKilometers : null,
          warningDays: values.warningDays,
          warningKilometers: values.warningKilometers,
          isActive: values.isActive,
        },
      });
      toast.success("Plan de mantenimiento actualizado");
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  };

  if (scheduleQuery.isLoading) return <SectionLoader placeholder="Cargando plan de mantenimiento" />;
  if (scheduleQuery.isError) {
    return <ErrorState title="No se pudo cargar el plan de mantenimiento" error={scheduleQuery.error} onRetry={scheduleQuery.refetch} />;
  }

  return (
    <section className="border-t border-gray-200 pt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Mantenimiento automático</h2>
          <p className="mt-1 max-w-2xl text-sm text-text-secondary">
            El sistema genera el mantenimiento cuando se cumple el tiempo, el kilometraje o cualquiera de los dos criterios activos.
          </p>
        </div>
        <ProjectionStatus projection={projection} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="grid border-y border-gray-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <fieldset className="space-y-4 py-5 lg:pr-6">
            <legend className="sr-only">Criterio por tiempo</legend>
            <Checkbox label="Programar por tiempo" {...register("useTime")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Cada cuántos meses" type="number" min={1} disabled={!useTime} error={errors.intervalMonths?.message} {...register("intervalMonths", { valueAsNumber: true, min: { value: 1, message: "Mínimo 1 mes" } })} />
              <Input label="Avisar con días de antelación" type="number" min={1} disabled={!useTime} error={errors.warningDays?.message} {...register("warningDays", { valueAsNumber: true, min: { value: 1, message: "Mínimo 1 día" } })} />
            </div>
            <p className="flex items-center gap-2 text-xs text-text-muted"><TimerReset className="h-4 w-4" />{projection?.nextDueDate ? `Próxima fecha: ${formatLongDate(projection.nextDueDate)}` : "La fecha empieza a contar al guardar el plan."}</p>
          </fieldset>

          <fieldset className="space-y-4 border-t border-gray-200 py-5 lg:border-t-0 lg:pl-6">
            <legend className="sr-only">Criterio por kilometraje</legend>
            <Checkbox label="Programar por kilometraje" {...register("useMileage")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Cada cuántos kilómetros" type="number" min={1} disabled={!useMileage} error={errors.intervalKilometers?.message} {...register("intervalKilometers", { valueAsNumber: true, min: { value: 1, message: "Mínimo 1 km" } })} />
              <Input label="Avisar con kilómetros de antelación" type="number" min={1} disabled={!useMileage} error={errors.warningKilometers?.message} {...register("warningKilometers", { valueAsNumber: true, min: { value: 1, message: "Mínimo 1 km" } })} />
            </div>
            <p className="flex items-center gap-2 text-xs text-text-muted"><Gauge className="h-4 w-4" />{projection?.currentMileage != null ? `Lectura actual: ${projection.currentMileage.toLocaleString("es-DO")} km${projection.nextDueMileage != null ? ` · Próximo: ${projection.nextDueMileage.toLocaleString("es-DO")} km` : ""}` : "Se activará con la primera lectura de kilometraje registrada."}</p>
          </fieldset>
        </div>

        {errors.useTime?.message ? <p className="mt-3 text-sm text-danger">{errors.useTime.message}</p> : null}
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Checkbox label="Plan automático activo" {...register("isActive")} />
          <Button type="submit" isLoading={updateSchedule.isPending}>Guardar plan</Button>
        </div>
      </form>
    </section>
  );
}

function ProjectionStatus({ projection }: { projection: MaintenanceProjection | null }) {
  if (!projection) return <span className="text-sm font-medium text-text-muted">Sin configurar</span>;
  const labels = { OK: "Al día", UPCOMING: "Próximo", DUE: "Requiere mantenimiento", SCHEDULED: "Programado" } as const;
  const styles = { OK: "text-success", UPCOMING: "text-warning", DUE: "text-danger", SCHEDULED: "text-primary" } as const;
  return <span className={`text-sm font-semibold ${styles[projection.status]}`}>{labels[projection.status]}</span>;
}
