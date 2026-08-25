import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Gauge, TimerReset } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/core/Button";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { extractApiError } from "@/shared/utils/error-handler";
import { formatLongDate } from "@/shared/utils/formatters";
import {
  useUpdateVehicleMaintenanceSchedule,
  useVehicleMaintenanceSchedule,
} from "@/features/maintenance/hooks/useMaintenance";
import type { MaintenanceProjection } from "@/features/maintenance/types/maintenance";

interface VehicleMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
}

interface ScheduleForm {
  useTime: boolean;
  intervalMonths: number;
  warningDays: number;
  useMileage: boolean;
  intervalKilometers: number;
  warningKilometers: number;
  isActive: boolean;
}

export function VehicleMaintenanceModal({
  isOpen,
  onClose,
  vehicleId,
}: VehicleMaintenanceModalProps) {
  const scheduleQuery = useVehicleMaintenanceSchedule(vehicleId, isOpen);
  const saveSchedule = useUpdateVehicleMaintenanceSchedule();
  const projection = scheduleQuery.data?.data ?? null;
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<ScheduleForm>({
    defaultValues: {
      useTime: true,
      intervalMonths: 2,
      warningDays: 15,
      useMileage: true,
      intervalKilometers: 5000,
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
      warningDays: schedule.warningDays,
      useMileage: schedule.intervalKilometers != null,
      intervalKilometers: schedule.intervalKilometers ?? 5000,
      warningKilometers: schedule.warningKilometers,
      isActive: schedule.isActive,
    });
  }, [projection, reset]);

  const submit = async (values: ScheduleForm) => {
    if (!values.useTime && !values.useMileage) {
      setError("useTime", {
        message: "Activa al menos un criterio de generación.",
      });
      return;
    }
    try {
      await saveSchedule.mutateAsync({
        vehicleId,
        data: {
          intervalMonths: values.useTime ? values.intervalMonths : null,
          intervalKilometers: values.useMileage
            ? values.intervalKilometers
            : null,
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plan de mantenimiento"
      size="xl"
      closeOnOverlayClick={!saveSchedule.isPending}
    >
      <Modal.Body className="pb-0">
        {scheduleQuery.isLoading ? (
          <SectionLoader placeholder="Cargando plan" />
        ) : scheduleQuery.isError ? (
          <ErrorState
            title="No se pudo cargar el plan"
            error={scheduleQuery.error}
            onRetry={scheduleQuery.refetch}
          />
        ) : (
          <form
            id="vehicle-maintenance-plan"
            onSubmit={handleSubmit(submit)}
            className="space-y-6"
          >
            <div className="rounded-lg bg-primary/5 px-4 py-3 text-sm text-text-secondary">
              El sistema genera un trabajo cuando se alcanza el tiempo, el
              kilometraje o cualquiera de los dos criterios activos. El
              kilometraje se toma del último consumo de combustible registrado.
            </div>

            <ProjectionSummary projection={projection} />

            <div className="grid gap-5 lg:grid-cols-2">
              <fieldset className="rounded-lg border border-border p-5">
                <div className="flex min-h-6 items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-text-primary">
                    Criterio por tiempo
                  </label>
                  <Checkbox
                    aria-label="Activar criterio por tiempo"
                    {...register("useTime")}
                  />
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Genera el trabajo al alcanzar el período definido.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Intervalo (meses)"
                    type="number"
                    min={1}
                    disabled={!useTime}
                    error={errors.intervalMonths?.message}
                    {...register("intervalMonths", {
                      valueAsNumber: true,
                      min: { value: 1, message: "Mínimo 1 mes" },
                    })}
                  />
                  <Input
                    label="Avisar antes (días)"
                    type="number"
                    min={1}
                    disabled={!useTime}
                    error={errors.warningDays?.message}
                    {...register("warningDays", {
                      valueAsNumber: true,
                      min: { value: 1, message: "Mínimo 1 día" },
                    })}
                  />
                </div>
              </fieldset>

              <fieldset className="rounded-lg border border-border p-5">
                <div className="flex min-h-6 items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-text-primary">
                    Criterio por kilometraje
                  </label>
                  <Checkbox
                    aria-label="Activar criterio por kilometraje"
                    {...register("useMileage")}
                  />
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  Se evalúa de inmediato al registrar cada consumo.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Intervalo (km)"
                    type="number"
                    min={1}
                    disabled={!useMileage}
                    error={errors.intervalKilometers?.message}
                    {...register("intervalKilometers", {
                      valueAsNumber: true,
                      min: { value: 1, message: "Mínimo 1 km" },
                    })}
                  />
                  <Input
                    label="Avisar antes (km)"
                    type="number"
                    min={1}
                    disabled={!useMileage}
                    error={errors.warningKilometers?.message}
                    {...register("warningKilometers", {
                      valueAsNumber: true,
                      min: { value: 1, message: "Mínimo 1 km" },
                    })}
                  />
                </div>
              </fieldset>
            </div>
            {errors.useTime?.message ? (
              <p className="text-sm text-danger">{errors.useTime.message}</p>
            ) : null}
            <Checkbox label="Plan automático activo" {...register("isActive")} />
          </form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={saveSchedule.isPending}
        >
          Cerrar
        </Button>
        <Button
          type="submit"
          form="vehicle-maintenance-plan"
          isLoading={saveSchedule.isPending}
          disabled={scheduleQuery.isLoading || scheduleQuery.isError}
        >
          Guardar plan
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function ProjectionSummary({
  projection,
}: {
  projection: MaintenanceProjection | null;
}) {
  if (!projection) {
    return (
      <p className="text-sm text-text-muted">
        Aún no hay un plan configurado para esta unidad.
      </p>
    );
  }
  const status = {
    OK: "Al día",
    UPCOMING: "Próximo",
    DUE: "Requiere atención",
    SCHEDULED: "Trabajo activo",
  }[projection.status];
  return (
    <div className="grid gap-3 rounded-lg border border-border bg-white p-4 sm:grid-cols-3">
      <Summary
        icon={<TimerReset className="h-4 w-4" />}
        label="Próxima fecha"
        value={
          projection.nextDueDate
            ? formatLongDate(projection.nextDueDate)
            : "Sin criterio de tiempo"
        }
      />
      <Summary
        icon={<Gauge className="h-4 w-4" />}
        label="Kilometraje"
        value={
          projection.currentMileage == null
            ? "Sin lectura"
            : projection.currentMileage.toLocaleString("es-DO") + " km"
        }
        detail={
          projection.nextDueMileage != null
            ? "Meta: " + projection.nextDueMileage.toLocaleString("es-DO") + " km"
            : undefined
        }
      />
      <Summary
        label="Estado actual"
        value={status}
        detail={
          projection.status === "DUE"
            ? "Se genera un trabajo automáticamente."
            : undefined
        }
      />
    </div>
  );
}

function Summary({
  icon,
  label,
  value,
  detail,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs text-text-muted">
        {icon}
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-text-primary">
        {value}
      </p>
      {detail ? <p className="mt-0.5 text-xs text-text-muted">{detail}</p> : null}
    </div>
  );
}
