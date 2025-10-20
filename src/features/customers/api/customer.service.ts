import { apiClient } from "@/shared/api/client";
import { ApiResponse } from "@/shared/types/api.types";
import { Customer } from "@/shared/types/entities/customer.types";

export const CustomerService = {
  fetchAllCustomers: async (): Promise<Customer[]> => {
    const { data } = await apiClient.get<ApiResponse<Customer[]>>("/customers");
    return data.data;
  },
};
