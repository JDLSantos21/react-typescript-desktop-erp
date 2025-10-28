import {
  DeleteIcon,
  HistoryIcon,
  PhonePlusIcon,
  ShoppingCartPlusIcon,
  UserEditIcon,
} from "@/shared/components";
import { MapPinPlusIcon } from "lucide-react";
import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface AsideMenuProps {
  onOpenCreateAddressModal: () => void;
  onOpenCreatePhoneModal: () => void;
}

export default function AsideMenu({
  onOpenCreateAddressModal,
  onOpenCreatePhoneModal,
}: AsideMenuProps) {
  const { customerId } = useParams();
  const navigate = useNavigate();
  return (
    <aside className="bg-background-secondary p-4 w-[300px] h-full border rounded-md border-border-light sticky top-4">
      <div className="mb-4 pb-3 border-b border-border-light">
        <h2 className="text-base font-semibold text-text-primary">
          Menú de acción
        </h2>
        <p className="text-xs text-text-muted mt-1">
          Acciones rápidas disponibles
        </p>
      </div>

      <nav className="space-y-1">
        <AsideButton
          label="Editar información"
          onClick={() => navigate(`/customers/edit/${customerId}`)}
          icon={<UserEditIcon className="w-4 h-4" />}
        />
        <AsideButton
          label="Crear pedido"
          onClick={() => navigate("/customers/new")}
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
          label="Eliminar cliente"
          variant="danger"
          onClick={() => navigate(`/customers/edit/${customerId}`)}
          icon={<DeleteIcon className="w-4 h-4" />}
        />
      </nav>
    </aside>
  );
}

function AsideButton({
  label,
  onClick,
  icon,
  variant = "default",
}: {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <button
      className={`
        group w-full text-left cursor-pointer 
        px-3 py-2.5 rounded-md
        text-sm font-medium ${
          variant === "danger" ? "text-danger" : "text-text-primary"
        }
        bg-background
        border border-transparent
        hover:border-border-light hover:bg-background-hover hover:shadow-sm
        active:scale-[0.98]
        transition-all duration-200
        flex items-center gap-3
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30`}
      onClick={onClick}
    >
      {variant === "danger" && (
        <span className="text-danger group-hover:text-danger-hover transition-colors duration-200">
          {icon}
        </span>
      )}
      {variant === "default" && icon && (
        <span className="text-primary group-hover:text-primary-hover transition-colors duration-200">
          {icon}
        </span>
      )}

      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
        {label}
      </span>
    </button>
  );
}
