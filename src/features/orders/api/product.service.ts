import { apiClient } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/types/api.types";
import type { Product, ProductInput } from "@/shared/types/entities/order.types";

export class ProductService {
  static async getForManagement(): Promise<ApiResponse<Product[]>> {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      "/products/management",
    );
    return response.data;
  }

  static async create(data: ProductInput): Promise<ApiResponse<Product>> {
    const response = await apiClient.post<ApiResponse<Product>>("/products", data);
    return response.data;
  }

  static async update(
    id: number,
    data: Partial<ProductInput>,
  ): Promise<ApiResponse<Product>> {
    const response = await apiClient.patch<ApiResponse<Product>>(
      `/products/${id}`,
      data,
    );
    return response.data;
  }

  static async remove(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  }
}
