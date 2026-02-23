import { useParams } from "react-router-dom";
import { useGetEquipmentById } from "../hooks/useEquipments";
import { Badge } from "@/shared/components/core/Badge";
import { Button } from "@/shared/components/core/Button";
import { CopyIcon } from "@/shared/components/icons";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import SectionLoader from "@/shared/components/SectionLoader";
import { copyToClipboard } from "@/shared/utils/clipboard";
import { getStatusColor } from "@/shared/utils/status.utils";
import { toast } from "sonner";

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: equipment,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetEquipmentById(id);

  useHeaderConfig({
    showBackButton: true,
    customContent: (
      <div className="flex items-center px-3 py-1 w-full gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Detalles del equipo
          </h2>
          <div className="flex gap-2 items-center text-sm text-text-secondary">
            <p>Numero de serie {equipment?.data.serialNumber}</p>
            <div className="border-l border-gray-200 h-3 mx-2" />
            <Button
              variant="ghost"
              size="icon"
              icon={CopyIcon}
              onClick={async () => {
                try {
                  await copyToClipboard(equipment?.data.serialNumber!);
                  toast.info("Número de serie copiado.");
                } catch (error) {
                  toast.error("No se pudo copiar el número de serie.");
                }
              }}
            />
            <Badge
              className={`${getStatusColor(equipment?.data.status!)}`}
              size="sm"
            >
              {equipment?.data.status}
            </Badge>
          </div>
        </div>
      </div>
    ),
    title: "",
  });

  return (
    <section className="h-full">
      {isLoading ? (
        <SectionLoader
          className="h-full"
          placeholder="Cargando detalles del equipo"
        />
      ) : isError ? (
        <ErrorState
          error={error}
          title="No se pudo cargar el equipo"
          onRetry={refetch}
        />
      ) : !equipment?.data && !isLoading ? (
        <EmptyState
          title="Equipo no encontrado"
          description="No se encontro el equipo con el identificador proporcionado"
        />
      ) : (
        <div>
          <h1>{equipment?.data.serialNumber}</h1>
        </div>
      )}
    </section>
  );
}
