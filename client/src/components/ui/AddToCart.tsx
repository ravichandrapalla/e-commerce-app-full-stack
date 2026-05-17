import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import type { Product } from "../../types/ecommerce";
import { Button } from "./button";
import {
  useAddToCart,
  useCart,
  useDecrementCartItem,
} from "../../hooks/useAddToCart";

type AddToCartProps = {
  product: Product;
};

export default function AddToCart({ product }: AddToCartProps) {
  const { data } = useCart();
  const addToCart = useAddToCart();
  const decrementCartItem = useDecrementCartItem();

  const quantity =
    data?.items?.find((item) => item.productId === product.id)?.quantity || 0;
  const isBusy = addToCart.isPending || decrementCartItem.isPending;
  const isSoldOut = product.stock <= 0;
  const isAtMaxStock = quantity >= product.stock;

  const increment = () => {
    if (isBusy || isSoldOut || isAtMaxStock) return;
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  const decrement = () => {
    if (isBusy || quantity <= 0) return;
    decrementCartItem.mutate({ productId: product.id });
  };

  if (quantity === 0) {
    return (
      <Button
        type="button"
        onClick={increment}
        disabled={isBusy || isSoldOut}
        className="h-10 w-full text-sm"
      >
        {isSoldOut ? "Sold out" : "Add to cart"}
      </Button>
    );
  }

  return (
    <div className="flex h-10 w-full items-center justify-between rounded-md border bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={decrement}
        disabled={isBusy}
        className="grid h-full w-11 place-items-center text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
      >
        <HugeiconsIcon icon={MinusSignIcon} size={18} />
      </button>

      <span className="min-w-12 text-center text-sm font-semibold">
        {quantity}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={increment}
        disabled={isBusy || isAtMaxStock}
        className="grid h-full w-11 place-items-center text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={18} />
      </button>
    </div>
  );
}
