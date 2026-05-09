import { api } from "../../lib/axios";

export const checkoutApi = () => api.post("/orders/checkout");

export const getOrdersApi = () => api.get("/orders");
