import { Edit3, MapPin, Trash2 } from "lucide-react";
import { Modal } from "@/shared/components/core/Modal";
import { Button } from "@/shared/components/core/Button";
import { Map } from "@/shared/components/core/Map";
import { useCanAccess } from "@/shared/authorization/usePermission";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { CustomerAddress } from "@/shared/types/entities/customer.types";
const sources = { MANUAL: "Coordenadas manuales", MAP: "Seleccionada en mapa", MOBILE_GPS: "GPS móvil" };
export function AddressDetailModal({ address, isOpen, onClose, onEdit, onDelete }: { address?: CustomerAddress; isOpen: boolean; onClose: () => void; onEdit: () => void; onDelete: () => void }) {
  const canManage = useCanAccess(PermissionLevel.SUPERVISION);
  if (!address) return null;
  const coords = address.coords;
  return <Modal isOpen={isOpen} onClose={onClose} title={address.branchName || "Dirección"} size="xl"><Modal.Body><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"><div><p className="text-base font-medium text-slate-900">{address.direction}</p><p className="mt-1 flex items-center gap-1 text-sm text-slate-600"><MapPin className="h-4 w-4" />{address.city}</p><dl className="mt-6 space-y-4 border-t border-slate-200 pt-5 text-sm"><div><dt className="text-slate-500">Ubicación exacta</dt><dd className="mt-1 text-slate-800">{coords ? `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}` : "Sin coordenadas"}</dd></div><div><dt className="text-slate-500">Origen</dt><dd className="mt-1 text-slate-800">{sources[address.locationSource]}</dd></div></dl></div><div className="h-75 overflow-hidden rounded-lg border border-slate-200">{coords ? <Map center={{ lat: coords.latitude, lng: coords.longitude }} markers={[{ id: address.id, position: { lat: coords.latitude, lng: coords.longitude } }]} /> : <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">Aún no hay una ubicación exacta registrada.</div>}</div></div></Modal.Body><Modal.Footer><Button variant="outline" onClick={onClose}>Cerrar</Button>{canManage ? <><Button variant="outline" icon={Edit3} onClick={onEdit}>Editar</Button><Button variant="danger" icon={Trash2} onClick={onDelete}>Eliminar</Button></> : null}</Modal.Footer></Modal>;
}
