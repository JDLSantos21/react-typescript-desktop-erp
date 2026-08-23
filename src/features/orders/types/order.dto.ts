// ============================================
// REQUEST DTOs - Lo que enviamos al backend
// ============================================

import { OrderStatus } from "@/shared/types/entities/order.types";

export interface CreateOrderItemDto {
  productId: number;
  requestedQuantity: number;
  notes?: string;
}

export interface CreateOrderDto {
  customerId: string;
  customerAddressId: number;
  orderItems: CreateOrderItemDto[];
  scheduledDate?: string;
  deliveryNotes?: string;
  notes?: string;
}

export interface UpdateOrderDto {
  orderId: number;
  orderItems?: CreateOrderItemDto[];
  deliveryNotes?: string;
  notes?: string;
  scheduledDate?: string;
}

export interface AssignOrderToEmployeeDto {
  orderId: number;
  userId: string;
}

export interface UpdateOrderStatusDto {
  orderId: number;
  status: {
    name: OrderStatus;
    description?: string;
  };
}
