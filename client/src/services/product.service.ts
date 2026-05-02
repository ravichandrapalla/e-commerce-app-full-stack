import { api } from "../lib/axios";

export const getProductsApi = (params: any) => api.get("/products", { params });

export const createProductApi = (data: any) => api.post("/products", data);
