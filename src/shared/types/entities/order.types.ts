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
  size: string | null;
  unit: string;
}

export interface OrderStatusHistoryField {
  status: OrderStatus;
  description: string | null;
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
  address: CustomerAddress | null;
  phone: CustomerPhone | null;
  customer: {
    id: string;
    businessName: string;
    representativeName: string;
  };
  assignedTo: {
    id: string;
    name: string;
  } | null;
}

export interface ProductCatalogItem {
  id: number;
  name: string;
  size: string | null;
  unit: string;
}

export interface PublicOrderTracking {
  trackingCode: string;
  status: OrderStatus;
  orderDate: string;
  scheduledDate: string | null;
  deliveredDate: string | null;
  deliveryNotes: string | null;
  items: Array<{
    product: {
      name: string;
      unit: string;
      size: string | null;
    };
    requestedQuantity: number;
    deliveredQuantity: number | null;
  }>;
  history: Array<{
    status: OrderStatus;
    description: string | null;
    createdAt: string;
  }>;
}
