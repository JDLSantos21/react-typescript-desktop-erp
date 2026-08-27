import type { EmailMessageStatus as EmailStatus } from "@/shared/types/entities/email.types";

const statusCopy: Record<EmailStatus, string> = {
  PENDING: "En cola",
  SENT: "Enviado",
  DELIVERED: "Entregado",
  BOUNCED: "Rebotado",
  COMPLAINED: "Marcado como spam",
  FAILED: "Fallido",
  SKIPPED: "Omitido",
};

const statusClasses: Record<EmailStatus, string> = {
  PENDING: "text-amber-700",
  SENT: "text-blue-700",
  DELIVERED: "text-emerald-700",
  BOUNCED: "text-rose-700",
  COMPLAINED: "text-rose-700",
  FAILED: "text-rose-700",
  SKIPPED: "text-slate-500",
};

export function EmailMessageStatus({ status }: { status: EmailStatus }) {
  return <span className={`text-sm font-medium ${statusClasses[status]}`}>{statusCopy[status]}</span>;
}
