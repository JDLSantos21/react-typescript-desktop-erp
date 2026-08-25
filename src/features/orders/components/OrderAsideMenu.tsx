import { AsideButton, AsideMenu } from "@/shared/components/navigation/AsideMenu";
import { DeleteIcon } from "@/shared/components/icons";
import { DriverIcon } from "@/shared/components/icons";
import { EditIcon } from "@/shared/components/icons";
import { HistoryIcon } from "@/shared/components/icons";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { useModal } from "@/shared/hooks/useModal";
import { OrderStatus } from "@/shared/types/entities/order.types";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { useCanAccess } from "@/shared/authorization/usePermission";

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
  const canOperateOrders = useCanAccess(PermissionLevel.ADVANCED_OPERATIONS);
  const canAssignDriver = useCanAccess(PermissionLevel.SUPERVISION);

  return (
    <AsideMenu>
      {canOperateOrders ? <AsideButton
        label="Editar pedido"
        onClick={() => onOpenEditModal()}
        icon={<EditIcon className="w-4 h-4" />}
        disabled={orderStatus === "ENTREGADO" || orderStatus === "CANCELADO"}
      /> : null}
      {canAssignDriver ? <AsideButton
        label="Asignar conductor"
        onClick={() => onOpenDriverAssignModal()}
        icon={<DriverIcon className="w-4 h-4" />}
      /> : null}

      <AsideButton
        label="Historial de estados"
        onClick={() => onOpenStatusHistoryModal()}
        icon={<HistoryIcon className="w-4 h-4" />}
      />

      {canOperateOrders ? <AsideButton
        label="Eliminar pedido"
        onClick={() => confirmModal.open()}
        variant="danger"
        icon={<DeleteIcon className="w-4 h-4" />}
      /> : null}
      {canOperateOrders ? <ConfirmDialog
        title="Eliminar pedido"
        description="¿Estás seguro de que deseas eliminar este pedido?"
        variant="danger"
        isOpen={confirmModal.isOpen}
        onConfirm={() => {
          /* TODO: handleDeleteOrder() */
          confirmModal.close();
        }}
        onCancel={() => confirmModal.close()}
      /> : null}
    </AsideMenu>
  );
}
