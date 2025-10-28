import { apiClient } from "@/shared/api/client";
import { ApiResponse } from "@/shared/types/api.types";
import { Order } from "@/shared/types/entities/order.types";

export class OrderService {
  static getOrdersByCustomerId = async (
    customerId: string
  ): Promise<ApiResponse<Order[]>> => {
    const res = await apiClient.get<ApiResponse<Order[]>>(
      `/customers/${customerId}/orders`
    );
    return res.data;
  };
}
