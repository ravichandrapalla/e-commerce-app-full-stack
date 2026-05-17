import { api } from "../../lib/axios";
import type { Cart } from "../../types/ecommerce";

export type ProductQuantityPayload = {
  productId: string;
  quantity: number;
};

export type ProductPayload = {
  productId: string;
};

export const getCartApi = () => api.get<Cart>("/cart");
export const addToCartApi = (data: ProductQuantityPayload) => api.post("/cart/add", data);
export const decrementCartApi = (data: ProductPayload) => api.post("/cart/decrement", data);
export const updateCartApi = (data: ProductQuantityPayload) => api.patch("/cart/update", data);
export const removeCartApi = (data: ProductPayload) =>
  api.delete("/cart/remove", { data });
