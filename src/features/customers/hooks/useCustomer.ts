import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerService, CustomerQueryParams } from "../api/customer.service";
import {
  CreateCustomerAddressDto,
  CreateCustomerPhoneDto,
} from "../types/customer.dto";
import { customerKeys } from "../api/customer.keys";

export const useGetCustomers = (params?: CustomerQueryParams) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => CustomerService.fetchAllCustomers(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export const useCustomerById = (customerId: string) => {
  return useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: () => CustomerService.fetchCustomerById(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

//Mutations

export const useAddCustomerAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      addressData,
    }: {
      customerId: string;
      addressData: CreateCustomerAddressDto;
    }) => CustomerService.addCustomerAddress(customerId, addressData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.customerId),
      });
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
    },
  });
};

export const useAddCustomerPhone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      phoneData,
    }: {
      customerId: string;
      phoneData: CreateCustomerPhoneDto;
    }) => CustomerService.addCustomerPhone(customerId, phoneData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.customerId),
      });
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
    },
  });
};
