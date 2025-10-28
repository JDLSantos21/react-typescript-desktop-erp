import { Alert, Checkbox, Input, Modal, Select } from "@/shared/components";
import { Button } from "@/shared/components/core/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  CreateCustomerPhoneFormData,
  createCustomerPhoneSchema,
} from "../schemas/customer.schema";
import { useAddCustomerPhone } from "../hooks/useCustomer";
import { extractApiError } from "@/shared/utils/error-handler";

interface CreatePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}

export default function CreatePhoneModal({
  isOpen,
  onClose,
  customerId,
}: CreatePhoneModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerPhoneFormData>({
    resolver: zodResolver(createCustomerPhoneSchema),
    defaultValues: {
      description: "",
      phone_number: "",
      type: "MOVIL",
      has_whatsapp: false,
      is_primary: false,
    },
  });

  const { mutateAsync: createPhoneForCustomer } = useAddCustomerPhone();

  const handleCreatePhone = async (phoneData: CreateCustomerPhoneFormData) => {
    try {
      setApiError(null);
      await createPhoneForCustomer({ customerId, phoneData });
      reset();
      onClose();
    } catch (error) {
      const errorInfo = extractApiError(error);
      setApiError(errorInfo.message);
      console.error("Error al crear teléfono:", errorInfo);
    }
  };

  const handleClose = () => {
    setApiError(null);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Header>Crear Teléfono</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleCreatePhone)} className="space-y-4">
          {apiError && (
            <Alert variant="danger">
              <strong>Error:</strong> {apiError}
            </Alert>
          )}

          <Input
            label="Número de teléfono"
            id="phone_number"
            type="text"
            error={errors.phone_number?.message}
            placeholder="809-123-4567"
            {...register("phone_number")}
          />

          <Input
            label="Descripción"
            id="description"
            error={errors.description?.message}
            placeholder="Descripción del teléfono"
            {...register("description")}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Tipo de teléfono"
                options={[
                  { value: "MOVIL", label: "Móvil" },
                  { value: "FIJO", label: "Fijo" },
                  { value: "TRABAJO", label: "Trabajo" },
                  { value: "OTROS", label: "Otros" },
                ]}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.type?.message}
                placeholder="Seleccionar tipo"
              />
            )}
          />

          <Checkbox
            label="¿Tiene WhatsApp?"
            id="has_whatsapp"
            {...register("has_whatsapp")}
          />

          <Checkbox
            label="¿Es el teléfono principal?"
            id="is_primary"
            {...register("is_primary")}
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Crear Teléfono
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
