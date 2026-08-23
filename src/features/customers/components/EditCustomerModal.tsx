import { Button } from "@/shared/components/core/Button";
import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
import { Customer } from "@/shared/types/entities/customer.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpdateCustomerFormData,
  updateCustomerSchema,
} from "../schemas/customer.schema";
import { memo } from "react";
import { useEditCustomer } from "../hooks/useCustomer";
import { toast } from "sonner";
import { extractApiError } from "@/shared/utils/error-handler";

interface ModalProps {
  customer?: Customer;
  isOpen: boolean;
  onClose: () => void;
}

export default memo(function EditCustomerModal({
  customer,
  isOpen,
  onClose,
}: ModalProps) {
  const { mutate: editCustomer, isPending } = useEditCustomer();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateCustomerFormData>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      businessName: customer?.businessName,
      representativeName: customer?.representativeName,
      email: customer?.email || "",
      rnc: customer?.rnc || "",
      notes: customer?.notes || "",
    },
  });

  const onSubmit = (customerData: UpdateCustomerFormData) => {
    if (!customer?.id) return;

    editCustomer(
      {
        customerId: customer.id,
        customerData,
      },
      {
        onSuccess: () => {
          toast.success("Cliente actualizado con éxito", {
            position: "bottom-center",
          });
          onClose();
        },
        onError: (error) => {
          toast.error(extractApiError(error).message, {
            position: "bottom-center",
          });
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar información">
      {!customer ? (
        <Modal.Body>
          <div>No se pudo cargar la información del cliente.</div>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Negocio"
                placeholder="Ej: Ferretería El Martillo"
                error={errors.businessName?.message}
                {...register("businessName")}
              />
              <Input
                label="Nombre del Representante"
                placeholder="Ej: Juan Pérez"
                error={errors.representativeName?.message}
                {...register("representativeName")}
              />
              <Input
                label="RNC (Opcional)"
                placeholder="000-0000000-0"
                error={errors.rnc?.message}
                {...register("rnc")}
              />
              <Input
                label="Correo Electrónico (Opcional)"
                type="email"
                placeholder="ejemplo@correo.com"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
            <div className="mt-4">
              <Input
                label="Nota (Opcional)"
                placeholder="Información adicional sobre el cliente"
                error={errors.notes?.message}
                {...register("notes")}
              />
            </div>
          </form>
        </Modal.Body>
      )}
      <Modal.Footer>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit(onSubmit)} isLoading={isPending}>
            Guardar cambios
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
});
