import { useState } from "react";
import { CircleMarker, MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { Modal } from "@/shared/components/core/Modal";
import { Button } from "@/shared/components/core/Button";
import { DEFAULT_TILE_LAYER } from "@/shared/components/core/Map";

type Position = { latitude: number; longitude: number };
const DEFAULT_POSITION: Position = { latitude: 18.4861, longitude: -69.9312 };

function MapClickTarget({ position, onChange }: { position: Position; onChange: (position: Position) => void }) {
  useMapEvents({ click(event) { onChange({ latitude: event.latlng.lat, longitude: event.latlng.lng }); } });
  return <CircleMarker center={[position.latitude, position.longitude]} radius={9} pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 0.9 }} />;
}

export function LocationPickerModal({ isOpen, onClose, initialPosition, onSelect }: { isOpen: boolean; onClose: () => void; initialPosition?: Position | null; onSelect: (position: Position) => void }) {
  const [position, setPosition] = useState<Position>(initialPosition ?? DEFAULT_POSITION);
  const select = () => { onSelect(position); onClose(); };
  return <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar ubicación exacta" size="xl">
    <Modal.Body>
      <p className="mb-4 text-sm text-slate-500">Haz clic en el mapa para colocar el punto de entrega.</p>
      <div className="h-105 overflow-hidden rounded-lg border border-slate-200">
        <MapContainer center={[position.latitude, position.longitude]} zoom={14} className="h-full w-full" scrollWheelZoom>
          <TileLayer url={DEFAULT_TILE_LAYER.url} attribution={DEFAULT_TILE_LAYER.attribution} />
          <MapClickTarget position={position} onChange={setPosition} />
        </MapContainer>
      </div>
      <p className="mt-3 text-sm text-slate-600">{position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}</p>
    </Modal.Body>
    <Modal.Footer><Button variant="outline" onClick={onClose}>Cancelar</Button><Button onClick={select}>Usar esta ubicación</Button></Modal.Footer>
  </Modal>;
}
