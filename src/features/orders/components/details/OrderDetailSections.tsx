import { CalendarDays, MapPin, Package, UserRound } from "lucide-react";
import { Button } from "@/shared/components/core/Button";
import { LocationIcon, UserIcon, WhatsAppIcon } from "@/shared/components/icons";
import { formatPhoneNumber, formatDate } from "@/shared/utils/formatters";
import { handleOpenWhatsapp } from "@/lib/opener";
import { Order } from "@/shared/types/entities/order.types";
import { useNavigate } from "react-router-dom";

interface OrderDetailSectionsProps { order: Order; onOpenMap: () => void; }

function SectionTitle({ icon: Icon, children }: { icon: typeof Package; children: string }) {
  return <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Icon className="h-4 w-4 text-slate-500" />{children}</h2>;
}

export function OrderDetailSections({ order, onOpenMap }: OrderDetailSectionsProps) {
  const navigate = useNavigate();
  const hasCoordinates = order.address?.coords?.latitude != null;
  return <div className="space-y-8 pb-8">
    <div className="grid gap-8 border-b border-slate-200 pb-8 xl:grid-cols-2">
      <section><SectionTitle icon={UserRound}>Cliente</SectionTitle><div className="mt-4"><p className="text-base font-semibold text-slate-900">{order.customer.businessName}</p><p className="mt-1 text-sm text-slate-600">{order.customer.representativeName}</p><p className="mt-4 text-sm text-slate-600">{order.phone ? formatPhoneNumber(order.phone.phoneNumber) : "Sin teléfono disponible"}</p><div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => handleOpenWhatsapp(order)} icon={WhatsAppIcon} variant="outline" size="sm" disabled={!order.phone?.hasWhatsapp}>Enviar mensaje</Button><Button onClick={() => navigate(`/customers/${order.customer.id}`)} icon={UserIcon} variant="outline" size="sm">Ver cliente</Button></div></div></section>
      <section><SectionTitle icon={MapPin}>Entrega</SectionTitle><div className="mt-4 flex min-w-0 items-start justify-between gap-5"><div className="min-w-0"><p className="font-semibold text-slate-900">{order.address?.branchName ?? "Sin dirección disponible"}</p>{order.address ? <><p className="mt-1 text-sm text-slate-700">{order.address.direction}</p><p className="mt-1 text-sm text-slate-500">{order.address.city}</p></> : null}</div><div className="shrink-0 text-right"><p className={`text-xs font-medium ${hasCoordinates ? "text-emerald-700" : "text-slate-500"}`}>{hasCoordinates ? "Ubicación exacta" : "Sin ubicación exacta"}</p><Button variant="outline" icon={LocationIcon} size="sm" className="mt-3" disabled={!hasCoordinates} onClick={onOpenMap}>Ver mapa</Button></div></div></section>
    </div>
    <section><SectionTitle icon={Package}>Productos solicitados</SectionTitle><div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">{order.products.map((product) => <div key={product.id} className="flex items-center justify-between gap-5 py-4"><div className="min-w-0"><p className="truncate font-medium text-slate-900">{product.name}</p><p className="mt-1 text-sm text-slate-500">{[product.size, product.unit].filter(Boolean).join(" · ") || "Sin presentación"}</p></div><p className="shrink-0 text-lg font-semibold tabular-nums text-slate-900">{product.quantity}<span className="ml-1 text-sm font-normal text-slate-500">und.</span></p></div>)}</div></section>
    <section className="border-t border-slate-200 pt-8"><SectionTitle icon={CalendarDays}>Seguimiento y programación</SectionTitle><dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-4"><Detail label="Fecha de pedido" value={formatDate(order.date)} /><Detail label="Fecha programada" value={order.scheduledDate ? formatDate(order.scheduledDate) : "Sin programar"} /><Detail label="Fecha de entrega" value={order.deliveredDate ? formatDate(order.deliveredDate) : "Pendiente"} /><Detail label="Asignado a" value={order.assignedTo?.name ?? "Sin asignar"} /></dl></section>
    {(order.notes || order.deliveryNotes) ? <section className="border-t border-slate-200 pt-8"><SectionTitle icon={Package}>Observaciones</SectionTitle><div className="mt-4 grid gap-5 sm:grid-cols-2">{order.notes ? <Note label="Pedido" value={order.notes} /> : null}{order.deliveryNotes ? <Note label="Entrega" value={order.deliveryNotes} /> : null}</div></section> : null}
  </div>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-medium text-slate-500">{label}</dt><dd className="mt-1.5 text-sm text-slate-800">{value}</dd></div>; }
function Note({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-slate-700">{value}</p></div>; }
