import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, Copy, History, MapPin, PackageCheck, Printer, Truck } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useDeleteEquipment, useEquipmentLocationHistory, useEquipmentSites, useGetEquipmentById, useLabelPrints, useMoveEquipment } from "../hooks/useEquipments";
import { usePrintEquipmentLabel } from "../hooks/usePrintEquipmentLabel";
import { EquipmentAsideMenu } from "../components/EquipmentAsideMenu";
import AssignEquipmentModal from "../components/AssignEquipmentModal";
import AssignmentHistoryModal from "../components/AssignmentHistoryModal";
import RemoveAssignModal from "../components/RemoveAssignModal";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { useModal } from "@/shared/hooks/useModal";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import SectionLoader from "@/shared/components/SectionLoader";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { Badge } from "@/shared/components/core/Badge";
import { Button } from "@/shared/components/core/Button";
import { Modal } from "@/shared/components/core/Modal";
import { Select } from "@/shared/components/core/Select";
import { Textarea } from "@/shared/components/core/Textarea";
import { Input } from "@/shared/components/core/Input";
import { copyToClipboard } from "@/shared/utils/clipboard";
import { toast } from "sonner";
import { MapModal } from "@/shared/components/core/MapModal";

dayjs.locale("es");

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const query = useGetEquipmentById(id);
  const history = useEquipmentLocationHistory(id);
  const sites = useEquipmentSites();
  const prints = useLabelPrints(id);
  const moveEquipment = useMoveEquipment();
  const deleteEquipment = useDeleteEquipment();
  const assignModal = useModal(); const assignmentHistoryModal = useModal(); const removeAssignModal = useModal();
  const deleteModal = useModal(); const moveModal = useModal(); const printModal = useModal();
  const [mapOpen, setMapOpen] = useState(false);
  const [siteId, setSiteId] = useState(0); const [moveNotes, setMoveNotes] = useState(""); const [printReason, setPrintReason] = useState("");
  const equipment = query.data?.data;
  const activeAssignment = useMemo(() => equipment?.assignments.find((item) => item.status === "ACTIVO" && !item.unassignedAt), [equipment]);
  const { printLabel, isPrinting } = usePrintEquipmentLabel(equipment);
  const hasPrinted = (prints.data?.data?.length ?? 0) > 0;

  useHeaderConfig({ title: equipment ? equipment.serialNumber : "Detalle del equipo", showBackButton: true });
  if (query.isLoading) return <SectionLoader className="h-full" placeholder="Cargando equipo" />;
  if (query.isError) return <ErrorState title="No se pudo cargar el equipo" error={query.error} onRetry={query.refetch} />;
  if (!equipment) return <EmptyState title="Equipo no encontrado" description="No existe un equipo con este identificador." />;

  const physicalPlace = activeAssignment?.deliveryStatus === "ENTREGADO" ? activeAssignment.customer?.businessName ?? "Cliente" : equipment.currentSite?.name ?? (activeAssignment ? "En proceso de entrega" : "Ubicación sin registrar");
  const move = async () => { if (!siteId) return toast.error("Selecciona una ubicación"); await moveEquipment.mutateAsync({ equipmentId: equipment.id, siteId, notes: moveNotes || undefined }); toast.success("Ubicación actualizada"); moveModal.close(); setSiteId(0); setMoveNotes(""); };
  const print = () => { if (hasPrinted && !printReason.trim()) return toast.error("Indica el motivo de la reimpresión"); printLabel(hasPrinted ? printReason.trim() : undefined); printModal.close(); setPrintReason(""); };

  return <div className="flex h-full">
    <main className="flex-1 overflow-y-auto px-8 py-7 show-scrollbar"><div className="max-w-5xl space-y-8 pb-10">
      <section className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h1 className="text-2xl font-semibold text-slate-950">{equipment.model.name}</h1><Button size="icon" variant="ghost" icon={Copy} aria-label="Copiar serial" onClick={async () => { await copyToClipboard(equipment.serialNumber); toast.success("Serial copiado"); }} /></div><p className="mt-1 text-sm text-slate-500">{equipment.model.brand || "Sin marca"} · {equipment.model.type}</p></div><Badge>{equipment.status}</Badge></section>
      <section><h2 className="text-sm font-semibold text-slate-900">Situación actual</h2><div className="mt-4 grid gap-3 md:grid-cols-3"><Summary icon={activeAssignment ? Truck : Building2} label="Custodia física" value={physicalPlace} detail={activeAssignment?.deliveryStatus === "PENDIENTE" ? "Asignado, pendiente de entrega" : equipment.currentSite?.type ?? "Ubicación actual"} /><Summary icon={PackageCheck} label="Asignación" value={activeAssignment ? activeAssignment.customer?.businessName ?? "Cliente asignado" : "Sin asignación activa"} detail={activeAssignment ? dayjs(activeAssignment.assignedAt).format("D MMM YYYY, h:mm A") : "Disponible para asignar"} /><Summary icon={MapPin} label="Geolocalización" value={equipment.location ? "Coordenadas registradas" : "Sin coordenadas"} detail={equipment.location ? dayjs(equipment.location.gpsUpdatedAt).format("D MMM YYYY, h:mm A") : "Se captura al confirmar la entrega"} /></div></section>
      {activeAssignment ? <section><div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-900">Asignación activa</h2><Button variant="link" size="sm" onClick={() => navigate(`/equipment-assignments/${activeAssignment.id}`)}>Ver expediente completo</Button></div><div className="mt-4 rounded-xl bg-slate-50 p-5"><dl className="grid gap-x-8 gap-y-5 sm:grid-cols-3"><Detail label="Cliente" value={activeAssignment.customer?.businessName ?? "—"} /><Detail label="Entrega" value={activeAssignment.deliveryStatus === "ENTREGADO" ? "Confirmada" : "Pendiente"} /><Detail label="Destino" value={activeAssignment.customerAddress?.branchName || activeAssignment.customerAddress?.city || "Dirección principal"} /></dl></div></section> : null}
      <div className="grid gap-8 lg:grid-cols-2"><section><h2 className="text-sm font-semibold text-slate-900">Información de la unidad</h2><dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-5"><Detail label="Número de serie" value={equipment.serialNumber} /><Detail label="Tipo" value={equipment.model.type} /><Detail label="Marca" value={equipment.model.brand || "Sin marca"} /><Detail label="Capacidad" value={equipment.model.capacity ? String(equipment.model.capacity) : "No especificada"} /></dl></section><section><h2 className="text-sm font-semibold text-slate-900">Ubicación exacta</h2>{equipment.location ? <button onClick={() => setMapOpen(true)} className="mt-4 flex w-full items-center gap-3 rounded-xl bg-slate-50 p-4 text-left hover:bg-slate-100"><MapPin className="h-5 w-5 text-primary" /><span><span className="block text-sm font-medium text-slate-900">Ver ubicación en el mapa</span><span className="text-xs text-slate-500">{equipment.location.latitude.toFixed(6)}, {equipment.location.longitude.toFixed(6)}</span></span></button> : <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">La ubicación GPS aparecerá cuando el conductor confirme la entrega.</div>}</section></div>
      <section><h2 className="text-sm font-semibold text-slate-900">Movimientos recientes</h2><div className="mt-4 space-y-1">{(history.data?.data ?? []).slice(0, 6).map((event) => <div key={event.id} className="flex items-start gap-3 py-3"><History className="mt-0.5 h-4 w-4 text-slate-400" /><div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">{event.type.charAt(0) + event.type.slice(1).toLowerCase()} {event.site?.name ? `· ${event.site.name}` : ""}</p><p className="text-xs text-slate-500">{event.description || "Actualización de custodia"}</p></div><time className="text-xs text-slate-400">{dayjs(event.recordedAt).format("D MMM, h:mm A")}</time></div>)}{!history.isLoading && !(history.data?.data?.length) ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Todavía no hay movimientos registrados.</p> : null}</div></section>
    </div></main>
    <EquipmentAsideMenu equipment={equipment} onAssign={assignModal.open} onViewAssignmentHistory={assignmentHistoryModal.open} onViewAssignment={() => activeAssignment && navigate(`/equipment-assignments/${activeAssignment.id}`)} onRemoveAssignment={removeAssignModal.open} onMove={moveModal.open} onPrint={printModal.open} onDelete={deleteModal.open} />
    <AssignEquipmentModal equipmentId={equipment.id} isOpen={assignModal.isOpen} onClose={assignModal.close} /><AssignmentHistoryModal equipment={equipment} isOpen={assignmentHistoryModal.isOpen} onClose={assignmentHistoryModal.close} />{activeAssignment ? <RemoveAssignModal assignment={activeAssignment} isOpen={removeAssignModal.isOpen} onClose={removeAssignModal.close} /> : null}
    <ConfirmDialog isLoading={deleteEquipment.isPending} variant="danger" isOpen={deleteModal.isOpen} onCancel={deleteModal.close} onConfirm={async () => { await deleteEquipment.mutateAsync(equipment.id); navigate("/equipments"); }} title="Desactivar equipo" description={`El equipo ${equipment.serialNumber} dejará de estar disponible. Su historial se conservará.`} />
    <Modal isOpen={moveModal.isOpen} onClose={moveModal.close} title="Mover equipo" size="sm"><Modal.Body className="space-y-4"><Select label="Nueva ubicación" placeholder="Selecciona planta o almacén" value={siteId ? String(siteId) : ""} onValueChange={(value) => setSiteId(Number(value))} options={(sites.data?.data ?? []).map((site) => ({ value: String(site.id), label: site.name }))} /><Textarea label="Nota del traslado" value={moveNotes} onChange={(e) => setMoveNotes(e.target.value)} placeholder="Opcional" /></Modal.Body><Modal.Footer><Button variant="outline" onClick={moveModal.close}>Cancelar</Button><Button isLoading={moveEquipment.isPending} onClick={move}>Guardar ubicación</Button></Modal.Footer></Modal>
    <Modal isOpen={printModal.isOpen} onClose={printModal.close} title={hasPrinted ? "Reimprimir etiqueta" : "Imprimir etiqueta"} size="sm"><Modal.Body className="space-y-4"><div className="rounded-xl bg-slate-50 p-4"><p className="text-sm font-medium text-slate-900">{hasPrinted ? `${prints.data?.data.length} impresión(es) registrada(s)` : "Primera impresión disponible"}</p><p className="mt-1 text-xs text-slate-500">La primera impresión requiere Operador o superior. Toda reimpresión requiere Administrativo o superior y queda auditada.</p></div>{hasPrinted ? <Input label="Motivo de la reimpresión" value={printReason} onChange={(e) => setPrintReason(e.target.value)} placeholder="Ej. etiqueta deteriorada" /> : null}</Modal.Body><Modal.Footer><Button variant="outline" onClick={printModal.close}>Cancelar</Button><Button icon={Printer} isLoading={isPrinting} onClick={print}>Imprimir etiqueta</Button></Modal.Footer></Modal>
    {equipment.location ? <MapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} title="Ubicación del equipo" center={{ lat: equipment.location.latitude, lng: equipment.location.longitude }} markers={[{ id: equipment.id, position: { lat: equipment.location.latitude, lng: equipment.location.longitude }, label: equipment.serialNumber }]} showOpenInGoogleMaps={false} /> : null}
  </div>;
}

function Summary({ icon: Icon, label, value, detail }: { icon: typeof MapPin; label: string; value: string; detail: string }) { return <div className="rounded-xl bg-slate-50 p-4"><Icon className="h-5 w-5 text-slate-400" /><p className="mt-4 text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-semibold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd></div>; }
