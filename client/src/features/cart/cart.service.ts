import { api } from "../../lib/axios";

export const getCartApi = () => api.get("/cart");
export const addToCartApi = (data: any) => api.post("/cart/add", data);
export const updateCartApi = (data: any) => api.patch("/cart/update", data);
export const removeCartApi = (data: any) =>
  api.delete("/cart/remove", { data });
