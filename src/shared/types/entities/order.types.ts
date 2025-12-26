import { CustomerAddress, CustomerPhone } from "./customer.types";

export type OrderStatus =
  | "PENDIENTE"
  | "PREPARANDO"
  | "DESPACHADO"
  | "ENTREGADO"
  | "CANCELADO"
  | "DEVUELTO";

export interface OrderProduct {
  id: number;
  name: string;
  quantity: number;
  size: string;
  unit: string;
}

export interface OrderStatusHistoryField {
  status: OrderStatus;
  description: string;
  changedAt: string;
  changedBy: {
    id: string;
    name: string;
  };
}

export interface Order {
  id: number;
  trackingCode: string;
  status: OrderStatus;
  date: string;
  scheduledDate: string | null;
  deliveredDate: string | null;
  deliveryNotes: string | null;
  notes: string | null;
  products: OrderProduct[];
  address: CustomerAddress;
  phone: CustomerPhone;
  customer: {
    id: string;
    businessName: string;
    representativeName: string;
  };
  assignedTo: {
    id: string;
    name: string;
  };
}
