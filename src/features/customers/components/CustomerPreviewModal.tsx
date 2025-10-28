import { Modal } from "@/shared/components";
import { useCustomerById } from "../hooks/useCustomer";
import { Spinner } from "@/shared/components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string | null;
}

export default function CustomerPreviewModal({
  isOpen,
  onClose,
  customerId,
}: ModalProps) {
  const { data, isLoading, refetch } = useCustomerById(customerId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle del cliente">
      <Modal.Header>Vista previa del cliente</Modal.Header>
      {isLoading ? <Spinner /> : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Modal>
  );
}
