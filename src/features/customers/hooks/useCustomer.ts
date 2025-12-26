import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerService, CustomerQueryParams } from "../api/customer.service";
import {
  CreateCustomerAddressDto,
  CreateCustomerDto,
  CreateCustomerPhoneDto,
  UpdateCustomerDto,
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

export const useaddCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerData: CreateCustomerDto) =>
      CustomerService.addCustomer(customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
    },
  });
};

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

export const useEditCustomerPhone = (customerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      phoneId,
      phoneData,
    }: {
      phoneId: number;
      phoneData: CreateCustomerPhoneDto;
    }) => CustomerService.editCustomerPhone(phoneId, customerId, phoneData),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(customerId),
      });
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
    },
  });
};

export const useEditCustomerAddress = (customerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      addressData,
    }: {
      addressId: number;
      addressData: CreateCustomerAddressDto;
    }) => CustomerService.editCustomerAddress(addressId, addressData),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(customerId),
      });
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
    },
  });
};

export const useDeleteCustomer = (customerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CustomerService.deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
    },
  });
};

export const useEditCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      customerData,
    }: {
      customerId: string;
      customerData: UpdateCustomerDto;
    }) => CustomerService.updateCustomer(customerId, customerData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.customerId),
      });
    },
  });
};
