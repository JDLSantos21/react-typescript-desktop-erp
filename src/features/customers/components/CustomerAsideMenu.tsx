import {
  DeleteIcon,
  DistanceIcon,
  HistoryIcon,
  PhonePlusIcon,
  ShoppingCartPlusIcon,
  UserEditIcon,
} from "@/shared/components/icons";
import {
  AsideButton,
  AsideMenu,
} from "@/shared/components/navigation/AsideMenu";
import { MapPinPlusIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteCustomer } from "../hooks/useCustomer";
import { toast } from "sonner";
import { extractApiError } from "@/shared/utils/error-handler";
import { AxiosError } from "axios";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { useModal } from "@/shared/hooks/useModal";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { useCanAccess } from "@/shared/authorization/usePermission";

interface AsideMenuProps {
  onOpenCreateAddressModal: () => void;
  onOpenCreatePhoneModal: () => void;
  onOpenEditModal: () => void;
  onOpenNearbyVehiclesMapModal: () => void;
}

export default function CustomerAsideMenu({
  onOpenCreateAddressModal,
  onOpenCreatePhoneModal,
  onOpenEditModal,
  onOpenNearbyVehiclesMapModal,
}: AsideMenuProps) {
  const { id } = useParams();
  const {
    mutateAsync: deleteCustomer,
    isError,
    error,
  } = useDeleteCustomer(id ?? "");
  const navigate = useNavigate();

  const handleDeleteCustomer = async () => {
    await deleteCustomer();
    if (!isError) navigate(-1);
    if (isError) toast.error(extractApiError(error as AxiosError).message);
  };

  const confirmModal = useModal();
  const canManageCustomer = useCanAccess(PermissionLevel.ADVANCED_OPERATIONS);

  return (
    <AsideMenu>
      {canManageCustomer ? <AsideButton
        label="Editar información"
        onClick={() => onOpenEditModal()}
        icon={<UserEditIcon className="w-4 h-4" />}
      /> : null}
      {canManageCustomer ? <AsideButton
        label="Crear pedido"
        onClick={() => navigate(`/orders/new/${id}`)}
        icon={<ShoppingCartPlusIcon className="w-4 h-4" />}
      /> : null}
      {canManageCustomer ? <AsideButton
        label="Agregar dirección"
        onClick={() => onOpenCreateAddressModal()}
        icon={<MapPinPlusIcon className="w-4 h-4" />}
      /> : null}
      {canManageCustomer ? <AsideButton
        label="Agregar teléfono"
        onClick={() => onOpenCreatePhoneModal()}
        icon={<PhonePlusIcon className="w-4 h-4" />}
      /> : null}
      <AsideButton
        label="Historial de pedidos"
        onClick={() => navigate(`/customers/${id}/orders-history`)}
        icon={<HistoryIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Vehículos cercanos"
        onClick={() => onOpenNearbyVehiclesMapModal()}
        icon={<DistanceIcon className="w-4 h-4" />}
      />
      {canManageCustomer ? <AsideButton
        label="Eliminar cliente"
        onClick={() => confirmModal.open()}
        variant="danger"
        icon={<DeleteIcon className="w-4 h-4" />}
      /> : null}

      {canManageCustomer ? <ConfirmDialog
        title="Eliminar cliente"
        description="¿Estás seguro de que deseas eliminar este cliente?"
        variant="danger"
        isOpen={confirmModal.isOpen}
        onConfirm={() => handleDeleteCustomer()}
        onCancel={() => confirmModal.close()}
      /> : null}
    </AsideMenu>
  );
}
