import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import {
  Customer,
  CustomerAddress,
  CustomerPhone,
} from "@/shared/types/entities/customer.types";
import {
  CreateCustomerAddressDto,
  CreateCustomerPhoneDto,
} from "../types/customer.dto";

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  businessName?: string;
  cedula?: string;
  active?: boolean;
  [key: string]: any;
}

export const CustomerService = {
  fetchAllCustomers: async (
    params?: CustomerQueryParams
  ): Promise<PaginatedResponse<Customer>> => {
    const { data } = await apiClient.get<PaginatedResponse<Customer>>(
      "/customers",
      { params }
    );
    return data;
  },
  fetchCustomerById: async (
    customerId: string
  ): Promise<ApiResponse<Customer>> => {
    const { data } = await apiClient.get<ApiResponse<Customer>>(
      `/customers/${customerId}`
    );
    return data;
  },

  addCustomerAddress: async (
    customerId: string,
    addressData: CreateCustomerAddressDto
  ): Promise<ApiResponse<CustomerAddress>> => {
    const { data } = await apiClient.post<ApiResponse<CustomerAddress>>(
      `/customers/${customerId}/addresses`,
      addressData
    );
    return data;
  },

  addCustomerPhone: async (
    customerId: string,
    phoneData: CreateCustomerPhoneDto
  ): Promise<ApiResponse<CustomerPhone>> => {
    const { data } = await apiClient.post<ApiResponse<CustomerPhone>>(
      `/customers/${customerId}/phones`,
      phoneData
    );
    return data;
  },
};
