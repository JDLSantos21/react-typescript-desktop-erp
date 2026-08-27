import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductInput } from "@/shared/types/entities/order.types";
import { productKeys } from "../api/product.keys";
import { ProductService } from "../api/product.service";

const invalidateProducts = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: productKeys.all });

export const useProductsForManagement = () =>
  useQuery({
    queryKey: [...productKeys.lists(), "management"],
    queryFn: ProductService.getForManagement,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductInput) => ProductService.create(data),
    onSuccess: () => invalidateProducts(queryClient),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductInput> }) =>
      ProductService.update(id, data),
    onSuccess: () => invalidateProducts(queryClient),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ProductService.remove,
    onSuccess: () => invalidateProducts(queryClient),
  });
};
