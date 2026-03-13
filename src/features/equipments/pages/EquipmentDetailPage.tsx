import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetEquipmentById } from "../hooks/useEquipments";
import { Badge } from "@/shared/components/core/Badge";
import { Button } from "@/shared/components/core/Button";
import { CopyIcon, LocationIcon } from "@/shared/components/icons";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import SectionLoader from "@/shared/components/SectionLoader";
import { copyToClipboard } from "@/shared/utils/clipboard";
import { getStatusColor } from "@/shared/utils/status.utils";
import { toast } from "sonner";
import { EquipmentAsideMenu } from "../components/EquipmentAsideMenu";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { MapModal } from "@/shared/components/core/MapModal";
import LastAsignment from "../components/LastAsignment";

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isMapOpen, setIsMapOpen] = useState(false);

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

  const lastAssignment = equipment?.data.assignments.at(-1);

  const equipmentLocation = { lat: 18.5350541, lng: -69.9072949 };

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
        <div className="flex h-full max-w-6xl">
          <div className="flex-1 space-y-8 px-8 pt-8">
            <section>
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">
                Información del modelo
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Modelo</p>
                    <p className="text-gray-900">
                      {equipment?.data.model.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Marca</p>
                    <p className="text-gray-900">
                      {equipment?.data.model.brand}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Capacidad</p>
                    <p className="text-gray-900">
                      {equipment?.data.model.capacity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Tipo</p>
                    <p className="text-gray-900">
                      {equipment?.data.model.type}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">
                Datos de la unidad
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">ID Único</p>
                    <p className="text-gray-900">{equipment?.data.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">
                      Estado actual
                    </p>
                    <p className="text-gray-900">{equipment?.data.status}</p>
                  </div>
                </div>
              </div>
            </section>

            {lastAssignment ? <LastAsignment data={lastAssignment} /> : null}
          </div>
          <div>
            <EquipmentAsideMenu />
            <div className="border space-y-2 bg-white p-3 text-sm rounded-2xl h-64 m-4 text-gray-400">
              <LocationIcon className="float-end" />
              <h2 className="font-medium uppercase">Ubicación actual</h2>
              <div
                role="button"
                tabIndex={0}
                className="map flex-1 h-[75%] rounded-xl bg-blue-100 cursor-pointer focus-visible:ring-2 focus-visible:outline-none focus:outline-none"
                onClick={() => setIsMapOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsMapOpen(true);
                  }
                }}
              >
                <MapContainer
                  center={[equipmentLocation.lat, equipmentLocation.lng]}
                  zoom={16}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                  touchZoom={false}
                  boxZoom={false}
                  keyboard={false}
                  attributionControl={false}
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                  <Marker
                    position={[equipmentLocation.lat, equipmentLocation.lng]}
                  />
                </MapContainer>
              </div>
              <p className="text-center text-xs">
                Actualizado: 10/03/2026 10:48 PM
              </p>
            </div>
          </div>

          {/* Modal del mapa expandido */}
          <MapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            title="Ubicación del equipo"
            center={equipmentLocation}
            zoom={16}
            markers={[
              {
                id: "equipment-location",
                position: equipmentLocation,
              },
            ]}
          />
        </div>
      )}
    </section>
  );
}
