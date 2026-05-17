import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSellerOrdersApi,
  getSellerProductsApi,
  getSellerStatsApi,
  updateSellerOrderStatusApi,
} from "../../services/seller.service";
import type { OrderStatus } from "../../types/ecommerce";

export const useSellerStats = () =>
  useQuery({
    queryKey: ["seller-stats"],
    queryFn: async () => {
      const res = await getSellerStatsApi();
      return res.data;
    },
  });

export const useSellerProducts = () =>
  useQuery({
    queryKey: ["seller-products"],
    queryFn: async () => {
      const res = await getSellerProductsApi();
      return res.data;
    },
  });

export const useSellerOrders = () =>
  useQuery({
    queryKey: ["seller-orders"],
    queryFn: async () => {
      const res = await getSellerOrdersApi();
      return res.data;
    },
  });

export const useUpdateSellerOrderStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => {
      const res = await updateSellerOrderStatusApi(orderId, status);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seller-orders"] });
      qc.invalidateQueries({ queryKey: ["seller-stats"] });
    },
  });
};
