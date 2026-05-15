import { api } from "../lib/axios";

export const getProductsApi = (data: any) => api.get("/products");

export const getProductApi = (id: string) => api.get(`/products/${id}`);

export const createProductApi = (data: any) => api.post("/products", data);
