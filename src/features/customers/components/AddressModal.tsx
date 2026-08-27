import { Input } from "@/shared/components/core/Input";
import { Modal } from "@/shared/components/core/Modal";
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
import { MapPin } from "lucide-react";
import { LocationPickerModal } from "./LocationPickerModal";

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
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<CustomerAddressFormData>({
    resolver: zodResolver(customerAddressSchema),
    defaultValues: {
      branchName: "",
      direction: "",
      city: "",
      isPrimary: false,
      latitude: undefined,
      longitude: undefined,
      locationSource: "MANUAL",
    },
  });

  const { mutate: createAddress, isPending: isCreating } =
    useAddCustomerAddress();
  const { mutate: updateAddress, isPending: isUpdating } =
    useEditCustomerAddress(customerId);

  useEffect(() => {
    if (isOpen && address) {
      reset({
        branchName: address.branchName || "",
        direction: address.direction,
        city: address.city,
        isPrimary: address.isPrimary,
        latitude: address.coords?.latitude,
        longitude: address.coords?.longitude,
        locationSource: address.locationSource ?? "MANUAL",
      });
    } else if (isOpen && !address) {
      reset({
        branchName: "",
        direction: "",
        city: "",
        isPrimary: false,
        latitude: undefined,
        longitude: undefined,
        locationSource: "MANUAL",
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
        },
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
        },
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
            id="branchName"
            type="text"
            placeholder="Ej: Sucursal Principal"
            error={errors.branchName?.message}
            {...register("branchName")}
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
            id="isPrimary"
            {...register("isPrimary")}
          />

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div><p className="text-sm font-medium text-slate-900">Ubicación exacta</p><p className="mt-0.5 text-xs text-slate-500">Opcional: agrega coordenadas para facilitar la entrega.</p></div>
              <Button type="button" variant="outline" size="sm" icon={MapPin} onClick={() => setIsPickerOpen(true)}>Seleccionar en mapa</Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="Latitud" type="number" step="any" error={errors.latitude?.message} {...register("latitude", { setValueAs: (value) => value === "" ? undefined : Number(value) })} />
              <Input label="Longitud" type="number" step="any" {...register("longitude", { setValueAs: (value) => value === "" ? undefined : Number(value) })} />
            </div>
          </div>
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
      <LocationPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        initialPosition={watch("latitude") != null && watch("longitude") != null ? { latitude: watch("latitude")!, longitude: watch("longitude")! } : null}
        onSelect={(position) => { setValue("latitude", position.latitude, { shouldDirty: true }); setValue("longitude", position.longitude, { shouldDirty: true }); setValue("locationSource", "MAP", { shouldDirty: true }); }}
      />
    </Modal>
  );
}
