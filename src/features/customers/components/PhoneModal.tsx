import { Checkbox, Input, Modal, Select } from "@/shared/components";
import { Button } from "@/shared/components/core/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  CustomerPhoneFormData,
  customerPhoneSchema,
} from "../schemas/customer.schema";
import {
  useAddCustomerPhone,
  useEditCustomerPhone,
} from "../hooks/useCustomer";
import { extractApiError } from "@/shared/utils/error-handler";
import { CustomerPhone } from "@/shared/types/entities/customer.types";
import { toast } from "sonner";

interface PhoneModalProps {
  customerId: string;
  phone?: CustomerPhone;
  isOpen: boolean;
  onClose: () => void;
}

export default function PhoneModal({
  customerId,
  phone,
  isOpen,
  onClose,
}: PhoneModalProps) {
  const isEditing = !!phone;

  const { mutate: createPhone, isPending: isCreating } = useAddCustomerPhone();
  const { mutate: updatePhone, isPending: isUpdating } =
    useEditCustomerPhone(customerId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<CustomerPhoneFormData>({
    resolver: zodResolver(customerPhoneSchema),
    defaultValues: {
      description: "",
      phone_number: "",
      type: "MOVIL",
      has_whatsapp: false,
      is_primary: false,
    },
  });

  useEffect(() => {
    if (isOpen && phone) {
      reset({
        description: phone.description || "",
        phone_number: phone.phoneNumber,
        type: phone.type,
        has_whatsapp: phone.hasWhatsapp,
        is_primary: phone.isPrimary,
      });
    } else if (isOpen && !phone) {
      reset({
        description: "",
        phone_number: "",
        type: "MOVIL",
        has_whatsapp: false,
        is_primary: false,
      });
    }
  }, [phone?.id, isOpen, reset]);

  const onSubmit = (data: CustomerPhoneFormData) => {
    if (isEditing) {
      updatePhone(
        { phoneData: { ...data }, phoneId: phone!.id },
        {
          onSuccess: () => {
            toast.success("Teléfono actualizado correctamente");
            onClose();
          },
          onError: (error) => {
            toast.error(extractApiError(error).message, {
              position: "bottom-center",
            });
          },
        }
      );
    } else {
      createPhone(
        { customerId, phoneData: data },
        {
          onSuccess: () => {
            toast.success("Teléfono agregado correctamente");
            onClose();
          },
          onError: (error) => {
            toast.error(extractApiError(error).message, {
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
      title={isEditing ? "Editar teléfono" : "Agregar teléfono"}
    >
      <Modal.Body>
        <form
          key={phone?.id || "new"}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
                key={`select-${phone?.id || "new"}-${field.value}`}
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
              disabled={!isDirty || isPending}
            >
              {isEditing ? "Guardar cambios" : "Crear Teléfono"}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
