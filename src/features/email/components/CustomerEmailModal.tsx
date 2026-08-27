import { RefreshCw, RotateCcw } from "lucide-react";
import { sileo } from "sileo";
import { useCanAccess } from "@/shared/authorization/usePermission";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { Button } from "@/shared/components/core/Button";
import { Checkbox } from "@/shared/components/core/Checkbox";
import { Modal } from "@/shared/components/core/Modal";
import { formatDate } from "@/shared/utils/formatters";
import { extractApiError } from "@/shared/utils/error-handler";
import {
  useCustomerEmailMessages,
  useCustomerEmailPreferences,
  useResetCustomerEmailUnsubscribe,
  useUpdateCustomerEmailPreferences,
} from "../hooks/useEmail";
import { EmailMessageStatus } from "./EmailMessageStatus";

export function CustomerEmailModal({
  customerId,
  email,
  isOpen,
  onClose,
}: {
  customerId: string;
  email: string | null | undefined;
  isOpen: boolean;
  onClose: () => void;
}) {
  const canManage = useCanAccess(PermissionLevel.ADVANCED_OPERATIONS);
  const canResetUnsubscribe = useCanAccess(PermissionLevel.ADMINISTRATION);
  const preferences = useCustomerEmailPreferences(customerId);
  const messages = useCustomerEmailMessages(customerId);
  const updatePreference = useUpdateCustomerEmailPreferences(customerId);
  const resetUnsubscribe = useResetCustomerEmailUnsubscribe(customerId);
  const preference = preferences.data?.data;
  const isUnsubscribed = Boolean(preference?.orderEmailsUnsubscribedAt);

  const changePreference = async (checked: boolean) => {
    try {
      await updatePreference.mutateAsync(checked);
      sileo.success({
        title: checked
          ? "Configuración de correo activada"
          : "Configuración de correo desactivada",
      });
    } catch (error) {
      sileo.error({
        title: "No se pudo actualizar la configuración",
        description: extractApiError(error).message,
      });
    }
  };

  const resetCustomerUnsubscribe = async () => {
    try {
      await resetUnsubscribe.mutateAsync();
      sileo.success({ title: "Baja del cliente restablecida" });
    } catch (error) {
      sileo.error({
        title: "No se pudo restablecer la baja",
        description: extractApiError(error).message,
      });
    }
  };

  const refresh = () => {
    void Promise.all([preferences.refetch(), messages.refetch()]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Correo electrónico" size="xl">
      <Modal.Body>
        <div className="space-y-7">
          <section className="border-b border-slate-200 pb-6">
            <h3 className="text-sm font-semibold text-slate-900">Configuración del cliente</h3>
            <p className="mt-1 text-sm text-slate-500">
              {email
                ? `Dirección registrada: ${email}`
                : "Este cliente no tiene un correo electrónico registrado."}
            </p>
            {email ? (
              <div className="mt-4">
                <Checkbox
                  checked={preference?.receivesOrderEmails ?? false}
                  disabled={!canManage || preferences.isLoading || updatePreference.isPending}
                  onChange={(event) => void changePreference(event.target.checked)}
                  label="Permitir notificaciones de pedidos para este cliente"
                />
                {!canManage ? (
                  <p className="mt-2 text-xs text-slate-500">Solo un operador o rol superior puede cambiar esta configuración.</p>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Preferencia de baja</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Esta preferencia se establece cuando el cliente usa el enlace de baja del correo.
                </p>
              </div>
              {isUnsubscribed && canResetUnsubscribe ? (
                <Button variant="outline" size="sm" icon={RotateCcw} onClick={() => void resetCustomerUnsubscribe()} isLoading={resetUnsubscribe.isPending}>
                  Restablecer baja
                </Button>
              ) : null}
            </div>
            <p className={`mt-3 text-sm ${isUnsubscribed ? "text-amber-700" : "text-slate-600"}`}>
              {isUnsubscribed
                ? `El cliente se dio de baja el ${formatDate(preference!.orderEmailsUnsubscribedAt!)}.`
                : "El cliente no se ha dado de baja de las notificaciones de pedidos."}
            </p>
            {isUnsubscribed && !canResetUnsubscribe ? (
              <p className="mt-2 text-xs text-slate-500">Solo un administrativo puede restablecer esta baja.</p>
            ) : null}
          </section>

          <section>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Historial de correos</h3>
                <p className="mt-1 text-sm text-slate-500">Notificaciones registradas para este cliente.</p>
              </div>
              <Button variant="outline" size="sm" icon={RefreshCw} onClick={refresh} isLoading={messages.isFetching || preferences.isFetching}>
                Actualizar
              </Button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-155 text-left text-sm">
                <thead className="border-b border-slate-200 text-xs text-slate-500">
                  <tr><th className="py-2.5 pr-4 font-medium">Asunto</th><th className="py-2.5 pr-4 font-medium">Destinatario</th><th className="py-2.5 pr-4 font-medium">Estado</th><th className="py-2.5 font-medium">Fecha</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {messages.isLoading ? <tr><td colSpan={4} className="py-7 text-center text-slate-500">Cargando historial…</td></tr> : null}
                  {messages.isError ? <tr><td colSpan={4} className="py-7 text-center text-rose-700">No se pudo cargar el historial de correos.</td></tr> : null}
                  {!messages.isLoading && !messages.isError && (messages.data?.data.length ?? 0) === 0 ? <tr><td colSpan={4} className="py-7 text-center text-slate-500">No hay correos registrados para este cliente.</td></tr> : null}
                  {messages.data?.data.map((message) => (
                    <tr key={message.id}>
                      <td className="max-w-70 truncate py-3 pr-4 text-slate-700" title={message.subject}>{message.subject}</td>
                      <td className="py-3 pr-4 text-slate-600">{message.recipient ?? "—"}</td>
                      <td className="py-3 pr-4"><EmailMessageStatus status={message.status} /></td>
                      <td className="py-3 text-slate-600" title={message.failureReason ?? undefined}>{formatDate(message.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" onClick={onClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}
