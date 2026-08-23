import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import {
  Order,
  ProductCatalogItem,
  OrderStatus,
  OrderStatusHistoryField,
  PublicOrderTracking,
} from "@/shared/types/entities/order.types";
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from "../types/order.dto";

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  orderId?: number;
  trackingCode?: string;
  customerId?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  scheduledDate?: string;
  search?: string;
}

export class OrderService {
  static getOrdersByCustomerId = async (
    customerId: string,
  ): Promise<ApiResponse<Order[]>> => {
    const res = await apiClient.get<ApiResponse<Order[]>>(
      `/customers/${customerId}/orders`,
    );
    return res.data;
  };

  static createOrder = async (
    orderData: CreateOrderDto,
    signal?: AbortSignal,
  ): Promise<ApiResponse<Order>> => {
    const res = await apiClient.post<ApiResponse<Order>>("/orders", orderData, {
      signal,
    });
    return res.data;
  };

  static getAllProducts = async (): Promise<
    ApiResponse<ProductCatalogItem[]>
  > => {
    const res = await apiClient.get<ApiResponse<ProductCatalogItem[]>>(
      "/products",
    );
    return res.data;
  };

  static getOrders = async (
    params: OrderQueryParams,
  ): Promise<PaginatedResponse<Order>> => {
    const { data } = await apiClient.get<PaginatedResponse<Order>>("/orders", {
      params,
    });
    return data;
  };

  static getOrderById = async (
    orderId: string,
  ): Promise<ApiResponse<Order>> => {
    const res = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return res.data;
  };

  static getOrderByTrackingCode = async (
    trackingCode: string,
  ): Promise<ApiResponse<PublicOrderTracking>> => {
    const res = await apiClient.get<ApiResponse<PublicOrderTracking>>(
      `/orders/tracking/${trackingCode}`,
    );
    return res.data;
  };

  static getStatusHistory = async (
    orderId: string,
  ): Promise<ApiResponse<OrderStatusHistoryField[]>> => {
    const res = await apiClient.get<ApiResponse<OrderStatusHistoryField[]>>(
      `/orders/${orderId}/status-history`,
    );
    return res.data;
  };

  static updateOrderStatus = async (
    params: UpdateOrderStatusDto,
  ): Promise<ApiResponse<Order>> => {
    const res = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${params.orderId}/status`,
      {
        status: params.status.name,
        description: params.status.description,
      },
    );
    return res.data;
  };

  static updateOrder = async (
    orderId: number,
    data: Omit<UpdateOrderDto, "orderId">,
  ): Promise<ApiResponse<Order>> => {
    const res = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${orderId}`,
      data,
    );
    return res.data;
  };

  static getInProgressOrdersCount = async (): Promise<
    ApiResponse<{ pending: number; preparing: number; dispatched: number }>
  > => {
    const res = await apiClient.get<
      ApiResponse<{ pending: number; preparing: number; dispatched: number }>
    >(`/orders/stats`);
    return res.data;
  };

  static assignDriver = async (
    orderId: number,
    driverId: string,
  ): Promise<ApiResponse<Order>> => {
    const res = await apiClient.post<ApiResponse<Order>>(
      `/orders/${orderId}/assign`,
      { employeeId: driverId },
    );
    return res.data;
  };

  static unassignDriver = async (
    orderId: number,
  ): Promise<ApiResponse<Order>> => {
    const res = await apiClient.delete<ApiResponse<Order>>(
      `/orders/${orderId}/assign`,
    );
    return res.data;
  };
}
