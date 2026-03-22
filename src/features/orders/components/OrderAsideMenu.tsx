import { AsideButton, AsideMenu } from "@/shared/components/navigation/AsideMenu";
import { DeleteIcon } from "@/shared/components/icons";
import { DriverIcon } from "@/shared/components/icons";
import { EditIcon } from "@/shared/components/icons";
import { HistoryIcon } from "@/shared/components/icons";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { useModal } from "@/shared/hooks/useModal";
import { OrderStatus } from "@/shared/types/entities/order.types";

interface AsideMenuProps {
  onOpenStatusHistoryModal: () => void;
  onOpenDriverAssignModal: () => void;
  onOpenEditModal: () => void;
  orderStatus?: OrderStatus;
}

export default function OrderAsideMenu({
  onOpenStatusHistoryModal,
  onOpenDriverAssignModal,
  onOpenEditModal,
  orderStatus,
}: AsideMenuProps) {
  const confirmModal = useModal();

  return (
    <AsideMenu>
      <AsideButton
        label="Editar pedido"
        onClick={() => onOpenEditModal()}
        icon={<EditIcon className="w-4 h-4" />}
        disabled={orderStatus === "ENTREGADO" || orderStatus === "CANCELADO"}
      />
      <AsideButton
        label="Asignar conductor"
        onClick={() => onOpenDriverAssignModal()}
        icon={<DriverIcon className="w-4 h-4" />}
      />

      <AsideButton
        label="Historial de estados"
        onClick={() => onOpenStatusHistoryModal()}
        icon={<HistoryIcon className="w-4 h-4" />}
      />

      <AsideButton
        label="Eliminar pedido"
        onClick={() => confirmModal.open()}
        variant="danger"
        icon={<DeleteIcon className="w-4 h-4" />}
      />
      <ConfirmDialog
        title="Eliminar pedido"
        description="¿Estás seguro de que deseas eliminar este pedido?"
        variant="danger"
        isOpen={confirmModal.isOpen}
        onConfirm={() => {
          /* TODO: handleDeleteOrder() */
          confirmModal.close();
        }}
        onCancel={() => confirmModal.close()}
      />
    </AsideMenu>
  );
}
