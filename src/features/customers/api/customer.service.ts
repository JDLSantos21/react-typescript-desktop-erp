import { apiClient } from "@/shared/api/client";
import { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import {
  Customer,
  CustomerAddress,
  CustomerEntity,
  CustomerPhone,
} from "@/shared/types/entities/customer.types";
import {
  CreateCustomerAddressDto,
  CreateCustomerDto,
  CreateCustomerPhoneDto,
  UpdateCustomerDto,
} from "../types/customer.dto";

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  businessName?: string;
  representativeName?: string;
  rnc?: string;
  email?: string;
  active?: boolean;
}

export const CustomerService = {
  fetchAllCustomers: async (
    params?: CustomerQueryParams,
  ): Promise<PaginatedResponse<Customer>> => {
    const normalizedParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(
            ([, value]) => value !== "" && value !== undefined && value !== null,
          ),
        )
      : undefined;

    const { data } = await apiClient.get<PaginatedResponse<Customer>>(
      "/customers",
      { params: normalizedParams },
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

  addCustomer: async (
    customerData: CreateCustomerDto
  ): Promise<ApiResponse<Customer>> => {
    const { data } = await apiClient.post<ApiResponse<Customer>>(
      `/customers`,
      customerData
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

  editCustomerAddress: async (
    addressId: number,
    addressData: CreateCustomerAddressDto
  ): Promise<ApiResponse<CustomerAddress>> => {
    const { data } = await apiClient.patch<ApiResponse<CustomerAddress>>(
      `/customers/addresses/${addressId}`,
      addressData
    );
    return data;
  },

  editCustomerPhone: async (
    phoneId: number,
    customerId: string,
    phoneData: CreateCustomerPhoneDto
  ): Promise<ApiResponse<CustomerPhone>> => {
    const { data } = await apiClient.patch<ApiResponse<CustomerPhone>>(
      `/customers/phones/${phoneId}`,
      { ...phoneData, customerId }
    );
    return data;
  },

  deleteCustomer: async (customerId: string): Promise<void> => {
    await apiClient.delete(`/customers/${customerId}`);
  },

  updateCustomer: async (
    customerId: string,
    customerData: UpdateCustomerDto
  ): Promise<ApiResponse<CustomerEntity>> => {
    const { data } = await apiClient.patch<ApiResponse<CustomerEntity>>(
      `/customers/${customerId}`,
      customerData
    );
    return data;
  },

  getNearbyVehicles: async ({
    lat,
    lng,
    radiusKm,
  }: {
    lat: number;
    lng: number;
    radiusKm: number;
  }): Promise<any> => {
    const { data } = await apiClient.get<any>(`/telemetry/nearby`, {
      params: {
        lat,
        lng,
        radiusKm,
      },
    });
    return data;
  },

  refreshVehiclesLocation: async (): Promise<void> => {
    await apiClient.post(`/telemetry/sync`);
  },
};
