import { api } from "../lib/axios";
import type {
  OrderStatus,
  ProductListResponse,
  SellerDashboardStats,
  SellerOrder,
} from "../types/ecommerce";

export const getSellerStatsApi = () =>
  api.get<SellerDashboardStats>("/seller/stats");

export const getSellerProductsApi = () =>
  api.get<ProductListResponse>("/seller/products?page=1&limit=50");

export const getSellerOrdersApi = () => api.get<SellerOrder[]>("/seller/orders");

export const updateSellerOrderStatusApi = (
  orderId: string,
  status: OrderStatus,
) => api.patch<SellerOrder>(`/seller/orders/${orderId}/status`, { status });
