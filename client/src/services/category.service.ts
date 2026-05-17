import { api } from "../lib/axios";
import type { Category } from "../types/ecommerce";

export const getCategoriesApi = () => api.get<Category[]>("/categories");
