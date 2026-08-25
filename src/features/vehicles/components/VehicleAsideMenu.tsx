import { DeleteIcon, EditIcon, FuelIcon, HistoryIcon } from "@/shared/components/icons";
import { AsideButton, AsideMenu } from "@/shared/components/navigation/AsideMenu";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { useCanAccess } from "@/shared/authorization/usePermission";

interface VehicleAsideMenuProps {
  onEdit: () => void;
  onShowFuel: () => void;
  onShowMaintenance: () => void;
  onDelete: () => void;
}

export function VehicleAsideMenu({ onEdit, onShowFuel, onShowMaintenance, onDelete }: VehicleAsideMenuProps) {
  const canManageVehicle = useCanAccess(PermissionLevel.SUPERVISION);
  const canViewFuel = useCanAccess(PermissionLevel.ADMINISTRATION);
  const canDeleteVehicle = useCanAccess(PermissionLevel.ADMINISTRATION);

  return <AsideMenu title="Acciones de la unidad">
    {canManageVehicle ? <AsideButton label="Editar información" onClick={onEdit} icon={<EditIcon className="h-4 w-4" />} /> : null}
    {canManageVehicle ? <AsideButton label="Configurar mantenimiento" onClick={onShowMaintenance} icon={<HistoryIcon className="h-4 w-4" />} /> : null}
    {canViewFuel ? <AsideButton label="Ver combustible y eficiencia" onClick={onShowFuel} icon={<FuelIcon className="h-4 w-4" />} /> : null}
    {canDeleteVehicle ? <AsideButton label="Eliminar vehículo" onClick={onDelete} variant="danger" icon={<DeleteIcon className="h-4 w-4" />} /> : null}
  </AsideMenu>;
}
