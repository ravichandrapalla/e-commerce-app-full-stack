import { api } from "../lib/axios";

export const getProductApi = (id: string) => api.get(`/products/${id}`);

export const createProductApi = (data: any) => api.post("/products", data);
