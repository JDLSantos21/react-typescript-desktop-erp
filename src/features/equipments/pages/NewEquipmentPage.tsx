import { useNavigate } from "react-router-dom";
import { useHeaderConfig } from "@/shared/hooks";
import CreateEquipmentModal from "../components/CreateEquipmentModal";
import { useModal } from "@/shared/hooks";
import { useEffect } from "react";

export default function NewEquipmentPage() {
  const navigate = useNavigate();
  const createModal = useModal();

  useHeaderConfig({
    title: "Crear Equipo",
    showBackButton: true,
    description: "Registra un nuevo equipo en el sistema",
  });

  useEffect(() => {
    createModal.open();
  }, [createModal]);

  const handleClose = () => {
    createModal.close();
    navigate("/equipments");
  };

  return (
    <CreateEquipmentModal
      isOpen={createModal.isOpen}
      onClose={handleClose}
    />
  );
}