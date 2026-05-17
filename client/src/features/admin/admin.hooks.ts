import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminOrdersApi,
  getDashboardStatsApi,
  updateAdminOrderStatusApi,
} from "../../services/admin.service";
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
