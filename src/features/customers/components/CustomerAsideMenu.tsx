import {
  AsideButton,
  AsideMenu,
  DeleteIcon,
  HistoryIcon,
  PhonePlusIcon,
  ShoppingCartPlusIcon,
  UserEditIcon,
} from "@/shared/components";
import { MapPinPlusIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteCustomer } from "../hooks/useCustomer";
import { toast } from "sonner";
import { extractApiError } from "@/shared/utils";
import { AxiosError } from "axios";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { useModal } from "@/shared/hooks";

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
  const { customerId } = useParams();
  const {
    mutateAsync: deleteCustomer,
    isError,
    error,
  } = useDeleteCustomer(customerId ?? "");
  const navigate = useNavigate();

  const handleDeleteCustomer = async () => {
    await deleteCustomer();
    if (!isError) navigate(-1);
    if (isError) toast.error(extractApiError(error as AxiosError).message);
  };

  const confirmModal = useModal();

  return (
    <AsideMenu>
      <AsideButton
        label="Editar información"
        onClick={() => onOpenEditModal()}
        icon={<UserEditIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Crear pedido"
        onClick={() => navigate(`/orders/new/${customerId}`)}
        icon={<ShoppingCartPlusIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Agregar dirección"
        onClick={() => onOpenCreateAddressModal()}
        icon={<MapPinPlusIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Agregar teléfono"
        onClick={() => onOpenCreatePhoneModal()}
        icon={<PhonePlusIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Historial de pedidos"
        onClick={() => navigate(`/customers/edit/${customerId}`)}
        icon={<HistoryIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Ver vehículos cercanos"
        onClick={() => onOpenNearbyVehiclesMapModal()}
        icon={<MapPinPlusIcon className="w-4 h-4" />}
      />
      <AsideButton
        label="Eliminar cliente"
        onClick={() => confirmModal.open()}
        variant="danger"
        icon={<DeleteIcon className="w-4 h-4" />}
      />

      <ConfirmDialog
        title="Eliminar cliente"
        description="¿Estás seguro de que deseas eliminar este cliente?"
        variant="danger"
        isOpen={confirmModal.isOpen}
        onConfirm={() => handleDeleteCustomer()}
        onCancel={() => confirmModal.close()}
      />
    </AsideMenu>
  );
}
