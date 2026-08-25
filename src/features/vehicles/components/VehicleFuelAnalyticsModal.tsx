import { Modal } from "@/shared/components/core/Modal";
import { VehicleFuelAnalytics } from "./VehicleFuelAnalytics";

interface VehicleFuelAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
}

export function VehicleFuelAnalyticsModal({
  isOpen,
  onClose,
  vehicleId,
}: VehicleFuelAnalyticsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Combustible y eficiencia"
      size="xl"
    >
      <Modal.Body>
        <VehicleFuelAnalytics vehicleId={vehicleId} />
      </Modal.Body>
    </Modal>
  );
}
