import { Input, Modal } from "@/shared/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAddCustomerAddress } from "../hooks/useCustomer";
import {
  createCustomerAddressSchema,
  CreateCustomerAddressFormData,
} from "../schemas/customer.schema";
import { Button } from "@/shared/components/core/Button";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { Alert } from "@/shared/components/core/Alert";
import { extractApiError } from "@/shared/utils/error-handler";

interface CreateAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}

export default function CreateAddressModal({
  isOpen,
  onClose,
  customerId,
}: CreateAddressModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerAddressFormData>({
    resolver: zodResolver(createCustomerAddressSchema),
    defaultValues: {
      branch_name: "",
      direction: "",
      city: "",
      is_primary: false,
    },
  });

  const { mutateAsync } = useAddCustomerAddress();

  const onSubmit = async (formData: CreateCustomerAddressFormData) => {
    try {
      setApiError(null); // Limpiar error previo
      await mutateAsync({
        customerId,
        addressData: formData,
      });
      reset();
      onClose();
    } catch (error) {
      const errorInfo = extractApiError(error);
      setApiError(errorInfo.message);
    }
  };

  const handleClose = () => {
    setApiError(null); // Limpiar error al cerrar
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear nueva dirección">
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError && <Alert variant="danger">{apiError}</Alert>}

          <Input
            label="Sucursal"
            id="branch_name"
            type="text"
            placeholder="Ej: Sucursal Principal"
            error={errors.branch_name?.message}
            {...register("branch_name")}
          />

          <Input
            label="Dirección"
            id="direction"
            type="text"
            placeholder="Ej: Av. Principal #123, Sector Centro"
            error={errors.direction?.message}
            {...register("direction")}
          />

          <Input
            label="Ciudad"
            id="city"
            type="text"
            placeholder="Ej: Santo Domingo"
            error={errors.city?.message}
            {...register("city")}
          />

          <Checkbox
            label="Dirección principal"
            id="is_primary"
            {...register("is_primary")}
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Crear Dirección
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
