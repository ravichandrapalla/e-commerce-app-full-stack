import { api } from "../lib/axios";
import type {
  AdminOrder,
  DashboardStats,
  OrderStatus,
  PendingApprovalsResponse,
  ProductListResponse,
} from "../types/ecommerce";
import type { AdminHeroSlidesResponse, HeroSlide } from "../types/hero";

export const getDashboardStatsApi = () => api.get<DashboardStats>("/admin/stats");

export const getAdminOrdersApi = () => api.get<AdminOrder[]>("/admin/orders");

export const updateAdminOrderStatusApi = (
  orderId: string,
  status: OrderStatus,
) => api.patch<AdminOrder>(`/admin/orders/${orderId}/status`, { status });

export const getPendingApprovalsApi = () =>
  api.get<PendingApprovalsResponse>("/admin/products/pending");

export const getAdminCatalogProductsApi = (params?: {
  page?: number;
  limit?: number;
  approvalStatus?: string;
}) => api.get<ProductListResponse>("/admin/products/catalog", { params });

export const approveProductApi = (productId: string) =>
  api.patch(`/admin/products/${productId}/approve`);

export const rejectProductApi = (productId: string, reason?: string) =>
  api.patch(`/admin/products/${productId}/reject`, { reason });

export const bulkApproveProductsApi = () =>
  api.post<{ approvedCount: number; message: string }>("/admin/products/bulk-approve");

export const getAdminHeroSlidesApi = () =>
  api.get<AdminHeroSlidesResponse>("/admin/hero-slides");

export const createHeroSlideApi = (data: FormData) =>
  api.post<{ slide: HeroSlide }>("/admin/hero-slides", data);

export const createHeroSlidesBatchApi = (data: FormData) =>
  api.post<{ slides: HeroSlide[] }>("/admin/hero-slides/batch", data);

export const updateHeroSlideApi = (id: string, data: FormData) =>
  api.patch<{ slide: HeroSlide }>(`/admin/hero-slides/${id}`, data);

export const deleteHeroSlideApi = (id: string) =>
  api.delete(`/admin/hero-slides/${id}`);

export const reorderHeroSlidesApi = (orderedIds: string[]) =>
  api.patch<{ slides: HeroSlide[] }>("/admin/hero-slides/reorder", { orderedIds });
