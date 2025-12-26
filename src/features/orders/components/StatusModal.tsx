import { Alert, Button, Modal, Select, Textarea } from "@/shared/components";
import { useUpdateOrderStatus } from "../hooks/useOrder";
import { Order, OrderStatus } from "@/shared/types/entities/order.types";
import { toast } from "sonner";
import { extractApiError } from "@/shared/utils";
import { Controller, useForm } from "react-hook-form";
import {
  UpdateOrderStatusFormData,
  UpdateOrderStatusSchema,
} from "../schemas/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface StatusOption {
  label: string;
  value: OrderStatus;
}

const statusOptions: StatusOption[] = [
  { label: "Pendiente", value: "PENDIENTE" },
  { label: "Preparando", value: "PREPARANDO" },
  { label: "Despachado", value: "DESPACHADO" },
  { label: "Entregado", value: "ENTREGADO" },
  { label: "Cancelado", value: "CANCELADO" },
];

interface StatusModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function StatusModal({
  order,
  isOpen,
  onClose,
}: StatusModalProps) {
  const { mutate, isPending } = useUpdateOrderStatus();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateOrderStatusFormData>({
    resolver: zodResolver(UpdateOrderStatusSchema),
    defaultValues: {
      name: order.status,
      description: "",
    },
  });

  const onSubmit = (data: UpdateOrderStatusFormData) => {
    mutate(
      {
        orderId: Number(order.id),
        status: { name: data.name!, description: data.description },
      },
      {
        onSuccess: () => {
          toast.success("Estado del pedido actualizado.");
          reset({
            name: data.name,
            description: "",
          });
          onClose();
        },
        onError: (err) => {
          toast.error(
            extractApiError(err).message ||
              "No se pudo actualizar el estado del pedido."
          );
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Actualizar estado">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {watch("name") === "DESPACHADO" && !order.assignedTo && (
            <Alert title="Atención" variant="warning" className="mb-4">
              El pedido no tiene un conductor asignado. Por favor, asigne un
              conductor antes de cambiar el estado a "Despachado".
            </Alert>
          )}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Select
                className="mb-3"
                options={statusOptions}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Selecciona un estado"
                error={errors.name?.message}
              />
            )}
          />

          <Textarea
            placeholder="Agregar comentario (opcional)"
            {...register("description")}
            error={errors.description?.message}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isPending}
              disabled={
                isPending ||
                watch("name") === order.status ||
                (watch("name") === "DESPACHADO" && !order.assignedTo)
              }
            >
              Actualizar Estado
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
