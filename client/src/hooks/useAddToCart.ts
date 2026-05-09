import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartApi, addToCartApi } from "../features/cart/cart.service";

export const useCart = () =>
  useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await getCartApi();
      return res.data;
    },
  });

export const useAddToCart = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addToCartApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
