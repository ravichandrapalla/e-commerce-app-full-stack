import { api } from "../lib/axios";
import type {
  Product,
  ProductListResponse,
  ProductSearchParams,
  ProductUpdateInput,
} from "../types/ecommerce";

export const getProductsApi = (data: ProductSearchParams) => {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value != null && value !== "") {
      params.append(key, String(value));
    }
  });

  return api.get<ProductListResponse>(`/products?${params.toString()}`);
};

export const getProductApi = (id: string) => api.get<Product>(`/products/${id}`);

export const createProductApi = (data: FormData) => api.post("/products", data);

export const updateProductApi = (id: string, data: ProductUpdateInput) =>
  api.patch<Product>(`/products/${id}`, data);
