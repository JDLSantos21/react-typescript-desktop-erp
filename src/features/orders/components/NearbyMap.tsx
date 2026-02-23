import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, Circle } from "react-leaflet";
import { calcDistance } from "@/shared/utils/geo";
import { divIcon } from "leaflet";
import { MapPin, Truck } from "lucide-react";
import { renderToString } from "react-dom/server";
import { useGetNearbyVehicles } from "@/features/customers/hooks/useCustomer";

interface NearbyMapProps {
  lat: number;
  lng: number;
  radialDistance: number; // in meters
}

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

export default function NearbyMap({
  lat,
  lng,
  radialDistance,
}: NearbyMapProps) {
  const [nearbyVehicles, setNearbyVehicles] = useState<VehicleGPS[]>([]);
  const { data: vehicles } = useGetNearbyVehicles(lat, lng, radialDistance);

  const searchNearbyVehicles = async () => {
    const filteredVehicles = vehicles?.data.filter((vehicle: VehicleGPS) => {
      const distance = calcDistance(lat, lng, vehicle.lat, vehicle.lng);
      return distance <= radialDistance;
    });
    setNearbyVehicles(filteredVehicles);
  };

  useEffect(() => {
    searchNearbyVehicles();
  }, [lat, lng, radialDistance]);

  const createCustomIcon = (
    IconComponent: any,
    color: string,
    label?: string,
  ) => {
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
              width: "32px",
              height: "32px",
              backgroundColor: color,
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <IconComponent size={18} color="white" />
          </div>
          {label && (
            <div
              style={{
                backgroundColor: "white",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: "500",
                color: "#374151",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          )}
        </div>,
      ),
      className: "",
      iconSize: label ? [120, 60] : [32, 32],
      iconAnchor: label ? [60, 32] : [16, 16],
    });
  };

  const locationIcon = createCustomIcon(MapPin, "#3b82f6");

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[lat, lng]} icon={locationIcon} />
      <Circle
        pathOptions={{
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.08,
          weight: 2,
          opacity: 0.4,
        }}
        center={[lat, lng]}
        radius={radialDistance}
      />

      {nearbyVehicles.map((vehicle) => (
        <Marker
          icon={createCustomIcon(Truck, "#10b981", vehicle.nombre)}
          title={vehicle.nombre}
          key={vehicle.nombre}
          position={[vehicle.lat, vehicle.lng]}
        />
      ))}
    </MapContainer>
  );
}
