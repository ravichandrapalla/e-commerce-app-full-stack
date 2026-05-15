import { api } from "../lib/axios";

type ProductSearchParams = {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
};

export const getProductsApi = (data: ProductSearchParams) => {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value != null && value !== "") {
      params.append(key, String(value));
    }
  });

  return api.get(`/products?${params.toString()}`);
};

export const getProductApi = (id: string) => api.get(`/products/${id}`);

export const createProductApi = (data: FormData) =>
  api.post("/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
