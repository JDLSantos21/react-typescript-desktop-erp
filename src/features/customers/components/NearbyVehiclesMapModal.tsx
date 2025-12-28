import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, Circle, Popup } from "react-leaflet";
import { divIcon } from "leaflet";
import { MapPin, Truck, X, Navigation } from "lucide-react";
import { renderToString } from "react-dom/server";
import { calcDistance } from "@/shared/utils";
import VehiclesData from "@/features/orders/mocks/vehiclesCoordinates.json";

interface VehicleGPS {
  id: number;
  nombre: string;
  lat: number;
  lng: number;
  velocidad: number;
  rumbo: number;
  ultimaActualizacion: string;
  conectado: boolean;
}

export default function NearbyVehiclesMapModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [nearbyVehicles, setNearbyVehicles] = useState<VehicleGPS[]>([]);
  const lat = 18.560477;
  const lng = -69.932504;
  const radialDistance = 2500;

  useEffect(() => {
    if (!isOpen) return;

    const filtered = VehiclesData.filter((vehicle) => {
      const distance = calcDistance(lat, lng, vehicle.lat, vehicle.lng);
      return distance <= radialDistance;
    });
    setNearbyVehicles(filtered);
  }, [isOpen]);

  const createIcon = (IconComponent: any, color: string, label?: string) => {
    return divIcon({
      html: renderToString(
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              backgroundColor: color,
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            <IconComponent size={16} color="white" strokeWidth={2.5} />
          </div>
          {label && (
            <div
              style={{
                backgroundColor: "white",
                padding: "3px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: "600",
                color: "#1f2937",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                whiteSpace: "nowrap",
                border: "1px solid #e5e7eb",
              }}
            >
              {label}
            </div>
          )}
        </div>
      ),
      className: "",
      iconSize: label ? [120, 60] : [28, 28],
      iconAnchor: label ? [60, 32] : [14, 14],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-lg shadow-2xl overflow-hidden m-4">
        <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Vehículos Cercanos
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {nearbyVehicles.length}{" "}
                {nearbyVehicles.length === 1 ? "vehículo" : "vehículos"} en un
                radio de {(radialDistance / 1000).toFixed(1)} km
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="h-full pt-20">
          <MapContainer
            center={[lat, lng]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap"
            />

            <Marker
              position={[lat, lng]}
              icon={createIcon(MapPin, "#3b82f6", "Cliente")}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">Ubicación del Cliente</p>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[lat, lng]}
              radius={radialDistance}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.06,
                weight: 1.5,
                opacity: 0.3,
              }}
            />

            {nearbyVehicles.map((vehicle) => {
              const distance = calcDistance(lat, lng, vehicle.lat, vehicle.lng);
              return (
                <Marker
                  key={vehicle.id}
                  position={[vehicle.lat, vehicle.lng]}
                  icon={createIcon(
                    Truck,
                    vehicle.conectado ? "#10b981" : "#6b7280",
                    vehicle.nombre
                  )}
                >
                  <Popup>
                    <div className="min-w-[180px] p-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck
                          size={16}
                          className={
                            vehicle.conectado
                              ? "text-emerald-600"
                              : "text-gray-500"
                          }
                        />
                        <p className="font-semibold text-sm">
                          {vehicle.nombre}
                        </p>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Navigation size={12} />
                          <span>{distance.toFixed(2)} m de distancia</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              vehicle.conectado
                                ? "bg-emerald-500"
                                : "bg-gray-400"
                            }`}
                          />
                          <span>
                            {vehicle.conectado ? "Conectado" : "Desconectado"}
                          </span>
                        </div>
                        {vehicle.velocidad > 0 && (
                          <div className="text-gray-500">
                            {vehicle.velocidad} km/h
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
    </div>
  );
}
