import { Button, Modal, Textarea } from "@/shared/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { memo } from "react";
import { useUnassignEquipmentFromCustomer } from "../hooks/useEquipments";
import { toast } from "sonner";
import { extractApiError } from "@/shared/utils";
import { EquipmentAssignment } from "@/features/equipments/types/equipment.types";

const unassignEquipmentSchema = z.object({
  reason: z.string().min(1, "Debe proporcionar un motivo"),
});

type UnassignEquipmentFormData = z.infer<typeof unassignEquipmentSchema>;

interface ModalProps {
  assignment: EquipmentAssignment;
  isOpen: boolean;
  onClose: () => void;
}

export default memo(function UnassignEquipmentModal({
  assignment,
  isOpen,
  onClose,
}: ModalProps) {
  const { mutate: unassignEquipment, isPending } = useUnassignEquipmentFromCustomer();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm<UnassignEquipmentFormData>({
    resolver: zodResolver(unassignEquipmentSchema),
  });

  const onSubmit = (data: UnassignEquipmentFormData) => {
    unassignEquipment({
      assignment_id: assignment.id,
      reason: data.reason,
    }, {
      onSuccess: () => {
        toast.success("Equipo desasignado con éxito", {
          position: "bottom-center",
        });
        reset();
        onClose();
      },
      onError: (error) => {
        toast.error(extractApiError(error).message, {
          position: "bottom-center",
        });
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Desasignar Equipo">
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Información de la Asignación
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>ID Asignación:</strong> #{assignment.id}</p>
                <p><strong>Estado Actual:</strong> {assignment.status}</p>
                <p><strong>Fecha de Asignación:</strong> {new Date(assignment.assignedAt).toLocaleDateString()}</p>
                {assignment.deliveredAt && (
                  <p><strong>Fecha de Entrega:</strong> {new Date(assignment.deliveredAt).toLocaleDateString()}</p>
                )}
                {assignment.notes && (
                  <p><strong>Notas:</strong> {assignment.notes}</p>
                )}
              </div>
            </div>

            <div>
              <Textarea
                label="Motivo de Desasignación *"
                placeholder="Describe el motivo por el cual se desasigna este equipo..."
                {...register("reason")}
                error={errors.reason?.message}
                rows={4}
              />
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Al desasignar este equipo, el cliente ya no lo tendrá bajo su responsabilidad.
                Esta acción será registrada en el historial del equipo.
              </p>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            isLoading={isPending}
            variant="danger"
          >
            Desasignar Equipo
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
});