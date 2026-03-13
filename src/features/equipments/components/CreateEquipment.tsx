import { Button } from "@/shared/components/core/Button";
import { Select } from "@/shared/components/core/Select";
import {
  BarcodeIcon,
  CalendarIcon,
  PrinterIcon,
  QRCodeIcon,
  RefreshIcon,
} from "@/shared/components/icons";
import { useCreateEquipment, useGetModels } from "../hooks/useEquipments";
import { Modal } from "@/shared/components/core/Modal";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/shared/components/core/Badge";
import { getStatusColor } from "@/shared/utils/status.utils";

export default function CreateEquipment() {
  const {
    data: models,
    isLoading: isLoadingModels,
    isRefetching,
  } = useGetModels();

  const navigate = useNavigate();

  const {
    mutate: createEquipment,
    isPending,
    data,
    isSuccess,
    reset,
  } = useCreateEquipment();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const model_id = Number(e.currentTarget.model_id.value);
    if (!model_id) return;
    createEquipment({ model_id });
  };

  return (
    <section className="p-3 border border-border-light rounded-sm shadow">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-bold text-text-primary uppercase">
          Generar unidad de equipo
        </h3>
        {isRefetching ? <RefreshIcon className="animate-spin" /> : null}
      </div>
      <form onSubmit={handleSubmit} className="gap-4 mt-4">
        <Select
          helperText="Si no existe el modelo, crealo en la pestaña de modelos."
          label="Modelo"
          placeholder="Selecciona un modelo"
          options={
            models?.data.map((m) => ({
              value: String(m.id),
              label: m.name,
            })) ?? []
          }
          name="model_id"
        />

        <div className="p-4 mt-5 bg-background-secondary border border-border-light rounded-sm">
          <p className="text-sm text-text-muted mb-2">
            Informacion de la nueva unidad:
          </p>
          <div className="flex items-center gap-2">
            <div className="flex text-muted-foreground italic text-xs items-center gap-1">
              <BarcodeIcon className="w-4 h-4" />
              <span>El serial será autogenerado</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon />
              <span>Fecha: {new Date().toLocaleDateString("es-DO")}</span>
            </div>
          </div>
        </div>

        <Button
          icon={QRCodeIcon}
          isLoading={isPending}
          disabled={isPending || isLoadingModels}
          className="w-full mt-5"
        >
          Generar equipo
        </Button>
      </form>

      <Modal
        title="Equipo creado exitosamente"
        isOpen={isSuccess}
        onClose={reset}
        closeOnOverlayClick={false}
      >
        <Modal.Body>
          <div className="flex items-center justify-between">
            <p className="font-bold text-text-primary mb-2">
              Detalles del equipo
            </p>
            <Badge className={`${getStatusColor(data?.data.status!)}`}>
              {data?.data.status}
            </Badge>
          </div>
          <div>
            <ul>
              <li>Serial: {data?.data.serialNumber}</li>
              <li>Tipo: {data?.data.model.type}</li>
              <li>Modelo: {data?.data.model.name}</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button icon={PrinterIcon} variant="outline">
            Imprimir etiqueta
          </Button>
          <Button onClick={() => navigate(`/equipments/${data?.data.id}`)}>
            Ver equipo
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
