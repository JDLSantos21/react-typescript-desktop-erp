import { apiClient } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  CustomerEmailPreferences,
  EmailMessage,
  EmailSettings,
  OrderEmailDefaults,
} from "@/shared/types/entities/email.types";

export const EmailService = {
  getOrderDefaults: async (): Promise<ApiResponse<OrderEmailDefaults>> => {
    const { data } = await apiClient.get<ApiResponse<OrderEmailDefaults>>(
      "/email/settings/order-defaults",
    );
    return data;
  },

  getSettings: async (): Promise<ApiResponse<EmailSettings>> => {
    const { data } = await apiClient.get<ApiResponse<EmailSettings>>(
      "/email/settings",
    );
    return data;
  },

  updateSettings: async (
    settings: Partial<Omit<EmailSettings, "id" | "updatedAt">>,
  ): Promise<ApiResponse<EmailSettings>> => {
    const { data } = await apiClient.patch<ApiResponse<EmailSettings>>(
      "/email/settings",
      settings,
    );
    return data;
  },

  getCustomerPreferences: async (
    customerId: string,
  ): Promise<ApiResponse<CustomerEmailPreferences>> => {
    const { data } = await apiClient.get<ApiResponse<CustomerEmailPreferences>>(
      `/email/customers/${customerId}/preferences`,
    );
    return data;
  },

  updateCustomerPreferences: async (
    customerId: string,
    receivesOrderEmails: boolean,
  ): Promise<ApiResponse<CustomerEmailPreferences>> => {
    const { data } = await apiClient.patch<ApiResponse<CustomerEmailPreferences>>(
      `/email/customers/${customerId}/preferences`,
      { receivesOrderEmails },
    );
    return data;
  },

  resetCustomerUnsubscribe: async (
    customerId: string,
  ): Promise<ApiResponse<CustomerEmailPreferences>> => {
    const { data } = await apiClient.delete<ApiResponse<CustomerEmailPreferences>>(
      `/email/customers/${customerId}/unsubscribe`,
    );
    return data;
  },

  getCustomerMessages: async (
    customerId: string,
  ): Promise<ApiResponse<EmailMessage[]>> => {
    const { data } = await apiClient.get<ApiResponse<EmailMessage[]>>(
      `/email/customers/${customerId}/messages`,
    );
    return data;
  },

  getOrderMessages: async (
    orderId: number,
  ): Promise<ApiResponse<EmailMessage[]>> => {
    const { data } = await apiClient.get<ApiResponse<EmailMessage[]>>(
      `/email/orders/${orderId}/messages`,
    );
    return data;
  },

  resendOrderEmail: async (orderId: number): Promise<ApiResponse<{ queued: boolean }>> => {
    const { data } = await apiClient.post<ApiResponse<{ queued: boolean }>>(
      `/orders/${orderId}/emails`,
    );
    return data;
  },
};
