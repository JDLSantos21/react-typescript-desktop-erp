import { Button, Modal, Select, Textarea } from "@/shared/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { memo } from "react";
import { useAssignEquipmentToCustomer } from "../hooks/useEquipments";
import { useGetCustomers } from "@/features/customers/hooks/useCustomer";
import { toast } from "sonner";
import { extractApiError } from "@/shared/utils";

const assignEquipmentSchema = z.object({
  customer_id: z.string().min(1, "Debe seleccionar un cliente"),
  customer_address_id: z.number().min(1, "Debe seleccionar una dirección"),
  notes: z.string().optional(),
});

type AssignEquipmentFormData = z.infer<typeof assignEquipmentSchema>;

interface ModalProps {
  equipmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default memo(function AssignEquipmentModal({
  equipmentId,
  isOpen,
  onClose,
}: ModalProps) {
  const { mutate: assignEquipment, isPending } = useAssignEquipmentToCustomer();
  const { data: customersData } = useGetCustomers({ limit: 1000 });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    register,
  } = useForm<AssignEquipmentFormData>({
    resolver: zodResolver(assignEquipmentSchema),
  });

  const selectedCustomerId = watch("customer_id");
  const selectedAddressId = watch("customer_address_id");

  const selectedCustomer = customersData?.data?.find(
    (c) => c.id === selectedCustomerId
  );

  const customerOptions =
    customersData?.data?.map((c) => ({
      value: c.id,
      label: c.businessName, // Solo mostramos el nombre comercial principal para limpiar el select
    })) || [];

  const addressOptions =
    selectedCustomer?.addresses.map((a) => ({
      value: a.id.toString(),
      label: `${a.direction}, ${a.city}`,
    })) || [];

  const onSubmit = (data: AssignEquipmentFormData) => {
    assignEquipment(
      {
        equipment_id: equipmentId,
        customer_id: data.customer_id,
        customer_address_id: data.customer_address_id,
        notes: data.notes,
      },
      {
        onSuccess: () => {
          toast.success("Equipo asignado correctamente");
          handleClose();
        },
        onError: (error) => toast.error(extractApiError(error).message),
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nueva Asignación">
      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
          {/* Paso 1: Selección de Cliente */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              1. Seleccionar Cliente
            </label>
            <Select
              placeholder="Buscar por nombre..."
              options={customerOptions}
              value={selectedCustomerId || ""}
              onValueChange={(val) => {
                setValue("customer_id", val);
                setValue("customer_address_id", 0);
              }}
              error={errors.customer_id?.message}
              className="w-full"
            />
          </div>

          {/* Context Card: Información del Cliente Seleccionado */}
          {selectedCustomer && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-4 items-center animate-in fade-in slide-in-from-top-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                {selectedCustomer.businessName.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-800">
                  {selectedCustomer.businessName}
                </p>
                <p className="text-slate-500">
                  {selectedCustomer.representativeName}
                </p>
              </div>
            </div>
          )}

          {/* Paso 2: Detalles de Entrega */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                2. Ubicación de Entrega
              </label>
              <Select
                placeholder={
                  !selectedCustomerId
                    ? "Primero selecciona un cliente"
                    : "Selecciona sucursal..."
                }
                options={addressOptions}
                value={selectedAddressId?.toString() || ""}
                onValueChange={(val) =>
                  setValue("customer_address_id", parseInt(val))
                }
                error={errors.customer_address_id?.message}
                disabled={!selectedCustomerId}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Notas Adicionales
              </label>
              <Textarea
                placeholder="Instrucciones de entrega, condiciones especiales..."
                {...register("notes")}
                className="min-h-[80px] text-sm"
              />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-3 justify-end w-full">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
            className="text-slate-500"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            isLoading={isPending}
            disabled={!selectedCustomerId || !selectedAddressId}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-6"
          >
            Confirmar Asignación
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
});
