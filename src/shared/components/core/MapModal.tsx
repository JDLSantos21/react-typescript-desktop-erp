import { ReactNode } from "react";
import { Modal } from "./Modal";
import { Map, MapProps } from "./Map";
import { Button } from "./Button";
import { ExternalLinkIcon } from "../icons";
import { cn } from "@/shared/utils";
import { handleOpenGoogleMaps } from "@/lib/opener";

interface MapModalProps extends Omit<MapProps, "height" | "className"> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  actions?: ReactNode;
  showOpenInGoogleMaps?: boolean;
  headerClassName?: string;
}

export function MapModal({
  isOpen,
  onClose,
  title = "Ubicación",
  subtitle,
  size = "xl",
  center,
  markers,
  circles,
  zoom,
  tileLayer,
  showAttribution,
  enableRecenter,
  onMarkerClick,
  actions,
  showOpenInGoogleMaps = true,
  headerClassName,
  children,
}: MapModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <div className="flex flex-col h-[75vh]">
        {/* Header */}
        {(subtitle || actions || showOpenInGoogleMaps) && (
          <div
            className={cn(
              "flex-none bg-white border-b border-gray-200 px-6 py-4",
              headerClassName
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">{subtitle}</div>
              <div className="flex items-center gap-2">
                {actions}
                {showOpenInGoogleMaps && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={ExternalLinkIcon}
                    onClick={() => handleOpenGoogleMaps(center.lat, center.lng)}
                  >
                    Abrir en Google Maps
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map Body */}
        <div className="flex-1 relative">
          <Map
            center={center}
            zoom={zoom}
            markers={markers}
            circles={circles}
            tileLayer={tileLayer}
            showAttribution={showAttribution}
            enableRecenter={enableRecenter}
            onMarkerClick={onMarkerClick}
            height="100%"
          >
            {children}
          </Map>
        </div>
      </div>
    </Modal>
  );
}
