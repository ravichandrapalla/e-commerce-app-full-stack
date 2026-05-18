import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveProductApi,
  bulkApproveProductsApi,
  createHeroSlideApi,
  createHeroSlidesBatchApi,
  deleteHeroSlideApi,
  getAdminCatalogProductsApi,
  getAdminHeroSlidesApi,
  getAdminOrdersApi,
  getDashboardStatsApi,
  getPendingApprovalsApi,
  rejectProductApi,
  reorderHeroSlidesApi,
  updateAdminOrderStatusApi,
  updateHeroSlideApi,
} from "../../services/admin.service";
import { heroSlidesQueryKey } from "../hero/hero.hooks";
import type { OrderStatus } from "../../types/ecommerce";

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await getDashboardStatsApi();
      return res.data;
    },
  });

export const useAdminOrders = () =>
  useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await getAdminOrdersApi();
      return res.data;
    },
  });

export const usePendingApprovals = () =>
  useQuery({
    queryKey: ["admin-pending-approvals"],
    queryFn: async () => {
      const res = await getPendingApprovalsApi();
      return res.data;
    },
  });

export const useAdminCatalogProducts = (params?: {
  page?: number;
  limit?: number;
  approvalStatus?: string;
}) =>
  useQuery({
    queryKey: ["admin-catalog-products", params],
    queryFn: async () => {
      const res = await getAdminCatalogProductsApi(params);
      return res.data;
    },
  });

const invalidateCatalogQueries = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ["admin-pending-approvals"] });
  qc.invalidateQueries({ queryKey: ["admin-catalog-products"] });
  qc.invalidateQueries({ queryKey: ["products"] });
  qc.invalidateQueries({ queryKey: ["seller-products"] });
  qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
};

export const useApproveProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await approveProductApi(productId);
      return res.data;
    },
    onSuccess: () => invalidateCatalogQueries(qc),
  });
};

export const useRejectProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      reason,
    }: {
      productId: string;
      reason?: string;
    }) => {
      const res = await rejectProductApi(productId, reason);
      return res.data;
    },
    onSuccess: () => invalidateCatalogQueries(qc),
  });
};

export const useBulkApproveProducts = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await bulkApproveProductsApi();
      return res.data;
    },
    onSuccess: () => invalidateCatalogQueries(qc),
  });
};

const invalidateHeroQueries = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ["admin-hero-slides"] });
  qc.invalidateQueries({ queryKey: heroSlidesQueryKey });
};

export const useAdminHeroSlides = () =>
  useQuery({
    queryKey: ["admin-hero-slides"],
    queryFn: async () => {
      const res = await getAdminHeroSlidesApi();
      return res.data;
    },
  });

export const useCreateHeroSlide = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createHeroSlideApi(data),
    onSuccess: () => invalidateHeroQueries(qc),
  });
};

export const useCreateHeroSlidesBatch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createHeroSlidesBatchApi(data),
    onSuccess: () => invalidateHeroQueries(qc),
  });
};

export const useUpdateHeroSlide = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateHeroSlideApi(id, data),
    onSuccess: () => invalidateHeroQueries(qc),
  });
};

export const useDeleteHeroSlide = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHeroSlideApi(id),
    onSuccess: () => invalidateHeroQueries(qc),
  });
};

export const useReorderHeroSlides = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderedIds: string[]) => reorderHeroSlidesApi(orderedIds),
    onSuccess: () => invalidateHeroQueries(qc),
  });
};

export const useUpdateAdminOrderStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => {
      const res = await updateAdminOrderStatusApi(orderId, status);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
};
