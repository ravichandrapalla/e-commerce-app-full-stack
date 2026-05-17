import { api } from "../lib/axios";
import type { AdminOrder, DashboardStats, OrderStatus } from "../types/ecommerce";

export const getDashboardStatsApi = () => api.get<DashboardStats>("/admin/stats");

export const getAdminOrdersApi = () => api.get<AdminOrder[]>("/admin/orders");

export const updateAdminOrderStatusApi = (
  orderId: string,
  status: OrderStatus,
) => api.patch<AdminOrder>(`/admin/orders/${orderId}/status`, { status });
