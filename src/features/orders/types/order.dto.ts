// ============================================
// REQUEST DTOs - Lo que enviamos al backend
// ============================================

import { OrderStatus } from "@/shared/types/entities/order.types";

export interface CreateOrderItemDto {
  product_id: number;
  requested_quantity: number;
  notes?: string;
}

export interface CreateOrderDto {
  customer_id: string;
  address_id: number;
  order_items: CreateOrderItemDto[];
  scheduled_date?: string;
  delivery_notes?: string;
  notes?: string;
}

export interface UpdateOrderDto {
  orderId: number;
  order_items?: CreateOrderItemDto[];
  delivery_notes?: string;
  notes?: string;
  scheduled_date?: string;
}

export interface AssignOrderToEmployeeDto {
  order_id: number;
  user_id: string;
}

export interface UpdateOrderDto {
  orderId: number;
  order_items?: CreateOrderItemDto[];
  delivery_notes?: string;
  notes?: string;
  scheduled_date?: string;
}

export interface UpdateOrderStatusDto {
  orderId: number;
  status: {
    name: OrderStatus;
    description?: string;
  };
}

// ============================================
// TYPES
// ============================================

export type OrderStatusUpdate =
  | "PENDIENTE"
  | "PREPARANDO"
  | "DESPACHADO"
  | "ENTREGADO"
  | "CANCELADO"
  | "DEVUELTO";

// ============================================
// RESPONSE DTOs - Lo que recibimos del backend
// ============================================

export interface OrderItemResponse extends CreateOrderItemDto {
  id: number;
  orderId: number;
  productName: string;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  id: number;
  trackingCode: string;
  customerId: string;
  customerAddressId: number;
  status: OrderStatusUpdate;
  orderItems: OrderItemResponse[];
  userId: string;
  assignedTo?: string;
  scheduledDate?: string;
  deliveryDate?: string;
  deliveredDate?: string;
  deliveryNotes?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
