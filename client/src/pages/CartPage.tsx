import { useCart } from "../hooks/useAddToCart";
import { useCheckout } from "../hooks/useCheckout";

export default function CartPage() {
  const { data, isLoading } = useCart();
  const checkout = useCheckout();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      {data.items.map((item: any) => (
        <div key={item.id} className="flex justify-between border p-3">
          <div>
            <h2>{item.product.title}</h2>
            <p>₹{item.product.price}</p>
          </div>
          <div>Qty: {item.quantity}</div>
        </div>
      ))}
      <button
        onClick={() => checkout.mutate()}
        className="border px-4 py-2 rounded"
      >
        Checkout
      </button>
    </div>
  );
}
