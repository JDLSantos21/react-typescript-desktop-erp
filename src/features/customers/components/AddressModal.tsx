import { Input, Modal } from "@/shared/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  useAddCustomerAddress,
  useEditCustomerAddress,
} from "../hooks/useCustomer";
import {
  CustomerAddressFormData,
  customerAddressSchema,
} from "../schemas/customer.schema";
import { Button } from "@/shared/components/core/Button";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { Alert } from "@/shared/components/core/Alert";
import { extractApiError } from "@/shared/utils/error-handler";
import { CustomerAddress } from "@/shared/types/entities/customer.types";
import { toast } from "sonner";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  address?: CustomerAddress;
}

export default function AddressModal({
  isOpen,
  onClose,
  customerId,
  address,
}: AddressModalProps) {
  const isEditing = !!address;
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CustomerAddressFormData>({
    resolver: zodResolver(customerAddressSchema),
    defaultValues: {
      branch_name: "",
      direction: "",
      city: "",
      is_primary: false,
    },
  });

  const { mutate: createAddress, isPending: isCreating } =
    useAddCustomerAddress();
  const { mutate: updateAddress, isPending: isUpdating } =
    useEditCustomerAddress(customerId);

  useEffect(() => {
    if (isOpen && address) {
      reset({
        branch_name: address.branchName || "",
        direction: address.direction,
        city: address.city,
        is_primary: address.isPrimary,
      });
    } else if (isOpen && !address) {
      reset({
        branch_name: "",
        direction: "",
        city: "",
        is_primary: false,
      });
    }

    setApiError(null);
  }, [address?.id, isOpen, reset]);

  const onSubmit = async (formData: CustomerAddressFormData) => {
    if (isOpen && isEditing) {
      updateAddress(
        { addressId: address!.id, addressData: formData },
        {
          onSuccess: () => {
            toast.success("Dirección actualizada correctamente");
            onClose();
          },
          onError: (error) => {
            toast.warning(extractApiError(error).message, {
              position: "bottom-center",
            });
          },
        }
      );
    } else {
      createAddress(
        {
          customerId,
          addressData: formData,
        },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
          onError: (error) => {
            toast.warning(extractApiError(error).message, {
              position: "bottom-center",
            });
          },
        }
      );
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar dirección" : "Agregar dirección"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="space-y-4">
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
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isPending}
            disabled={!isDirty || isPending}
          >
            {isEditing ? "Guardar Cambios" : "Crear Dirección"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
