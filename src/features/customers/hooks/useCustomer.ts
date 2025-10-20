import { useQuery } from "@tanstack/react-query";
import { CustomerService } from "../api/customer.service";

export const useGetCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: CustomerService.fetchAllCustomers,
  });
};
