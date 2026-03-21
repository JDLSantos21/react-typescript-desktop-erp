import { formatDate } from "@/shared/utils/formatters";
import { EyeIcon, UserIcon } from "@/shared/components/icons";
import { EquipmentAssignment } from "@/shared/types/entities/equipment.types";
import { Button } from "@/shared/components/core/Button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/shared/components/core/Badge";
import { getStatusColor } from "@/shared/utils/status.utils";

interface LastAsignmentProps {
  data: EquipmentAssignment;
}

export default function LastAsignment({ data }: LastAsignmentProps) {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium">
          Última asignación
        </h2>
      </div>
      {data.customer ? (
        <div className="mb-4 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <UserIcon className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {data.customer.businessName}
            </p>
            <p className="text-xs text-gray-500">
              {data.customer.representativeName}
            </p>
          </div>
          <Button
            className="ml-auto"
            variant="outline"
            size="sm"
            icon={EyeIcon}
            onClick={() => navigate(`/customers/${data.customer?.id}`)}
          >
            Ver cliente
          </Button>
        </div>
      ) : (
        <div className="w-full bg-blue-50 border border-blue-100 mb-4 rounded-lg p-4 flex items-center text-blue-800">
          <UserIcon className="w-5 h-5 mr-3 shrink-0" />
          <div>
            <p className="text-sm font-medium">
              Asignación sin información de cliente detallada
            </p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <p className="text-xs text-gray-400 mb-1.5">Estado</p>
            <Badge size="lg" className={`${getStatusColor(data.status)}`}>
              {data.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1.5">Fecha de Asignación</p>
            <p className="text-gray-900">{formatDate(data.assignedAt)}</p>
          </div>

          {data.unassignedAt && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">
                Fecha de Desasignación
              </p>
              <p className="text-gray-900">{formatDate(data.unassignedAt)}</p>
            </div>
          )}

          {data.deliveredAt && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Fecha de Entrega</p>
              <p className="text-gray-900">{formatDate(data.deliveredAt)}</p>
            </div>
          )}

          {data.notes && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-1.5">Notas</p>
              <p className="text-gray-900">{data.notes}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
