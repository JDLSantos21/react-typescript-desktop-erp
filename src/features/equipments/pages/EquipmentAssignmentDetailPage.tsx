import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, BellRing, Check, Clock3, Download, FileText, MapPin, PackageCheck, Settings2, Trash2, Upload } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useAttachContract, useDeliverEquipment, useEquipmentAssignment, useEquipmentInactivityAlerts, useEquipmentMonitoringSettings, useModelMonitoringProducts, useRemoveAssignmentDocument, useUpdateAssignmentMonitoring } from "../hooks/useEquipments";
import { EquipmentService } from "../api/equipment.service";
import { useHeaderConfig } from "@/shared/hooks/useHeaderConfig";
import { ErrorState } from "@/shared/components/ErrorState";
import SectionLoader from "@/shared/components/SectionLoader";
import { Badge } from "@/shared/components/core/Badge";
import { Button } from "@/shared/components/core/Button";
import { Modal } from "@/shared/components/core/Modal";
import { Input } from "@/shared/components/core/Input";
import { handleOpenUrl } from "@/lib/opener";
import { useCanAccess } from "@/shared/authorization/usePermission";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { toast } from "sonner";
import { MapModal } from "@/shared/components/core/MapModal";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";

dayjs.locale("es");

export default function EquipmentAssignmentDetailPage() {
  const { id } = useParams();
  const assignmentId = Number(id);
  const navigate = useNavigate();
  const query = useEquipmentAssignment(Number.isFinite(assignmentId) ? assignmentId : undefined);
  const attachContract = useAttachContract();
  const removeContract = useRemoveAssignmentDocument();
  const deliver = useDeliverEquipment();
  const alertQuery = useEquipmentInactivityAlerts({ page: 1, limit: 1, assignmentId }, Number.isFinite(assignmentId));
  const monitoringSettings = useEquipmentMonitoringSettings();
  const updateMonitoring = useUpdateAssignmentMonitoring();
  const modelProducts = useModelMonitoringProducts(query.data?.data.equipment.model.id);
  const canSupervise = useCanAccess(PermissionLevel.SUPERVISION);
  const canManageDocuments = useCanAccess(PermissionLevel.ADMINISTRATION);
  const contractInput = useRef<HTMLInputElement>(null);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [removeContractOpen, setRemoveContractOpen] = useState(false);
  const [monitoringOpen, setMonitoringOpen] = useState(false);
  const [useCustomDays, setUseCustomDays] = useState(false);
  const [customDays, setCustomDays] = useState(30);
  const [coordinates, setCoordinates] = useState({ latitude: "", longitude: "" });

  useHeaderConfig({ title: "Detalle de asignación", showBackButton: true });

  if (query.isLoading) return <SectionLoader className="h-full" placeholder="Cargando asignación" />;
  if (query.isError || !query.data?.data) return <ErrorState title="No se pudo cargar la asignación" error={query.error} onRetry={query.refetch} />;
  const assignment = query.data.data;
  const activeAlert = alertQuery.data?.data[0];
  const contract = assignment.documents?.find((item) => item.type === "CONTRATO" && item.isActive);

  const openDocument = async (fileId: string) => {
    const result = await EquipmentService.getDownloadUrl(fileId);
    await handleOpenUrl(result.data.url);
  };

  const uploadContract = async (file?: File) => {
    if (!file) return;
    try {
      await attachContract.mutateAsync({ assignmentId, file, replaceActive: Boolean(contract) });
      toast.success(contract ? "Contrato reemplazado" : "Contrato agregado a la asignación");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cargar el contrato. Verifica la configuración CORS de R2.");
    }
  };

  const removeCurrentContract = async () => {
    if (!contract) return;
    try { await removeContract.mutateAsync({ assignmentId, documentId: contract.id }); toast.success("Contrato retirado de la asignación"); }
    catch { toast.error("No se pudo retirar el contrato"); }
    finally { setRemoveContractOpen(false); }
  };

  const confirmDelivery = async () => {
    const latitude = Number(coordinates.latitude);
    const longitude = Number(coordinates.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return toast.error("Introduce coordenadas válidas");
    await deliver.mutateAsync({ serialNumber: assignment.equipment.serialNumber, latitude, longitude });
    toast.success("Entrega registrada correctamente");
    setDeliveryOpen(false);
    await query.refetch();
  };

  const openMonitoring = () => {
    setUseCustomDays(assignment.orderInactivityDays != null);
    setCustomDays(assignment.orderInactivityDays ?? monitoringSettings.data?.data.defaultOrderInactivityDays ?? 30);
    setMonitoringOpen(true);
  };

  const saveMonitoring = async () => {
    if (useCustomDays && (!Number.isInteger(customDays) || customDays < 1 || customDays > 365)) return toast.error("El plazo debe estar entre 1 y 365 días");
    try {
      await updateMonitoring.mutateAsync({ assignmentId, orderInactivityDays: useCustomDays ? customDays : null });
      toast.success("Seguimiento de consumo actualizado");
      setMonitoringOpen(false);
    } catch { toast.error("No se pudo actualizar el seguimiento"); }
  };

  return (
    <div className="h-full overflow-y-auto px-8 py-7 show-scrollbar">
      <div className="max-w-6xl space-y-8 pb-10">
        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button className="text-sm text-primary hover:underline" onClick={() => navigate(`/equipments/${assignment.equipment.id}`)}>{assignment.equipment.serialNumber}</button>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950">{assignment.customer.businessName}</h1>
            <p className="mt-1 text-sm text-slate-500">Asignado {dayjs(assignment.assignedAt).format("D [de] MMMM [de] YYYY, h:mm A")}</p>
          </div>
          <Badge variant={assignment.deliveryStatus === "ENTREGADO" ? "success" : "warning"}>{assignment.deliveryStatus === "ENTREGADO" ? "Entregado" : "Pendiente de entrega"}</Badge>
        </section>

        {activeAlert ? <button type="button" onClick={openMonitoring} className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left ${activeAlert.state === "ALERTA" ? "bg-amber-50 text-amber-950" : "bg-blue-50 text-blue-950"}`}><span className="rounded-xl bg-white p-2.5"><AlertTriangle className={`h-5 w-5 ${activeAlert.state === "ALERTA" ? "text-amber-600" : "text-blue-600"}`} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{activeAlert.state === "ALERTA" ? "Cliente fuera del plazo de pedidos" : "El plazo de pedidos está próximo a vencer"}</span><span className="mt-1 block text-xs opacity-75">{activeAlert.products.map((product) => product.name).join(", ")} · {activeAlert.state === "ALERTA" ? `${activeAlert.daysOverdue} días vencido` : `faltan ${activeAlert.daysRemaining} días`}</span></span><Settings2 className="h-4 w-4 opacity-60" /></button> : null}

        <section>
          <h2 className="text-sm font-semibold text-slate-900">Estado del expediente</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <StatusCard icon={PackageCheck} label="Entrega" ready={assignment.checklist.delivered} value={assignment.checklist.delivered ? "Confirmada" : "Pendiente"} />
            <StatusCard icon={FileText} label="Cédula del cliente" ready={assignment.checklist.customerIdentity} value={assignment.checklist.customerIdentity ? "Registrada" : "Puede agregarse al entregar"} />
            <StatusCard icon={FileText} label="Contrato firmado" ready={assignment.checklist.contract} value={assignment.checklist.contract ? "Registrado" : "Pendiente del supervisor"} />
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
          <section>
            <h2 className="text-sm font-semibold text-slate-900">Destino y entrega</h2>
            <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Detail label="Equipo" value={`${assignment.equipment.model.name} · ${assignment.equipment.serialNumber}`} />
              <Detail label="Estado de asignación" value={assignment.status} />
              <Detail label="Dirección" value={`${assignment.customerAddress.branchName || "Principal"} · ${assignment.customerAddress.direction}, ${assignment.customerAddress.city}`} />
              <Detail label="Fecha de entrega" value={assignment.deliveredAt ? dayjs(assignment.deliveredAt).format("D MMMM YYYY, h:mm A") : "Aún no entregado"} />
            </dl>
            {assignment.deliveryLocation ? (
              <button className="mt-5 flex w-full items-center gap-3 rounded-xl bg-slate-50 px-4 py-4 text-left hover:bg-slate-100" onClick={() => setMapOpen(true)}>
                <MapPin className="h-5 w-5 text-primary" />
                <span><span className="block text-sm font-medium text-slate-900">Ubicación registrada en la entrega</span><span className="text-xs text-slate-500">{assignment.deliveryLocation.latitude.toFixed(6)}, {assignment.deliveryLocation.longitude.toFixed(6)}</span></span>
              </button>
            ) : null}
          </section>

          <section>
            <h2 className="text-sm font-semibold text-slate-900">Documentos</h2>
            <div className="mt-4 space-y-3">
              {contract ? <DocumentRow name="Contrato firmado" detail={contract.file.originalName} onOpen={() => openDocument(contract.file.id)} /> : <EmptyDocument label="Contrato aún no cargado" />}
              {(assignment.customer.documents ?? []).filter((item) => item.type === "CEDULA" && item.isActive).map((document) => <DocumentRow key={document.id} name="Cédula del cliente" detail={document.file.originalName} onOpen={() => openDocument(document.file.id)} />)}
            </div>
            {canSupervise ? <div className="mt-4 flex flex-wrap gap-2"><input ref={contractInput} type="file" accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={(event) => uploadContract(event.target.files?.[0])} />{!contract || canManageDocuments ? <Button variant="outline" size="sm" icon={Upload} isLoading={attachContract.isPending} onClick={() => contractInput.current?.click()}>{contract ? "Reemplazar contrato" : "Subir contrato"}</Button> : null}{contract && canManageDocuments ? <Button variant="ghost" size="sm" icon={Trash2} className="text-red-600 hover:text-red-700" onClick={() => setRemoveContractOpen(true)}>Retirar</Button> : null}{assignment.deliveryStatus === "PENDIENTE" ? <Button size="sm" icon={MapPin} onClick={() => setDeliveryOpen(true)}>Registrar entrega</Button> : null}</div> : null}
          </section>
        </div>

        <section className="rounded-2xl bg-slate-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4"><div className="flex items-start gap-3"><span className="rounded-xl bg-white p-2.5 text-blue-600"><BellRing className="h-5 w-5" /></span><div><h2 className="text-sm font-semibold text-slate-900">Seguimiento de pedidos</h2><p className="mt-1 text-sm text-slate-500">Alerta después de {assignment.orderInactivityDays ?? monitoringSettings.data?.data.defaultOrderInactivityDays ?? 30} días sin pedir {modelProducts.data?.data.map((product) => product.name).join(", ") || "productos configurados"}.</p><p className="mt-1 text-xs text-slate-400">{assignment.orderInactivityDays == null ? "Usa la configuración general" : "Plazo personalizado para esta asignación"}</p></div></div>{canSupervise ? <Button variant="outline" size="sm" icon={Settings2} onClick={openMonitoring}>Configurar</Button> : null}</div>
        </section>
      </div>

      <Modal isOpen={deliveryOpen} onClose={() => setDeliveryOpen(false)} title="Registrar entrega" size="sm">
        <Modal.Body className="space-y-4"><p className="text-sm text-slate-600">Esta alternativa administrativa registra la ubicación exacta. En la app móvil el conductor la enviará automáticamente al escanear el QR.</p><div className="grid grid-cols-2 gap-3"><Input label="Latitud" value={coordinates.latitude} onChange={(e) => setCoordinates((value) => ({ ...value, latitude: e.target.value }))} /><Input label="Longitud" value={coordinates.longitude} onChange={(e) => setCoordinates((value) => ({ ...value, longitude: e.target.value }))} /></div></Modal.Body>
        <Modal.Footer><Button variant="outline" onClick={() => setDeliveryOpen(false)}>Cancelar</Button><Button isLoading={deliver.isPending} onClick={confirmDelivery}>Confirmar entrega</Button></Modal.Footer>
      </Modal>
      <Modal isOpen={monitoringOpen} onClose={() => setMonitoringOpen(false)} title="Seguimiento de pedidos" size="sm" closeOnOverlayClick={!updateMonitoring.isPending}>
        <Modal.Body className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">Define el tiempo máximo sin un pedido que contenga alguno de los productos asociados al modelo.</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setUseCustomDays(false)} className={`rounded-xl p-4 text-left ${!useCustomDays ? "bg-blue-50 text-blue-900 ring-1 ring-blue-200" : "bg-slate-50 text-slate-600"}`}><span className="block text-sm font-medium">Plazo general</span><span className="mt-1 block text-xs opacity-70">{monitoringSettings.data?.data.defaultOrderInactivityDays ?? 30} días</span></button>
            <button type="button" onClick={() => setUseCustomDays(true)} className={`rounded-xl p-4 text-left ${useCustomDays ? "bg-blue-50 text-blue-900 ring-1 ring-blue-200" : "bg-slate-50 text-slate-600"}`}><span className="block text-sm font-medium">Personalizado</span><span className="mt-1 block text-xs opacity-70">Solo esta asignación</span></button>
          </div>
          {useCustomDays ? <Input label="Días sin pedidos" type="number" min={1} max={365} value={customDays} onChange={(event) => setCustomDays(Number(event.target.value))} /> : null}
          <div className="rounded-xl bg-slate-50 px-4 py-3"><p className="text-xs font-medium text-slate-700">Productos que reinician el plazo</p><p className="mt-1 text-sm text-slate-500">{modelProducts.data?.data.map((product) => product.name).join(", ") || "Este modelo todavía no tiene productos configurados."}</p></div>
        </Modal.Body>
        <Modal.Footer><Button variant="outline" onClick={() => setMonitoringOpen(false)} disabled={updateMonitoring.isPending}>Cancelar</Button><Button onClick={saveMonitoring} isLoading={updateMonitoring.isPending}>Guardar</Button></Modal.Footer>
      </Modal>
      {assignment.deliveryLocation ? <MapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} title="Ubicación de entrega" center={{ lat: assignment.deliveryLocation.latitude, lng: assignment.deliveryLocation.longitude }} markers={[{ id: "delivery", position: { lat: assignment.deliveryLocation.latitude, lng: assignment.deliveryLocation.longitude }, label: assignment.equipment.serialNumber }]} showOpenInGoogleMaps={false} /> : null}
      <ConfirmDialog title="Retirar contrato" description="El contrato dejará de estar disponible para esta asignación." variant="danger" isOpen={removeContractOpen} onCancel={() => setRemoveContractOpen(false)} onConfirm={removeCurrentContract} isLoading={removeContract.isPending} />
    </div>
  );
}

function StatusCard({ icon: Icon, label, ready, value }: { icon: typeof Check; label: string; ready: boolean; value: string }) { return <div className="rounded-xl bg-slate-50 p-4"><div className="flex items-center justify-between"><Icon className={`h-5 w-5 ${ready ? "text-emerald-600" : "text-amber-600"}`} />{ready ? <Check className="h-4 w-4 text-emerald-600" /> : <Clock3 className="h-4 w-4 text-amber-600" />}</div><p className="mt-4 text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-slate-900">{value}</p></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd></div>; }
function EmptyDocument({ label }: { label: string }) { return <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">{label}</div>; }
function DocumentRow({ name, detail, onOpen }: { name: string; detail: string; onOpen: () => void }) { return <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"><FileText className="h-5 w-5 text-slate-400" /><div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">{name}</p><p className="truncate text-xs text-slate-500">{detail}</p></div><Button variant="ghost" size="icon" icon={Download} aria-label={`Abrir ${name}`} onClick={onOpen} /></div>; }
