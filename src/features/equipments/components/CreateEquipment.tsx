import { Button } from "@/shared/components/core/Button";
import { Select } from "@/shared/components/core/Select";
import {
  BarcodeIcon,
  CalendarIcon,
  PrinterIcon,
  QRCodeIcon,
  RefreshIcon,
} from "@/shared/components/icons";
import { useCreateEquipment, useEquipmentSites, useGetModels } from "../hooks/useEquipments";
import { Modal } from "@/shared/components/core/Modal";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/shared/components/core/Badge";
import { getStatusColor } from "@/shared/utils/status.utils";
import { usePrintEquipmentLabel } from "../hooks/usePrintEquipmentLabel";

export default function CreateEquipment() {
  const {
    data: models,
    isLoading: isLoadingModels,
    isRefetching,
  } = useGetModels();
  const sites = useEquipmentSites();

  const navigate = useNavigate();

  const {
    mutate: createEquipment,
    isPending,
    data,
    isSuccess,
    reset,
  } = useCreateEquipment();

  const { printLabel } = usePrintEquipmentLabel(data?.data);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const modelId = Number(e.currentTarget.modelId.value);
    const siteId = Number(e.currentTarget.siteId.value);
    if (!modelId || !siteId) return;
    createEquipment({ modelId, siteId });
  };

  return (
    <section className="border-y border-slate-200 py-6">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-semibold text-slate-900">
          Generar unidad de equipo
        </h3>
        {isRefetching ? <RefreshIcon className="animate-spin" /> : null}
      </div>
      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
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
          name="modelId"
        />
        <Select
          helperText="Ubicación física inicial de la unidad."
          label="Ubicación inicial"
          placeholder="Selecciona una ubicación"
          options={(sites.data?.data ?? []).map((site) => ({
            value: String(site.id),
            label: site.name,
          }))}
          name="siteId"
        />

        <div className="border-y border-slate-200 py-4">
          <p className="mb-2 text-sm font-medium text-slate-700">Información de la nueva unidad</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <BarcodeIcon className="w-4 h-4" />
              <span>El serial será autogenerado</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <CalendarIcon className="h-4 w-4" />
              <span>Fecha: {new Date().toLocaleDateString("es-DO")}</span>
            </div>
          </div>
        </div>

        <Button
          icon={QRCodeIcon}
          isLoading={isPending}
          disabled={isPending || isLoadingModels || sites.isLoading}
          className="w-full"
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
              <li>Ubicación: {data?.data.currentSite?.name ?? "—"}</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button icon={PrinterIcon} variant="outline" onClick={() => printLabel()}>
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
