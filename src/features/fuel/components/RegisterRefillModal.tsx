import { Modal } from "@/shared/components/core/Modal";
import { useForm } from "react-hook-form";
import {
  RegisterRefillFormData,
  RegisterRefillInput,
  registerRefillSchema,
} from "../schemas/fuel.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/shared/components/core/Input";
import { Button } from "@/shared/components/core/Button";
import { useGetFuelTank, useRegisterTankRefill } from "../hooks/useFuel";
import { DollarIcon } from "@/shared/components/icons";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import SectionLoader from "@/shared/components/SectionLoader";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { useState } from "react";
import TankStatusCard from "./TankStatusCard";
import ResetTankDialog from "./ResetTankDialog";

interface FuelRefillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FuelRefillModal({
  isOpen,
  onClose,
}: FuelRefillModalProps) {
  const registerRefillMutation = useRegisterTankRefill();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterRefillInput, unknown, RegisterRefillFormData>({
    resolver: zodResolver(registerRefillSchema),
  });

  const {
    data: tankData,
    isLoading: isLoadingTank,
    isError: isTankError,
    error: tankError,
    refetch: refetchTank,
  } = useGetFuelTank();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<RegisterRefillFormData | null>(
    null,
  );

  const [isResetOpen, setIsResetOpen] = useState(false);

  const onSubmit = (data: RegisterRefillFormData) => {
    setPendingData(data);
    setIsConfirmOpen(true);
  };

  const handleConfirmRegister = async () => {
    if (!pendingData) return;
    try {
      await registerRefillMutation.mutateAsync(pendingData);
      reset();
      setPendingData(null);
      setIsConfirmOpen(false);
      onClose();
    } catch {
      setIsConfirmOpen(false);
    }
  };

  const handleCancelConfirm = () => {
    setIsConfirmOpen(false);
    setPendingData(null);
  };

  return (
    <Modal
      title="Registrar un reabastecimiento"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <Modal.Body>
        {/* Información del tanque */}
        <div className="mb-4">
          {isLoadingTank ? (
            <SectionLoader placeholder="Cargando datos del tanque" />
          ) : isTankError ? (
            <ErrorState
              title="Error al cargar el tanque"
              message="No se pudo obtener la información del tanque."
              error={tankError}
              onRetry={() => refetchTank()}
              className="py-6!"
            />
          ) : !tankData ? (
            <EmptyState
              title="Tanque no encontrado"
              description="No se encontró información del tanque de combustible."
            />
          ) : (
            <TankStatusCard
              tank={tankData.data}
              isModalOpen={isOpen}
              onResetClick={() => setIsResetOpen(true)}
            />
          )}
        </div>

        <form
          id="register-refill-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            label="Cantidad de galones"
            type="number"
            placeholder="Ingrese la cantidad de galones"
            error={errors.gallons?.message}
            {...register("gallons")}
          />
          <Input
            startIcon={<DollarIcon />}
            label="Precio por galón"
            type="number"
            placeholder="Ingrese el precio por galón"
            error={errors.price_per_gallon?.message}
            {...register("price_per_gallon")}
          />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          type="submit"
          form="register-refill-form"
          isLoading={registerRefillMutation.isPending}
        >
          Registrar
        </Button>
      </Modal.Footer>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Confirmar reabastecimiento"
        description={
          pendingData
            ? `¿Estás seguro de registrar ${pendingData.gallons} galones a $${pendingData.price_per_gallon} por galón?`
            : undefined
        }
        confirmText="Confirmar registro"
        onCancel={handleCancelConfirm}
        onConfirm={handleConfirmRegister}
        isLoading={registerRefillMutation.isPending}
      />

      <ResetTankDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onSuccess={() => {
          setIsResetOpen(false);
          onClose();
        }}
      />
    </Modal>
  );
}
