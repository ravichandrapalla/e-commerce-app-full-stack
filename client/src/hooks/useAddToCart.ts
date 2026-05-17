import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCartApi,
  decrementCartApi,
  getCartApi,
  removeCartApi,
  updateCartApi,
  type ProductPayload,
  type ProductQuantityPayload,
} from "../features/cart/cart.service";

export const cartQueryKey = ["cart"] as const;

export const useCart = (enabled = true) =>
  useQuery({
    queryKey: cartQueryKey,
    queryFn: async () => {
      const res = await getCartApi();
      return res.data;
    },
    retry: false,
    enabled,
  });

const useCartInvalidation = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: cartQueryKey });
};

export const useAddToCart = () => {
  const invalidateCart = useCartInvalidation();

  return useMutation({
    mutationFn: (payload: ProductQuantityPayload) => addToCartApi(payload),
    onSuccess: invalidateCart,
  });
};

export const useSetCartQuantity = () => {
  const invalidateCart = useCartInvalidation();

  return useMutation({
    mutationFn: (payload: ProductQuantityPayload) => updateCartApi(payload),
    onSuccess: invalidateCart,
  });
};

export const useDecrementCartItem = () => {
  const invalidateCart = useCartInvalidation();

  return useMutation({
    mutationFn: (payload: ProductPayload) => decrementCartApi(payload),
    onSuccess: invalidateCart,
  });
};

export const useRemoveCartItem = () => {
  const invalidateCart = useCartInvalidation();

  return useMutation({
    mutationFn: (payload: ProductPayload) => removeCartApi(payload),
    onSuccess: invalidateCart,
  });
};
