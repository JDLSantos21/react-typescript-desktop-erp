import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrderQueryParams, OrderService } from "../api/order.service";
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from "../types/order.dto";
import { orderKeys } from "../api/order.keys";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderData,
      signal,
    }: {
      orderData: CreateOrderDto;
      signal?: AbortSignal;
    }) => OrderService.createOrder(orderData, signal),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
    },
  });
};

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => OrderService.getAllProducts(),
  });
};

export const useGetOrders = (params: OrderQueryParams) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => OrderService.getOrders(params),
  });
};

export const useGetOrderByTrackingCode = (trackingCode: string) => {
  return useQuery({
    queryKey: orderKeys.detail(trackingCode),
    queryFn: () => OrderService.getOrderByTrackingCode(trackingCode),
    enabled: !!trackingCode,
  });
};

export const useGetOrder = (orderId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => OrderService.getOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useGetOrderStatusHistory = (
  orderId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["order-status-history", orderId],
    queryFn: () => OrderService.getStatusHistory(orderId),
    enabled: !!orderId && enabled,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateOrderStatusDto) =>
      OrderService.updateOrderStatus({ ...params }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId.toString()),
      });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: number;
      data: Omit<UpdateOrderDto, "orderId">;
    }) => OrderService.updateOrder(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId.toString()),
      });
    },
  });
};

export const useGetInProgressOrdersCount = () => {
  return useQuery({
    queryKey: orderKeys.counts(),
    queryFn: () => OrderService.getInProgressOrdersCount(),
  });
};

export const useAssignDriverToOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { orderId: number; driverId: string }) =>
      OrderService.assignDriver(params.orderId, params.driverId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId.toString()),
      });
    },
  });
};

export const useUnassignDriverFromOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => OrderService.unassignDriver(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(orderId.toString()),
      });
    },
  });
};
