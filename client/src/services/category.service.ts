import { api } from "../lib/axios";

export const getCategoriesApi = () => api.get("/categories");
