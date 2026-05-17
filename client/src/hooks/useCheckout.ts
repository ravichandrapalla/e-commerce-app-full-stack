import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkoutApi,
  completeDemoCheckoutApi,
  getOrdersApi,
} from "../features/order/order.service";
import type { ShippingAddressFormValues } from "../features/order/checkout.schema";

export const useCheckout = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (shipping: ShippingAddressFormValues) => {
      const res = await checkoutApi(shipping);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useCompleteDemoCheckout = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const res = await completeDemoCheckoutApi(orderId);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useOrders = () =>
  useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await getOrdersApi();
      return res.data;
    },
  });
