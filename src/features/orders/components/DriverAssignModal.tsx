import { useGetAllDrivers } from "@/features/employees/hooks/useEmployee";
import { Button } from "@/shared/components/core/Button";
import { Modal } from "@/shared/components/core/Modal";
import { Select } from "@/shared/components/core/Select";
import { UserIcon } from "@/shared/components/icons";
import SectionLoader from "@/shared/components/SectionLoader";
import { Order } from "@/shared/types/entities/order.types";
import { useState } from "react";
import {
  useAssignDriverToOrder,
  useUnassignDriverFromOrder,
} from "../hooks/useOrder";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
interface DriverAssignModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}
export default function DriverAssignModal({
  order,
  isOpen,
  onClose,
}: DriverAssignModalProps) {
  const { data, isLoading, isError } = useGetAllDrivers();

  const [currentDriverId, setCurrentDriverId] = useState<string | undefined>(
    order.assignedTo?.id
  );

  const [isEditing, setIsEditing] = useState(false);

  const isFinalStatus =
    order.status === "ENTREGADO" || order.status === "CANCELADO";
  const hasDriver = !!order.assignedTo;

  const { mutate: assignDriver, isPending: isAssigning } =
    useAssignDriverToOrder();
  const { mutate: unassignDriver } = useUnassignDriverFromOrder();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDriverId) return;
    assignDriver(
      { orderId: order.id, driverId: currentDriverId },
      {
        onSuccess: () => {
          setIsEditing(false);
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Conductor">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <Modal.Body>
          {hasDriver && !isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Conductor asignado
                  </p>
                  <p className="font-medium">{order.assignedTo?.name}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {isLoading && (
                <SectionLoader placeholder="Cargando conductores..." />
              )}
              {isError && <p>Error al cargar los conductores.</p>}

              {!isLoading && !isError && (
                <Select
                  placeholder="Selecciona el chofer"
                  options={data!.data.map((driver) => ({
                    label: `${driver.name} ${driver.lastName}`,
                    value: driver.id,
                  }))}
                  value={currentDriverId}
                  onValueChange={(value: string) => setCurrentDriverId(value)}
                />
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-3 justify-end">
            {!isFinalStatus && hasDriver && !isEditing && (
              <>
                <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
                  Eliminar conductor
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Cambiar conductor
                </Button>
              </>
            )}

            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentDriverId(order.assignedTo?.id);
                }}
                disabled={false}
              >
                Cancelar
              </Button>
            )}

            {(!hasDriver || isEditing) && (
              <Button
                type="submit"
                isLoading={isAssigning}
                disabled={isAssigning || !currentDriverId}
              >
                {hasDriver ? "Actualizar conductor" : "Asignar conductor"}
              </Button>
            )}
          </div>
        </Modal.Footer>
      </form>
      <ConfirmDialog
        variant="danger"
        isOpen={isConfirmOpen}
        title="Eliminar conductor"
        description="¿Estás seguro de que deseas eliminar el conductor asignado a este pedido?"
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => unassignDriver(order.id)}
      />
    </Modal>
  );
}
