import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import { formatDate } from "@/shared/utils";
import { CustomerAddress } from "@/shared/types/entities/customer.types";
import {
  Button,
  MapPinUserIcon,
  Modal,
  NavigateIcon,
  RefreshIcon,
  Spinner,
  Tooltip,
  TruckIcon,
} from "@/shared/components";
import {
  useGetNearbyVehicles,
  useRefreshVehiclesLocations,
} from "../hooks/useCustomer";
import { createIcon } from "./CreateIcon";

interface VehicleGPS {
  id: number;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  lastUpdate: string;
  distanceKm: number;
  durationMinutes: number;
}

interface NearbyVehiclesMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  addreses: CustomerAddress[];
}

interface CurrentPosition {
  Clat: number;
  Clng: number;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function NearbyVehiclesMapModal({
  isOpen,
  onClose,
  addreses,
}: NearbyVehiclesMapModalProps) {
  const RADIAL_DISTANCE_METERS = 2000;

  const firstWithCoords = addreses.find(
    (a) => a.coordinates?.latitude && a.coordinates?.longitude
  );

  if (!firstWithCoords?.coordinates) return null;

  const [cPostion, setCPosition] = useState<CurrentPosition>({
    Clat: firstWithCoords.coordinates.latitude,
    Clng: firstWithCoords.coordinates.longitude,
  });

  const {
    data: vehiclesData,
    isLoading,
    isRefetching,
    refetch,
  } = useGetNearbyVehicles(
    cPostion.Clat,
    cPostion.Clng,
    RADIAL_DISTANCE_METERS / 1000
  );

  const { mutate: refreshLocations, isPending: isRefreshing } =
    useRefreshVehiclesLocations();

  const nearbyVehicles: VehicleGPS[] = vehiclesData?.data || [];

  const handleRefresh = () => {
    refreshLocations(undefined, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Vehículos cercanos"
      size="xl"
      className="h-[80vh]"
    >
      <div className="flex flex-col h-full">
        <div className="flex-none bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                <TruckIcon size={14} />
                <span className="text-sm font-medium">
                  {nearbyVehicles.length}{" "}
                  {nearbyVehicles.length === 1 ? "disponible" : "disponibles"}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-200"></div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <NavigateIcon size={14} />
                <span className="text-sm">
                  Radio {(RADIAL_DISTANCE_METERS / 1000).toFixed(1)} km
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {nearbyVehicles.length > 0 && (
                <span className="text-xs text-gray-400 font-medium">
                  Actualizado{" "}
                  {formatDate(nearbyVehicles[0]?.lastUpdate, "relative")}
                </span>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={handleRefresh}
                disabled={isRefreshing || isRefetching}
              >
                <RefreshIcon
                  size={16}
                  className={`${
                    isRefreshing || isRefetching ? "animate-spin" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {addreses.length > 1 && (
            <div className="flex items-center gap-3 mt-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Ubicación
              </span>
              <div className="flex flex-wrap gap-2">
                {addreses.map((a) => {
                  const isActive =
                    Math.abs(a.coordinates?.latitude! - cPostion.Clat) <
                      0.00001 &&
                    Math.abs(a.coordinates?.longitude! - cPostion.Clng) <
                      0.00001;

                  const hasCoordinates = !!a.coordinates?.latitude;

                  const button = (
                    <Button
                      disabled={!hasCoordinates}
                      onClick={() => {
                        if (!hasCoordinates) return;

                        setCPosition({
                          Clat: a.coordinates!.latitude,
                          Clng: a.coordinates!.longitude,
                        });
                      }}
                      variant={isActive ? "primary" : "outline"}
                      size="sm"
                      className={
                        !hasCoordinates ? "opacity-50 cursor-not-allowed" : ""
                      }
                    >
                      {a.branchName}
                    </Button>
                  );

                  if (!hasCoordinates) {
                    return (
                      <Tooltip
                        key={a.id}
                        content="Esta dirección no tiene coordenadas asignadas"
                        variant="warning"
                        asChild
                      >
                        {button}
                      </Tooltip>
                    );
                  }

                  return <div key={a.id}>{button}</div>;
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 relative z-0 bg-gray-50">
          <MapContainer
            center={[cPostion.Clat, cPostion.Clng]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            {(isLoading || isRefetching) && (
              <div className="absolute inset-0 z-[1000] bg-white/50 flex items-center justify-center backdrop-blur-sm">
                <Spinner size="lg" className="text-blue-600" />
              </div>
            )}
            <RecenterMap lat={cPostion.Clat} lng={cPostion.Clng} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap"
            />

            <Marker
              position={[cPostion.Clat, cPostion.Clng]}
              icon={createIcon(MapPinUserIcon, "#3b82f6", "Cliente")}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">Ubicación del Cliente</p>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[cPostion.Clat, cPostion.Clng]}
              radius={RADIAL_DISTANCE_METERS}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.06,
                weight: 1.5,
                opacity: 0.3,
              }}
            />

            {nearbyVehicles.map((vehicle) => {
              return (
                <Marker
                  key={vehicle.id}
                  position={[vehicle.lat, vehicle.lng]}
                  icon={createIcon(TruckIcon, "#10b981", vehicle.name)}
                >
                  <Popup>
                    <div className="min-w-[150px] p-1">
                      <div className="flex items-center gap-2">
                        <TruckIcon size={16} className="text-emerald-600" />
                        <p className="font-semibold text-sm">{vehicle.name}</p>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <NavigateIcon size={12} />
                          <span>
                            {vehicle.distanceKm.toFixed(2)} Km de distancia
                          </span>
                          <span>
                            (~{vehicle.durationMinutes.toFixed(1)} minutos)
                          </span>
                        </div>
                        {vehicle.speed > 0 && (
                          <div className="text-gray-500">
                            {vehicle.speed} km/h
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </Modal>
  );
}
