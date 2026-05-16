import { useState } from "react";
import { Button } from "./button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, MinusSignIcon } from "@hugeicons/core-free-icons";
import { useAddToCart, useCart } from "../../hooks/useAddToCart";

export default function AddToCart({ product }) {
  const { data, isLoading } = useCart();
  const [qty, setQty] = useState(
    data?.items?.find((item) => item.product?.id === product.id)?.quantity || 0,
  );
  console.log(
    "-->",
    product,
    data?.items,
    data?.items?.find((item) => item.product?.id === product.id)?.quantity || 0,
  );
  const addToCart = useAddToCart();

  const handleCartQtyChange = (type: string) => {
    switch (type) {
      case "Add": {
        setQty((prev: number) => prev + 1);
        addToCart.mutate({ productId: product.id, quantity: 1 });
        break;
      }
      case "Remove": {
        setQty((prev: number) => prev - 1);
        break;
      }
      default: {
        return;
      }
    }
  };

  if (!qty)
    return (
      <Button onClick={() => handleCartQtyChange("Add")}>Add to Cart</Button>
    );
  return (
    <div className="w-1/4 flex space-x-4 p-2 justify-between items-center">
      <div className="flex items-center justify-center bg-green-600 rounded p-2 m-0">
        <HugeiconsIcon
          icon={PlusSignIcon}
          size={20}
          className="text-white cursor-pointer"
          onClick={() => handleCartQtyChange("Add")}
        />
      </div>

      {qty}
      <div className="flex items-center justify-center bg-red-600 rounded p-2">
        <HugeiconsIcon
          icon={MinusSignIcon}
          size={20}
          className="text-white cursor-pointer"
          onClick={() => handleCartQtyChange("Remove")}
        />
      </div>
    </div>
  );
}
