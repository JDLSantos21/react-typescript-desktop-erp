import { useState } from "react";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { Input } from "@/shared/components/core/Input";
import { useResetFuelTank } from "../hooks/useFuel";

interface ResetTankDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ResetTankDialog({
  isOpen,
  onClose,
  onSuccess,
}: ResetTankDialogProps) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const resetTankMutation = useResetFuelTank();

  const handleConfirm = async () => {
    if (!password.trim()) {
      setPasswordError("Debe ingresar su contraseña");
      return;
    }

    try {
      await resetTankMutation.mutateAsync({ password });
      handleClose();
      onSuccess();
    } catch {
      setPasswordError("Contraseña incorrecta o error en la operación");
    }
  };

  const handleClose = () => {
    setPassword("");
    setPasswordError("");
    onClose();
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Reiniciar tanque"
      description="Esta acción reiniciará el nivel del tanque a su capacidad máxima. Ingrese su contraseña para confirmar."
      confirmText="Reiniciar tanque"
      variant="danger"
      onCancel={handleClose}
      onConfirm={handleConfirm}
      isLoading={resetTankMutation.isPending}
    >
      <Input
        label="Contraseña"
        type="password"
        placeholder="Ingrese su contraseña"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError("");
        }}
        error={passwordError}
      />
    </ConfirmDialog>
  );
}
