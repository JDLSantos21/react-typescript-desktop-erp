import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "danger";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirmar acción",
  description = "¿Estás seguro de que deseas realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "primary",
  isLoading = false,
  children,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      closeOnOverlayClick={false}
    >
      <Modal.Body>
        <p>{description}</p>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} isLoading={isLoading} variant={variant}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
