import { Button, Modal, Select } from "@/shared/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CreateEquipmentFormData,
  createEquipmentSchema,
} from "../schemas/equipment.schema";
import { memo } from "react";
import {
  useCreateEquipment,
  useGetAllEquipmentModels,
} from "../hooks/useEquipments";
import { toast } from "sonner";
import { extractApiError } from "@/shared/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default memo(function CreateEquipmentModal({
  isOpen,
  onClose,
}: ModalProps) {
  const { mutate: createEquipment, isPending } = useCreateEquipment();
  const { data: modelsData } = useGetAllEquipmentModels();

  console.log("Models Data:", modelsData?.data);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateEquipmentFormData>({
    resolver: zodResolver(createEquipmentSchema),
  });

  const selectedModelId = watch("model_id");

  const onSubmit = (equipmentData: CreateEquipmentFormData) => {
    createEquipment(Number(equipmentData.model_id), {
      onSuccess: () => {
        toast.success("Equipo creado con éxito", {
          position: "bottom-center",
        });
        onClose();
      },
      onError: (error) => {
        toast.error(extractApiError(error).message, {
          position: "bottom-center",
        });
      },
    });
  };

  const modelOptions =
    modelsData?.data.map((model) => ({
      value: model.id.toString(),
      label: `${model.name} - ${model.type}${
        model.brand ? ` (${model.brand})` : ""
      }`,
    })) || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Equipo">
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Select
                label="Modelo del Equipo"
                placeholder="Selecciona un modelo"
                options={modelOptions}
                value={selectedModelId || ""}
                onValueChange={(value) => setValue("model_id", value)}
                error={errors.model_id?.message}
              />
            </div>

            {selectedModelId && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Detalles del Modelo
                </h4>
                {(() => {
                  const selectedModel = modelsData?.data.find(
                    (model) => model.id.toString() === selectedModelId
                  );
                  if (!selectedModel) return null;

                  return (
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Nombre:</strong> {selectedModel.name}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {selectedModel.type}
                      </p>
                      {selectedModel.brand && (
                        <p>
                          <strong>Marca:</strong> {selectedModel.brand}
                        </p>
                      )}
                      {selectedModel.capacity && (
                        <p>
                          <strong>Capacidad:</strong> {selectedModel.capacity}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            isLoading={isPending}
            disabled={!selectedModelId}
          >
            Crear Equipo
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
});
