import { api } from "../../lib/axios";
import type { CheckoutResponse, Order } from "../../types/ecommerce";

import type { ShippingAddressFormValues } from "./checkout.schema";

export const checkoutApi = (shipping: ShippingAddressFormValues) =>
  api.post<CheckoutResponse>("/orders/checkout", { shipping });

export const completeDemoCheckoutApi = (orderId: string) =>
  api.post<Order>("/orders/checkout/demo-complete", { orderId });

export const getOrdersApi = () => api.get<Order[]>("/orders");

export const getOrderApi = (orderId: string) =>
  api.get<Order>(`/orders/${orderId}`);
