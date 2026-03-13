import React, { ReactNode, useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import { divIcon, LatLngExpression } from "leaflet";
import { renderToString } from "react-dom/server";
import { cn } from "@/shared/utils/cn";
import "leaflet/dist/leaflet.css";

// ============================================================================
// Types
// ============================================================================

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapMarkerProps {
  id: string | number;
  position: MapPosition;
  icon?: (props: any) => React.JSX.Element;
  iconColor?: string;
  label?: string;
  popup?: ReactNode;
  onClick?: () => void;
}

export interface MapCircleProps {
  center: MapPosition;
  radius: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  weight?: number;
  opacity?: number;
}

export interface MapProps {
  center: MapPosition;
  zoom?: number;
  markers?: MapMarkerProps[];
  circles?: MapCircleProps[];
  className?: string;
  height?: string;
  tileLayer?: "default" | "satellite" | "dark";
  showAttribution?: boolean;
  enableRecenter?: boolean;
  onMarkerClick?: (markerId: string | number) => void;
  children?: ReactNode;
}

// ============================================================================
// Internal Components
// ============================================================================

function RecenterMap({ center }: { center: MapPosition }) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], undefined, {
      animate: true,
      duration: 0.5,
    });
  }, [center.lat, center.lng, map]);

  return null;
}

// ============================================================================
// Icon Factory
// ============================================================================

function createMarkerIcon(
  IconComponent?: (props: any) => React.JSX.Element,
  color: string = "#3b82f6",
  label?: string
) {
  return divIcon({
    html: renderToString(
      <div className="flex flex-col items-center gap-1">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            backgroundColor: color,
            borderRadius: "50%",
            border: "3px solid white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          {IconComponent && <IconComponent size={18} color="white" />}
        </div>
        {label && (
          <div
            style={{
              backgroundColor: "white",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "600",
              color: "#1f2937",
              boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
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
    iconSize: label ? [140, 70] : [32, 32],
    iconAnchor: label ? [70, 36] : [16, 16],
    popupAnchor: [0, -20],
  });
}

// ============================================================================
// Tile Layer Configurations
// ============================================================================

const TILE_LAYERS = {
  default: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  },
} as const;

// ============================================================================
// Main Map Component
// ============================================================================

const DEFAULT_MARKERS: MapMarkerProps[] = [];
const DEFAULT_CIRCLES: MapCircleProps[] = [];

export function Map({
  center,
  zoom = 14,
  markers = DEFAULT_MARKERS,
  circles = DEFAULT_CIRCLES,
  className,
  height = "100%",
  tileLayer = "default",
  showAttribution = false,
  enableRecenter = true,
  onMarkerClick,
  children,
}: MapProps) {
  const mapCenter: LatLngExpression = useMemo(
    () => [center.lat, center.lng],
    [center.lat, center.lng]
  );

  const selectedTileLayer = TILE_LAYERS[tileLayer];

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height, width: "100%" }}
      className={cn("z-0 rounded-lg", className)}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      {enableRecenter && <RecenterMap center={center} />}

      <TileLayer
        url={selectedTileLayer.url}
        attribution={showAttribution ? selectedTileLayer.attribution : ""}
      />

      {/* Render Circles */}
      {circles.map((circle) => (
        <Circle
          key={`circle-${circle.center.lat}-${circle.center.lng}-${circle.radius}`}
          center={[circle.center.lat, circle.center.lng]}
          radius={circle.radius}
          pathOptions={{
            color: circle.color || "#3b82f6",
            fillColor: circle.fillColor || "#3b82f6",
            fillOpacity: circle.fillOpacity ?? 0.1,
            weight: circle.weight ?? 2,
            opacity: circle.opacity ?? 0.5,
          }}
        />
      ))}

      {/* Render Markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.position.lat, marker.position.lng]}
          icon={createMarkerIcon(marker.icon, marker.iconColor, marker.label)}
          eventHandlers={{
            click: () => {
              marker.onClick?.();
              onMarkerClick?.(marker.id);
            },
          }}
        >
          {marker.popup && <Popup>{marker.popup}</Popup>}
        </Marker>
      ))}

      {/* Custom children for advanced use cases */}
      {children}
    </MapContainer>
  );
}

// ============================================================================
// Convenience Exports
// ============================================================================

export type { MapMarkerProps as Marker, MapCircleProps as Circle };
