import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useModal } from "@/shared/hooks/useModal";
import { extractApiError } from "@/shared/utils/error-handler";
import { VehicleFormModal } from "../components/VehicleFormModal";
import { useDeleteVehicle, useGetVehicle, useVehicleOperationalSummary } from "../hooks/useVehicles";
import { VehicleAsideMenu } from "../components/VehicleAsideMenu";
import { VehicleFuelAnalyticsModal } from "../components/VehicleFuelAnalyticsModal";
import { VehicleMaintenanceModal } from "../components/VehicleMaintenanceModal";
import { VehicleDetailSections } from "../components/VehicleDetailSections";

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editModal = useModal();
  const deleteModal = useModal();
  const fuelModal = useModal();
  const maintenanceModal = useModal();
  const { data, isLoading, isError, error, refetch } = useGetVehicle(id);
  const operationalSummary = useVehicleOperationalSummary(id);
  const deleteVehicle = useDeleteVehicle();
  const vehicle = data?.data;

  useHeaderConfig({
    showBackButton: true,
    title: vehicle
      ? `${vehicle.brand} ${vehicle.model}`
      : "Detalle del vehículo",
    description: vehicle
      ? `Ficha ${vehicle.currentTag} · Placa ${vehicle.licensePlate}`
      : "Consulta la información operativa de la unidad.",
  });

  const handleDelete = async () => {
    if (!vehicle) return;
    try {
      await deleteVehicle.mutateAsync(vehicle.id);
      toast.success("Vehículo eliminado correctamente");
      navigate("/vehicles");
    } catch (deleteError) {
      toast.error(extractApiError(deleteError).message);
      deleteModal.close();
    }
  };

  if (isLoading)
    return <SectionLoader className="h-full" placeholder="Cargando vehículo" />;
  if (isError)
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        title="No se pudo cargar el vehículo"
      />
    );
  if (!vehicle)
    return (
      <EmptyState
        title="Vehículo no encontrado"
        description="La unidad solicitada no existe o ya fue eliminada."
      />
    );

  return (
    <div className="flex h-full overflow-hidden">
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="max-w-5xl px-8 py-7">
          <VehicleDetailSections
            vehicle={vehicle}
            summary={operationalSummary.data?.data ?? null}
            isSummaryLoading={operationalSummary.isLoading}
            hasSummaryError={operationalSummary.isError}
          />
        </div>
      </div>
      <VehicleAsideMenu
        onEdit={editModal.open}
        onShowFuel={fuelModal.open}
        onShowMaintenance={maintenanceModal.open}
        onDelete={deleteModal.open}
      />

      <VehicleFuelAnalyticsModal
        isOpen={fuelModal.isOpen}
        onClose={fuelModal.close}
        vehicleId={vehicle.id}
      />
      <VehicleMaintenanceModal
        isOpen={maintenanceModal.isOpen}
        onClose={maintenanceModal.close}
        vehicleId={vehicle.id}
      />
      <VehicleFormModal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        vehicle={vehicle}
      />
      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onCancel={deleteModal.close}
        onConfirm={handleDelete}
        isLoading={deleteVehicle.isPending}
        variant="danger"
        title="Eliminar vehículo"
        description={`Eliminarás permanentemente la unidad ${vehicle.licensePlate}. Esta acción no se puede deshacer.`}
        confirmText="Eliminar vehículo"
      />
    </div>
  );
}
