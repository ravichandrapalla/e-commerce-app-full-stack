import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkoutApi, getOrdersApi } from "../features/order/order.service";

export const useCheckout = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: checkoutApi,
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
