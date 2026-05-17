import { api } from "../../lib/axios";
import type { CheckoutResponse, Order } from "../../types/ecommerce";

export const checkoutApi = () => api.post<CheckoutResponse>("/orders/checkout");

export const completeDemoCheckoutApi = (orderId: string) =>
  api.post<Order>("/orders/checkout/demo-complete", { orderId });

export const getOrdersApi = () => api.get<Order[]>("/orders");
