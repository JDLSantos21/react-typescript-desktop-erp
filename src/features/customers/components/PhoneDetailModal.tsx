import { Edit3, Trash2 } from "lucide-react";
import { Modal } from "@/shared/components/core/Modal";
import { Button } from "@/shared/components/core/Button";
import { useCanAccess } from "@/shared/authorization/usePermission";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { CustomerPhone } from "@/shared/types/entities/customer.types";
import { formatPhoneNumber } from "@/shared/utils/formatters";
import { copyToClipboard } from "@/shared/utils/clipboard";
import { CopyIcon, WhatsAppIcon } from "@/shared/components/icons";
import { handleOpenWhatsappPhone } from "@/lib/opener";
import { toast } from "sonner";
export function PhoneDetailModal({ phone, isOpen, onClose, onEdit, onDelete }: { phone?: CustomerPhone; isOpen: boolean; onClose: () => void; onEdit: () => void; onDelete: () => void }) {
  const canManage = useCanAccess(PermissionLevel.SUPERVISION);
  if (!phone) return null;
  const copy = async () => { await copyToClipboard(phone.phoneNumber); toast.success("Número copiado"); };
  return <Modal isOpen={isOpen} onClose={onClose} title="Detalles del teléfono"><Modal.Body><div className="flex items-center gap-2"><p className="text-2xl font-semibold text-slate-900">{formatPhoneNumber(phone.phoneNumber)}</p><Button variant="ghost" size="icon" icon={CopyIcon} title="Copiar número" aria-label="Copiar número" onClick={() => void copy()} /></div><p className="mt-2 text-sm text-slate-500">{phone.type}{phone.description ? ` · ${phone.description}` : ""}</p><dl className="mt-7 grid gap-4 border-t border-slate-200 pt-5 text-sm sm:grid-cols-2"><div><dt className="text-slate-500">WhatsApp</dt><dd className="mt-1">{phone.hasWhatsapp ? <Button variant="outline" size="sm" icon={WhatsAppIcon} iconClassName="text-green-500" onClick={() => void handleOpenWhatsappPhone(phone.phoneNumber, "Hola")}>Enviar mensaje</Button> : <span className="text-slate-800">No disponible</span>}</dd></div><div><dt className="text-slate-500">Teléfono principal</dt><dd className="mt-1 text-slate-800">{phone.isPrimary ? "Sí" : "No"}</dd></div></dl></Modal.Body><Modal.Footer>{canManage ? <><Button variant="outline" icon={Edit3} onClick={onEdit}>Editar</Button><Button variant="danger" icon={Trash2} onClick={onDelete}>Eliminar</Button></> : null}</Modal.Footer></Modal>;
}
