import { useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Download, FileText, RefreshCw, Trash2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Modal } from "@/shared/components/core/Modal";
import { Button } from "@/shared/components/core/Button";
import ConfirmDialog from "@/shared/components/core/ConfirmDialog";
import { useAttachCustomerDocument, useCustomerAssignmentDocuments, useCustomerDocuments, useRemoveCustomerDocument } from "@/features/equipments/hooks/useEquipments";
import { EquipmentService } from "@/features/equipments/api/equipment.service";
import { handleOpenUrl } from "@/lib/opener";
import { useCanAccess } from "@/shared/authorization/usePermission";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { toast } from "sonner";

export function CustomerDocumentsModal({ customerId, isOpen, onClose }: { customerId: string; isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const identities = useCustomerDocuments(customerId, isOpen);
  const assignmentDocuments = useCustomerAssignmentDocuments(customerId, isOpen);
  const attach = useAttachCustomerDocument();
  const remove = useRemoveCustomerDocument();
  const canManage = useCanAccess(PermissionLevel.ADMINISTRATION);
  const input = useRef<HTMLInputElement>(null);
  const [replaceActive, setReplaceActive] = useState(false);
  const [documentToRemove, setDocumentToRemove] = useState<string>();
  const identityDocuments = (identities.data?.data ?? []).filter((document) => document.type === "CEDULA");

  const chooseFile = (replace: boolean) => { setReplaceActive(replace); input.current?.click(); };
  const upload = async (file?: File) => {
    if (!file) return;
    try {
      await attach.mutateAsync({ customerId, file, replaceActive });
      toast.success(replaceActive ? "Cédula reemplazada" : "Cédula agregada al cliente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo cargar la cédula.");
    } finally {
      if (input.current) input.current.value = "";
      setReplaceActive(false);
    }
  };
  const open = async (fileId: string) => {
    try { const result = await EquipmentService.getDownloadUrl(fileId); await handleOpenUrl(result.data.url); }
    catch { toast.error("No se pudo abrir el documento"); }
  };
  const confirmRemove = async () => {
    if (!documentToRemove) return;
    try { await remove.mutateAsync({ customerId, documentId: documentToRemove }); toast.success("Documento retirado del expediente"); }
    catch { toast.error("No se pudo retirar el documento"); }
    finally { setDocumentToRemove(undefined); }
  };

  return <>
    <Modal isOpen={isOpen} onClose={onClose} title="Documentos" size="lg">
      <Modal.Body className="space-y-8">
        <DocumentSection title="Cédula" actions={identityDocuments.length === 0 ? <Button size="sm" icon={Upload} isLoading={attach.isPending} onClick={() => chooseFile(false)}>Subir cédula</Button> : canManage ? <Button size="sm" variant="outline" icon={RefreshCw} isLoading={attach.isPending} onClick={() => chooseFile(true)}>Reemplazar</Button> : null}>
          {identityDocuments.length ? <div className="space-y-2">{identityDocuments.map((document) => <DocumentRow key={document.id} title="Cédula del cliente" detail={`${document.file.originalName} · ${dayjs(document.createdAt).format("D MMM YYYY, h:mm A")}`} onOpen={() => open(document.file.id)} actions={canManage ? <Button size="icon" variant="ghost" icon={Trash2} className="text-red-600 hover:text-red-700" aria-label="Eliminar cédula" onClick={() => setDocumentToRemove(document.id)} /> : undefined} />)}</div> : <EmptyRow label="No hay una cédula registrada" />}
        </DocumentSection>

        <DocumentSection title="Documentos de asignaciones">
          {(assignmentDocuments.data?.data ?? []).length ? <div className="space-y-2">{assignmentDocuments.data!.data.map((document) => <DocumentRow key={document.id} title="Contrato de asignación" detail={`${document.assignment.equipment.serialNumber} · ${document.file.originalName}`} onOpen={() => open(document.file.id)} actions={<Button size="icon" variant="ghost" icon={ArrowUpRight} aria-label="Ver asignación" onClick={() => { onClose(); navigate(`/equipment-assignments/${document.assignment.id}`); }} />} />)}</div> : <EmptyRow label="No hay contratos de asignaciones registrados" />}
        </DocumentSection>
        <input ref={input} type="file" accept="application/pdf,image/jpeg,image/png" className="hidden" onChange={(event) => upload(event.target.files?.[0])} />
      </Modal.Body>
      <Modal.Footer><Button variant="outline" onClick={onClose}>Cerrar</Button></Modal.Footer>
    </Modal>
    <ConfirmDialog title="Retirar documento" description="La cédula dejará de estar disponible en el expediente del cliente." variant="danger" isOpen={Boolean(documentToRemove)} onCancel={() => setDocumentToRemove(undefined)} onConfirm={confirmRemove} isLoading={remove.isPending} />
  </>;
}

function DocumentSection({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) { return <section><div className="mb-3 flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-slate-900">{title}</h3>{actions}</div>{children}</section>; }
function EmptyRow({ label }: { label: string }) { return <div className="rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-500">{label}</div>; }
function DocumentRow({ title, detail, onOpen, actions }: { title: string; detail: string; onOpen: () => void; actions?: ReactNode }) { return <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"><FileText className="h-5 w-5 shrink-0 text-slate-400" /><div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">{title}</p><p className="truncate text-xs text-slate-500">{detail}</p></div><Button variant="ghost" size="icon" icon={Download} aria-label={`Abrir ${title}`} onClick={onOpen} />{actions}</div>; }
