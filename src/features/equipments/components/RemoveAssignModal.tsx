import { Button } from "@/shared/components/core/Button";
import { Modal } from "@/shared/components/core/Modal";
import { useUnassignEquipment } from "../hooks/useEquipments";
import { EquipmentAssignment } from "@/shared/types/entities/equipment.types";
import { Select } from "@/shared/components/core/Select";
import { unassignReasons } from "../equipment.constant";
import { useState } from "react";
import { Textarea } from "@/shared/components/core/Textarea";
import { UserIcon } from "@/shared/components/icons";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { Controller, useForm } from "react-hook-form";
import {
  UnassignFormInput,
  unassignSchema,
} from "../schemas/equipments.schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface RemoveAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: EquipmentAssignment;
}

export default function RemoveAssignModal({
  isOpen,
  onClose,
  assignment,
}: RemoveAssignModalProps) {
  const { mutateAsync: unassignEquipment, isPending } = useUnassignEquipment();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<UnassignFormInput | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UnassignFormInput>({
    defaultValues: {
      assignmentId: assignment.id,
      notes: "",
    },
    resolver: zodResolver(unassignSchema),
  });

  const onValidSubmit = (data: UnassignFormInput) => {
    setFormData(data);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!formData) return;
    try {
      await unassignEquipment(formData);
      onClose();
    } finally {
      reset();
      setFormData(null);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Quitar asignación">
        <Modal.Body className="space-y-4">
          <div>
            <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
              Cliente asignado
            </h2>
            <div className="mb-4 border-gray-200 rounded-lg flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <UserIcon className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {assignment?.customer?.businessName}
                </p>
                <p className="text-xs text-gray-500">
                  {assignment?.customer?.representativeName}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onValidSubmit)}
            id="remove-assign-form"
            className="space-y-4"
          >
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Select
                  label="Motivo de la desasignación"
                  options={Object.entries(unassignReasons).map(
                    ([key, value]) => ({
                      value: key,
                      label: value,
                    }),
                  )}
                  error={errors.reason?.message}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />

            <Textarea
              label="Notas"
              placeholder="Notas adicionales"
              {...register("notes")}
              error={errors.notes?.message}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            type="submit"
            form="remove-assign-form"
            isLoading={isPending}
            disabled={isPending}
          >
            {isPending ? "Eliminando asignación..." : "Eliminar asignación"}
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmDialog
        variant="danger"
        isOpen={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
        title="Quitar asignación"
        description="¿Estás seguro de que deseas quitar esta asignación?"
        onConfirm={handleConfirm}
      />
    </>
  );
}
