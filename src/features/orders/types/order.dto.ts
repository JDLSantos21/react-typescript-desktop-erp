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

export interface UpdateOrderStatusDto {
  orderId: number;
  status: {
    name: OrderStatus;
    description?: string;
  };
}
