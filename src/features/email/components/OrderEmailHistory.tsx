import { Mail, RotateCcw } from "lucide-react";
import { sileo } from "sileo";
import { PermissionGate } from "@/shared/authorization/PermissionGate";
import { PermissionLevel } from "@/shared/authorization/permissions";
import { Button } from "@/shared/components/core/Button";
import { formatDate } from "@/shared/utils/formatters";
import { extractApiError } from "@/shared/utils/error-handler";
import { useOrderEmailMessages, useResendOrderEmail } from "../hooks/useEmail";
import { EmailMessageStatus } from "./EmailMessageStatus";

export function OrderEmailHistory({ orderId }: { orderId: number }) {
  const messages = useOrderEmailMessages(orderId);
  const resend = useResendOrderEmail();

  const requestResend = async () => {
    try {
      await resend.mutateAsync(orderId);
      sileo.success({ title: "Correo puesto en cola para enviar" });
    } catch (error) {
      sileo.error({
        title: "No se pudo enviar el correo",
        description: extractApiError(error).message,
      });
    }
  };

  return (
    <section className="border-t border-slate-100 pt-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Correos del pedido</h2>
          <p className="mt-1 text-sm text-slate-500">Historial de notificaciones enviadas al cliente.</p>
        </div>
        <PermissionGate minimumLevel={PermissionLevel.ADVANCED_OPERATIONS}>
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={() => void requestResend()} isLoading={resend.isPending}>
            Reenviar correo
          </Button>
        </PermissionGate>
      </div>
      {messages.isLoading ? (
        <p className="py-5 text-sm text-slate-500">Cargando historial de correos…</p>
      ) : messages.isError ? (
        <p className="py-5 text-sm text-rose-700">No se pudo cargar el historial de correos.</p>
      ) : (messages.data?.data.length ?? 0) === 0 ? (
        <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
          <Mail className="h-4 w-4" />
          Aún no hay correos registrados para este pedido.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead className="border-b border-slate-200 text-xs text-slate-500">
              <tr><th className="py-2.5 pr-4 font-medium">Destinatario</th><th className="py-2.5 pr-4 font-medium">Tipo</th><th className="py-2.5 pr-4 font-medium">Estado</th><th className="py-2.5 font-medium">Fecha</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.data!.data.map((message) => (
                <tr key={message.id}>
                  <td className="py-3 pr-4 text-slate-700">{message.recipient ?? "—"}</td>
                  <td className="py-3 pr-4 text-slate-600">{message.trigger === "MANUAL_RESEND" ? "Reenvío manual" : "Pedido creado"}</td>
                  <td className="py-3 pr-4"><EmailMessageStatus status={message.status} /></td>
                  <td className="py-3 text-slate-600" title={message.failureReason ?? undefined}>{formatDate(message.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
